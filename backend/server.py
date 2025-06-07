from fastapi import FastAPI, Request
from pydantic import BaseModel
from GeminiService import GeminiService
import json
from fastapi.middleware.cors import CORSMiddleware

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
