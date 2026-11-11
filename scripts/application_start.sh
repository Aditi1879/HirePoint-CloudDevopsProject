
#!/bin/bash
set -e

echo "Restarting HirePoint backend with PM2..."

sudo -u ssm-user -H env PATH="/usr/local/bin:/usr/bin:/bin:/usr/lib/nodejs22/bin" \
  bash -c 'pm2 restart hirepoint-backend --update-env'

echo "Saving PM2 process list..."

sudo -u ssm-user -H env PATH="/usr/local/bin:/usr/bin:/bin:/usr/lib/nodejs22/bin" \
  bash -c 'pm2 save'

echo "HirePoint backend restarted successfully."
