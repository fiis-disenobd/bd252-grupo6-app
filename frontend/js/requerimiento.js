document.getElementById('form-requerimiento').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    tipo_personal: document.getElementById('tipo_personal').value,
    modalidad_trabajo: document.getElementById('modalidad_trabajo').value,
    experiencia_requerida: parseInt(document.getElementById("experiencia_requerida").value),
    puesto: document.getElementById("puesto").value,
    fecha_solicitud: document.getElementById("fecha_solicitud").value
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/requerimientos/crear/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    const mensaje = document.getElementById('mensaje');

    if (response.ok) {
      mensaje.style.color = 'green';
      mensaje.textContent = `✅ ${result.message} (Código: ${result.Cod_Requerimiento})`;
      document.getElementById('form-requerimiento').reset();
    } else {
      mensaje.style.color = 'red';
      mensaje.textContent = `❌ ${result.error}`;
    }
  } catch (err) {
    document.getElementById('mensaje').style.color = 'red';
    document.getElementById('mensaje').textContent = `❌ Error: ${err}`;
  }
  
});

// --- Botón para volver al index ---
document.getElementById("btnVolverInicio").addEventListener("click", () => {
    window.location.href = "index1.html";
});
