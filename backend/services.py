import os
import json
from models import TamagotchiState

def load_state(user_id: str) -> TamagotchiState:
    # Формування шляху до файлу стану для конкретного користувача
    state_file = os.path.join(os.path.dirname(__file__), f"../data/state_{user_id}.json")
    
    # Перевірка, чи існує файл стану
    if not os.path.exists(state_file):
        raise FileNotFoundError(f"Файл стану для користувача {user_id} не знайдено.")

    # Завантаження даних із JSON-файлу
    with open(state_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Перетворення JSON-даних у модель TamagotchiState
    return TamagotchiState(**data)

def save_state(user_id: str, state: TamagotchiState):
    # Формування шляху до файлу стану для конкретного користувача
    state_file = os.path.join(os.path.dirname(__file__), f"../data/state_{user_id}.json")
    
    # Перетворення моделі TamagotchiState у словник для збереження
    data_to_save = state.dict()
    
    # Переконання, що директорія для файлу існує
    data_dir = os.path.dirname(state_file)
    os.makedirs(data_dir, exist_ok=True)  # Створює директорію, якщо її немає
    
    # Збереження даних у JSON-файл
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(data_to_save, f, ensure_ascii=False, indent=4)  # `ensure_ascii=False` для підтримки Unicode