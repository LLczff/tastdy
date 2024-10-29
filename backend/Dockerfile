# Build stage
FROM golang:1.23-alpine AS build

WORKDIR /app

COPY . .
RUN go mod download

# build binary file named main at /app directory
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main .

# Deploy stage
FROM alpine:3.20 AS deploy

COPY --from=build /app/main /app/main

# set gin to production mode
ENV GIN_MODE release

ENTRYPOINT ["/app/main"]