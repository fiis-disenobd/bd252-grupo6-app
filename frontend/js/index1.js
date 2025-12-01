// =====================================
// ICONOS SVG
// =====================================
const icons = {
    proyectos: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
    </svg>`,

    tareas: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>`,

    crear: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>`,

    responsables: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5 21c1-4 7-4 8 0"/>
    </svg>`,

    documentacion: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8z"/>
        <path d="M14 2v6h6"/>
    </svg>`,

    clientes: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="7" r="4"/>
        <circle cx="17" cy="7" r="4"/>
        <path d="M4 21c1-4 7-4 8 0"/>
        <path d="M13 21c1-4 7-4 8 0"/>
    </svg>`,

    crm: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5 21c1.5-4 13.5-4 15 0"/>
    </svg>`,

    reclutamiento: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5.5 21c1.5-4 12.5-4 14 0"/>
    </svg>`,

    requerimiento: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v20M5 12h14"/>
    </svg>`,

    evaluar: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="10" cy="10" r="6"/>
        <path d="M14 14l6 6"/>
    </svg>`,

    contratar: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12l5 5L20 7"/>
    </svg>`,
};

// =====================================
// CONFIGURACIÓN DE MÓDULOS
// =====================================
const modules = [
    {
        id: "proyectos",
        title: "Gestión de Proyectos",
        icon: icons.proyectos,

        // Casos de uso corregidos
        useCases: [
            {
                id: "tareas",
                title: "Tareas",
                description: "Gestión completa de las tareas del proyecto",
                icon: icons.tareas,
            },
            {
                id: "proyectos",
                title: "Proyectos",
                description: "Administración de proyectos activos",
                icon: icons.proyectos,
            },
            {
                id: "responsables",
                title: "Responsables",
                description: "Asignación y control de responsables del proyecto",
                icon: icons.responsables,
            },
            {
                id: "documentacion",
                title: "Documentación",
                description: "Gestión de documentos del proyecto",
                icon: icons.documentacion,
            },
            {
                id: "clientes",
                title: "Clientes Asociados",
                description: "Listado y gestión de clientes asociados al proyecto",
                icon: icons.clientes,

            }
        ]
    },

    // RECLUTAMIENTO
    {
        id: "reclutamiento",
        title: "Gestión Integral de Reclutamiento y Selección",
        icon: icons.reclutamiento,
        useCases: [
            { id: "nuevo-requerimiento", title: "Nuevo Requerimiento", description: "Crea una solicitud de personal", icon: icons.requerimiento },
            { id: "evaluar-candidato", title: "Evaluar Candidato", description: "Evalúa y compara postulantes", icon: icons.evaluar },
            { id: "contratacion", title: "Contratación", description: "Registro de contratación final", icon: icons.contratar }
        ]
    },

    // CRM
    {
        id: "crm",
        title: "Gestión de Clientes CRM",
        icon: icons.crm,
        useCases: []
    }
];
// =====================================
// FUNCIONES DE RENDER
// =====================================
let activeModule = null;
let activeUseCase = null;
function renderSidebar() {
    const container = document.getElementById("module-list");
    container.innerHTML = "";

    modules.forEach(m => {
        const btn = document.createElement("button");
        btn.innerHTML = `<span class="icon">${m.icon}</span> ${m.title}`;
        btn.className = activeModule === m.id ? "active" : "";
        btn.onclick = () => {
            activeModule = m.id;
            activeUseCase = null;
            render();
        };
        container.appendChild(btn);
    });
}
function renderContent() {
    const container = document.getElementById("main-container");
    if (!activeModule) {
        container.innerHTML = `
            <h1>Panel General</h1>
            <div class="grid grid-3">
                <div class="card"><h2>24</h2><p>Proyectos Activos</p></div>
                <div class="card"><h2>18</h2><p>Candidatos en Proceso</p></div>
                <div class="card"><h2>156</h2><p>Clientes Activos</p></div>
            </div>
        `;
        return;
    }
    const module = modules.find(m => m.id === activeModule);
    if (!activeUseCase) {
        container.innerHTML = `
            <h1>${module.title}</h1>
            <p class="subtitle">Selecciona un caso de uso:</p>
            <div class="grid grid-3 animated">
                ${module.useCases.map(u => `
                    <div class="card card-hover" onclick="openUseCase('${u.id}')">
                        <div class="icon-box">${u.icon}</div>
                        <h3>${u.title}</h3>
                        <p>${u.description}</p>
                    </div>
                `).join("")}
            </div>
        `;
        return;
    }
    const useCase = module.useCases.find(u => u.id === activeUseCase);
    container.innerHTML = `
        <button class="btn-back" onclick="back()">← Volver</button>
        <h1>${useCase.title}</h1>
        <p>${useCase.description}</p>
        <div class="grid grid-2 animated">
            ${useCase.options.map(o => `
                <div class="card card-hover">
                    <div class="icon-box">${o.icon}</div>
                    <h3>${o.title}</h3>
                </div>
            `).join("")}
        </div>
    `;
}
function openUseCase(id) {
        if(id == "nuevo-requerimiento"){
            window.location.href="requerimiento.html";
            return;
        }

        if(id == "evaluar-candidato"){
            window.location.href="evaluar_candidatos.html"
        }

        if(id == "contratacion"){
            window.location.href="contratacion.html"
        }

        if(id == "clientes"){
            window.location.href="clientes.html"
        }

        if(id == "documentacion"){
            window.location.href="documentacion.html"
        }

        if(id == "proyectos"){
            window.location.href="proyectos.html"
        }
        if(id == "responsables"){
            window.location.href="responsables.html"
        }

        if(id == "tareas"){
            window.location.href="tareas.html"
        }
}
function back() {
    activeUseCase = null;
    render();
}
function render() {
    renderSidebar();
    renderContent();
}
render();



