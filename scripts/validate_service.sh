
#!/bin/bash
set -e

echo "Checking HirePoint backend health..."

for attempt in {1..12}; do
    if curl -fsS http://127.0.0.1:8000/health; then
        echo
        echo "Backend health check passed."
        break
    fi

    if [ "$attempt" -eq 12 ]; then
        echo "Backend health check failed."
        exit 1
    fi

    echo "Waiting for backend to become healthy..."
    sleep 5
done

echo "Checking Nginx..."

systemctl is-active --quiet nginx

echo "Nginx is running."
