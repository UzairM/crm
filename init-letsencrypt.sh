#!/bin/bash

# Email for Let's Encrypt notifications
email="your-email@elphinstone.us"
# Domain name
domain="help.elphinstone.us"

# Stop any running containers
echo "### Stopping existing containers ..."
docker-compose down

# Make sure the certbot directory exists
mkdir -p "./certbot/conf"
mkdir -p "./certbot/www"

if [ ! -e "./certbot/conf/options-ssl-nginx.conf" ] || [ ! -e "./certbot/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/conf/ssl-dhparams.pem"
fi

echo "### Starting Nginx ..."
docker-compose up -d nginx

# Wait for Nginx to start
echo "### Waiting for Nginx to start ..."
sleep 5

echo "### Testing domain accessibility ..."
if curl -s -o /dev/null "http://$domain/.well-known/acme-challenge/"; then
    echo "Domain is accessible, proceeding with certificate request..."
else
    echo "Error: Domain $domain is not accessible."
    echo "Please ensure:"
    echo "1. Domain points to this server's IP"
    echo "2. Port 80 is open and accessible"
    echo "3. No firewall is blocking the connection"
    exit 1
fi

echo "### Requesting Let's Encrypt certificate for $domain ..."

# Get the certificate
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $email \
    --agree-tos \
    --no-eff-email \
    -d $domain" certbot

echo "### Reloading Nginx ..."
docker-compose exec nginx nginx -s reload 
