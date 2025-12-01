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

document.getElementById('formDocumentacion').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('/documentacion/crear/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('¡Documento registrado con éxito!');
            window.location.href = '/documentacion/';
        } else {
            const mensaje = result.error || 'Error desconocido';
            alert('Error: ' + mensaje);
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});
