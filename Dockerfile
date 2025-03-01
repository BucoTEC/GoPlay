# Start with a small Go image
FROM golang:1.21-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the Go modules manifests and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go binary
RUN go build -o app .

# Use a minimal image for the final container
FROM alpine:latest

# Set working directory in the container
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/app .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["./app"]
