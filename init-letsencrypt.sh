#!/bin/bash

# Email for Let's Encrypt notifications
email="your-email@elphinstone.us"
# Domain name
domain="help.elphinstone.us"

# Azure DNS Configuration
export AZURE_TENANT_ID="your-tenant-id"
export AZURE_CLIENT_ID="your-client-id"
export AZURE_CLIENT_SECRET="your-client-secret"
export AZURE_SUBSCRIPTION_ID="your-subscription-id"
export AZURE_RESOURCE_GROUP="your-resource-group"
export AZURE_DNS_ZONE="elphinstone.us"

# Create Azure credentials file
envsubst < azure.ini > azure.ini.tmp && mv azure.ini.tmp azure.ini
chmod 600 azure.ini

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

echo "### Starting all services ..."
docker-compose up -d

# Wait for services to start
echo "### Waiting for services to start ..."
sleep 10

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

echo "### Requesting Let's Encrypt certificate using Azure DNS for $domain ..."

# Get the certificate using Azure DNS challenge
docker-compose run --rm -v $PWD/azure.ini:/azure.ini:ro --entrypoint "\
  pip install certbot-dns-azure && \
  certbot certonly \
    --dns-azure \
    --dns-azure-credentials /azure.ini \
    --dns-azure-propagation-seconds 30 \
    --email $email \
    --agree-tos \
    --no-eff-email \
    -d $domain" certbot

# Clean up credentials
rm -f azure.ini

echo "### Reloading Nginx ..."
docker-compose exec nginx nginx -s reload 
