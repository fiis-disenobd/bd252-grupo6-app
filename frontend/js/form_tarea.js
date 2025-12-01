function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.getElementById('formTarea').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        id_tarea: document.getElementById('id_tarea').value,
        proyecto: document.getElementById('proyecto').value,
        responsable: document.getElementById('responsable').value,
        nombre_tarea: document.getElementById('nombre_tarea').value,
        descripcion_tarea: document.getElementById('descripcion_tarea').value,
        fecha_inicio_tarea: document.getElementById('fecha_inicio_tarea').value,
        fecha_entrega_estimada: document.getElementById('fecha_entrega_estimada').value || null,
        fecha_entrega_real: document.getElementById('fecha_entrega_real').value || null,
        estado_tarea: document.getElementById('estado_tarea').value
    };

    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('http://127.0.0.1:8000//api/tareas/crear/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert('¡Tarea registrada con éxito!');
            window.location.href = '/tareas/';
        } else {
            alert('Error: ' + (result.error || 'Error desconocido'));
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});
