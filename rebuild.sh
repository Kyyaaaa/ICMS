#!/bin/bash
set -e

echo "=========================================="
echo "🔄  Cập nhật & Build lại toàn bộ ICMS (Rebuild App)..."
echo "=========================================="

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "1. Pull code mới nhất từ Git (Nhánh: $BRANCH)..."
git pull origin $BRANCH

echo "2. Cài đặt gói & Build Backend Node.js..."
cd backend
npm install
npm run build
if pm2 describe icms-backend > /dev/null 2>&1; then
  pm2 restart icms-backend --update-env
else
  pm2 start dist/server.js --name "icms-backend"
fi
cd ..

echo "3. Cài đặt gói & Build Frontend React SPA..."
cd frontend
npm install
npm run build
cd ..

echo "4. Kiểm tra cấu hình và reload Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "=========================================="
echo "✅ Đã build lại và cập nhật hệ thống thành công!"
echo "=========================================="
pm2 status
