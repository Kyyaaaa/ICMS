import { Response } from 'express';
import { AccountService } from './account.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AccountController {
  
  static async getAllAccounts(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role;
      const { role, search, page, limit } = req.query;

      const p = page ? parseInt(page as string) : 1;
      const l = limit ? parseInt(limit as string) : 50;

      const accounts = await AccountService.listAccounts(
        callerRole, 
        role as string, 
        search as string, 
        p, 
        l
      );

      return res.status(200).json({
        success: true,
        data: accounts,
        message: 'Accounts retrieved successfully'
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAccountById(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const callerId = req.user.id;
      const { id } = req.params;
      const targetId = id as string;

      if (callerRole !== 'ADMIN' && callerRole !== 'STAFF' && callerId !== targetId) {
        return res.status(403).json({ success: false, message: 'Forbidden: You can only access your own account' });
      }

      const account = await AccountService.getAccount(callerRole, callerId, targetId);

      return res.status(200).json({
        success: true,
        data: account,
        message: 'Account retrieved successfully'
      });
    } catch (error: any) {
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const { email, password, role, full_name, phone_number } = req.body;

      const newAccount = await AccountService.createAccount(callerRole, email, password, role, full_name, phone_number);

      return res.status(201).json({
        success: true,
        data: newAccount,
        message: 'Account created successfully'
      });
    } catch (error: any) {
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const callerId = req.user.id;
      const { id } = req.params;
      const targetId = id as string;

      if (callerRole !== 'ADMIN' && callerRole !== 'STAFF' && callerId !== targetId) {
        return res.status(403).json({ success: false, message: 'Forbidden: You can only update your own account' });
      }

      const { full_name, email, phone_number, password, old_password, date_of_birth, gender, avatar_url, status } = req.body;

      // --- Only require old password when user is changing their own password (not Admin reset) ---
      if (password !== undefined && password !== '') {
        const isSelfUpdate = callerId === targetId;
        if (isSelfUpdate) {
          if (!old_password) {
            return res.status(400).json({
              success: false,
              message: 'Please enter your current password to confirm.'
            });
          }
          // Verify old password by attempting to sign in
          try {
            const accountData = await AccountService.getAccount(callerRole, callerId, targetId);
            if (!accountData) {
              return res.status(404).json({
                success: false,
                message: 'Account not found.'
              });
            }
            await AuthService.login(accountData.email, old_password);
          } catch {
            return res.status(400).json({
              success: false,
              message: 'Incorrect current password.'
            });
          }
        }
      }

      let updatedAccount = await AccountService.updateAccount(callerRole, callerId, targetId, {
        full_name,
        email,
        phone_number,
        password,
        date_of_birth,
        gender,
        avatar_url
      });

      if (status !== undefined && status !== updatedAccount.status) {
        updatedAccount = await AccountService.setAccountStatus(callerRole, callerId, targetId, status);
      }

      return res.status(200).json({
        success: true,
        data: updatedAccount,
        message: 'Account updated successfully'
      });
    } catch (error: any) {
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }


  static async updateAccountStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const callerId = req.user.id;
      const { id } = req.params;
      const targetId = id as string;

      const { status } = req.body;

      const updatedAccount = await AccountService.setAccountStatus(callerRole, callerId, targetId, status);

      return res.status(200).json({
        success: true,
        data: updatedAccount,
        message: `Account status updated to ${status}`
      });
    } catch (error: any) {
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
