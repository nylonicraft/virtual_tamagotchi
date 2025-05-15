import asyncio
import os
from services import load_state, save_state
async def decrease_state():
    while True:
        # Отримуємо список усіх файлів стану користувачів
        data_dir = os.path.join(os.path.dirname(__file__), "../data")
        user_files = [f for f in os.listdir(data_dir) if f.startswith("state_") and f.endswith(".json")]

        for user_file in user_files:
            # Витягуємо user_id з імені файлу
            user_id = user_file.replace("state_", "").replace(".json", "")
            state = load_state(user_id)

            # Зменшуємо рівень ситості та щастя
            state.satiety = max(state.satiety - 1, 0)
            state.happiness = max(state.happiness - 1, 0)

            # Зберігаємо оновлений стан
            save_state(user_id, state)

        # Чекаємо 40 секунд перед наступним циклом
        await asyncio.sleep(40)