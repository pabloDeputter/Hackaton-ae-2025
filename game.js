// Farm Simulator using Three.js
console.log("Script loading");
import * as THREE from 'three';
console.log("THREE imported:", THREE);
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
console.log("OrbitControls imported");
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Game state
const gameState = {
  money: 100,
  selectedCrop: "wheat", // 'wheat' or 'banana'
  crops: [],
  cities: []
};

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Position camera at a fixed angle
camera.position.set(0, 25, 25);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Modified controls - restrict to zoom only
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableRotate = false; // Disable rotation
controls.enablePan = false; // Disable panning
controls.minDistance = 15; // Minimum zoom
controls.maxDistance = 50; // Maximum zoom

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Ground - farmland
const groundGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x553311,
  roughness: 0.8,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Initialize city grid size
const cityGridSize = 100;

// Define citiesThree
const cityData = [
  { name: "Wheatville", x: -cityGridSize/4, z: -cityGridSize/4, cropType: "wheat", color: 0xDDDD77 },
  { name: "Banana Bay", x: cityGridSize/4, z: cityGridSize/4, cropType: "banana", color: 0xFFDD33 }
];

// Create city markers
function createCities() {
  const loader = new FontLoader();
  const citiesList = cityData;
  
  citiesList.forEach(city => {
    // Create city platform
    const cityGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 16);
    const cityMaterial = new THREE.MeshStandardMaterial({
      color: city.color,
      roughness: 0.5
    });
    
    const cityPlatform = new THREE.Mesh(cityGeometry, cityMaterial);
    cityPlatform.position.set(
      city.x * plotSize,
      0.25,
      city.z * plotSize
    );
    cityPlatform.receiveShadow = true;
    
    scene.add(cityPlatform);
    
    // Store city data
    gameState.cities.push({
      name: city.name,
      position: { x: city.x, z: city.z },
      cropType: city.cropType,
      platform: cityPlatform
    });
    
    // Create text label (simplified - you may want to add actual 3D text)
    const textDiv = document.createElement('div');
    textDiv.className = 'city-label';
    textDiv.textContent = city.name;
    textDiv.style.position = 'absolute';
    textDiv.style.color = 'white';
    textDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    textDiv.style.padding = '2px 6px';
    textDiv.style.borderRadius = '4px';
    textDiv.style.fontSize = '14px';
    textDiv.style.fontWeight = 'bold';
    textDiv.style.pointerEvents = 'none';
    document.body.appendChild(textDiv);
    
    // Update position in animation loop
    city.label = textDiv;
  });
}

// Create farm plots (grid)
const plotSize = 2;
const gridSize = 10; // 10x10 grid
const plots = [];

for (let x = -gridSize / 2; x < gridSize / 2; x++) {
  for (let z = -gridSize / 2; z < gridSize / 2; z++) {
    const plotGeometry = new THREE.PlaneGeometry(
      plotSize * 0.9,
      plotSize * 0.9
    );
    
    // Determine which city this plot belongs to
    let cityType = null;
    for (const city of cityData) {
      if (Math.abs(x - city.x * plotSize/2) < gridSize/4 && 
          Math.abs(z - city.z * plotSize/2) < gridSize/4) {
        cityType = city.cropType;
        break;
      }
    }
    
    // Color based on region
    const plotMaterial = new THREE.MeshStandardMaterial({
      color: cityType === "wheat" ? 0xd4bc7a : 
             cityType === "banana" ? 0x98e698 : 0x7d4e26,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    
    const plot = new THREE.Mesh(plotGeometry, plotMaterial);
    plot.rotation.x = -Math.PI / 2;
    plot.position.set(
      x * plotSize + plotSize / 2,
      0.01,
      z * plotSize + plotSize / 2
    );
    plot.receiveShadow = true;

    // Store plot data
    plot.userData = {
      x: x + gridSize / 2,
      z: z + gridSize / 2,
      planted: false,
      growthStage: 0,
      growthTime: 0,
      crop: null,
      allowedCropType: cityType  // Restrict crop type based on city
    };

    scene.add(plot);
    plots.push(plot);
  }
}

// Create cities after plots
createCities();

// Create different crop models based on type
function createCrop(plotX, plotZ, type = "wheat") {
  const cropGroup = new THREE.Group();

  if (type === "wheat") {
    // Wheat stem
    const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xd4bc7a });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.6;
    stem.castShadow = true;
    cropGroup.add(stem);

    // Wheat head
    const headGeometry = new THREE.CylinderGeometry(0.08, 0.03, 0.3, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf0e68c });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    cropGroup.add(head);
  } 
  else if (type === "banana") {
    // Banana plant stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.4;
    stem.castShadow = true;
    cropGroup.add(stem);

    // Banana leaves
    for (let i = 0; i < 4; i++) {
      const leafGeometry = new THREE.PlaneGeometry(0.8, 0.3);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x32cd32,
        side: THREE.DoubleSide 
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.y = 0.7;
      leaf.rotation.y = Math.PI * i / 2;
      leaf.rotation.x = Math.PI / 6;
      leaf.castShadow = true;
      cropGroup.add(leaf);
    }

    // Banana bunch (when fully grown)
    const bananaGeometry = new THREE.CylinderGeometry(0.1, 0.06, 0.3, 8, 1, false, 0, Math.PI);
    bananaGeometry.rotateX(Math.PI / 2);
    const bananaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE135 });
    const bananas = new THREE.Mesh(bananaGeometry, bananaMaterial);
    bananas.position.set(0, 0.6, 0.2);
    bananas.visible = false; // Hide initially
    bananas.name = "fruit";
    cropGroup.add(bananas);
  }

  // Position on plot
  cropGroup.position.set(
    (plotX - gridSize / 2) * plotSize + plotSize / 2,
    0,
    (plotZ - gridSize / 2) * plotSize + plotSize / 2
  );

  cropGroup.scale.set(0.1, 0.1, 0.1); // Start small
  scene.add(cropGroup);

  return {
    object: cropGroup,
    type: type,
    growthStage: 0,
    fullyGrown: false,
    plotX: plotX,
    plotZ: plotZ,
  };
}

// Raycaster for plot selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle mouse clicks
function onMouseClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(plots);

  if (intersects.length > 0) {
    const plot = intersects[0].object;
    const plotData = plot.userData;

    // Check if this plot can grow the selected crop type
    if (!plotData.allowedCropType) {
      alert("This plot isn't suitable for farming!");
      return;
    }

    if (!plotData.planted) {
      // Plant a crop - can only plant the crop type allowed in this region
      if (gameState.money >= 10) {
        gameState.money -= 10;
        plotData.planted = true;

        // Create crop of the allowed type for this plot
        const crop = createCrop(plotData.x, plotData.z, plotData.allowedCropType);
        plotData.crop = crop;
        gameState.crops.push(crop);

        updateMoneyDisplay();
      }
    } else if (plotData.crop.growthStage >= 1) {
      // Harvest if fully grown - different values based on crop type
      const harvestValue = plotData.crop.type === "wheat" ? 20 : 30;
      gameState.money += harvestValue;
      plotData.planted = false;

      // Remove crop from scene
      scene.remove(plotData.crop.object);

      // Remove from crops array
      const index = gameState.crops.indexOf(plotData.crop);
      if (index > -1) {
        gameState.crops.splice(index, 1);
      }

      plotData.crop = null;
      updateMoneyDisplay();
    }
  }
}

// Update money display
function updateMoneyDisplay() {
  document.getElementById("money").textContent = gameState.money;
}

// Grow crops
function growCrops(deltaTime) {
  gameState.crops.forEach((crop) => {
    if (crop.growthStage < 1) {
      // Different growth rates
      const growthRate = crop.type === "wheat" ? 0.15 : 0.08;
      crop.growthStage += deltaTime * growthRate;

      // Scale crop based on growth
      const scale = 0.1 + crop.growthStage * 0.9;
      crop.object.scale.set(scale, scale, scale);

      // Change color as it grows
      if (crop.growthStage > 0.8 && !crop.fullyGrown) {
        // Make fruits visible when fully grown
        if (crop.type === "banana") {
          const fruit = crop.object.getObjectByName("fruit");
          if (fruit) fruit.visible = true;
        } 
        else if (crop.type === "wheat") {
          // Make wheat more golden
          crop.object.children[1].material.color.set(0xFFD700);
        }
        
        crop.fullyGrown = true;
      }
    }
  });
  
  // Update city labels
  cityData.forEach(city => {
    if (city.label) {
      const pos = new THREE.Vector3(
        city.x * plotSize, 
        2, 
        city.z * plotSize
      );
      pos.project(camera);
      
      const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(pos.y * 0.5) + 0.5) * window.innerHeight;
      
      city.label.style.transform = `translate(-50%, -50%)`;
      city.label.style.left = x + 'px';
      city.label.style.top = y + 'px';
    }
  });
}

// Handle window resize
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

// Add event listeners
window.addEventListener("click", onMouseClick, false);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();

  // Update crops growth
  growCrops(deltaTime);

  // Update controls
  controls.update();

  renderer.render(scene, camera);
}

animate();