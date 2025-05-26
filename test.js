const { execSync } = require('child_process');
const fs = require('fs');
const path = './tasks.json';

function readTasksFile() {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function test(description, command, expectedText, verifyFileFn = null) {
  try {
    const output = execSync(`node task-cli.js ${command}`, { encoding: 'utf-8' });
    const success = expectedText ? output.includes(expectedText) : true;

    const fileValid = verifyFileFn ? verifyFileFn(readTasksFile()) : true;

    if (success && fileValid) {
      console.log(`✅ ${description}`);
    } else {
      console.error(`❌ ${description} — Falla de contenido o archivo:\n${output}`);
    }
  } catch (err) {
    console.error(`❌ ${description} — error:\n${err.stdout || err.message}`);
  }
}

function testError(description, command, expectedError) {
  try {
    execSync(`node task-cli.js ${command}`, { encoding: 'utf-8', stdio: 'pipe' });
    console.error(`❌ ${description} — se esperaba error y no ocurrió`);
  } catch (err) {
    if (err.stdout.includes(expectedError)) {
      console.log(`✅ ${description}`);
    } else {
      console.error(`❌ ${description} — error inesperado:\n${err.stdout}`);
    }
  }
}

// 🚀 Inicio de pruebas
resetJSON();

test("Agregar tarea válida", `add "Leer un libro"`, "Tarea agregada", (data) => {
  return data.length === 1 && data[0].description === "Leer un libro" && data[0].status === "todo";
});

test("Actualizar tarea", `update 1 "Leer dos libros"`, "actualizada", (data) => {
  return data[0].description === "Leer diez libros a la semana";
});

test("Marcar como en progreso", `mark-in-progress 1`, "in-progress", (data) => {
  return data[0].status === "in-progress";
});

test("Marcar como completada", `mark-done 1`, "done", (data) => {
  return data[0].status === "done";
});

console.log("📂 Estado actual del archivo tasks.json:");
console.log(JSON.stringify(readTasksFile(), null, 2));

/* test("Eliminar tarea", `delete 1`, "eliminada", (data) => {
  return data.length === 0;
}); */

// ❌ PRUEBAS NEGATIVAS

testError("Actualizar tarea inexistente", `update 99 "Nada"`, "Tarea no encontrada");
testError("Eliminar tarea inexistente", `delete 99`, "Tarea no encontrada");
testError("Marcar tarea inexistente", `mark-done 99`, "Tarea no encontrada");
testError("Agregar tarea sin descripción", `add`, "Debes escribir una descripción");

console.log("🧪 Pruebas finalizadas.");
