package services

import (
	"context"
	"strings"
	"time"

	"expensemania-backend/internal/models"
	"expensemania-backend/internal/repositories"
	"expensemania-backend/internal/types"
	"expensemania-backend/internal/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CategoryService struct {
	categories *repositories.CategoryRepository
}

func NewCategoryService(categories *repositories.CategoryRepository) *CategoryService {
	return &CategoryService{categories: categories}
}

func (s *CategoryService) SeedDefaults(ctx context.Context) error {
	return s.categories.UpsertDefaults(ctx, defaultCategories())
}

func (s *CategoryService) List(ctx context.Context, userID primitive.ObjectID, categoryType string) ([]models.Category, error) {
	return s.categories.List(ctx, userID, categoryType)
}

func (s *CategoryService) Create(ctx context.Context, userID primitive.ObjectID, req types.CategoryRequest) (models.Category, error) {
	now := time.Now().UTC()
	slug := strings.TrimSpace(req.Slug)
	if slug == "" {
		slug = slugify(req.Name)
	}
	parentID, err := optionalObjectID(req.ParentID)
	if err != nil {
		return models.Category{}, utils.BadRequest("Invalid parent category id", nil)
	}
	category := models.Category{
		UserID:    &userID,
		Name:      utils.CleanString(req.Name),
		Slug:      slug,
		Type:      req.Type,
		Icon:      utils.CleanString(req.Icon),
		Color:     utils.CleanString(req.Color),
		ParentID:  parentID,
		IsDefault: false,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if category.Icon == "" {
		category.Icon = "tag"
	}
	if category.Color == "" {
		category.Color = "#38bdf8"
	}
	if err := s.categories.Create(ctx, &category); err != nil {
		return models.Category{}, err
	}
	return category, nil
}

func (s *CategoryService) Delete(ctx context.Context, userID, id primitive.ObjectID) (int64, error) {
	deleted, err := s.categories.Delete(ctx, userID, id)
	if err != nil {
		return 0, err
	}
	if deleted == 0 {
		return 0, utils.NotFound("Category")
	}
	return deleted, nil
}

func slugify(value string) string {
	cleaned := strings.ToLower(strings.TrimSpace(value))
	cleaned = strings.Map(func(r rune) rune {
		switch {
		case r >= 'a' && r <= 'z':
			return r
		case r >= '0' && r <= '9':
			return r
		case r == '-' || r == '_':
			return '-'
		case r == ' ':
			return '-'
		default:
			return -1
		}
	}, cleaned)
	for strings.Contains(cleaned, "--") {
		cleaned = strings.ReplaceAll(cleaned, "--", "-")
	}
	return strings.Trim(cleaned, "-")
}

func optionalObjectID(raw string) (*primitive.ObjectID, error) {
	if strings.TrimSpace(raw) == "" {
		return nil, nil
	}
	id, err := primitive.ObjectIDFromHex(raw)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

func defaultCategories() []models.Category {
	return []models.Category{
		{Name: "Food", Slug: "food", Type: "expense", Icon: "utensils", Color: "#fb7185", IsDefault: true},
		{Name: "Transport", Slug: "transport", Type: "expense", Icon: "car", Color: "#38bdf8", IsDefault: true},
		{Name: "Shopping", Slug: "shopping", Type: "expense", Icon: "shopping-bag", Color: "#f472b6", IsDefault: true},
		{Name: "Bills", Slug: "bills", Type: "expense", Icon: "receipt", Color: "#facc15", IsDefault: true},
		{Name: "Fun", Slug: "fun", Type: "expense", Icon: "party-popper", Color: "#c084fc", IsDefault: true},
		{Name: "Health", Slug: "health", Type: "expense", Icon: "heart-pulse", Color: "#4ade80", IsDefault: true},
		{Name: "Travel", Slug: "travel", Type: "expense", Icon: "plane", Color: "#2dd4bf", IsDefault: true},
		{Name: "Other", Slug: "other", Type: "expense", Icon: "sparkles", Color: "#818cf8", IsDefault: true},
		{Name: "Salary", Slug: "salary", Type: "income", Icon: "briefcase", Color: "#22c55e", IsDefault: true},
		{Name: "Freelance", Slug: "freelance", Type: "income", Icon: "laptop", Color: "#06b6d4", IsDefault: true},
		{Name: "Investment", Slug: "investment", Type: "income", Icon: "trending-up", Color: "#a3e635", IsDefault: true},
		{Name: "Gift", Slug: "gift", Type: "income", Icon: "gift", Color: "#f59e0b", IsDefault: true},
	}
}
