from pydantic import BaseModel
from typing import List, Optional


class Task(BaseModel):
    task: str
    owner: str
    due_date: Optional[str]
    priority: str
    confidence: float


class Reminder(BaseModel):
    title: str
    date_or_time: str
    owner: str


class ActionPlan(BaseModel):
    title: str
    owner: str
    steps: List[str]


class ExtractionResult(BaseModel):
    summary: List[str]
    tasks: List[Task]
    reminders: List[Reminder]
    action_plans: List[ActionPlan]
    decisions: List[str]
    risks: List[str]