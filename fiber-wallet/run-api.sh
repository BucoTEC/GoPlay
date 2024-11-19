#!/bin/bash

# Run swag init to generate Swagger documentation
echo "Running swag init..."
if ! swag init; then
    echo "Error: swag init failed. Please check your setup."
    exit 1
fi

# Check if air is installed
if command -v air &>/dev/null; then
    echo "Starting application with air..."
    air
else
    echo "Air is not installed. Starting application with go run..."
    go run main.go
fi
