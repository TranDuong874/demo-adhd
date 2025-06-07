from fastapi import FastAPI, Request
from pydantic import BaseModel
from GeminiService import GeminiService
import json
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os

app = FastAPI()
bot = GeminiService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormData(BaseModel):
    age: str
    tasks: str
    freeTime: str
    deadlines: str = None
    activities: str = None
    studyDuration: str = None

@app.post("/schedule")
async def get_schedule(form_data: FormData):
    input_str = (
        f"1 : {form_data.age}, "
        f"2 : {form_data.tasks}, "
        f"3 : {form_data.freeTime}, "
        f"4 : {form_data.deadlines or ''}, "
        f"5 : {form_data.activities or ''}, "
        f"6 : {form_data.studyDuration or ''}"
    )

    raw_response = bot.getResponse(input_str)
    cleaned = raw_response.strip().removeprefix("```json").removesuffix("```").strip()
    data = json.loads(cleaned)
    return data


DATA_FILE = "tasks_data.json"

class Task(BaseModel):
    index: int
    subject: str
    startTime: str  # ISO string expected from frontend Date.toISOString()
    endTime: str
    duration: int

class TaskSession(BaseModel):
    tasks: List[Task]

@app.post("/save_tasks")
async def save_tasks(session: TaskSession):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []
    else:
        existing_data = []

    existing_data.append({"session": session.dict()})

    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving data: {e}")

    return {"message": "Tasks saved successfully"}

@app.get("/get_sessions")
async def get_sessions():
    if not os.path.exists(DATA_FILE):
        return {}

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            all_sessions = json.load(f)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid data format.")

    grouped = defaultdict(list)

    for record in all_sessions:
        session = record.get("session", {})
        tasks = session.get("tasks", [])
        for task in tasks:
            try:
                date_key = task["startTime"][:10]  # "YYYY-MM-DD"
                grouped[date_key].append(task)
            except KeyError:
                continue

    return grouped