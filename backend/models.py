from pydantic import BaseModel
from typing import List

class Task(BaseModel):
    title: str
    owner: str
    due_date: str
    priority: str
    confidence: float

class Reminder(BaseModel):
    title: str
    remind_at: str
    confidence: float

class ActionPlan(BaseModel):
    goal: str
    steps: List[str]

class ExtractionResult(BaseModel):
    tasks: List[Task]
    reminders: List[Reminder]
    action_plans: List[ActionPlan]
    summary: List[str]
    decisions: List[str]
    risks: List[str]