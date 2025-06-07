from fastapi import FastAPI
from GeminiService import GeminiService
import json

app = FastAPI()

if __name__ == "__main__":
    bot = GeminiService()

    test_input = '{' \
    '1 : 12,' \
    '2 : Math, English,' \
    '3 : I can study tonight at 8pm, my school starts 7am' \
    '4 : Math test tomorrow, english deadline 2 days later,' \
    '' \
    '}'


    
    raw_response = bot.getResponse(test_input)
    cleaned = raw_response.strip().removeprefix("```json").removesuffix("```").strip()
    data = json.loads(cleaned)
    print(json.dumps(data,ensure_ascii=False, indent=4))