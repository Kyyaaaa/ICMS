import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

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

    // Gọi Supabase để xác thực token và lấy thông tin user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Gắn thông tin user vào request để các route/controller sau có thể sử dụng
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

    // Lấy role từ metadata của tài khoản (do ta đã lưu lúc register)
    const userRole = req.user.user_metadata?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this resource'
      });
    }

    next();
  };
};
