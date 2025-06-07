from google import genai
from dotenv import load_dotenv
import os
import json
from google.genai import types

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

with open('system_instruction.txt', 'r', encoding='utf-8') as file:
    system_instruction = file.readlines()


class GeminiService:
    def __init__(self):
        self.SYSTEM_INSTRUCTION = system_instruction
    def sendQuery(self, query: str):
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(system_instruction=self.SYSTEM_INSTRUCTION),
            contents=[query]
        )
        return response
    
    def getResponse(self, query: str):
        response = self.sendQuery(query)
        if not response:
            return "GeminiSerivce.py: getResponse Error"
        else:
            return response.text
        
