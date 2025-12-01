//const API = "http://127.0.0.1:8000/api";
window.initRecepciones = function () {
    cargarRecepciones();   // tu función principal
};

/* ==========================================================
   Cargar Recepciones
   ========================================================== */
async function cargarRecepciones() {
    try {
        const res = await fetch(`${API}/recepciones/`);
        const data = await res.json();

        const cont = document.getElementById("lista-recepciones");
        cont.innerHTML = "";

        data.forEach(r => cont.innerHTML += crearCardRecepcion(r));

        activarBotones();
    } catch (e) {
        console.error("Error cargando recepciones", e);
    }
}

function crearCardRecepcion(r) {
    return `
    <div class="recepcion-card">
        <h3 class="card-title">${r.id_recepcion}</h3>

        <div class="card-info">
            <p><strong>Cliente:</strong> ${r.cliente}</p>
            <p><strong>Documento:</strong> ${r.documento}</p>
            <p><strong>Fecha:</strong> ${new Date(r.fecha_recepcion).toLocaleString("es-PE")}</p>
            <p><strong>Estado:</strong> ${r.estado.trim()}</p>
        </div>

        <button class="btn-ver-detalles" data-id="${r.id_recepcion}">
            Ver detalles
        </button>

        <div class="det-panel" id="det-${r.id_recepcion}"></div>
    </div>`;
}

/* ==========================================================
   Activar botones de "Ver Detalles"
   ========================================================== */
function activarBotones() {
    document.querySelectorAll(".btn-ver-detalles").forEach(btn => {
        btn.onclick = () => verDetalles(btn.dataset.id, btn);
    });
}

/* ==========================================================
   Ver detalles de la recepción
   ========================================================== */
async function verDetalles(id, btn) {
    const panel = document.getElementById(`det-${id}`);

    // alternar abrir/cerrar
    if (panel.innerHTML.trim() !== "") {
        panel.innerHTML = "";
        btn.textContent = "Ver detalles";
        return;
    }

    btn.textContent = "Ocultar detalles";

    const res = await fetch(`${API}/recepciones/${id}/detalles/`);
    const detalles = await res.json();

    panel.innerHTML = detalles.map(crearDetalle).join("");

    activarBotonesAcciones();
}

function crearDetalle(d) {
    const estado = (d.estado || "").toString().trim().toUpperCase();


    return `
        <div class="detalle">
            <h4>${d.descripcion} (${d.sku})</h4>

            <p><strong>Recibido:</strong> ${d.cantidad_recibida}</p>
            <p><strong>Verificado:</strong> ${d.cantidad_verificada ?? 0}</p>
            <p><strong>Estado:</strong> ${estado}</p>


            ${estado === "Pendiente"
                ? `<input id="cant-${d.id_detalle_recepcion}" type="number" value="${d.cantidad_recibida}">
                   <button class="btn" data-verificar="${d.id_detalle_recepcion}">Verificar</button>`
                : ""}
                    
            ${estado === "OK"
                ? `<button class="btn" data-sugerir="${d.id_detalle_recepcion}" data-prod="${d.id_producto}">
                       Ver sugerencias
                   </button>
                   <div id="sug-${d.id_detalle_recepcion}"></div>`
                : ""}
            ${estado.toUpperCase=== "UBICADO" ? `
                <p class="ubicado-msg"><strong>Ubicado correctamente</strong></p>
                 ` : ""}
                
        </div>`;
}

/* ==========================================================
   Activar botones Verificar / Sugerencias
   ========================================================== */
function activarBotonesAcciones() {
    document.querySelectorAll("[data-verificar]").forEach(btn => {
        btn.onclick = () => verificar(detId = btn.dataset.verificar);
    });

    document.querySelectorAll("[data-sugerir]").forEach(btn => {
        btn.onclick = () => sugerir(btn.dataset.sugerir, btn.dataset.prod);
    });
}

/* ==========================================================
   Verificar Detalle
   ========================================================== */
async function verificar(id) {
    const cant = document.getElementById(`cant-${id}`).value;

    await fetch(`${API}/recepciones/detalles/${id}/verificar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cantidad_verificada: parseInt(cant),
            estado: "OK"
        })
    });

    cargarRecepciones();
}

/* ==========================================================
   Sugerencias de ubicación
   ========================================================== */
async function sugerir(id_detalle, id_producto) {
    const cont = document.getElementById(`sug-${id_detalle}`);
    cont.innerHTML = "<p>Cargando...</p>";

    const res = await fetch(`${API}/ubicaciones/sugerir/${id_producto}/`);
    const data = await res.json();

    cont.innerHTML = data.map(ubi => `
        <div class="sugerencia-box">
            <p><strong>${ubi.codigo}</strong> — Stock: ${ubi.stock}</p>
            <button onclick="asignarUbicacion('${id_detalle}', '${ubi.id_ubicacion}')">
                Asignar aquí
            </button>
        </div>
    `).join("");
}

/* ==========================================================
   Asignar ubicación
   ========================================================== */
async function asignarUbicacion(idDetalle, idUbicacion) {
    if (!confirm(`¿Asignar ubicación ${idUbicacion} al detalle ${idDetalle}?`))
        return;

    try {
            const response = await fetch(`${API}/detalle/${idDetalle}/asignar-ubicacion/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_ubicacion: idUbicacion })
        });

        const data = await response.json();

         if (!response.ok) {
            alert("Error: " + (data.error || "No se pudo asignar"));
            return;
        }

        alert("Ubicación asignada con éxito.");

        // volver a cargar sugerencias
        sugerir(idDetalle, data.id_producto);

        // volver a cargar todo
        cargarRecepciones();
        
    } catch (error) {
        console.error(error);
        alert("Error en el servidor.");
    }
}



// inicializar
