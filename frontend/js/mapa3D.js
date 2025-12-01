// mapa3D.js (module)
console.log("Mapa 3D cargado");


// ============================
//  MAPA 3D - THREE.js (module)
// ============================

let scene, camera, renderer;
let racksGroup = new THREE.Group();
let controls;
let animationId;

//initMapa3D();
//loadData();


// === AGREGAR AQUÍ ===
function crearPared(ancho, alto, posX, posY, posZ, rotY = 0) {
    const paredGeo = new THREE.BoxGeometry(ancho, alto, 0.5);
    const paredMat = new THREE.MeshStandardMaterial({
        color: 0xdfe6e9,
        roughness: 0.8
    });
    const pared = new THREE.Mesh(paredGeo, paredMat);
    pared.position.set(posX, posY, posZ);
    pared.rotation.y = rotY;
    pared.receiveShadow = true;
    pared.castShadow = true;
    scene.add(pared);
}
// Crear columnas estructurales 3D
function crearColumna(x, z) {
    const colGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
    const colMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.6 
    });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, 20, z);
    col.castShadow = true;
    col.receiveShadow = true;
    scene.add(col);
}
function crearLineaPasillo(x, z, w, h) {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xf1c40f,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.02, z);  // 0.02 para evitar z-fighting
    scene.add(mesh);
}

function crearMontacargas(x, z) {
    // Cuerpo del montacargas
    const cuerpo = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 6),
        new THREE.MeshStandardMaterial({ color: 0xe67e22 }) // naranja
    );
    cuerpo.position.set(x, 1.5, z);
    cuerpo.castShadow = true;

    // Mástil frontal
    const mastil = new THREE.Mesh(
        new THREE.BoxGeometry(1, 6, 1),
        new THREE.MeshStandardMaterial({ color: 0x2d3436 }) // negro
    );
    mastil.position.set(x, 5, z + 2);
    mastil.castShadow = true;

    scene.add(cuerpo);
    scene.add(mastil);
}


// ------------------------------------
// 1) Inicializar escenario
// ------------------------------------
function initMapa3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(40, 45, 60);
    camera.lookAt(0, 0, 0);

    // renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas-3d"), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Sombras realistas
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controles de cámara (module import)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 250;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 1.0;
    controls.enablePan = true;
    controls.panSpeed = 0.8;

    // Iluminación
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(80, 120, 80);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-80, 40, -60);
    scene.add(fillLight);


    // luz general suave
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemi);

    // lámparas industriales repetidas en el techo
    for (let i = -70; i <= 70; i += 35) {
        const spot = new THREE.SpotLight(0xffffff, 1.2);
        spot.position.set(i, 50, 0);
        spot.angle = Math.PI / 4;
        spot.penumbra = 0.3;
        spot.decay = 2;
        spot.distance = 200;
        spot.castShadow = true;
        scene.add(spot);
    }
    // Piso
    const floorGeometry = new THREE.PlaneGeometry(500, 500);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        roughness: 0.8,
        metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    // ======== PAREDES DEL ALMACÉN ========
    crearPared(200, 40, 0, 20, -100);               // pared fondo
    crearPared(200, 40, 0, 20, 100);                // pared frente
    crearPared(200, 40, -100, 20, 0, Math.PI / 2);  // pared izquierda
    crearPared(200, 40, 100, 20, 0, Math.PI / 2);   // pared derecha
    // eje de referencia (opcional, para debug)
    // ================================
    //   COLUMNAS DEL ALMACÉN
    // ================================
    crearColumna(-30, -10);
    crearColumna(30, -10);
    crearColumna(0, 20);
    crearColumna(-40, 20);
    crearColumna(40, 20);
    // ================================
    //   LÍNEAS AMARILLAS DE PASILLOS
    // ================================
    crearLineaPasillo(0, 0, 180, 3);
    crearLineaPasillo(0, -30, 180, 3);
    crearLineaPasillo(0, 30, 180, 3);
    // ============================
    //   MONTACARGAS EN EL ALMACÉN
    // ============================
    crearMontacargas(-40, -20);
    crearMontacargas(20, 10);
    crearMontacargas(50, -30);


    const grid = new THREE.GridHelper(300, 30, 0x444444, 0x222222);
    grid.position.y = 0.01;
    scene.add(grid);

    // grupo contenedor
    scene.add(racksGroup);

    // resize handler
    window.addEventListener('resize', onWindowResize);

    animate();
    loadData();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ------------------------------------
function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// ------------------------------------
// 2) Cargar datos del backend
// ------------------------------------
async function loadData() {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/map/data/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const statsBox = document.getElementById("stats");
        if (statsBox) {
            statsBox.innerHTML = `
                <strong>Racks:</strong> ${data.resumen.total_racks} <br>
                <strong>Productos:</strong> ${data.resumen.total_productos} <br>
                <strong>Cajas:</strong> ${data.resumen.total_cajas}
            `;
        }


        renderRacks(data.ubicaciones, data.inventario);
    } catch (err) {
        console.error("Error cargando datos:", err);
        document.getElementById("stats").textContent = "Error cargando datos: " + err.message;
    }
}

const btnReload = document.getElementById("reloadData");
if (btnReload) btnReload.addEventListener("click", loadData);


// ------------------------------------
// 3) Renderizar racks + cajas
// ------------------------------------
function renderRacks(ubicaciones, inventario) {
    // limpiar: eliminar hijos del grupo
    while (racksGroup.children.length) racksGroup.remove(racksGroup.children[0]);

    function colorPorTipo(tipo) {
        if (!tipo) return 0x3498db;
        switch (tipo.toUpperCase()) {
            case "FRÍO": return 0x00bfff;
            case "SEC": return 0xf39c12;
            case "PELIGROSO": return 0xe74c3c;
            default: return 0x3498db;
        }
    }

    const cajaMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.6 });

    ubicaciones.forEach((u, index) => {
        // seguridad: si pasillo/nivel/slot vienen como strings convertimos a number
        const pasillo = Number(u.pasillo) || 0;
        const nivel = Number(u.nivel) || 0;
        const slot = Number(u.slot) || 0;

        const rackMat = new THREE.MeshStandardMaterial({
            color: colorPorTipo(u.tipo_almacen),
            roughness: 0.4,
            metalness: 0.1
        });

        const geometry = new THREE.BoxGeometry(4, 3.5, 2.5); // rack más grande y proporciones
        const rack = new THREE.Mesh(geometry, rackMat);
        rack.castShadow = true;
        rack.receiveShadow = true;

        // Mejor alineamiento
        const x = pasillo * 10 - 50;  // ajusta offsets para centrar (puedes cambiar -24)
        const y = 5 + nivel * 10;   // nivel 0 => altura base, cada nivel suma 3
        const z = slot * 5 - 50;     // ajusta offset z (puedes cambiar)

        rack.position.set(x, y, z);
        racksGroup.add(rack);

        // añadir etiqueta (id de ubicacion) simple como sprite/texto (opcional)
        const labelCanvas = makeLabelCanvas(u.codigo || u.id_ubicacion || `U${index}`, { fontsize: 24, borderColor: 'rgba(0,0,0,0.6)' });
        const labelTex = new THREE.CanvasTexture(labelCanvas);
        labelTex.minFilter = THREE.LinearMipMapLinearFilter;
        labelTex.magFilter = THREE.LinearFilter;
        labelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        const labelMat = new THREE.SpriteMaterial({ map: labelTex, depthTest: false });
        const sprite = new THREE.Sprite(labelMat);
        sprite.scale.set(10, 4,1);
        sprite.position.set(x, y + 2.5, z);
        racksGroup.add(sprite);

        // buscar inventario sobre esta ubicación
        const items = inventario.filter((i) => i.id_ubicacion === u.id_ubicacion);
        
        console.log("U:", u.id_ubicacion, "Items:", items);

        items.forEach((itm, idx) => {
            const cajaGeom = new THREE.BoxGeometry(3, 2, 2);
            const caja = new THREE.Mesh(cajaGeom, cajaMaterial);

            caja.castShadow = true;
            caja.receiveShadow = true;

            caja.position.set(x, y + 3 + idx * 1.2, z);
            racksGroup.add(caja);
        });
    });
}

// helper: crear canvas con texto para sprite label
function makeLabelCanvas(text, params= {}) {
    params = params || {};
    const fontsize = params.fontsize || 48;
    const padding = params.padding || 20;

    const scaleFactor = 2;
   

    const font = `${fontsize*scaleFactor}px Inter, Arial, sans-serif`;
   
    const borderColor = params.borderColor || 'rgba(0,0,0,0.8)';
    const bg = params.bg || 'rgba(255,255,255,0.95)';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = font;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    canvas.width = textWidth + padding * 4;
    canvas.height = fontsize + padding * 3;
    // background
    ctx.fillStyle = "rgba(255,255,255,1)";  
    roundRect(ctx, 0, 0, canvas.width, canvas.height, 6);
    ctx.fill();
    // border
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    // text
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return canvas;
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}



function destroyMapa3D() {
    if (!renderer) return;

    cancelAnimationFrame(animationId);

    // borra todo lo agregado
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // elimina el canvas
    renderer.dispose();

    // limpia memoria
    renderer.dispose();
    scene = null;
    camera = null;
    controls = null;
    racksGroup = new THREE.Group();

    renderer = null;
}

window.initMapa3D = initMapa3D;
window.destroyMapa3D = destroyMapa3D;
