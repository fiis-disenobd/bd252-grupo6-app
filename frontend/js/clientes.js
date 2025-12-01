// ---------------------
// MODO OSCURO
// ---------------------
function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        text.innerText = "Modo Claro";
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        text.innerText = "Modo Oscuro";
        localStorage.setItem('theme', 'light');
    }
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// ---------------------
// CARGAR CLIENTES
// ---------------------
async function cargarClientes() {
    const contenedor = document.getElementById('contenedor-clientes');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/clientes/');
        const clientes = await response.json();

        contenedor.innerHTML = '';

        if (clientes.length === 0) {
            contenedor.innerHTML = '<p class="text-center text-muted">No hay clientes registrados.</p>';
            return;
        }

        clientes.forEach(c => {
            const cardHTML = `
            <div class="col-md-6 col-xl-4 mb-4 cliente-card">
                <div class="card h-100 p-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 class="card-title fw-bold mb-1 text-primary cliente-nombre">${c.nombre_cliente}</h5>
                                <small class="text-muted border px-2 py-1 rounded">ID: ${c.id_cliente}</small>
                            </div>
                            <span class="badge-tipo">${c.tipo_cliente || 'General'}</span>
                        </div>
                        <div class="text-muted" style="opacity: 0.8;">
                            <div class="d-flex align-items-center mb-2"><i class="fas fa-user icon-width"></i> ${c.contacto_cliente}</div>
                            <div class="d-flex align-items-center mb-2"><i class="fas fa-envelope icon-width"></i> ${c.correo_cliente}</div>
                            <div class="d-flex align-items-center mb-2"><i class="fas fa-phone icon-width"></i> ${c.telefono_cliente}</div>
                            <div class="d-flex align-items-center mb-1"><i class="fas fa-map-marker-alt icon-width"></i> ${c.direccion_cliente}</div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            contenedor.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p class="text-danger text-center">Error al cargar los datos de la API.</p>';
    }
}

// ---------------------
// BUSCADOR
// ---------------------
function filtrarClientes() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let tarjetas = document.getElementsByClassName('cliente-card');

    for (let i = 0; i < tarjetas.length; i++) {
        let nombre = tarjetas[i].getElementsByClassName('cliente-nombre')[0].innerText.toLowerCase();
        tarjetas[i].style.display = nombre.includes(input) ? "" : "none";
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarClientes);
