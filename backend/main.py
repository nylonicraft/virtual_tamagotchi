import os
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="./frontend"), name="static")

class TamagotchiState(BaseModel):
    name: str  # Ім'я тамагочі
    satiety: int = 50
    happiness: int = 50

def load_state(user_id: str) -> TamagotchiState:
    state_file = os.path.join(os.path.dirname(__file__), f"../data/state_{user_id}.json")
    if not os.path.exists(state_file):
        raise FileNotFoundError(f"Файл стану для користувача {user_id} не знайдено.")

    with open(state_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    return TamagotchiState(**data)

def save_state(user_id: str, state: TamagotchiState):
    state_file = os.path.join(os.path.dirname(__file__), f"../data/state_{user_id}.json")
    data_to_save = state.dict()
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(data_to_save, f, ensure_ascii=False, indent=4)

@app.get("/", response_class=HTMLResponse, summary="Головна сторінка", description="Цей ендпоінт повертає HTML-файл.")
def root():
    with open("./frontend/index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)