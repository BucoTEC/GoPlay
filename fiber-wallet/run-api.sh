#!/bin/bash

# Set default paths (can be overridden by environment variables)
MAIN_FILE=${MAIN_FILE:-"./cmd/app/main.go"}
APP_DIR=${APP_DIR:-"./cmd/app"}

# Run swag init to generate Swagger documentation
echo "Running swag init..."
if ! swag init -g "$MAIN_FILE"; then
    echo "Error: swag init failed. Please check your setup."
    exit 1
fi

# Check if air is installed
if command -v air &>/dev/null; then
    echo "Starting application with air..."
    air
else
    echo "Air is not installed. Starting application with go run..."
    go run "$APP_DIR"
fi
