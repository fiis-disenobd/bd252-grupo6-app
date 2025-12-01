function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if(document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        text.innerText = "Modo Claro";
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        text.innerText = "Modo Oscuro";
        localStorage.setItem('theme', 'light');
    }
}

// Cargar modo oscuro
if(localStorage.getItem('theme') === 'dark') {
    toggleTheme();
}

async function cargarTareas() {
    const lista = document.getElementById('lista-tareas');
    try {
        const res = await fetch('http://127.0.0.1:8000//api/tareas/?format=json');
        const tareas = await res.json();
        lista.innerHTML = '';

        if (tareas.length === 0) {
            lista.innerHTML = '<p class="text-center text-muted">No hay tareas.</p>';
            return;
        }

        tareas.forEach(t => {
            let borderClass = 'border-secondary';
            if(t.estado_tarea === 'dentro del plazo') borderClass = 'border-verde';
            else if(t.estado_tarea === 'en curso') borderClass = 'border-amarillo';
            else borderClass = 'border-rojo';

            lista.innerHTML += `
                <div class="card mb-3 p-3 status-card ${borderClass} tarea-card">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <h5 class="fw-bold mb-0 tarea-nombre">${t.nombre_tarea}</h5>
                            <small class="text-muted">${t.id_tarea}</small>
                        </div>
                        <div class="col-md-4 border-start border-end">
                            <small class="d-block text-muted">Proyecto: 
                                <span class="text-primary">${t.nombre_proyecto}</span>
                            </small>
                            <small class="d-block text-muted">Resp: ${t.nombre_responsable}</small>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="badge bg-light text-dark border">${t.estado_tarea}</span>
                        </div>
                    </div>
                </div>`;
        });
    } catch (err) {
        console.error(err);
    }
}

function filtrarTareas() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let tarjetas = document.getElementsByClassName('tarea-card');

    for (let i = 0; i < tarjetas.length; i++) {
        let nombre = tarjetas[i]
            .getElementsByClassName('tarea-nombre')[0]
            .innerText.toLowerCase();
        
        tarjetas[i].style.display = nombre.includes(input) ? "" : "none";
    }
}

document.addEventListener('DOMContentLoaded', cargarTareas);
