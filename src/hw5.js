// Import the OrbitControls class as an ES module to enable interactive camera manipulation
import {OrbitControls} from './OrbitControls.js'

// 1. VIRTUAL WORLD SETUP
// Create the root scene graph node which holds all 3D meshes, light sources, and cameras
const scene = new THREE.Scene();

// Initialize a Perspective Camera to simulate realistic human depth perception (objects further away look smaller)
// Arguments: Field of View (75 degrees), Aspect Ratio, Near clipping plane (0.1), Far clipping plane (1000 units)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Instantiate the WebGL core renderer responsible for drawing our 3D calculations onto a 2D HTML canvas
// Enable antialiasing to smooth out jagged stair-step edges on diagonal lines and surface contours
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Match the WebGL drawing canvas dimensions exactly to the visible browser viewport size
renderer.setSize(window.innerWidth, window.innerHeight);

// Mount the dynamically generated WebGL canvas element directly into the webpage's DOM body node
document.body.appendChild(renderer.domElement);

// Apply a dark, stylized midnight blue tone to the scene background to make the bowling alley pop
scene.background = new THREE.Color(0x1a1a2e);


// 2. ILLUMINATION & GLOBAL ILLUMINATION SIMULATION
// Ambient Light provides non-directional, uniform light to every surface in the scene, preventing pitch-black shadows
// It mimics bouncing indirect light. Color: White, Intensity: 0.5
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light acts like the sun, emitting parallel rays from a specific source direction
// Color: White, Intensity: 0.8
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

// Position the light source overhead, slightly right, and far behind the bowler to cast long forward-facing shadows
// Coordinates: X = 5 (right), Y = 20 (high up), Z = -20 (down-lane)
directionalLight.position.set(5, 20, -20);
scene.add(directionalLight);

// Enable the shadow-map calculation engine inside the renderer core to evaluate occluded pixels
renderer.shadowMap.enabled = true;

// Configure this specific directional light source to compute and generate dynamic real-time depth shadows
directionalLight.castShadow = true;


// 3. MATHEMATICAL UTILITIES
// Standard helper function converting angles from Degrees to Radians, as Three.js uses Radians for all rotation operations
function degrees_to_radians(degrees) {
  var pi = Math.PI; // Grab the constant Pi value (approximately 3.14159)
  return degrees * (pi/180); // Multiply by conversion ratio to map degrees cleanly into radians
}


// 4. SCENE MODELING ENGINE (ALLEY INFRASTRUCTURE)
function createBowlingLane() {
  
  // --- SUB-SECTION A: PHYSICAL GEOMETRIC MESHES ---

  // Main Lane: Dimensions match regulation proportions (Width: 3.5 units, Thickness: 0.2 units, Length: 60 units)
  const laneGeometry = new THREE.BoxGeometry(3.5, 0.2, 60);
  
  // Use Phong material to support specularity (glossy, shiny reflections from light sources)
  const laneMaterial = new THREE.MeshPhongMaterial({
    color: 0xDEB887,  // Natural light maple wood hex code
    shininess: 80     // High shininess value gives it a polished, freshly-waxed look
  });
  
  // Combine geometry and material structural data into a unique scene graph object called a Mesh
  const lane = new THREE.Mesh(laneGeometry, laneMaterial);
  
  // The center of a box sits at its internal local origin. We offset Z by -30 to push the 60-unit lane forward.
  // This keeps the start of the lane (the Foul Line) aligned exactly at the global coordinate Z = 0.
  lane.position.set(0, 0, -30);
  
  // Configure the lane surface to receive cast shadows dropped onto it from balls and pins
  lane.receiveShadow = true;
  
  // Configure the lane itself to cast shadows down onto the floor beneath it
  lane.castShadow = true;
  scene.add(lane); // Append the completed lane object directly into the renderable scene tree


  // Approach Area: The space where players walk and aim before throwing the ball
  // Dimensions: Width matches lane (3.5), Thickness matches lane (0.2), Length is 15 units
  const approachGeometry = new THREE.BoxGeometry(3.5, 0.2, 15);
  
  // Distinguish the approach area by using a slightly darker, warmer wood finish
  const approachMaterial = new THREE.MeshPhongMaterial({
    color: 0xCD853F,  // Peru wood hex code
    shininess: 50     // Lower shininess than the lane to simulate less slick, unpolished wood flooring
  });
  const approach = new THREE.Mesh(approachGeometry, approachMaterial);
  
  // Situate the approach area behind the foul line. Since the lane goes down negative Z, the approach extends down positive Z.
  // Setting Z to 7.5 centers this 15-unit box perfectly between Z = 0 (foul line) and Z = 15.
  approach.position.set(0, 0, 7.5);
  approach.receiveShadow = true; // Allow the ball and players to cast shadows onto the walkway surface
  approach.castShadow = true;
  scene.add(approach);


  // Flanking Gutters: Channels running on both sides of the lane to catch errant throws
  // Dimensions: Width: 0.4 units, Thickness: 0.1 units (half the lane thickness), Length: 60 units
  const gutterGeometry = new THREE.BoxGeometry(0.4, 0.1, 60);
  const gutterMaterial = new THREE.MeshPhongMaterial({
    color: 0x2c3e50,  // Dark matte slate grey to visually represent plastic/synthetic gutter tracks
    shininess: 20     // Low shininess gives it a dull, matte look
  });

  // Left Gutter Mesh Construction
  const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  // Calculation: Lane center is 0. Left lane edge is at -1.75 (-3.5 / 2). Gutter half-width is -0.2 (-0.4 / 2).
  // Total X coordinate = -1.75 + -0.2 = -1.95. Set Y to -0.05 to drop its top surface below the lane deck line.
  leftGutter.position.set(-1.95, -0.05, -30);
  leftGutter.receiveShadow = true; // Pins or debris falling in the gutter will cast internal shadows
  scene.add(leftGutter);

  // Right Gutter Mesh Construction
  const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  // Calculation: Right lane edge is at +1.75 (+3.5 / 2). Gutter half-width is +0.2 (+0.4 / 2).
  // Total X coordinate = 1.75 + 0.2 = 1.95. Position identically along Y and Z axes.
  rightGutter.position.set(1.95, -0.05, -30);
  rightGutter.receiveShadow = true;
  scene.add(rightGutter);


  // Pin Deck Area: The reinforced plate surface at the far end of the lane where pins stand
  // Dimensions: Width: 3.5 units, Thickness: 0.01 units (thin overlay sheet), Length: 5 units (Z = -55 to Z = -60)
  const pinDeckGeometry = new THREE.BoxGeometry(3.5, 0.01, 5);
  const pinDeckMaterial = new THREE.MeshPhongMaterial({
    color: 0xD3D3D3,  // Distinct light off-white grey plate to contrast against wood grain
    shininess: 40
  });
  const pinDeck = new THREE.Mesh(pinDeckGeometry, pinDeckMaterial);
  // Center is at Z = -57.5. Set Y to 0.101 so it rests perfectly flat on top of the main lane platform (which sits at Y = 0.1).
  pinDeck.position.set(0, 0.101, -57.5);
  pinDeck.receiveShadow = true; // Essential for displaying pin tracking shadows
  scene.add(pinDeck);


  // --- SUB-SECTION B: SURFACE VECTOR MARKINGS ---
  // DESIGN NOTE: To prevent "Z-Fighting" (an artifact where two planes share identical space and flicker randomly),
  // all flat lane patterns are placed at small, progressively staggered Y elevations (e.g., Y = 0.102).

  // Foul Line: Boundaries marking where a player's delivery approach must end
  // Create a flat plane strip across the 3.5 unit lane width with a visible thickness of 0.08 units
  const foulLineGeometry = new THREE.PlaneGeometry(3.5, 0.08);
  const foulLineMaterial = new THREE.MeshBasicMaterial({ color: 0xE74C3C }); // Use MeshBasicMaterial because indicators don't need lighting or shadows
  const foulLine = new THREE.Mesh(foulLineGeometry, foulLineMaterial);
  // Situate exactly at Z = 0. Lift Y to 0.102 to clear the floor bounds.
  foulLine.position.set(0, 0.102, 0);
  // Default planes initialize standing straight up vertically. Rotate -90 degrees on the X axis to lay it flat face up.
  foulLine.rotation.x = degrees_to_radians(-90);
  scene.add(foulLine);


  // Approach Dots: Alignment markers helping players establish starting footwork
  // Generate tiny squares (0.06 x 0.06 dimensions)
  const dotGeometry = new THREE.PlaneGeometry(0.06, 0.06);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Pure dark gray charcoal tint
  
  // Define standard crossway spacing intervals along the width of the lane (X coordinates)
  const dotPositionsX = [-1.2, -0.6, 0, 0.6, 1.2];
  // Define two horizontal tracking paths along the length of the approach area (Z coordinates)
  const dotRowsZ = [3.0, 11.0]; 

  // Nested iterations to cleanly distribute the dots across both defined rows
  dotRowsZ.forEach((zPos) => { // Outer loop maps individual rows down the track
    dotPositionsX.forEach((xPos) => { // Inner loop maps across the lane width
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(xPos, 0.102, zPos); // Place dot at current grid point slightly above the wood deck
      dot.rotation.x = degrees_to_radians(-90); // Flatten flat onto surface
      scene.add(dot); // Insert the dot instance into the scene graph
    });
  });


  // Lane Targeting Arrows: Core chevron visual aids used by bowlers to aim their line
  // A ConeGeometry with 3 segments produces a perfect triangular arrowhead outline
  // Arguments: Radius: 0.06 units, Height: 0.2 units, Radial segments: 3
  const arrowGeometry = new THREE.ConeGeometry(0.06, 0.2, 3);
  const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x4a3728 }); // Dark wood inset color to match standard lanes
  
  // Map out coordinates for a traditional V-shaped chevron layout formation
  // The apex of the arrow formation is closest to the pins, tapering back symmetrically on both sides.
  const arrowOffsets = [
    { x: 0, z: -15.0 },       // Center point arrow (exactly 15 units down from the foul line)
    { x: -0.4, z: -14.7 }, { x: 0.4, z: -14.7 }, // Second row pairs flanking the center
    { x: -0.8, z: -14.4 }, { x: 0.8, z: -14.4 }, // Third row pairs branching outward
    { x: -1.2, z: -14.1 }, { x: 1.2, z: -14.1 }  // Outer wing edge pairs
  ];

  // Map over the layout matrix array to generate each individual targeting arrow
  arrowOffsets.forEach((offset) => {
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(offset.x, 0.102, offset.z); // Position arrowhead at target coordinates
    arrow.rotation.x = degrees_to_radians(-90); // Twist 90 degrees forward to lay flat against the lane surface
    arrow.rotation.z = degrees_to_radians(180); // Rotate 180 degrees around Z to point directly down-lane toward the pins
    scene.add(arrow); // Save element to scene graph
  });
}

// Invoke the setup routine to construct all physical lane items into memory
createBowlingLane();


// 5. INITIAL TRANSFORMS & ORIENTATION
// Create an empty transformation matrix to configure the default viewer standpoint
const cameraTranslate = new THREE.Matrix4();
// Configure a translation matrix to lift the view up (Y=5) and push it back behind the approach area (Z=12)
cameraTranslate.makeTranslation(0, 5, 12);
// Apply the transformation matrix to the camera object, locking its perspective starting frame
camera.applyMatrix4(cameraTranslate);


// 6. INTERACTIVE INTERACTION LAYER
// Bind the OrbitControls instance to monitor user inputs over the viewport canvas element
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true; // State tracking flag determining if camera panning calculations are active

// Key event parser tracking camera toggle controls
function handleKeyDown(e) {
  // Check if user pressed 'O' or 'o' key to toggle camera manipulation modes
  if (e.key === "o" || e.key === "O") {
    isOrbitEnabled = !isOrbitEnabled; // Invert the boolean state flag
  }
}

// Attach the keyboard listener subroutine directly onto the main browser global DOM document level
document.addEventListener('keydown', handleKeyDown);


// 7. VIEWPORT RESPONSIVENESS CAPABILITIES
// Dynamic window scaling event routine to prevent geometric stretching distortion
function onWindowResize() {
  // Recalculate camera aspect ratio to account for the new browser window width and height values
  camera.aspect = window.innerWidth / window.innerHeight;
  // Instruct camera projection system to rebuild its projection tracking frustum matrix map
  camera.updateProjectionMatrix();
  // Readjust active drawing WebGL resolution boundaries to fill the revised screen shape
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Bind the responsiveness event wrapper method directly to the browser window resize event channel
window.addEventListener('resize', onWindowResize, false);


// 8. GRAPHICS RENDERING RUNTIME LOOP
// Core rendering loop updating screen contents up to 60+ times per second based on screen hardware
function animate() {
  // Enqueue this animation method to run again on the next available browser screen refresh interval
  requestAnimationFrame(animate);

  // Synchronize internal orbit status values with user input interaction configuration state
  controls.enabled = isOrbitEnabled;
  // If orbit mechanics are active, run calculations to update camera tracking targets
  controls.update();

  // Instruct WebGL layer to re-render the fully updated scene graph perspective matrix back onto screen canvas
  renderer.render(scene, camera);
}

// Execute the loop mechanism to start scene processing
animate();
