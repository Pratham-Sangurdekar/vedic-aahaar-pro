import csv
import sys
import os
import random
import datetime
from fpdf import FPDF

class AyurvedicDietPlanner:
    def __init__(self, dataset: list):
        """
        Initialize diet planner with a dataset.
        Args:
            dataset (list of dicts): Parsed CSV rows or food entries
        """
        self.data = dataset

    def filter_foods(self, goal, concern, preferences="", restrictions="") -> list:
        """
        Filter foods based on goals, health concerns, preferences, and restrictions.
        Returns top 5 foods.
        """
        goal = goal.lower()
        concern = concern.lower()
        preferences = preferences.lower()
        restrictions = restrictions.lower()

        scored_foods = []

        for food in self.data:
            text = " ".join(str(food.values())).lower()

            # Skip foods violating restrictions
            if restrictions and restrictions in text:
                continue

            # Scoring
            score = 0
            if goal in text: score += 3
            if concern in text: score += 2
            if preferences and preferences in text: score += 2
            if "tridoshic" in text: score += 1

            scored_foods.append((score, food))

        # Sort by score descending
        scored_foods.sort(key=lambda x: x[0], reverse=True)

        top_foods = [food for score, food in scored_foods if score > 0]

        # Fallback to random if no scoring foods
        if not top_foods:
            top_foods = random.sample(self.data, min(5, len(self.data)))

        return top_foods[:5]

    def generate_plan(self, goal, concern, preferences="", restrictions="") -> dict:
        """
        Generate diet plan with meals: Breakfast, Lunch, Snack, Dinner, Drink
        """
        foods = self.filter_foods(goal, concern, preferences, restrictions)

        if not foods:
            return {"message": "Fallback: Try basic sattvic diet (fruits, rice, lentils, ghee, herbal teas)."}

        plan = {
            "Breakfast": foods[0]["Food Name"],
            "Lunch": foods[1]["Food Name"] if len(foods) > 1 else foods[0]["Food Name"],
            "Snack": foods[2]["Food Name"] if len(foods) > 2 else foods[0]["Food Name"],
            "Dinner": foods[3]["Food Name"] if len(foods) > 3 else foods[0]["Food Name"],
            "Drink": foods[4]["Food Name"] if len(foods) > 4 else "Herbal tea (Tulsi, Ginger, or Cumin)"
        }
        return plan


def read_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return [row for row in reader]


# Robust main for any working directory
if __name__ == "__main__":
    # Usage: python Diet_Generator.py <goal> <concern> <restrictions>
    args = sys.argv[1:]
    if len(args) < 1:
        print("Usage: python Diet_Generator.py <goal> <concern> <restrictions>")
        sys.exit(1)
    goal = args[0]
    concern = args[1] if len(args) > 1 else ""
    restrictions = args[2] if len(args) > 2 else ""
    # Always resolve paths relative to this script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "data", "Diet_generator.csv")
    out_path = os.path.join(base_dir, "data", "Diet_chart.pdf")
    dataset = read_csv(data_path)
    planner = AyurvedicDietPlanner(dataset)
    plan = planner.generate_plan(goal, concern, "", restrictions)
    write_plan_pdf(plan, out_path, goal, concern, restrictions)
# ayurvedic_diet_planner.py

import random

class AyurvedicDietPlanner:
    def __init__(self, dataset: list):
        """
        Initialize diet planner with a dataset.
        Args:
            dataset (list of dicts): Parsed CSV rows or food entries
        """
        self.data = dataset

    def filter_foods(self, goal, concern, preferences="", restrictions="") -> list:
        """
        Filter foods based on goals, health concerns, preferences, and restrictions.
        Returns top 5 foods.
        """
        goal = goal.lower()
        concern = concern.lower()
        preferences = preferences.lower()
        restrictions = restrictions.lower()

        scored_foods = []

        for food in self.data:
            text = " ".join(str(food.values())).lower()

            # Skip foods violating restrictions
            if restrictions and restrictions in text:
                continue

            # Scoring
            score = 0
            if goal in text: score += 3
            if concern in text: score += 2
            if preferences and preferences in text: score += 2
            if "tridoshic" in text: score += 1

            scored_foods.append((score, food))

        # Sort by score descending
        scored_foods.sort(key=lambda x: x[0], reverse=True)

        top_foods = [food for score, food in scored_foods if score > 0]

        # Fallback to random if no scoring foods
        if not top_foods:
            top_foods = random.sample(self.data, min(5, len(self.data)))

        return top_foods[:5]

    def generate_plan(self, goal, concern, preferences="", restrictions="") -> dict:
        """
        Generate diet plan with meals: Breakfast, Lunch, Snack, Dinner, Drink
        """
        foods = self.filter_foods(goal, concern, preferences, restrictions)

        if not foods:
            return {"message": "Fallback: Try basic sattvic diet (fruits, rice, lentils, ghee, herbal teas)."}

        plan = {
            "Breakfast": foods[0]["Food Name"],
            "Lunch": foods[1]["Food Name"] if len(foods) > 1 else foods[0]["Food Name"],
            "Snack": foods[2]["Food Name"] if len(foods) > 2 else foods[0]["Food Name"],
            "Dinner": foods[3]["Food Name"] if len(foods) > 3 else foods[0]["Food Name"],
            "Drink": foods[4]["Food Name"] if len(foods) > 4 else "Herbal tea (Tulsi, Ginger, or Cumin)"
        }
        return plan