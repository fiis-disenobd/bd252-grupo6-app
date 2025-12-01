window.initUbicaciones = function () {
    activarFiltros();
    cargarUbicaciones();
};
/* ==========================================================
   Cargar Ubicaciones
   ========================================================== */
async function cargarUbicaciones() {
    try {
        const res = await fetch(`${API}/ubicaciones/`);
        let ubicaciones = await res.json();

        // aplicar filtros
        ubicaciones = filtrarUbicaciones(ubicaciones);

        renderUbicaciones(ubicaciones);
        actualizarStats(ubicaciones);

    } catch (err) {
        console.error("Error al cargar ubicaciones:", err);
    }
}

/* ==========================================================
   Filtros
   ========================================================== */
function activarFiltros() {
    const f1 = document.getElementById("filtro-busqueda");
    const f2 = document.getElementById("filtro-zona");
    const f3 = document.getElementById("filtro-estado");

    if (!f1 || !f2 || !f3) return; // ← evita crashear

    f1.oninput = cargarUbicaciones;
    f2.onchange = cargarUbicaciones;
    f3.onchange = cargarUbicaciones;
}
function filtrarUbicaciones(lista) {
    const busqueda = document.getElementById("filtro-busqueda").value.toLowerCase();
    const zona = document.getElementById("filtro-zona").value;
    const estado = document.getElementById("filtro-estado").value;

    return lista.filter(u => {
        // 🔍 filtro por texto
        const matchBusqueda =
            u.codigo.toLowerCase().includes(busqueda) ||
            u.pasillo.toLowerCase().includes(busqueda);

        // 🔥 FIX: zona NO debe filtrar nada (porque no existe en BD)
        const matchZona = true;

        // 🔥 FIX: siempre libre (porque no existe estado en BD)
        const estadoUbicacion = "libre";
        const matchEstado = estado === "todos" || estadoUbicacion === estado;

        return matchBusqueda && matchZona && matchEstado;
    });
}
/* ==========================================================
   Renderizar Cards
   ========================================================== */
function renderUbicaciones(lista) {
    const cont = document.getElementById("lista-ubicaciones");
    cont.innerHTML = "";

    if (lista.length === 0) {
        cont.innerHTML = `<div class="card"><p>No se encontraron ubicaciones.</p></div>`;
        return;
    }

    lista.forEach(u => {
        cont.innerHTML += crearCardUbicacion(u);
    });

    activarBotonesInventario();
}

function crearCardUbicacion(u) {
    const estadoClase = {
        "libre": "badge-libre",
        "ocupado": "badge-ocupado",
        "bloqueado": "badge-bloqueado"
    }[u.estado] || "badge";

    return `
        <div class="ubicacion-card">
        
        <div class="ubi-header">
            <div>
                <h3 class="ubi-title">${u.codigo}</h3>
                <p class="ubi-sub">${u.pasillo} · Nivel ${u.nivel}</p>
            </div>

            <span class="badge badge-libre">libre</span>
        </div>

        <p class="ubi-sub">Tipo: ${u.tipo_almacen}</p>

        <button class="btn-ver" data-id="${u.id_ubicacion}">
            Ver inventario
        </button>

        <div class="inventario-box" id="inv-${u.id_ubicacion}"></div>

    </div>`;
}

/* ==========================================================
   Inventario en Ubicación
   ========================================================== */
function activarBotonesInventario() {
    document.querySelectorAll(".btn-ver").forEach(btn => {
        btn.onclick = () => cargarInventario(btn.dataset.id, btn);
    });
}

async function cargarInventario(id, btn) {
    const panel = document.getElementById(`inv-${id}`);

    // alternar
    if (panel.innerHTML.trim() !== "") {
        panel.innerHTML = "";
        btn.textContent = "Ver inventario";
        return;
    }

    btn.textContent = "Ocultar inventario";

    const res = await fetch(`${API}/ubicaciones/${id}/inventario/`);
    const data = await res.json();

    if (!data.length) {
        panel.innerHTML = "<p>No hay productos en esta ubicación.</p>";
        return;
    }

    panel.innerHTML = panel.innerHTML = `
        <table class="tabla-inventario">
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                ${data
                    .map(i => `
                        <tr>
                            <td>${i.sku}</td>
                            <td>${i.descripcion || "Sin nombre"}</td>
                            <td>${i.cantidad}</td>
                        </tr>
                    `)
                    .join("")}
            </tbody>
        </table>
    `;
}

function calcularBarra(ocupado, capacidad) {
    if (!capacidad || capacidad === 0) return 0;

    let porcentaje = Math.round((ocupado / capacidad) * 100);

    let clase = "barra-verde";

    if (porcentaje >= 80) clase = "barra-roja";
    else if (porcentaje >= 50) clase = "barra-amarilla";

    return `
        <div class="barra-container">
            <div class="barra-ocupacion ${clase}" style="width:${porcentaje}%;"></div>
        </div>
        <p style="margin-top:5px; font-size:13px; color:#555;">
            ${porcentaje}% ocupado
        </p>
    `;
}


/* ==========================================================
   Estadísticas
   ========================================================== */
function actualizarStats(lista) {
    document.getElementById("stat-total").textContent = lista.length;
    document.getElementById("stat-libres").textContent = lista.length;
    document.getElementById("stat-ocupadas").textContent = 0;
    document.getElementById("stat-bloqueadas").textContent = 0;
}


/* ==========================================================
   Inicializar si existe contenedor
   ========================================================== */
function loadUbicaciones() {
    activarFiltros();
    cargarUbicaciones();
}

window.initUbicaciones();
