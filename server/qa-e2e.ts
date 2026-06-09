import * as dotenv from 'dotenv';
dotenv.config();

import { LearnerService } from './src/modules/learner/learner.service';
import { AccountService } from './src/modules/account/account.service';
import { AuthService } from './src/modules/auth/auth.service';
import { supabaseAdmin } from './src/configs/supabase';

async function runQATests() {
  console.log('🧪 Bắt đầu chạy QA E2E Tests...');
  const testEmail = 'qa_test_agent@example.com';
  const testPassword = 'Password@123';
  let createdUserId = '';

  try {
    // ---------------------------------------------------------
    // QA-08.1: Đăng ký Learner mới
    // ---------------------------------------------------------
    console.log('\n[QA-08.1] Testing Đăng ký Learner mới...');
    // Dọn dẹp user cũ nếu có do test thất bại giữa chừng
    const { data: existing } = await supabaseAdmin.from('account').select('id').eq('email', testEmail).maybeSingle();
    if (existing) {
      await LearnerService.delete(existing.id);
    }

    const newLearner = await LearnerService.create({
      email: testEmail,
      password: testPassword,
      full_name: 'QA Test Learner',
      phone_number: '0999888777'
    });
    
    createdUserId = newLearner.id;
    console.log(`✅ Đã tạo Learner thành công: ${createdUserId}`);

    // Verify trong public.account
    const { data: accountData, error: accountError } = await supabaseAdmin
      .from('account')
      .select('*')
      .eq('id', createdUserId)
      .single();
    
    if (accountError || !accountData) throw new Error('Không tìm thấy bản ghi trong public.account');
    if (accountData.role !== 'LEARNER') throw new Error(`Sai role: ${accountData.role}`);
    console.log('✅ Đã verify dữ liệu tồn tại trong public.account với role LEARNER');

    // ---------------------------------------------------------
    // QA-08.2: Đăng nhập & Middleware
    // ---------------------------------------------------------
    console.log('\n[QA-08.2] Testing Đăng nhập (AuthService.login)...');
    const loginResult = await AuthService.login(testEmail, testPassword);
    if (!loginResult.session?.access_token) throw new Error('Đăng nhập thất bại, không có token');
    if (loginResult.user.role !== 'LEARNER') throw new Error('Role trả về không đúng');
    console.log('✅ Đăng nhập thành công, token và user data hợp lệ.');

    // ---------------------------------------------------------
    // QA-07: Admin CRUD và Filter (AccountService)
    // ---------------------------------------------------------
    console.log('\n[QA-07] Testing Admin CRUD Account...');
    
    // Test cập nhật account
    const updatedAccount = await AccountService.updateAccount('ADMIN', 'admin_id', createdUserId, {
      full_name: 'QA Updated Name'
    });
    if (updatedAccount.full_name !== 'QA Updated Name') throw new Error('Cập nhật tên thất bại');
    console.log('✅ Cập nhật thông tin thành công');

    // Test ban/unban
    await AccountService.setAccountStatus('ADMIN', createdUserId, false);
    const bannedAcc = await AccountService.getAccount('ADMIN', 'admin_id', createdUserId);
    if (bannedAcc.status !== 'BANNED') throw new Error('Ban tài khoản thất bại');
    
    await AccountService.setAccountStatus('ADMIN', createdUserId, true);
    const unbannedAcc = await AccountService.getAccount('ADMIN', 'admin_id', createdUserId);
    if (unbannedAcc.status !== 'ACTIVE') throw new Error('Unban tài khoản thất bại');
    console.log('✅ Đổi trạng thái (Ban/Unban) thành công');

    // Test list & filter
    const listResult = await AccountService.listAccounts('ADMIN', 'LEARNER', 'QA Updated', 1, 10);
    if (listResult.total === 0 || !listResult.data.some((u: any) => u.id === createdUserId)) {
      throw new Error('Filter/Search không hoạt động');
    }
    console.log(`✅ Lọc và tìm kiếm thành công (Tìm thấy ${listResult.total} kết quả)`);

    // ---------------------------------------------------------
    // QA-08.3: Xóa Học viên
    // ---------------------------------------------------------
    console.log('\n[QA-08.3] Testing Xóa Học viên...');
    await LearnerService.delete(createdUserId);
    
    // Verify đã biến mất
    const { data: checkAcc } = await supabaseAdmin.from('account').select('id').eq('id', createdUserId).maybeSingle();
    if (checkAcc) throw new Error('Bản ghi vẫn tồn tại trong public.account sau khi xóa');
    console.log('✅ Xóa user và verify biến mất khỏi public.account thành công');

    console.log('\n🎉 TẤT CẢ QA TESTS ĐỀU PASS 100%!');

  } catch (error: any) {
    console.error(`\n❌ QA TEST THẤT BẠI: ${error.message}`);
    // Cleanup if failed
    if (createdUserId) {
      try { await LearnerService.delete(createdUserId); } catch (e) {}
    }
    process.exit(1);
  }
}

runQATests();
