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

document.getElementById('formProyecto').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        id_proyecto: document.getElementById('id_proyecto').value,
        cliente: document.getElementById('id_cliente').value,
        nombre_proyecto: document.getElementById('nombre_proyecto').value,
        fecha_inicio: document.getElementById('fecha_inicio').value,
        fecha_fin: document.getElementById('fecha_fin').value || null,
        descripcion: document.getElementById('descripcion').value,
        estado_proyecto: document.getElementById('estado_proyecto').value,
        prioridad_proyecto: document.getElementById('prioridad_proyecto').value
    };

    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/proyectos/crear/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken 
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('¡Proyecto creado con éxito!');
            window.location.href = '/proyectos/';
        } else {
            const mensaje = result.error || 'Error desconocido';
            alert('Error: ' + mensaje);
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});
