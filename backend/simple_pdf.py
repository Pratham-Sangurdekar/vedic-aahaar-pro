import csv
import sys
import os
import random
import datetime
from fpdf import FPDF

def create_simple_diet_pdf(plan, path, goal, concern, restrictions, patient_name="Patient", patient_age=30, patient_gender="Not specified", patient_height=None, patient_weight=None):
    pdf = FPDF()
    pdf.add_page()
    
    # Header
    pdf.set_font("Arial", "B", 20)
    pdf.set_text_color(0, 100, 0)
    pdf.cell(0, 12, "Ved-Aahaar", ln=True, align="C")
    pdf.set_font("Arial", "", 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, "Personalized Ayurvedic Diet Plan", ln=True, align="C")
    
    # Line
    pdf.set_draw_color(0, 100, 0)
    pdf.set_line_width(0.5)
    pdf.line(20, 35, 190, 35)
    pdf.ln(5)
    # Patient Info
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 100, 0)
    pdf.ln(7)
    pdf.cell(0, 10, "Patient Information", ln=True)
    
    
    pdf.set_font("Arial", "", 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 6, f"Name: {patient_name}", ln=True)
    pdf.cell(0, 6, f"Age: {patient_age} years", ln=True)
    pdf.cell(0, 6, f"Gender: {patient_gender}", ln=True)
    if patient_height:
        pdf.cell(0, 6, f"Height: {patient_height} cm", ln=True)
    if patient_weight:
        pdf.cell(0, 6, f"Weight: {patient_weight} kg", ln=True)
    
    
    
    # Health Assessment
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 100, 0)
    pdf.cell(0, 10, "Health Assessment", ln=True)
    pdf.ln(2)
    
    pdf.set_font("Arial", "", 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 6, f"Health Goal: {goal.replace('_', ' ').title()}", ln=True)
    pdf.cell(0, 6, f"Primary Concern: {concern.replace('_', ' ').title()}", ln=True)
    if restrictions:
        pdf.cell(0, 6, f"Dietary Preferences: {restrictions}", ln=True)
    
    pdf.ln(8)
    
    # Diet Plan
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 100, 0)
    pdf.cell(0, 10, "Personalized Diet Plan", ln=True)
    pdf.ln(2)
    
    pdf.set_font("Arial", "", 11)
    pdf.set_text_color(0, 0, 0)
    
    meal_times = {
        "Breakfast": "8:00 AM",
        "Lunch": "12:30 PM", 
        "Snack": "4:00 PM",
        "Dinner": "7:00 PM",
        "Drink": "Throughout the day"
    }
    
    for meal, food in plan.items():
        if meal in meal_times:
            pdf.set_font("Arial", "B", 11)
            pdf.cell(0, 6, f"{meal} ({meal_times[meal]}):", ln=True)
            pdf.set_font("Arial", "", 11)
            pdf.cell(0, 6, f"  {food}", ln=True)
            pdf.ln(2)
    
    pdf.ln(5)
    
    # Principles
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 100, 0)
    pdf.cell(0, 10, "Ayurvedic Principles", ln=True)
    pdf.ln(2)
    
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(0, 0, 0)
    principles = [
        "- Eat at regular times to maintain digestive fire (Agni)",
        "- Include all six tastes (sweet, sour, salty, bitter, pungent, astringent)",
        "- Favor warm, cooked foods over cold, raw foods",
        "- Drink warm water throughout the day",
        "- Practice mindful eating without distractions",
        "- Include seasonal and locally available foods"
    ]
    
    for principle in principles:
        pdf.cell(0, 5, principle, ln=True)
    
    pdf.ln(8)
    
    # Footer
    pdf.set_draw_color(0, 100, 0)
    pdf.line(20, 270, 190, 270)
    pdf.ln(5)
    
    pdf.set_font("Arial", "I", 9)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 5, "This diet plan is based on Ayurvedic principles. Please consult with a healthcare professional", ln=True, align="C")
    pdf.cell(0, 5, "before making significant dietary changes.", ln=True, align="C")
    pdf.cell(0, 5, f"Generated on: {datetime.datetime.now().strftime('%B %d, %Y at %I:%M %p')}", ln=True, align="C")
    
    pdf.output(path)

if __name__ == "__main__":
    # Test the function
    test_plan = {
        "Breakfast": "Khichdi",
        "Lunch": "Prawn Biryani", 
        "Snack": "Fried Fish",
        "Dinner": "Chamthong with Fish",
        "Drink": "Chakhao with Fish"
    }
    
    create_simple_diet_pdf(
        test_plan, 
        "test_simple.pdf", 
        "weight_management", 
        "irregular_digestion", 
        "vegetarian",
        "John Doe", 
        35, 
        "Male", 
        175, 
        80
    )
    print("Simple PDF created successfully")
