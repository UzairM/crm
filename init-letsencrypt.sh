#!/bin/bash

# Email for Let's Encrypt notifications
email="your-email@elphinstone.us"
# Domain name
domain="help.elphinstone.us"

# Make sure the certbot directory exists
mkdir -p "./certbot/conf"
mkdir -p "./certbot/www"

if [ ! -e "./certbot/conf/options-ssl-nginx.conf" ] || [ ! -e "./certbot/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/conf/ssl-dhparams.pem"
fi

# Stop local Nginx
echo "### Stopping local Nginx ..."
systemctl stop nginx

echo "### Requesting Let's Encrypt certificate using standalone method for $domain ..."
certbot certonly \
  --standalone \
  --preferred-challenges http \
  --email $email \
  --agree-tos \
  --no-eff-email \
  --config-dir "./certbot/conf" \
  --work-dir "./certbot/work" \
  --logs-dir "./certbot/logs" \
  -d $domain


