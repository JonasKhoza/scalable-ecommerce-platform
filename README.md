# Scalable E-Commerce Platform

## Overview
This is a scalable and modular e-commerce platform built using microservices architecture. Each service is containerized using Docker, allowing for independent development, deployment, and scaling.

## Features
- User Service: Authentication and profile management.
- Product Catalog Service: Manage product listings and inventory.
- Shopping Cart Service: Add, remove, and update cart items.
- Order Service: Place and track orders.
- Payment Service: Secure payment processing with external gateways.
- Notification Service: Sends email and SMS notifications for various events.
- API-Gateway Service: Serves as the entry point for all client requests, routing them to the appropriate microservice.

## Tech Stack
- Backend: Node.js, Express, TypeScript
- Containerization: Docker, Docker Compose
- CI/CD: GitHub Actions
- Monitoring: Prometheus and Grafana (future enhancement)
- Service Discovery: Consul (future enhancement)

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/scalable-ecommerce-platform.git
   cd scalable-ecommerce-platform
