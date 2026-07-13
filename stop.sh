#!/bin/bash
set -e

echo "=========================================="
echo "⏹️  Dừng toàn bộ hệ thống ICMS (Stop App)..."
echo "=========================================="

echo "1. Dừng dịch vụ Backend Node.js (PM2)..."
if pm2 describe icms-backend > /dev/null 2>&1; then
  pm2 stop icms-backend
  echo "✅ Đã dừng dịch vụ Backend (icms-backend)."
else
  echo "⚠️  Dịch vụ icms-backend không chạy trong PM2."
fi

echo "2. Dừng phục vụ Frontend (Tạm gỡ cấu hình Nginx của ICMS)..."
if [ -L "/etc/nginx/sites-enabled/icms" ] || [ -f "/etc/nginx/sites-enabled/icms" ]; then
  sudo rm -f /etc/nginx/sites-enabled/icms
  sudo systemctl reload nginx
  echo "✅ Đã ngắt phục vụ Frontend (Trang web tạm thời đóng)."
else
  echo "⚠️  Cấu hình Nginx ICMS đã được ngắt từ trước."
fi

echo "=========================================="
echo "🛑 Toàn bộ hệ thống ICMS (Frontend + Backend) đã được dừng!"
echo "=========================================="
pm2 status
