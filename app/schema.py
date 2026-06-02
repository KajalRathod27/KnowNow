from pydantic import BaseModel

class NewsInput(BaseModel):
    text: str

class BatchNewsInput(BaseModel):
    texts: list[str]