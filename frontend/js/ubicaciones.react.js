
const { useState, useEffect } = React;

function UbicacionesApp() {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [estructuras, setEstructuras] = useState([]);

    const [filtroPasillo, setFiltroPasillo] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    const [form, setForm] = useState({
        id_ubicacion: "",
        id_estructura: "",
        codigo: "",
        pasillo: "",
        nivel: "",
        slot: "",
        tipo_almacen: ""
    });

    const [sugerencias, setSugerencias] = useState([]);

    // ===========================
    // Cargar datos desde Django
    // ===========================
    useEffect(() => {
        loadUbicaciones();
        loadTipos();
    }, []);

    async function loadUbicaciones() {
        const res = await fetch("http://127.0.0.1:8000/api/ubicaciones/");
        const data = await res.json();
        setUbicaciones(data);
    }

    async function loadTipos() {
        const res = await fetch("http://127.0.0.1:8000/api/tipos-estructura/");
        const data = await res.json();
        setEstructuras(data);
    }

    // ===========================
    // CRUD: Crear ubicación
    // ===========================
    async function crearUbicacion(e) {
        e.preventDefault();

        const res = await fetch("http://127.0.0.1:8000/api/ubicaciones/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            loadUbicaciones();
            alert("Ubicación creada");
        }
    }

    // ===========================
    // Cambiar estado
    // ===========================
    async function cambiarEstado(id, estado) {
        await fetch(`http://127.0.0.1:8000/api/ubicaciones/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado })
        });

        loadUbicaciones();
    }

    // ===========================
    // Sugerencias inteligentes
    // ===========================
    function generarSugerencias() {
        const libres = ubicaciones.filter(u => u.estado === "libre");

        const lista = libres
            .map(u => ({
                codigo: u.codigo,
                pasillo: u.pasillo,
                nivel: u.nivel
            }))
            .slice(0, 5);

        setSugerencias(lista);
    }

    // ===========================
    // KPIs cálculo
    // ===========================
    const total = ubicaciones.length;
    const libres = ubicaciones.filter(u => u.estado === "libre").length;
    const ocupados = ubicaciones.filter(u => u.estado === "ocupado").length;
    const bloqueados = ubicaciones.filter(u => u.estado === "bloqueado").length;
    const ocupacion = total ? Math.round((ocupados / total) * 100) : 0;

    // ===========================
    // Filtrado dinámico
    // ===========================
    const filtrados = ubicaciones.filter(u =>
        (filtroPasillo === "" || u.pasillo === filtroPasillo) &&
        (filtroEstado === "" || u.estado === filtroEstado)
    );

    return (
        <div className="ubicaciones-wrapper">

            {/* ====================== KPIS ====================== */}
            <div className="kpi-container">
                <div className="kpi-box blue"><h3>Total</h3><p>{total}</p></div>
                <div className="kpi-box green"><h3>Libres</h3><p>{libres}</p></div>
                <div className="kpi-box yellow"><h3>Ocupados</h3><p>{ocupados}</p></div>
                <div className="kpi-box red"><h3>Bloqueados</h3><p>{bloqueados}</p></div>
                <div className="kpi-box purple"><h3>Ocupación</h3><p>{ocupacion}%</p></div>
            </div>

            {/* ====================== FILTROS ====================== */}
            <div className="filtros-box">
                <select value={filtroPasillo} onChange={e => setFiltroPasillo(e.target.value)}>
                    <option value="">Todos los pasillos</option>
                    {[...new Set(ubicaciones.map(u => u.pasillo))].map(p =>
                        <option key={p} value={p}>{p}</option>
                    )}
                </select>

                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                    <option value="">Todos los estados</option>
                    <option value="libre">Libre</option>
                    <option value="ocupado">Ocupado</option>
                    <option value="bloqueado">Bloqueado</option>
                </select>

                <button onClick={generarSugerencias}>Sugerencias</button>
            </div>

            {/* ====================== SUGERENCIAS ====================== */}
            {sugerencias.length > 0 && (
                <div className="sugerencias">
                    <h4>Mejores ubicaciones disponibles</h4>
                    <ul>
                        {sugerencias.map((s, i) => (
                            <li key={i}>{s.codigo} (P {s.pasillo} – N {s.nivel})</li>
                        ))}
                    </ul>
                </div>
            )}


            {/* ====================== FORM CREAR ====================== */}
            <form className="form-ubicacion" onSubmit={crearUbicacion}>
                <h3>Crear nueva ubicación</h3>

                <input placeholder="ID ubicación"
                    value={form.id_ubicacion}
                    onChange={e => setForm({ ...form, id_ubicacion: e.target.value })}
                />

                <select
                    value={form.id_estructura}
                    onChange={e => setForm({ ...form, id_estructura: e.target.value })}
                >
                    <option value="">Tipo de estructura</option>
                    {estructuras.map(t =>
                        <option key={t.id_estructura} value={t.id_estructura}>
                            {t.nombre}
                        </option>
                    )}
                </select>

                <input placeholder="Código"
                    value={form.codigo}
                    onChange={e => setForm({ ...form, codigo: e.target.value })}
                />

                <input placeholder="Pasillo"
                    value={form.pasillo}
                    onChange={e => setForm({ ...form, pasillo: e.target.value })}
                />

                <input placeholder="Nivel"
                    value={form.nivel}
                    onChange={e => setForm({ ...form, nivel: e.target.value })}
                />

                <input placeholder="Slot"
                    value={form.slot}
                    onChange={e => setForm({ ...form, slot: e.target.value })}
                />

                <input placeholder="Tipo almacén"
                    value={form.tipo_almacen}
                    onChange={e => setForm({ ...form, tipo_almacen: e.target.value })}
                />

                <button type="submit">Crear</button>
            </form>

            {/* ====================== TABLA ====================== */}
            <table className="tabla-ubicaciones">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Pasillo</th>
                        <th>Nivel</th>
                        <th>Slot</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {filtrados.map(u => (
                        <tr key={u.id_ubicacion}>
                            <td>{u.codigo}</td>
                            <td>{u.pasillo}</td>
                            <td>{u.nivel}</td>
                            <td>{u.slot}</td>
                            <td>
                                <span className={`badge badge-${u.estado}`}>
                                    {u.estado}
                                </span>
                            </td>

                            <td>
                                <button onClick={() => cambiarEstado(u.id_ubicacion, "libre")}>Libre</button>
                                <button onClick={() => cambiarEstado(u.id_ubicacion, "ocupado")}>Ocupar</button>
                                <button onClick={() => cambiarEstado(u.id_ubicacion, "bloqueado")}>Bloquear</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}


// ===============================
// MONTAR Y DESMONTAR REACT
// ===============================


window.mountUbicacionesReact = function () {
    const container = document.getElementById("locations");

    if (!container) {
        console.error("❌ No existe div #locations");
        return;
    }

    console.log("🔵 Montando Ubicaciones React...");

    window._ubicacionesRoot = ReactDOM.createRoot(container);
    window._ubicacionesRoot.render(<UbicacionesApp />);
};

window.unmountUbicacionesReact = function () {
    if (window._ubicacionesRoot) {
        console.log("🧹 Desmontando Ubicaciones React...");
        window._ubicacionesRoot.unmount();
        window._ubicacionesRoot = null;
    }
};