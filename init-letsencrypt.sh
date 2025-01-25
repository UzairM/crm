#!/bin/bash

# Email for Let's Encrypt notifications
email="your-email@elphinstone.us"
# Domain name
domain="help.elphinstone.us"
# RSA key size
rsa_key_size=4096
# Use staging environment for testing (1 for staging, 0 for production)
staging=1

# Make sure the certbot directory exists
mkdir -p "./certbot/conf"
mkdir -p "./certbot/www"

if [ ! -e "./certbot/conf/options-ssl-nginx.conf" ] || [ ! -e "./certbot/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/conf/ssl-dhparams.pem"
fi

# Create dummy certificates for Nginx to start
if [ ! -d "./certbot/conf/live/$domain" ]; then
  echo "### Creating dummy certificate for $domain ..."
  mkdir -p "./certbot/conf/live/$domain"
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout "./certbot/conf/live/$domain/privkey.pem" \
    -out "./certbot/conf/live/$domain/fullchain.pem" \
    -subj "/CN=localhost"
fi

echo "### Starting Nginx ..."
docker-compose up -d nginx

echo "### Deleting dummy certificate for $domain ..."
rm -rf "./certbot/conf/live/$domain"

echo "### Requesting Let's Encrypt certificate for $domain ..."

# Select appropriate certbot command based on staging/prod
case $staging in
  1) staging_arg="--staging";;
  0) staging_arg="";;
esac

docker-compose run --rm certbot certonly \
  $staging_arg \
  --webroot \
  --webroot-path /var/www/certbot \
  --email $email \
  --agree-tos \
  --no-eff-email \
  -d $domain

echo "### Reloading Nginx ..."
docker-compose exec nginx nginx -s reload 
