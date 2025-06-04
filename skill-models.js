// Skill section 3D models
function createSecurityModel() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300/300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    document.getElementById('security-model').appendChild(renderer.domElement);

    // Create a shield geometry
    const shieldGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32, 1, false, 0, Math.PI);
    const shieldMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff9f,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.rotation.x = Math.PI / 2;
    scene.add(shield);

    // Add particles around the shield
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00ff9f,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add lighting
    const light = new THREE.PointLight(0x00ff9f, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        shield.rotation.z += 0.01;
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

    animate();
}

function createRobloxModel() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300/300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    document.getElementById('roblox-model').appendChild(renderer.domElement);

    // Create a cube for Roblox logo
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff9f,
        transparent: true,
        opacity: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lighting
    const light = new THREE.PointLight(0x00ff9f, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

function createBotModel() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300/300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    document.getElementById('bot-model').appendChild(renderer.domElement);

    // Create robot head
    const headGeometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff9f,
        transparent: true,
        opacity: 0.8
    });
    const head = new THREE.Mesh(headGeometry, material);
    scene.add(head);

    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x00ff9f,
        emissiveIntensity: 0.5
    });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.5, 0.3, 1);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 0.3, 1);
    head.add(rightEye);

    // Add lighting
    const light = new THREE.PointLight(0x00ff9f, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        head.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

function createTerminalModel() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300/300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    document.getElementById('terminal-model').appendChild(renderer.domElement);

    // Create terminal screen
    const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff9f,
        transparent: true,
        opacity: 0.8
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    scene.add(screen);

    // Add matrix-like particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00ff9f,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add lighting
    const light = new THREE.PointLight(0x00ff9f, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        screen.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
        particles.rotation.y += 0.002;
        renderer.render(scene, camera);
    }

    animate();
}

// Initialize all models when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createSecurityModel();
    createRobloxModel();
    createBotModel();
    createTerminalModel();
}); 