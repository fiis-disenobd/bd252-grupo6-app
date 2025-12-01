// ======= Modo Oscuro =======
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

// Cargar modo guardado
if (localStorage.getItem("theme") === "dark") {
    toggleTheme();
}

// ======= Cargar Responsables desde API =======
async function cargarResponsables() {
    const cardsContainer = document.getElementById("cards-container");
    const tableBody = document.getElementById("tabla-body");

    try {
        const res = await fetch("http://127.0.0.1:8000//api/responsables/?format=json");
        const data = await res.json();

        cardsContainer.innerHTML = "";
        tableBody.innerHTML = "";

        data.forEach(r => {
            // Badge de disponibilidad
            let badgeClass = "disp-otro";
            const disp = r.disponibilidad?.toLowerCase() || "";

            if (disp.includes("completo")) badgeClass = "disp-completo";
            else if (disp.includes("medio")) badgeClass = "disp-medio";

            // Tarjeta
            cardsContainer.innerHTML += `
                <div class="col-md-6 col-xl-4 mb-3 card-item" data-disponibilidad="${r.disponibilidad}">
                    <div class="card h-100 p-3">
                        <div class="d-flex justify-content-between">
                            <h5 class="fw-bold mb-1">${r.nombre_responsable}</h5>
                            <small class="text-muted opacity-75">${r.id_responsable}</small>
                        </div>

                        <div class="text-primary mb-2">
                            <i class="fas fa-briefcase me-2"></i>${r.rol_responsable}
                        </div>

                        <div class="small text-muted mb-3">
                            <div><i class="fas fa-envelope me-2"></i>${r.correo}</div>
                            <div><i class="fas fa-phone me-2"></i>${r.telefono}</div>
                        </div>

                        <div class="border-top pt-2 mt-auto">
                            <small class="text-muted d-block">Proyecto asignado:</small>
                            <div class="fw-medium text-primary">${r.nombre_proyecto}</div>
                        </div>
                    </div>
                </div>`;

            // Tabla
            tableBody.innerHTML += `
                <tr>
                    <td class="ps-4 opacity-75">${r.id_responsable}</td>
                    <td class="fw-bold">${r.nombre_responsable}</td>
                    <td>${r.rol_responsable}</td>
                    <td>${r.nombre_proyecto}</td>
                    <td>
                        <div class="small">${r.correo}</div>
                        <div class="small opacity-75">${r.telefono}</div>
                    </td>
                    <td><span class="badge-disp ${badgeClass}">${r.disponibilidad}</span></td>
                </tr>`;
        });

    } catch (err) {
        console.error("Error API Responsables:", err);
    }
}

// ======= Filtro =======
function filtrarTabla() {
    const filtro = document.getElementById("filtroDisponibilidad").value.toLowerCase();

    document.querySelectorAll("#tabla-body tr").forEach(fila => {
        const disp = fila.cells[5].textContent.toLowerCase();
        fila.style.display = filtro === "todos" || disp.includes(filtro) ? "" : "none";
    });

    document.querySelectorAll(".card-item").forEach(card => {
        const disp = card.getAttribute("data-disponibilidad").toLowerCase();
        card.style.display = filtro === "todos" || disp.includes(filtro) ? "block" : "none";
    });
}

// Iniciar
document.addEventListener("DOMContentLoaded", cargarResponsables);
