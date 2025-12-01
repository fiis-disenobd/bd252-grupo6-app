// --- Cargar lista de evaluaciones de candidatos ---
document.addEventListener('DOMContentLoaded', async () => {
  const tablaEvaluaciones = document.getElementById('tabla-evaluaciones-body');
  const mensaje = document.getElementById('mensaje-evaluaciones');

  try {
    const response = await fetch('http://127.0.0.1:8000/api/evaluaciones/');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener la lista de evaluaciones.');
    }

    // Limpiar tabla antes de cargar
    tablaEvaluaciones.innerHTML = '';

    // Si no hay registros
    if (data.length === 0) {
      mensaje.textContent = 'No hay evaluaciones registradas.';
      mensaje.style.color = 'gray';
      return;
    }

    // Cargar filas
    data.forEach((item) => {
      const fila = document.createElement('tr');

      const evaluado = item.puntaje_obtenido !== null && item.puntaje_obtenido !== undefined;
      const textBoton = evaluado ? 'Reevaluar' : 'Evaluar';
      const classBoton = evaluado ? 'btn-reevaluar' : 'btn-evaluar';
      const modo = evaluado ? 'reevaluar' : 'evaluar';
      


      fila.innerHTML = `
        <td>${item.nombre_candidato ?? '—'}</td>
        <td>${item.id_candidato ?? '—'}</td>
        <td>${item.telefono}</td>        
        <td>${item['años_experiencia'] ?? item.anios_experiencia ?? '—'}</td>
        <td>${item.proyecto_asociado ?? '—'}</td>
        <td>${item.puntaje_obtenido ?? '—'}</td>
        <td>${item.fecha_evaluacion ? new Date(item.fecha_evaluacion).toLocaleDateString() : '—'}</td>
        <td>
          <button class="${classBoton}" 
          data-id="${item.id_candidato} "
          data-cod="${item.cod_contrato ?? ''} "
          data-modo="${modo}">
            ${textBoton}
          </button>
        </td>
      `;
      tablaEvaluaciones.appendChild(fila);
    });

  

    // Mensaje de éxito
    mensaje.textContent = `✅ ${data.length} candidatos cargados correctamente.`;
    mensaje.style.color = 'green';

    // Agregar eventos a los botones de "Evaluar"
    document.querySelectorAll('.btn-evaluar, .btn-reevaluar').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idCandidato = e.target.dataset.id;
        const codPostulacion = e.target.dataset.cod;
        const modo = e.target.dataset.modo;
        // Redirigir al detalle de evaluación
        window.location.href = `evaluar_candidato_detalle.html?id=${idCandidato}&cod=${codPostulacion}&modo=${modo}`;
      });
    });

  } catch (error) {
    mensaje.textContent = `❌ Error al cargar evaluaciones: ${error.message}`;
    mensaje.style.color = 'red';
  }
});
