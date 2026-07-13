#!/bin/bash
set -e

echo "=========================================="
echo "⏹️  Dừng hệ thống ICMS (Stop App)..."
echo "=========================================="

if pm2 describe icms-backend > /dev/null 2>&1; then
  pm2 stop icms-backend
  echo "✅ Đã dừng dịch vụ Backend (icms-backend)."
else
  echo "⚠️  Dịch vụ icms-backend không chạy trong PM2."
fi

echo "=========================================="
pm2 status
