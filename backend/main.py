import os
import json
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from routes import router
from backend.tasks import decrease_state

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="./frontend"), name="static")
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(decrease_state())

@app.get("/", response_class=HTMLResponse, summary="Головна сторінка", description="Цей ендпоінт повертає HTML-файл.")
def root():
    with open("./frontend/index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)