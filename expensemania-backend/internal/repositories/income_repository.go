package repositories

import (
	"context"
	"time"

	"expensemania-backend/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type IncomeRepository struct {
	col *mongo.Collection
}

type IncomeFilter struct {
	From      *time.Time
	To        *time.Time
	Category  string
	Source    string
	Page      int
	Limit     int
	SortBy    string
	SortOrder string
}

func NewIncomeRepository(db *mongo.Database) *IncomeRepository {
	return &IncomeRepository{col: db.Collection("income")}
}

func (r *IncomeRepository) Collection() *mongo.Collection {
	return r.col
}

func (r *IncomeRepository) Create(ctx context.Context, income *models.Income) error {
	result, err := r.col.InsertOne(ctx, income)
	if err != nil {
		return err
	}
	income.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *IncomeRepository) List(ctx context.Context, userID primitive.ObjectID, filter IncomeFilter) ([]models.Income, int64, error) {
	query := bson.M{"userId": userID}
	if filter.Category != "" {
		query["category"] = filter.Category
	}
	if filter.Source != "" {
		query["source"] = filter.Source
	}
	if filter.From != nil || filter.To != nil {
		date := bson.M{}
		if filter.From != nil {
			date["$gte"] = *filter.From
		}
		if filter.To != nil {
			date["$lte"] = *filter.To
		}
		query["date"] = date
	}
	total, err := r.col.CountDocuments(ctx, query)
	if err != nil {
		return nil, 0, err
	}
	cursor, err := r.col.Find(ctx, query, options.Find().
		SetSort(bson.D{{Key: "date", Value: -1}}).
		SetSkip(int64((filter.Page-1)*filter.Limit)).
		SetLimit(int64(filter.Limit)))
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	var incomes []models.Income
	if err := cursor.All(ctx, &incomes); err != nil {
		return nil, 0, err
	}
	return incomes, total, nil
}

func (r *IncomeRepository) Update(ctx context.Context, userID, id primitive.ObjectID, update bson.M) (models.Income, error) {
	update["updatedAt"] = time.Now().UTC()
	var income models.Income
	err := r.col.FindOneAndUpdate(
		ctx,
		bson.M{"_id": id, "userId": userID},
		bson.M{"$set": update},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&income)
	return income, err
}

func (r *IncomeRepository) Delete(ctx context.Context, userID, id primitive.ObjectID) (int64, error) {
	result, err := r.col.DeleteOne(ctx, bson.M{"_id": id, "userId": userID})
	if err != nil {
		return 0, err
	}
	return result.DeletedCount, nil
}
