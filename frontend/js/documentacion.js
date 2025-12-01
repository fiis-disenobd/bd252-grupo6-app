// ---------------------------
// 1. MODO OSCURO
// ---------------------------
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const icon = document.getElementById("theme-icon");
    const text = document.getElementById("theme-text");

    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        text.innerText = "Modo Claro";
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        text.innerText = "Modo Oscuro";
        localStorage.setItem("theme", "light");
    }
}

if (localStorage.getItem("theme") === "dark") {
    setTimeout(toggleTheme, 10);
}

// ---------------------------
// 2. CARGAR DOCUMENTOS
// ---------------------------
async function cargarDocs() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/documentacion/');
        const data = await res.json();

        const resumen = document.getElementById("resumen-docs");
        const grid = document.getElementById("grid-docs");
        const table = document.getElementById("tabla-docs-body");
        const types = document.getElementById("lista-tipos");

        resumen.innerHTML = "";
        grid.innerHTML = "";
        table.innerHTML = "";
        types.innerHTML = "";

        if (data.length === 0) {
            grid.innerHTML = `<p class="text-center text-muted">No hay documentos.</p>`;
            return;
        }

        // --- Contadores ---
        const totalDocs = data.length;
        const proyectosUnicos = new Set(data.map(x => x.nombre_proyecto)).size;
        const tiposCount = {};

        data.forEach(d => {
            const tipo = d.tipo_documento || "Otro";
            tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;

            const tieneArchivo = d.archivo ? true : false;
            const fileUrl = tieneArchivo ? `/media/${d.archivo}` : "#";

            // ---- Tarjetas ----
            const cardHTML = `
            <div class="col-md-6 col-xl-4 mb-4">
                <div class="card h-100 p-3 pb-0">
                    <div class="d-flex mb-2">
                        <i class="fas fa-file-pdf icon-doc text-danger"></i>
                        <div>
                            <h6 class="fw-bold mb-0 text-truncate">${d.nombre_documento}</h6>
                            <small class="text-muted">${d.id_documento}</small>
                        </div>
                    </div>
                    <div class="small text-muted mb-1"><i class="far fa-file me-2"></i> ${d.tipo_documento}</div>
                    <div class="small text-muted mb-1"><i class="far fa-folder me-2"></i> ${d.nombre_proyecto}</div>
                    <div class="small text-muted mb-3"><i class="far fa-calendar me-2"></i> ${d.fecha_subida}</div>
                    <div class="mt-auto pt-2 border-top">
                        ${
                            tieneArchivo
                                ? `<a href="${fileUrl}" target="_blank" class="btn-download-outline">
                                       <i class="fas fa-download me-1"></i> Descargar
                                   </a>`
                                : `<button class="btn btn-sm btn-light text-muted w-100 border" disabled>Sin archivo</button>`
                        }
                    </div>
                </div>
            </div>`;
            grid.innerHTML += cardHTML;

            // ---- Tabla ----
            const rowHTML = `
            <tr>
                <td class="ps-4">${d.id_documento}</td>
                <td>${d.nombre_documento}</td>
                <td><span class="badge bg-light text-dark border">${d.tipo_documento}</span></td>
                <td>${d.nombre_proyecto}</td>
                <td>${d.fecha_subida}</td>
                <td class="text-center">
                    ${
                        tieneArchivo
                            ? `<a href="${fileUrl}" target="_blank" class="btn btn-sm btn-primary rounded-pill"><i class="fas fa-download"></i></a>`
                            : `<span class="text-muted small">-</span>`
                    }
                </td>
            </tr>`;
            table.innerHTML += rowHTML;
        });

        // ---- Resumen ----
        const numTipos = Object.keys(tiposCount).length;

        resumen.innerHTML = `
            <div class="col-md-4">
                <div class="card p-3 border-primary border-start border-4">
                    <small class="text-muted">Total Documentos</small>
                    <h4 class="fw-bold">${totalDocs}</h4>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-3 border-info border-start border-4">
                    <small class="text-muted">Tipos de Documentos</small>
                    <h4 class="fw-bold">${numTipos}</h4>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-3 border-success border-start border-4">
                    <small class="text-muted">Proyectos con Docs</small>
                    <h4 class="fw-bold">${proyectosUnicos}</h4>
                </div>
            </div>
        `;

        // ---- Lista por tipos ----
        Object.entries(tiposCount).forEach(([tipo, count]) => {
            types.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${tipo}</span>
                    <span class="badge bg-primary">${count}</span>
                </li>`;
        });

    } catch (err) {
        console.error("Error cargando documentos:", err);
    }
}

document.addEventListener("DOMContentLoaded", cargarDocs);
