// --- Obtener parámetros de la URL (id del candidato) ---
const urlParams = new URLSearchParams(window.location.search);
const idCandidato = urlParams.get('id');
const modo = urlParams.get('modo') 
let codPostulacion = urlParams.get('cod');

// Referencias a los elementos
const nombre = document.getElementById('nombre');
const telefono = document.getElementById('telefono');
const experiencia = document.getElementById('experiencia');
const proyecto = document.getElementById('proyecto');
const puntajePromedio = document.getElementById('puntaje-promedio');
const mensaje = document.getElementById('mensaje');
const form = document.getElementById('form-evaluacion');

//let codPostulacion = null; Se obtendrá del backend

// --- Cargar información del candidato ---
async function cargarCandidato() {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/evaluaciones/`);
    const data = await res.json();

    //Filtrar el candidato por idCandidato
    const candidato = data.find(c => 
      (c.id_candidato && c.id_candidato.trim() === idCandidato.trim()) ||
      (c.ID_Candidato && c.ID_Candidato.trim() === idCandidato.trim())
    );
    

    if (!candidato) {
      mensaje.textContent = "❌ No se encontró información del candidato.";
      mensaje.style.color = "red";
      return;
    }

    // Mostrar información
    nombre.textContent = candidato.nombre_candidato;
    telefono.textContent = candidato.telefono;
    experiencia.textContent = candidato["años_experiencia"] ?? candidato.anios_experiencia;
    proyecto.textContent = candidato.proyecto_asociado;

    // Guardar codPostulacion si existe en los datos
    codPostulacion = candidato.cod_postulacion || candidato.Cod_Postulacion || null;

    // Simulamos el Cod_Postulacion (en un caso real se debe obtener en el backend)
    //codPostulacion = candidato.Cod_Postulacion ?? "POST001"; // Valor de prueba

  } catch (err) {
    mensaje.textContent = `❌ Error al cargar candidato: ${err}`;
    mensaje.style.color = "red";
  }
}

cargarCandidato();

// --- Calcular puntaje promedio automáticamente ---
const inputs = document.querySelectorAll('#form-evaluacion input[type="number"]');
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.value > 5) input.value = 5;
    if (input.value < 1) input.value = 1;

    // Recalcular promedio
    const valores = Array.from(inputs)
      .map(i => parseInt(i.value))
      .filter(v => !isNaN(v));
    if (valores.length === 5) {
      const promedio = (valores.reduce((a, b) => a + b, 0) / 5).toFixed(2);
      puntajePromedio.textContent = promedio;
    } else {
      puntajePromedio.textContent = "0.00";
    }
  });
});

// --- Enviar formulario de evaluación (POST) ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    Cod_Postulacion: codPostulacion,
    Hard_skills: document.getElementById('Hard_skills').value,
    Soft_skills: document.getElementById('Soft_skills').value,
    Experiencia: document.getElementById('Experiencia').value,
    Etica_integridad: document.getElementById('Etica_integridad').value,
    Evaluacion_economica: document.getElementById('Evaluacion_economica').value,
    Observaciones: document.getElementById('Observaciones').value
  };

  try {
    const url = modo === 'reevaluar' 
      ? `http://127.0.0.1:8000/api/evaluaciones/actualizar/${codPostulacion}/`
      : `http://127.0.0.1:8000/api/evaluaciones/crear/`;

    const method = modo === 'reevaluar' ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      mensaje.textContent = modo === 'reevaluar'
        ? "✅ Evaluación actualizada correctamente."
        : "✅ Evaluación enviada correctamente.";
      mensaje.style.color = 'green';
      form.reset();
      puntajePromedio.textContent = "0.00";
    } else {
      mensaje.textContent = `❌ ${result.error}`;
      mensaje.style.color = 'red';
    }
  } catch (error) {
    mensaje.textContent = `❌ Error al enviar evaluación: ${error}`;
    mensaje.style.color = 'red';
  }
});
