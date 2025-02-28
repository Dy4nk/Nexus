const requestIdleCallbackFunc =
    window.requestIdleCallback ||
    function (cb) {
        return setTimeout(cb, 50);
    };

const gridLines = document.querySelector('.grid-lines');
const totalGridLines = 20;
let gridLineIndex = 1;

function addGridLines() {
    if (gridLineIndex < totalGridLines) {
        const hLine = document.createElement('div');
        hLine.classList.add('h-line');
        hLine.style.top = `${gridLineIndex * 5}%`;
        gridLines.appendChild(hLine);

        const vLine = document.createElement('div');
        vLine.classList.add('v-line');
        vLine.style.left = `${gridLineIndex * 5}%`;
        gridLines.appendChild(vLine);

        gridLineIndex++;
        requestIdleCallbackFunc(addGridLines);
    }
}
addGridLines();

const hebrewChars = 'אבגדהוזחטיכלמנסעפצקרשת';
const totalHebrewChars = 30;
let hebrewIndex = 0;

function addHebrewChars() {
    if (hebrewIndex < totalHebrewChars) {
        const charDiv = document.createElement('div');
        charDiv.classList.add('hebrew-char');
        charDiv.textContent =
            hebrewChars[Math.floor(Math.random() * hebrewChars.length)];
        charDiv.style.left = `${Math.random() * 95 + 2}%`;
        charDiv.style.top = `${Math.random() * 95 + 2}%`;
        charDiv.style.opacity = 0.1 + Math.random() * 0.3;
        document.body.appendChild(charDiv);

        hebrewIndex++;
        requestIdleCallbackFunc(addHebrewChars);
    }
}
addHebrewChars();

const hexagons = document.querySelectorAll('.hexagon');
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * hexagons.length);
    hexagons[randomIndex].classList.toggle('active');
}, 2000);

if (typeof THREE !== 'undefined') {
    const container = document.getElementById('sphere-container');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff4800, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const blueLight = new THREE.PointLight(0x00ffff, 0.5);
    blueLight.position.set(-2, 1, 3);
    scene.add(blueLight);

    const geometry = new THREE.SphereGeometry(2, 32, 32);

    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4
    });
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);

    const innerMaterial = new THREE.MeshPhongMaterial({
        color: 0x0077ff,
        emissive: 0x001133,
        transparent: true,
        opacity: 0.2,
        shininess: 100
    });
    const sphere = new THREE.Mesh(geometry, innerMaterial);
    sphere.scale.set(0.95, 0.95, 0.95);

    const sphereGroup = new THREE.Group();
    sphereGroup.add(wireframeMesh);
    sphereGroup.add(sphere);
    scene.add(sphereGroup);

    function animate() {
        requestAnimationFrame(animate);

        sphereGroup.rotation.x += 0.002;
        sphereGroup.rotation.y += 0.004;

        const pulseScale = 0.95 + 0.03 * Math.sin(Date.now() * 0.001);
        sphere.scale.set(pulseScale, pulseScale, pulseScale);

        if (Math.random() > 0.98) {
            lineMaterial.opacity = 0.1 + Math.random() * 0.5;
        }

        renderer.render(scene, camera);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (container) {
                const newWidth = container.clientWidth;
                const newHeight = container.clientHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            }
        }, 100);
    });

    animate();
}
