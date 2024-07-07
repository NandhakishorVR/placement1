import pathlib
import textwrap
import google.generativeai as genai
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings
import logging

app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = genai.GenerativeModel("gemini-1.5-flash")
GOOGLE_API_KEY = "your_api_key_here"
genai.configure(api_key=GOOGLE_API_KEY)
chat = model.start_chat(history=[])

class Settings(BaseSettings):
    class Config:
        arbitrary_types_allowed = True

class RequestModel(BaseModel):
    data: str

class ResponseModel(BaseModel):
    result: list

def answerMyQn(a):
    logging.info("Inside answerMyQn function")
    response = chat.send_message("give me a mcq question on computer science interview along with exactly 5 options which are numbered using normal numbers without any further explanation")
    logging.info(f"First response: {response}")
    qn = response.text
    qn = qn.split('\n')
    qn = [x for x in qn if x != '']
    qn = [x for x in qn if x != '## Question:']
    qn = [x for x in qn if x != '## Answer:']
    qn = qn[:-1]
    response = chat.send_message("give correct option number of above mcq no need of other explanation and only option number required")
    logging.info(f"Second response: {response}")
    ans = response.text
    ans = list(ans)
    result = qn + list(ans[0])
    result = json.dumps(result)
    logging.info(f"Final result: {result}")
    return result

@app.post("/api/answer_my_qn", response_model=ResponseModel)
async def answer_my_qn(request: RequestModel):
    resultSet = []
    for i in range(6):
        result = answerMyQn(request.data)
        if i > 0 :
            resultSet[i] = result
    return ResponseModel(result=resultSet)

if __name__ == '__main__':
    import uvicorn
    logging.basicConfig(level=logging.INFO)
    uvicorn.run("src.api.api:app", host='0.0.0.0', port=8000, log_level="info")
