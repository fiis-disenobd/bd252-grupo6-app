// --- Cargar Expertos Contratados ---
async function cargarExpertos() {
    const res = await fetch("http://127.0.0.1:8000/api/contratos/listar/");
    const data = await res.json();

    const tbody = document.querySelector("#tablaExpertos tbody");
    tbody.innerHTML = "";

    data.forEach(experto => {
        const fila = `
            <tr>
                <td>${experto.nombre_experto}</td>
                <td>${experto.tipo}</td>
                <td>${experto.correo}</td>
                <td>${experto.especialidad}</td>
                <td>${experto.proyecto}</td>
                <td>${experto.tipo_contrato}</td>
                <td>${experto.estado}</td>
                <td>${experto.ubicacion}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// --- Cargar Candidatos Evaluados ---
async function cargarCandidatos() {
    const res = await fetch("http://127.0.0.1:8000/api/contratos/candidatos-evaluados/");
    const data = await res.json();

    const tbody = document.querySelector("#tablaCandidatos tbody");
    tbody.innerHTML = "";

    data.forEach(c => {
        const fila = `
            <tr>
                <td>${c.posicion}</td>
                <td>${c.candidato}</td>
                <td>${c.formacion}</td>
                <td>${c.proyecto}</td>
                <td>${c.puntaje_total}</td>
                <td>${new Date(c.fecha_evaluacion).toLocaleDateString()}</td>
                <td><button class="btn" onclick="redirigirARegistro('${c.cod_postulacion}')">Contratar</button></td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// --- Nueva funcion: Redirigir a contratacion_crear.html con el Cod_Postulacion ---
function redirigirARegistro(cod_postulacion) {
    window.location.href = `contratacion_crear.html?cod_postulacion=${cod_postulacion}`;
}

// --- Inicialización ---
cargarExpertos();
cargarCandidatos();

// --- Botón para volver al index ---
document.getElementById("btnVolverInicio").addEventListener("click", () => {
    window.location.href = "index1.html";
});
