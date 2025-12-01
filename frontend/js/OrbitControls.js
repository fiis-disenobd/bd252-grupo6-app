/**
 * OrbitControls (versión global NO-ESM)
 * compatible con THREE global (three.min.js)
 */
THREE.OrbitControls = function( object, domElement ) {

    this.object = object;
    this.domElement = domElement !== undefined ? domElement : document;

    // Parámetros
    this.enabled = true;
    this.target = new THREE.Vector3();

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.minPolarAngle = 0;       
    this.maxPolarAngle = Math.PI; 

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.0;
    this.panSpeed = 1.0;

    const scope = this;

    function handleMouseMove( event ) {
        if ( !scope.enabled ) return;

        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        scope.object.rotation.y -= movementX * 0.002;
        scope.object.rotation.x -= movementY * 0.002;
    }

    function handleWheel( event ) {
        if ( !scope.enabled ) return;
        scope.object.position.addScaledVector(
            scope.object.getWorldDirection( new THREE.Vector3() ),
            event.deltaY * 0.002
        );
    }

    domElement.addEventListener( 'mousemove', handleMouseMove );
    domElement.addEventListener( 'wheel', handleWheel );

    this.update = function() {};
};
