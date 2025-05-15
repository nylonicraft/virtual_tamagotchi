from pydantic import BaseModel

class TamagotchiState(BaseModel):
    name: str
    satiety: int = 50
    happiness: int = 50