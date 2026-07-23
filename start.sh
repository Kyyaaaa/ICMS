#!/bin/bash
set -e

echo "=========================================="
echo "▶️  Khởi chạy toàn bộ hệ thống ICMS (Start App)..."
echo "=========================================="

echo "1. Khởi chạy Backend Node.js với PM2..."
cd backend
if pm2 describe icms-backend > /dev/null 2>&1; then
  echo "Dịch vụ icms-backend đã tồn tại trong PM2, đang khởi động lại..."
  pm2 restart icms-backend --update-env
else
  echo "Khởi chạy dịch vụ mới icms-backend..."
  pm2 start dist/server.js --name "icms-backend"
fi
cd ..

echo "2. Kích hoạt phục vụ Frontend qua Nginx..."
sudo ln -sf /etc/nginx/sites-available/icms /etc/nginx/sites-enabled/icms
sudo nginx -t && sudo systemctl reload nginx

echo "=========================================="
echo "✅ Hệ thống ICMS (Frontend + Backend) đã được khởi chạy thành công!"
echo "=========================================="
pm2 status
