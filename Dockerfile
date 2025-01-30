# Build stage
FROM golang:1.23-alpine AS builder

# Move to working directory (/build).
WORKDIR /build

# Copy and download dependencies using go mod.
COPY go.mod go.sum ./
RUN go mod download

# Copy the code into the container.
COPY . .

# Set necessary environment variables needed for our image and build the API server.
RUN go build -o main .

# Final production image
FROM alpine:latest

# Copy the binary from the build stage into the final image.
COPY --from=builder /build/main /

# Expose the necessary port.
EXPOSE 3001

# Command to run when starting the container.
ENTRYPOINT ["/main"]
