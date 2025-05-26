# Task-Tracker

# 📝 Task Tracker CLI

Aplicación de línea de comandos para gestionar tus tareas desde el terminal. Creada en Node.js sin librerías externas.

## Comandos disponibles

```bash
task-cli add "Tarea nueva"
task-cli update <id> "Nueva descripción"
task-cli delete <id>
task-cli mark-in-progress <id>
task-cli mark-done <id>
task-cli list
task-cli list done
task-cli list todo
task-cli list in-progress
task-cli show-json