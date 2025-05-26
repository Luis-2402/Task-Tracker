#!/usr/bin/env node
const fs = require('fs');
const path = './tasks.json';
const command = process.argv[2];
const args = process.argv.slice(3);

// Carga de tareas
function loadTasks() {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '[]'); // Solo se crea vacío si no existe
  }
  return JSON.parse(fs.readFileSync(path));
}

function saveTasks(tasks) {
  fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
}

// Generar nuevo ID
function getNextId(tasks) {
  return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}


// Comandos
switch (command) {
  case 'add':
    const description = args.join(' ').trim();
    if (!description) return console.log('❌ Debes escribir una descripción');
    const tasksAdd = loadTasks();
    const newTask = {
      id: getNextId(tasksAdd),
      description,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasksAdd.push(newTask);
    saveTasks(tasksAdd);
    console.log(`✅ Tarea agregada (ID: ${newTask.id})`);
    break;

  case 'update':
    const [updateIdStr, ...updateDescArr] = args;
    const updateId = Number(updateIdStr);
    const newDesc = updateDescArr.join(' ').trim();
    if (!updateId || !newDesc) return console.log('❌ Debes indicar ID y nueva descripción');
    const tasksUpdate = loadTasks();
    const taskToUpdate = tasksUpdate.find(t => t.id === updateId);
    if (!taskToUpdate) return console.log('❌ Tarea no encontrada');
    taskToUpdate.description = newDesc;
    taskToUpdate.updatedAt = new Date().toISOString();
    saveTasks(tasksUpdate);
    console.log(`✏️ Tarea actualizada (ID: ${updateId})`);
    break;

  case 'delete':
    const deleteId = Number(args[0]);
    const tasksDelete = loadTasks();
    const filteredTasks = tasksDelete.filter(t => t.id !== deleteId);
    if (filteredTasks.length === tasksDelete.length) return console.log('❌ Tarea no encontrada');
    saveTasks(filteredTasks);
    console.log(`🗑️ Tarea eliminada (ID: ${deleteId})`);
    break;

  case 'mark-in-progress':
  case 'mark-done':
    const markId = Number(args[0]);
    const statusToSet = command === 'mark-done' ? 'done' : 'in-progress';
    const tasksMark = loadTasks();
    const taskToMark = tasksMark.find(t => t.id === markId);
    if (!taskToMark) return console.log('❌ Tarea no encontrada');
    taskToMark.status = statusToSet;
    taskToMark.updatedAt = new Date().toISOString();
    saveTasks(tasksMark);
    console.log(`✅ Tarea actualizada a "${statusToSet}" (ID: ${markId})`);
    break;

    case 'show-json':
        try {
            const tasks = loadTasks();
            console.log("📄 Contenido actual de tasks.json:");
            console.log(JSON.stringify(tasks, null, 2));
        } catch (err) {
            console.error('❌ Error al leer tasks.json:', err.message);
        }
    break;

  case 'list':
    const filter = args[0];
    const tasksList = loadTasks();
    const filtered = filter
      ? tasksList.filter(t => t.status === filter)
      : tasksList;
    if (filtered.length === 0) return console.log('📭 No hay tareas para mostrar.');
    filtered.forEach(t =>
      console.log(`[#${t.id}] (${t.status}) ${t.description} - Actualizado: ${t.updatedAt}`)
    );
    break;

  default:
    console.log('❓ Comando no reconocido.');
    console.log('Comandos válidos: add, update, delete, mark-done, mark-in-progress, list [status]');
}