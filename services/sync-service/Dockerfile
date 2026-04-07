FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY main.go .
RUN go mod init sync-service && go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o sync-service .

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/sync-service .

CMD ["./sync-service"]
