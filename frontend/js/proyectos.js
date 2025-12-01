function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("theme-icon");
    const text = document.getElementById("theme-text");

    if (document.body.classList.contains("dark-mode")) {
        icon.classList.replace("fa-moon", "fa-sun");
        text.innerText = "Modo Claro";
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        text.innerText = "Modo Oscuro";
        localStorage.setItem("theme", "light");
    }
}

// Mantener la preferencia
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

/* =====================================================
   Cargar Proyectos desde API
===================================================== */

async function cargarProyectos() {
    const tbody = document.getElementById("tabla-body");

    try {
        const res = await fetch("http://127.0.0.1:8000/api/proyectos/?format=json");
        const proyectos = await res.json();

        tbody.innerHTML = "";

        if (proyectos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay proyectos.</td></tr>`;
            return;
        }

        proyectos.forEach(p => {
            const estado = (p.estado_proyecto || "").toLowerCase();

            let badge = "bg-secondary";
            if (estado === "en curso") badge = "bg-en-curso";
            else if (estado === "pendiente") badge = "bg-pendiente";
            else if (estado === "cerrado") badge = "bg-cerrado";

            tbody.innerHTML += `
                <tr>
                    <td class="fw-bold opacity-75">${p.id_proyecto}</td>
                    <td class="fw-bold">${p.nombre_proyecto}</td>
                    <td><i class="fas fa-user opacity-50 me-1"></i> ${p.nombre_cliente}</td>
                    <td><span class="badge-estado ${badge}">${p.estado_proyecto}</span></td>
                    <td>${p.prioridad_proyecto}</td>
                    <td><small class="opacity-75">Ini: ${p.fecha_inicio}</small></td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML =
            `<tr><td colspan="6" class="text-danger text-center">Error de API</td></tr>`;
    }
}

/* =====================================================
   FILTRO
===================================================== */

function filtrarProyectos() {
    const filtro = document.getElementById("filtroEstado").value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-body tr");

    filas.forEach(fila => {
        const estado = fila.cells[3].textContent.toLowerCase().trim();

        fila.style.display =
            filtro === "todos" || estado === filtro ? "" : "none";
    });
}

document.addEventListener("DOMContentLoaded", cargarProyectos);
