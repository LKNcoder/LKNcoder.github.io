<<<<<<< HEAD
import * as THREE from 'three';
import {
    FontLoader
} from 'three/addons/loaders/FontLoader.js';
[... rest of original code ...]
animate();
=======
import * as THREE from 'three';
import {
    FontLoader
} from 'three/addons/loaders/FontLoader.js';
import {
    TextGeometry
} from 'three/addons/geometries/TextGeometry.js';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
    VRButton
} from 'three/addons/webxr/VRButton.js';
import {
    XRControllerModelFactory
} from 'three/addons/webxr/XRControllerModelFactory.js';
import {
    EffectComposer
} from 'three/addons/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/addons/postprocessing/RenderPass.js';
import {
    UnrealBloomPass
} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {
    SMAAPass
} from 'three/addons/postprocessing/SMAAPass.js';

// Initialize loading manager
let assetsLoaded = false;
const loadingManager = new THREE.LoadingManager(
    // onLoad callback
    function() {
        console.log('Loading complete!');
        assetsLoaded = true;
        loadingScreen.style.display = 'none';
        // Add camera listener for audio after loading
        camera.add(audioListener);
    },
    // onProgress callback
    function(url, itemsLoaded, itemsTotal) {
        const progress = (itemsLoaded / itemsTotal * 100).toFixed(0);
        loadingScreen.innerHTML = `Loading... ${progress}%`;
    },
    // onError callback
    function(url) {
        console.error('Error loading ' + url);
        assetsLoaded = true;
        loadingScreen.style.display = 'none';
    }
);

const textureLoader = new THREE.TextureLoader(loadingManager);

// Get the main render canvas and parent div first
const parentDiv = document.getElementById('renderDiv');
let canvas = document.getElementById('threeRenderCanvas');
if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'threeRenderCanvas';
    parentDiv.appendChild(canvas);
}

// Initialize the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(0, 1.6, 0);

// Initialize the renderer with VR support
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    alpha: true,
    powerPreference: "high-performance",
    xr: {
        enabled: true,
        frameRate: 90
    },
    precision: "highp",
    depth: true,
    stencil: false
});

document.body.appendChild(VRButton.createButton(renderer));

// Set up renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

// Initialize post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add bloom effect
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.2,
    0.4,
    0.9
);
composer.addPass(bloomPass);

// Add SMAA
const smaaPass = new SMAAPass(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio()
);
composer.addPass(smaaPass);

// VR Controller setup
const controllerModelFactory = new XRControllerModelFactory();
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);
const controllerGrip1 = renderer.xr.getControllerGrip(0);
const controllerGrip2 = renderer.xr.getControllerGrip(1);

controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));

scene.add(controller1);
scene.add(controller2);
scene.add(controllerGrip1);
scene.add(controllerGrip2);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Animation loop
const clock = new THREE.Clock();

function animate() {
    renderer.setAnimationLoop(() => {
        const deltaTime = Math.min(clock.getDelta(), 0.1);
        
        // Update your game logic here
        
        // Render
        if (renderer.xr.isPresenting) {
            renderer.render(scene, camera);
        } else {
            composer.render();
        }
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = parentDiv.clientWidth / parentDiv.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parentDiv.clientWidth, parentDiv.clientHeight);
    composer.setSize(parentDiv.clientWidth, parentDiv.clientHeight);
}

window.addEventListener('resize', onWindowResize);

// Start the animation
animate();
>>>>>>> updated
