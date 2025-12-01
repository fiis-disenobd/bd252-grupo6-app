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

document.getElementById('formResponsable').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        id_responsable: document.getElementById('id_responsable').value,
        proyecto: document.getElementById('proyecto').value,
        nombre_responsable: document.getElementById('nombre_responsable').value,
        rol_responsable: document.getElementById('rol_responsable').value,
        disponibilidad: document.getElementById('disponibilidad').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        cod_requerimiento: document.getElementById('cod_requerimiento').value,
    };

    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('http://127.0.0.1:8000//api/responsables/crear/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert('¡Responsable registrado con éxito!');
            window.location.href = '/responsables/';
        } else {
            alert('Error: ' + (result.error || 'Error desconocido'));
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});
