
import sys
import csv
import pandas as pd
from difflib import get_close_matches
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

class FoodTracker:
    def __init__(self, csv_file: str):
        """
        Initialize the FoodTracker with dataset and ML model.
        Args:
            csv_file (str): Path to CSV dataset
        """
        # Load dataset
        self.data = pd.read_csv(csv_file)
        self.data["Dish Name"] = self.data["Dish Name"].str.lower().str.strip()

        # Numeric columns for nutritional info
        self.numeric_cols = ["Calories (kcal)", "Carbohydrates (g)", "Protein (g)", "Fats (g)",
                             "Free Sugar (g)", "Fibre (g)", "Sodium (mg)", "Calcium (mg)",
                             "Iron (mg)", "Vitamin C (mg)", "Folate (碌g)"]

        # ML model setup
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.data["Dish Name"])
        self.nn_model = NearestNeighbors(n_neighbors=3, metric="cosine")
        self.nn_model.fit(self.tfidf_matrix)

    def get_food_info(self, dish_name: str) -> dict:
        """
        Lookup nutritional info for a dish. Uses exact, partial, fuzzy, or ML-based prediction.
        Args:
            dish_name (str)
        Returns:
            dict: Nutrition info
        """
        dish_name = dish_name.lower().strip()

        # Exact match
        result = self.data[self.data["Dish Name"] == dish_name]

        # Partial match
        if result.empty:
            result = self.data[self.data["Dish Name"].str.contains(dish_name, na=False)]

        # Fuzzy match
        if result.empty:
            close_matches = get_close_matches(dish_name, self.data["Dish Name"].tolist(), n=1, cutoff=0.7)
            if close_matches:
                result = self.data[self.data["Dish Name"] == close_matches[0]]

        if not result.empty:
            return result.iloc[0].to_dict()

        # Fallback to ML prediction
        return self.predict_with_ml(dish_name)

    def predict_with_ml(self, dish_name: str) -> dict:
        """
        Predict nutrition info for unknown dish using nearest neighbor ML.
        If no good matches, return global average and warning.
        Args:
            dish_name (str)
        Returns:
            dict: Predicted nutrition values
        """
        dish_vec = self.vectorizer.transform([dish_name])
        distances, indices = self.nn_model.kneighbors(dish_vec, n_neighbors=3)
        similar_dishes = self.data.iloc[indices[0]]
        avg_values = similar_dishes[self.numeric_cols].mean().to_dict()

        # If all distances are high (e.g., >0.6), fallback to global average
        if all(d > 0.6 for d in distances[0]):
            global_avg = self.data[self.numeric_cols].mean().to_dict()
            return {
                "Dish Name": dish_name,
                "Prediction": True,
                "Warning": "No close match found. This is a rough estimate based on all foods.",
                **global_avg
            }
        else:
            return {
                "Dish Name": dish_name,
                "Prediction": True,
                "Based on Similar Dishes": similar_dishes["Dish Name"].tolist(),
                **avg_values
            }

def write_results_csv(results, path):
    if not results:
        return
    keys = results[0].keys()
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in results:
            writer.writerow(row)

if __name__ == "__main__":
    # Usage: python Calorie_tracker.py <food_item1> <food_item2> ...
    food_items = sys.argv[1:]
    if not food_items:
        print("Usage: python Calorie_tracker.py <food_item1> <food_item2> ...")
        sys.exit(1)
    tracker = FoodTracker("data/Calorie_tracker.csv")
    results = [tracker.get_food_info(item) for item in food_items]
    write_results_csv(results, "data/Calorie_tracker.csv")
    # Also print CSV to stdout for backend parsing
    import io
    if results:
        keys = results[0].keys()
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=keys)
        writer.writeheader()
        for row in results:
            writer.writerow(row)
        print(output.getvalue(), end="")
# food_tracker.py

import pandas as pd
from difflib import get_close_matches
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

class FoodTracker:
    def __init__(self, csv_file: str):
        """
        Initialize the FoodTracker with dataset and ML model.
        Args:
            csv_file (str): Path to CSV dataset
        """
        # Load dataset
        self.data = pd.read_csv(csv_file)
        self.data["Dish Name"] = self.data["Dish Name"].str.lower().str.strip()

        # Numeric columns for nutritional info
        self.numeric_cols = ["Calories (kcal)", "Carbohydrates (g)", "Protein (g)", "Fats (g)",
                             "Free Sugar (g)", "Fibre (g)", "Sodium (mg)", "Calcium (mg)",
                             "Iron (mg)", "Vitamin C (mg)", "Folate (碌g)"]

        # ML model setup
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.data["Dish Name"])
        self.nn_model = NearestNeighbors(n_neighbors=3, metric="cosine")
        self.nn_model.fit(self.tfidf_matrix)

    def get_food_info(self, dish_name: str) -> dict:
        """
        Lookup nutritional info for a dish. Uses exact, partial, fuzzy, or ML-based prediction.
        Args:
            dish_name (str)
        Returns:
            dict: Nutrition info
        """
        dish_name = dish_name.lower().strip()

        # Exact match
        result = self.data[self.data["Dish Name"] == dish_name]

        # Partial match
        if result.empty:
            result = self.data[self.data["Dish Name"].str.contains(dish_name, na=False)]

        # Fuzzy match
        if result.empty:
            close_matches = get_close_matches(dish_name, self.data["Dish Name"].tolist(), n=1, cutoff=0.7)
            if close_matches:
                result = self.data[self.data["Dish Name"] == close_matches[0]]

        if not result.empty:
            return result.iloc[0].to_dict()

        # Fallback to ML prediction
        return self.predict_with_ml(dish_name)

    def predict_with_ml(self, dish_name: str) -> dict:
        """
        Predict nutrition info for unknown dish using nearest neighbor ML.
        Args:
            dish_name (str)
        Returns:
            dict: Predicted nutrition values
        """
        dish_vec = self.vectorizer.transform([dish_name])
        distances, indices = self.nn_model.kneighbors(dish_vec, n_neighbors=3)

        similar_dishes = self.data.iloc[indices[0]]
        avg_values = similar_dishes[self.numeric_cols].mean().to_dict()

        return {
            "Dish Name": dish_name,
            "Prediction": True,
            "Based on Similar Dishes": similar_dishes["Dish Name"].tolist(),
            **avg_values
        }