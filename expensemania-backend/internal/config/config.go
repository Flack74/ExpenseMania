package config

import (
	"bufio"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	AppEnv             string
	Port               string
	MongoURI           string
	MongoDBName        string
	JWTAccessSecret    string
	JWTRefreshSecret   string
	AccessTokenTTL     time.Duration
	RefreshTokenTTL    time.Duration
	FrontendURL        string
	CORSAllowedOrigins []string
	RateLimitMax       int
	RateLimitWindow    time.Duration
	DefaultCurrency    string
	DefaultTimezone    string
	CookieSecure       bool
	SMTPHost           string
	SMTPPort           int
	SMTPUsername       string
	SMTPPassword       string
	SMTPFrom           string
	RedisURL           string
}

func Load() Config {
	loadDotEnv(".env")
	jwtSecret := getEnv("JWT_SECRET", "dev-insecure-secret-change-me")
	appEnv := getEnv("APP_ENV", "development")
	return Config{
		AppEnv:             appEnv,
		Port:               getEnv("PORT", "8080"),
		MongoURI:           getEnv("MONGODB_URI", ""),
		MongoDBName:        getEnv("MONGODB_DB", "expensemania"),
		JWTAccessSecret:    getEnv("JWT_ACCESS_SECRET", jwtSecret),
		JWTRefreshSecret:   getEnv("JWT_REFRESH_SECRET", jwtSecret),
		AccessTokenTTL:     getDuration("ACCESS_TOKEN_TTL", 15*time.Minute),
		RefreshTokenTTL:    getDuration("REFRESH_TOKEN_TTL", 30*24*time.Hour),
		FrontendURL:        strings.TrimRight(getEnv("FRONTEND_URL", "http://localhost:5173"), "/"),
		CORSAllowedOrigins: getCSV("CORS_ALLOWED_ORIGINS", "http://localhost:8080,http://localhost:5173,https://*.vercel.app"),
		RateLimitMax:       getInt("RATE_LIMIT_MAX", 120),
		RateLimitWindow:    getDuration("RATE_LIMIT_WINDOW", time.Minute),
		DefaultCurrency:    strings.ToUpper(getEnv("DEFAULT_CURRENCY", "INR")),
		DefaultTimezone:    getEnv("DEFAULT_TIMEZONE", "Asia/Kolkata"),
		CookieSecure:       getBool("COOKIE_SECURE", strings.EqualFold(appEnv, "production")),
		SMTPHost:           getEnv("SMTP_HOST", ""),
		SMTPPort:           getInt("SMTP_PORT", 587),
		SMTPUsername:       getEnv("SMTP_USERNAME", ""),
		SMTPPassword:       getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:           getEnv("SMTP_FROM", ""),
		RedisURL:           getEnv("REDIS_URL", ""),
	}
}

func (c Config) IsProduction() bool {
	return strings.EqualFold(c.AppEnv, "production")
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func getBool(key string, fallback bool) bool {
	value := strings.ToLower(getEnv(key, ""))
	if value == "" {
		return fallback
	}
	return value == "1" || value == "true" || value == "yes"
}

func getInt(key string, fallback int) int {
	value, err := strconv.Atoi(getEnv(key, ""))
	if err != nil {
		return fallback
	}
	return value
}

func getDuration(key string, fallback time.Duration) time.Duration {
	raw := getEnv(key, "")
	if raw == "" {
		return fallback
	}
	d, err := time.ParseDuration(raw)
	if err == nil {
		return d
	}
	seconds, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}
	return time.Duration(seconds) * time.Second
}

func getCSV(key, fallback string) []string {
	raw := getEnv(key, fallback)
	parts := strings.Split(raw, ",")
	values := make([]string, 0, len(parts))
	for _, part := range parts {
		value := strings.TrimSpace(part)
		if value != "" {
			values = append(values, value)
		}
	}
	return values
}

func loadDotEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if key == "" || os.Getenv(key) != "" {
			continue
		}
		_ = os.Setenv(key, value)
	}
}
