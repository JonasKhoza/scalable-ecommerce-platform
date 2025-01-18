#!/bin/sh
SERVICE_NAME="payment-service"
SERVICE_ID="payment-service-${HOSTNAME}"
SERVICE_PORT=9090

# Register the service with Consul
curl --request PUT \
  --data "{\"ID\": \"$SERVICE_ID\", \"Name\": \"$SERVICE_NAME\", \"Address\": \"payment-service\", \"Port\": $SERVICE_PORT, \"Tags\": [\"v1\"]}" \
  $CONSUL_HTTP_ADDR/v1/agent/service/register
