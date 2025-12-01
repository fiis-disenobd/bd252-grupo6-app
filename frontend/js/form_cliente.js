// Obtener token CSRF
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

document.getElementById('formCliente').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        id_cliente: document.getElementById('id_cliente').value,
        nombre_cliente: document.getElementById('nombre_cliente').value,
        tipo_cliente: document.getElementById('tipo_cliente').value,
        contacto_cliente: document.getElementById('contacto_cliente').value,
        correo_cliente: document.getElementById('correo_cliente').value,
        telefono_cliente: document.getElementById('telefono_cliente').value,
        direccion_cliente: document.getElementById('direccion_cliente').value
    };

    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/clientes/crear/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Cliente creado con éxito');
            window.location.href = '/clientes/';
        } else {
            alert("Error: " + (result.error || "Error desconocido"));
        }

    } catch (err) {
        console.error(err);
        alert("Error de conexión");
    }
});
