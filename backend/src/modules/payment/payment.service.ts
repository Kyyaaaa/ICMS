import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { PaymentRepository } from './payment.repository';
import { VNPayReturnQuery } from './payment.model';

export class PaymentService {
  static async generateVnpayUrl(invoiceId: string, installmentId: string | undefined, paymentPlan: string, ipAddr: string, learnerId: string): Promise<string> {
    const invoice = await InvoiceRepository.getInvoiceDetails(invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    if (invoice.learner_id !== learnerId) {
      throw new Error('Forbidden: You can only pay your own invoices');
    }
    if (!['PENDING', 'PARTIAL'].includes(invoice.status)) {
      throw new Error('Invoice is not payable');
    }

    let amount = invoice.amount * 100; // VNPay amount is in VND * 100
    let txnRef = invoice.invoice_code;

    if (paymentPlan === 'installments') {
      let installments = invoice.invoice_installments || [];
      if (installments.length === 0) {
        installments = await InvoiceRepository.generateInstallments(invoice.id, invoice.amount);
      }
      const targetInst = installmentId 
        ? installments.find((inst: any) => inst.id === installmentId)
        : installments.find((inst: any) => inst.installment_number === 1);

      if (!targetInst) {
        throw new Error('Installment not found');
      }
      amount = targetInst.amount * 100;
      txnRef = `${invoice.invoice_code}-${targetInst.installment_number}`;
    } else if (installmentId && invoice.invoice_installments) {
      const installment = invoice.invoice_installments.find((inst: any) => inst.id === installmentId);
      if (!installment) {
        throw new Error('Installment not found');
      }
      amount = installment.amount * 100;
      txnRef = `${invoice.invoice_code}-${installment.installment_number}`;
    }

    const tmnCode = process.env.VNP_TMNCODE || '';
    const secretKey = process.env.VNP_HASHSECRET || '';
    let vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = process.env.VNP_RETURNURL || 'http://localhost:5173/payment/result';
    if (!tmnCode || !secretKey) {
      throw new Error('VNPay is not configured');
    }

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = txnRef; 
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan hoa don ' + txnRef;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex'); 
    vnp_Params['vnp_SecureHash'] = signed;

    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  static async verifyVnpayReturn(vnp_Params: VNPayReturnQuery | Record<string, any>): Promise<{ success: boolean; message: string; code: string; debug?: any }> {
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASHSECRET || '';
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');     

    const validSignature = typeof secureHash === 'string'
      && secureHash.length === signed.length
      && crypto.timingSafeEqual(Buffer.from(secureHash), Buffer.from(signed));

    if (validSignature) {
      const responseCode = vnp_Params['vnp_ResponseCode'];
      const transactionStatus = vnp_Params['vnp_TransactionStatus'];
      const invoiceCode = vnp_Params['vnp_TxnRef'] as string;
      const amount = Number(vnp_Params['vnp_Amount']) / 100;
      const transactionNo = vnp_Params['vnp_TransactionNo'] as string;

      if (responseCode === '00' && transactionStatus === '00') {
        // Success
        await PaymentRepository.recordPaymentAndEnroll(invoiceCode, amount, transactionNo);
        return { success: true, message: 'Payment successful', code: '00' };
      } else {
        return { success: false, message: 'Payment failed on VNPay', code: responseCode };
      }
    } else {
      return { success: false, message: 'Invalid signature', code: '97' };
    }
  }
}

function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj){
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
