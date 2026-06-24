from models import Task

task = Task(
    title="Send IBM proposal",
    owner="Ravi",
    due_date="Friday",
    priority="high",
    confidence=0.95
)

print(task)