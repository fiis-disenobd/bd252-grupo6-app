
// Simula el useState y renderView
(function(){
    const menu = document.getElementById('menu');
    const items = Array.from(menu.querySelectorAll('.menu-item'));

    const views = {
        dashboard: document.getElementById('dashboard'),
        inventory: document.getElementById('inventory'),
        receiving: document.getElementById('receiving'),
        shipping: document.getElementById('shipping'),
        picking: document.getElementById('picking'),
        locations: document.getElementById('locations'),
        map3d: document.getElementById('map3d')
    };

    let currentView = 'dashboard';

    function setActive(viewId) {
        // actualizar estado visual del menu
        items.forEach(it => {
            const is = it.getAttribute('data-view') === viewId;
            it.classList.toggle('active', is);
            it.setAttribute('aria-pressed', is ? 'true' : 'false');
        });

        // mostrar/ocultar vistas
        Object.entries(views).forEach(([k, el]) => {
            const show = k === viewId;
            el.style.display = show ? '' : 'none';
            el.setAttribute('aria-hidden', show ? 'false' : 'true');
            el.setAttribute('data-visible', show ? 'true' : 'false');
        });

        currentView = viewId;

            // 🔥 Si la vista seleccionada es Mapa 3D, cargar la escena 3D
        if (viewId === "map3d") {
            setTimeout(() => {
            if (typeof initMapa3D === "function") initMapa3D();
            }, 50);
        } else {
                // Limpiar escena 3D si se sale de la vista
            if (typeof destroyMapa3D === "function") destroyMapa3D();
        }

        // React Ubicaciones
        if (viewId === "receiving") loadRecepcionesHTML();
        if (viewId === "locations") {
            setTimeout(loadUbicacionesHTML, 50);
            }

         }

    // listeners
    items.forEach(it => {
        it.addEventListener('click', () => {
            const v = it.getAttribute('data-view');
            setActive(v);
        });

        // accesibilidad
        it.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                it.click();
            }
        });
    });

    // inicial
    setActive(currentView);
})();


// ===============================
// Recepciones
// ===============================
async function loadRecepcionesHTML() {
    const container = document.getElementById("recepciones-container");
    if (!container) return;

    try {
        // Cargar HTML
        const res = await fetch("recepciones.html");
        const html = await res.text();
        container.innerHTML = html;

        // Cargar CSS si no está cargado
        if (!document.querySelector(`link[href="css/recepciones.css"]`)) {
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "css/recepciones.css";
            document.head.appendChild(css);
        }

        // Cargar JS (si no está cargado aún)
        if (!window._recepcionesLoaded) {
            const script = document.createElement("script");
            script.src = "js/recepciones.js";
            
            script.onload = ()=>{
                if(typeof window.initRecepciones =="function"){
                    window.initRecepciones();
                }
            };

            document.body.appendChild(script);
            window._recepcionesLoaded= true;

        }else{
            
            if(typeof window.initRecepciones === "function"){
                window.initRecepciones();
            }
        }
        
    } catch (e) {
        console.error("Error cargando recepciones.html:", e);
    }
}
// Cargar recepciones al entrar a la vista


// ===============================
// UBICACIONES
// ===============================
async function loadUbicacionesHTML() {
    const container = document.getElementById("locations-container");
    if (!container) return;

    try {
        // Cargar HTML
        const res = await fetch("ubicaciones.html");
        const html = await res.text();
        container.innerHTML = html;

        // Cargar CSS si no está cargado
        if (!document.querySelector(`link[href="css/ubicaciones.css"]`)) {
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "css/ubicaciones.css";
            document.head.appendChild(css);
        }

        // Cargar JS si no está cargado aún
        if (!window._ubicacionesLoaded) {
            const script = document.createElement("script");
            script.src = "js/ubicaciones.js";
            document.body.appendChild(script);
            window._ubicacionesLoaded = true;
        } else {
            // Si el script ya existe, reiniciar la vista
            if (typeof window.initUbicaciones === "function") {
                window.initUbicaciones();
            }
        }

    } catch (e) {
        console.error("Error cargando ubicaciones.html:", e);
    }
}



let chartPedidosEstado, chartStockBajo, chartRecepciones;

async function loadDashboard() {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/dashboard/");
        const data = await res.json();

        const KPIS = data.kpis;

        // 🎯 ACTUALIZAR LOS NÚMEROS
        document.getElementById("dash_ordenes").textContent = KPIS.total_pedidos;
        document.getElementById("dash_stock").textContent = KPIS.stock_bajo;
        document.getElementById("dash_recepciones").textContent = KPIS.recepciones_pendiente;

        // ============================
        // 🎨 PALETA Y CONFIG GLOBAL
        // ============================
        Chart.defaults.font.family = "Inter, sans-serif";
        Chart.defaults.color = "#4b5563";

        const colors = {
            blue: "#3b82f6",
            green: "#10b981",
            yellow: "#f59e0b",
            red: "#ef4444",
            purple: "#8b5cf6"
        };

        // =====================================
        // 📊 1. PEDIDOS POR ESTADO (REAL DATA)
        // =====================================
        if (chartPedidosEstado) chartPedidosEstado.destroy();

        chartPedidosEstado = new Chart(
            document.getElementById("chart_ordenes"),
            {
                type: "bar",
                data: {
                    labels: ["Planificados", "En Picking", "Validados"],
                    datasets: [{
                        label: "Pedidos",
                        data: [
                            KPIS.planificados,
                            KPIS.picking,
                            KPIS.validados
                        ],
                        backgroundColor: [
                            colors.blue,
                            colors.yellow,
                            colors.green
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    }
                }
            }
        );

        // ===========================================
        // 📊 2. STOCK BAJO (PRODUCTOS REALES)
        // ===========================================
        if (chartStockBajo) chartStockBajo.destroy();

        const lowStockLabels = data.inventario_bajo.map(x => x[0]);
        const lowStockValues = data.inventario_bajo.map(x => x[1]);

        chartStockBajo = new Chart(
            document.getElementById("chart_stock"),
            {
                type: "bar",
                data: {
                    labels: lowStockLabels,
                    datasets: [{
                        label: "Unidades",
                        data: lowStockValues,
                        backgroundColor: colors.red
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    }
                }
            }
        );

        // ===========================================
        // 📊 3. RECEPCIONES POR ESTADO (REAL)
        // ===========================================
        if (chartRecepciones) chartRecepciones.destroy();

        chartRecepciones = new Chart(
            document.getElementById("chart_recepciones"),
            {
                type: "pie",
                data: {
                    labels: ["Registrado", "Pendiente", "Cerrado"],
                    datasets: [{
                        data: [
                            KPIS.recepciones_registrado,
                            KPIS.recepciones_pendiente,
                            KPIS.recepciones_cerrado
                        ],
                        backgroundColor: [
                            colors.blue,
                            colors.yellow,
                            colors.green
                        ]
                    }]
                }
            }
        );

    } catch (error) {
        console.error("Error cargando dashboard", error);
    }
}
// Cuando cargue la vista dashboard:
document.addEventListener('DOMContentLoaded', loadDashboard);

