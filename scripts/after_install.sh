
#!/bin/bash
set -e

APP_DIR="/home/ssm-user/HirePoint-CloudDevopsProject/backend"

echo "Preparing HirePoint backend..."

chown -R ssm-user:ssm-user "$APP_DIR"

echo "Installing production dependencies..."

sudo -u ssm-user -H env PATH="/usr/local/bin:/usr/bin:/bin:/usr/lib/nodejs22/bin" \
  bash -c "cd '$APP_DIR' && npm ci --omit=dev"

echo "Backend dependencies installed successfully."
