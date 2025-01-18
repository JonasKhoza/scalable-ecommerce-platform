#!/bin/sh
SERVICE_NAME="product-catalog-service"
SERVICE_ID="product-catalog-service-${HOSTNAME}"
SERVICE_PORT=5000

# Register the service with Consul
curl --request PUT \
  --data "{
    \"ID\": \"$SERVICE_ID\",
    \"Name\": \"$SERVICE_NAME\",
    \"Address\": \"$SERVICE_NAME\",
    \"Port\": $SERVICE_PORT,
    \"Tags\": [\"v1\"],
    \"Check\": {
      \"HTTP\": \"http://$SERVICE_NAME:$SERVICE_PORT/health\",
      \"Interval\": \"30s\",
      \"Timeout\": \"5s\"
    }
  }" \
  $CONSUL_HTTP_ADDR/v1/agent/service/register

