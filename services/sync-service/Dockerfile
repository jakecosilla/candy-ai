FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o sync-service ./main.go

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/sync-service .

CMD ["./sync-service"]
