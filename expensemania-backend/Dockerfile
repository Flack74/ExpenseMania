FROM golang:1.22-alpine AS build

WORKDIR /src

RUN apk add --no-cache ca-certificates tzdata

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

COPY . .

RUN --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" \
    -o /out/expensemania-api ./cmd/api

FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata wget && \
    addgroup -S -g 10001 expensemania && \
    adduser -S -D -H -u 10001 -G expensemania expensemania

WORKDIR /app

COPY --from=build --chown=expensemania:expensemania /out/expensemania-api /app/expensemania-api

RUN chmod +x /app/expensemania-api

USER expensemania

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["/app/expensemania-api"]
