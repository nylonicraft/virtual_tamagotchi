from models import TamagotchiState
from services import load_state, save_state
from fastapi import APIRouter, Body

router = APIRouter()

@router.post("/create", summary="Створити нового тамагочі", description="Цей ендпоінт створює нового тамагочі з унікальним UID та ім'ям.")
def create_tamagochi(data: dict = Body(...)):
    user_id = data.get("user_id")
    name = data.get("name")

    if not user_id or not name:
        return {"message": "UID та ім'я обов'язкові."}

    state_file = os.path.join(os.path.dirname(__file__), f"../data/state_{user_id}.json")
    if os.path.exists(state_file):
        return {"message": "Тамагочі з таким UID вже існує."}

    # Створюємо початковий стан з ім'ям
    state = TamagotchiState(name=name, satiety=50, happiness=50)
    save_state(user_id, state)

    return {"message": f"Тамагочі '{name}' створено!"}

@router.get("/status/{user_id}", summary="Перевірити стан тамагочі", description="Цей ендпоінт повертає стан тамагочі за його UID.")
def status(user_id: str):
    try:
        state = load_state(user_id)
        return {"state": state}
    except FileNotFoundError:
        return {"error": f"Тамагочі з UID {user_id} не знайдено."}
    
@app.get("/feelings/{user_id}", summary="Емоційний стан тамагочі", description="Цей ендпоінт повертає емоційний стан тамагочі за його UID.")
def feelings(user_id: str):
    # Завантаження стану тамагочі з файлу
    state = load_state(user_id)
     # Визначення емоційного стану на основі ситості та щастя
    feelings = {
        "hungry": state.satiety < 30, # Голодний, якщо ситість менше 30
        "bored": state.happiness < 30, # Нудьгує, якщо щастя менше 30
        "happy": state.satiety >= 30 and state.happiness >= 30 # Щасливий, якщо ситість і щастя >= 30
    }
    return {"feelings": feelings}

@router.post("/feed/{user_id}", summary="Нагодувати тамагочі", description="Цей ендпоінт нагодує тамагочі, підвищуючи його ситість.")
def feed(user_id: str):
    # Завантаження стану тамагочі
    state = load_state(user_id)
    # Збільшення ситості на 10, але не більше 100
    state.satiety = min(state.satiety + 10, 100)
    # Збереження оновленого стану
    save_state(user_id, state)
    return {"message": "Тамагочі нагодовано!", "state": state}

@router.post("/play/{user_id}", summary="Пограти з тамагочі", description="Цей ендпоінт пограє з тамагочі, підвищуючи його щастя.")
def play(user_id: str):
    state = load_state(user_id)
    state.happiness = min(state.happiness + 10, 100)
    save_state(user_id, state)
    return {"message": "Тамагочі пограв!", "state": state}