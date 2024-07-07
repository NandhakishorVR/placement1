import logging
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

# Define CORS origins
origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:5173",  # Vite dev server
    "http://localhost:5174",  # Add this
    "http://localhost:5175",
]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize GenerativeAI model and chat
GOOGLE_API_KEY = "AIzaSyA-W9iNhXEOR84gKXHqKBf70PMhuMZATUM"  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(history=[])

class RequestModel(BaseModel):
    data: str

class ResponseModel(BaseModel):
    result: list

def answerMyQn(a):
    logging.info("Inside answerMyQn function")
    response = chat.send_message("give me a mcq question on computer science along with exactly 5 options which are numbered using normal numbers without any further explanation")
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
    ans = list(ans)[0]
    result = qn + [ans]
    logging.info(f"Final result: {result}")
    result[5] = int(result[5].split('.')[0])
    return result

@app.post("/api/answer_my_qn", response_model=ResponseModel)
async def answer_my_qn(request: RequestModel):
    try:
        resultSet = []
        count = 0
        while count != 5:
            result = answerMyQn(request.data)
            if result[5] <= len(result) - 2:
                resultSet.append(result)
                count +=  1
        logging.info(json.dumps(resultSet))
        return {"result": resultSet}
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    logging.basicConfig(level=logging.INFO)
    uvicorn.run("src.api.api:app", host='0.0.0.0', port=8000, log_level="info")
