from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import datetime
import subprocess


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8001", "http://localhost:8002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Diet Generator Endpoint ---
class DietRequest(BaseModel):
    goal: str
    concern: str = ""
    restrictions: str = ""
    patient_name: str = "Patient"
    patient_age: int = 30
    patient_gender: str = "Not specified"
    patient_height: Optional[float] = None
    patient_weight: Optional[float] = None

@app.post("/generate-diet-chart")
def generate_diet_chart(request: DietRequest):
    # Always resolve paths relative to this file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.abspath(os.path.join(base_dir, "..", "Diet_Generator.py"))
    pdf_path = os.path.abspath(os.path.join(base_dir, "..", "data", "Diet_chart.pdf"))
    
    # Create enhanced diet plan using the Python script directly
    import sys
    sys.path.append(os.path.join(base_dir, ".."))
    try:
        from Diet_Generator import AyurvedicDietPlanner, read_csv
        from simple_pdf import create_simple_diet_pdf
    except ImportError as e:
        return JSONResponse({"error": f"Import error: {str(e)}"}, status_code=500)
    
    try:
        # Read the dataset
        data_path = os.path.join(base_dir, "..", "data", "Diet_generator.csv")
        dataset = read_csv(data_path)
        
        # Generate diet plan
        planner = AyurvedicDietPlanner(dataset)
        plan = planner.generate_plan(request.goal, request.concern, "", request.restrictions)
        
        # Create enhanced PDF with patient details
        create_simple_diet_pdf(
            plan, 
            pdf_path, 
            request.goal, 
            request.concern, 
            request.restrictions,
            request.patient_name,
            request.patient_age,
            request.patient_gender,
            request.patient_height,
            request.patient_weight
        )
        
        if not os.path.exists(pdf_path):
            return JSONResponse({"error": "Diet chart PDF was not generated."}, status_code=500)
        return FileResponse(pdf_path, filename="Diet_chart.pdf")
    except Exception as e:
        return JSONResponse({"error": f"Error generating diet chart: {str(e)}"}, status_code=500)

# --- Calorie Tracker Endpoint ---
class FoodLogRequest(BaseModel):
    food_items: List[str]
    date: Optional[str] = None  # YYYY-MM-DD

@app.post("/track-calories")
def track_calories(request: FoodLogRequest):
    # Call Calorie_tracker.py with food items
    # Assume it returns calorie/nutrient info
    args = ["python3", "../Calorie_tracker.py"] + request.food_items
    result = subprocess.run(args, capture_output=True, text=True)
    # Store log by date
    log_date = request.date or datetime.date.today().isoformat()
    log_path = f"../data/log_{log_date}.txt"
    with open(log_path, "a") as f:
        f.write(result.stdout + "\n")
    return JSONResponse({"result": result.stdout, "date": log_date})

# --- Daily Log Retrieval ---
@app.get("/get-log/{date}")
def get_log(date: str):
    log_path = f"../data/log_{date}.txt"
    if os.path.exists(log_path):
        with open(log_path) as f:
            return {"log": f.read()}
    return {"log": "No log found for this date."}
