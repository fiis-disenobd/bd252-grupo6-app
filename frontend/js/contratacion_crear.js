// Obtener el código de la postulacion desde la URL
const params = new URLSearchParams(window.location.search);
const cod_postulacion = params.get("cod_postulacion");
console.log("Código recibido:", cod_postulacion);

document.getElementById("cod_postulacion").value = cod_postulacion;

// --- Acción del botón Volver ---
document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "contratacion.html";
});

// --- Enviar el contrato al backend ---
document.getElementById("formContrato").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        Cod_Postulacion: document.getElementById("cod_postulacion").value,
        rol: document.getElementById("rol").value,
        proyecto_asociado: document.getElementById("proyecto_asociado").value,
        nombre_tipo_contrato: document.getElementById("nombre_tipo_contrato").value,
        modalidad_pago: document.getElementById("modalidad_pago").value,
        salario: parseFloat(document.getElementById("salario").value),
        moneda: document.getElementById("moneda").value,
        condiciones: document.getElementById("condiciones").value
    };

    const res = await fetch("http://127.0.0.1:8000/api/contratos/crear/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
        alert(result.message || "Contrato creado exitosamente ✅");
        window.location.href = "contratacion.html";
    } else {
        alert(result.error || "Ocurrió un error al registrar el contrato ❌");
    }
});
