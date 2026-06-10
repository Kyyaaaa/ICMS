import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../configs/supabase';

// Mở rộng interface Request của Express để chứa dữ liệu user
export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware kiểm tra JWT Token hợp lệ
 */
export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid token. Please provide a Bearer token in the Authorization header'
      });
    }

    const token = authHeader.split(' ')[1];

    // Gọi Supabase để xác thực token và lấy thông tin user (từ auth.users)
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

    if (error || !authUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Fetch user from custom 'account' table with joined roles table
    const { data: user, error: userError } = await supabaseAdmin
      .from('account')
      .select('*, roles(name)')
      .eq('id', authUser.id)
      .single();

    if (userError || !user) {
      return res.status(401).json({ success: false, message: 'User account not found' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    // Map the role name back to user.role to maintain compatibility with existing code
    if (user.roles && (user.roles as any).name) {
      user.role = (user.roles as any).name;
    }

    // Gắn thông tin account vào request để các route/controller sau có thể sử dụng
    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi khi xác thực token:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error during authentication'
    });
  }
};

/**
 * Middleware kiểm tra Role (Phân quyền)
 * Lưu ý: Phải đặt middleware này SAU middleware verifyToken
 * @param allowedRoles Mảng các Role được phép truy cập (VD: ['LEARNER', 'ADMIN'])
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User info not found in request'
      });
    }

    // Lấy role từ bảng account
    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this resource'
      });
    }

    next();
  };
};
