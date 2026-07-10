import { formatDate } from "../../../shared/utils/date";
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { TopNav } from '@/shared/components/layout/TopNav';
import Cookies from 'js-cookie';
import axiosClient from '@/shared/services/axiosClient';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const responseCode = searchParams.get('vnp_ResponseCode');
    const amount = Number(searchParams.get('vnp_Amount')) / 100;
    const orderInfo = searchParams.get('vnp_OrderInfo');

    const [isLoggedIn, setIsLoggedIn] = useState(() => !!Cookies.get('access_token'));
    const [userRole] = useState<'learner' | 'tutor' | 'staff' | 'admin'>(() => {
        try { return JSON.parse(Cookies.get('user_info') || '{}').role?.toLowerCase() || 'learner'; } catch { return 'learner'; }
    });

    const [userInfo] = useState(() => {
        try { return JSON.parse(Cookies.get('user_info') || '{}'); } catch { return {}; }
    });

    const isSuccess = responseCode === '00';
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // Fallback: Gọi trực tiếp API xử lý kết quả ở Backend từ Frontend để chắc chắn CSDL được cập nhật 
        // phòng trường hợp VNPay Sandbox IPN Webhook chưa được cấu hình.
        const verifyPayment = async () => {
            if (responseCode && !isVerified) {
                try {
                    await axiosClient.get(`/payments/vnpay/vnpay-return${window.location.search}`);
                    setIsVerified(true);
                } catch (error) {
                    console.error("Lỗi khi xác thực thanh toán với server:", error);
                }
            }
        };
        verifyPayment();
    }, [searchParams, responseCode, isVerified]);

    return (
        <div className="bg-[#f7fafc] min-h-screen flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} userInfo={userInfo} />
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg border border-[#e0e3e5] p-10 md:p-15 text-center animate-fade-in-up">
                    {isSuccess ? (
                        <>
                            <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 className="w-12 h-12 text-[#2e7d32]" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-[#002045] mb-4">Payment Successful!</h2>
                            <p className="text-lg text-[#43474e] mb-8 max-w-lg mx-auto">
                                Your payment of <strong>{amount ? amount.toLocaleString('en-US') : '0'} VND</strong> has been processed successfully. 
                                You are now enrolled in the class!
                            </p>
                            <div className="bg-[#f7fafc] border border-[#e0e3e5] rounded-2xl p-6 mb-10 text-left max-w-md mx-auto">
                                <div className="flex justify-between mb-3 text-sm"><span className="text-[#74777f]">Order Info:</span> <span className="font-bold text-[#002045]">{orderInfo}</span></div>
                                <div className="flex justify-between mb-3 text-sm"><span className="text-[#74777f]">Payment Method:</span> <span className="font-bold text-[#002045]">VNPay</span></div>
                                <div className="flex justify-between text-sm"><span className="text-[#74777f]">Date:</span> <span className="font-bold text-[#002045]">{formatDate(new Date())}</span></div>
                            </div>
                            <Link to={`/learner/classes`} className="inline-flex items-center gap-2 px-8 py-4 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors shadow-md hover:shadow-lg">
                                View My Classes <ArrowRight className="w-5 h-5" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 rounded-full bg-[#ffebee] flex items-center justify-center mx-auto mb-8">
                                <XCircle className="w-12 h-12 text-[#c62828]" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-[#002045] mb-4">Payment Failed</h2>
                            <p className="text-lg text-[#43474e] mb-8 max-w-lg mx-auto">
                                Unfortunately, we could not process your payment at this time. VNPay Response Code: {responseCode}.
                            </p>
                            <Link to={`/learner/payments`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0061a5] border-2 border-[#0061a5] rounded-xl font-bold hover:bg-[#f0f7ff] transition-colors">
                                Return to Payments
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
