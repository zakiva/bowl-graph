// ============================================================================
// COMPUTER GRAPHICS HW05 - MAIN SCENE INFRASTRUCTURE ENGINE
// ============================================================================

// Import OrbitControls wrapper to allow users to interactively view the scene graph
import { OrbitControls } from './OrbitControls.js';

// Instantiate the foundational root 3D container context node for all objects, meshes, and lights
const scene = new THREE.Scene();

// Establish the Perspective Camera frustum boundaries to project 3D coordinate spaces onto a 2D viewport frame
// Parameters: Field of view angle (75°), aspect ratio width/height, near clip (0.1), far clip distance (1000)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Initialize the primary WebGL hardware interface rendering pipeline context
// Enable internal hardware antialiasing passes to eliminate jagged edge aliasing artifacts along high-contrast lines
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Match the drawing area buffer allocation coordinates perfectly to fill the active screen dimensions
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the newly allocated WebGL rendering canvas node into the live structural HTML webpage layout
document.body.appendChild(renderer.domElement);

// Assign a solid matte color background hex representation directly to clear the background buffer each frame
scene.background = new THREE.Color(0x1a1a2e);

// ============================================================================
// SYSTEM ILLUMINATION LOGIC & SHADOW CONFIGURATION
// ============================================================================

// Initialize ambient fill light values to simulate non-directional bounce scattering
// Parameters: Hexadecimal tint value (white), light source coefficient scaling factor (0.5 intensity)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// Add the global uniform ambient light instance tree node directly into our root render array
scene.add(ambientLight);

// Instantiate a virtual directional parallel ray source simulating localized overhead light fixtures
// Parameters: Color spectrum mask value (white), radiant strength output multiplier (0.8 intensity)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

// Position the light vector origin point offset to create distinct structural angles
// Coordinates: X=5 (right), Y=20 (high ceilings elevation), Z=-20 (positioned down towards the pins)
directionalLight.position.set(5, 20, -20);

// Append the local directional ray transform pointer reference into our master rendering node array
scene.add(directionalLight);

// Set the global renderer master setting switch state to calculate stencil depth shadow occlusion maps
renderer.shadowMap.enabled = true;

// Configure the specific light source object instance to actively draw dynamic projectable shadows
directionalLight.castShadow = true;

// ============================================================================
// GEOMETRIC MATHEMATICS HELPER FUNCTIONS
// ============================================================================

// Utility method designed to transform angular values into standard Cartesian radian units
function degrees_to_radians(degrees) {
  // Store the mathematical constant Archimedes Pi ratio property
  var pi = Math.PI;
  // Compute conversion factor: multiply degree coordinates by Pi divided by a half circle revolution
  return degrees * (pi / 180);
}

// ============================================================================
// SCENE INFRASTRUCTURE CREATION MODULE
// ============================================================================
function createBowlingLane() {
  
  // --------------------------------------------------------------------------
  // MILESTONE 2 COMPONENT RECAP: PHYSICAL WOOD AND SLATE STRUCTURES
  // --------------------------------------------------------------------------

  // Allocate hardware memory buffers tracking a standard rectangular 3D box profile for the main lane
  // Dimensions: Regulation width (3.5 units), physical vertical depth (0.2 units), length (60 units)
  const laneGeometry = new THREE.BoxGeometry(3.5, 0.2, 60);
  
  // Construct a reflective material fragment script model calculating high specularity highlights
  const laneMaterial = new THREE.MeshPhongMaterial({
    color: 0xDEB887,  // Natural light maple wood floor hex representation
    shininess: 80     // Prompts sharp specular light shapes reflecting an ultra-glossy lane finish
  });
  
  // Blend structural vertices array layout and texture maps into a renderable node mesh instance
  const lane = new THREE.Mesh(laneGeometry, laneMaterial);
  
  // Translate the lane 30 units back on the Z axis. This centers the 60-unit block
  // so that its front edge (the Foul Line) sits exactly at the world space coordinate point Z = 0.
  lane.position.set(0, 0, -30);
  
  // Instruct pixel shader passes to capture dynamic shadow mapping calculations onto this surface
  lane.receiveShadow = true;
  
  // Allow the physical boundaries of this platform mesh to cast baseline occluding shadows
  lane.castShadow = true;
  
  // Register the completed lane mesh tree pointer directly into the master active graphics scene view
  scene.add(lane);

  // Define the geometric dimensions representing the physical runner approach deck tracking zone
  // Proportions: Matches lane width (3.5), matches lane depth thickness (0.2), extends out 15 units
  const approachGeometry = new THREE.BoxGeometry(3.5, 0.2, 15);
  
  // Differentiate the player approach tracking zones by applying an unpolished darker wood grain shade
  const approachMaterial = new THREE.MeshPhongMaterial({
    color: 0xCD853F,  // Peru wood tone hex designation
    shininess: 50     // Lower shininess value yields a satin finish representing high foot-traction zones
  });
  
  // Instantiate the independent approach runway geometry structure inside the graphics scene map
  const approach = new THREE.Mesh(approachGeometry, approachMaterial);
  
  // Position the 15-unit box behind the foul line (`Z = 0`), meaning it stretches into positive Z space.
  // Setting `Z = 7.5` places the box's center perfectly between `Z = 0` and `Z = 15`.
  approach.position.set(0, 0, 7.5);
  
  // Receive shadows cast from objects like the bowling ball or sliding player shoes
  approach.receiveShadow = true;
  
  // Ensure the approach platform boundaries contribute to global depth shadow map generation steps
  approach.castShadow = true;
  
  // Attach the completed player approach track mesh directly into our master graphic assembly array
  scene.add(approach);

  // Model the side drop gutter tracks using narrow box profiles
  // Structural settings: Width (0.4), vertical thickness depth (0.1), total length running parallel (60)
  const gutterGeometry = new THREE.BoxGeometry(0.4, 0.1, 60);
  
  // Create a low specularity matte material to simulate dense industrial synthetic gutter liners
  const gutterMaterial = new THREE.MeshPhongMaterial({
    color: 0x2c3e50,  // Dark slate navy gray hex color code
    shininess: 20     // Flat matte light dispersion properties
  });

  // Assemble the left gutter mesh instance assembly parameters
  const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  
  // Math: Lane center is 0. Left lane edge sits at -1.75 (3.5 / 2). Gutter half-width is -0.2 (0.4 / 2).
  // Total X coordinate = -1.75 + (-0.2) = -1.95. Drop Y to -0.05 so its deck surface sits visibly below the lane.
  leftGutter.position.set(-1.95, -0.05, -30);
  
  // Set gutter tracking states to capture falling shadows generated down the lane profile
  leftGutter.receiveShadow = true;
  
  // Add the completed left structural drainage track directly into the visible simulation world
  scene.add(leftGutter);

  // Assemble the right side gutter mesh layout parameters
  const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  
  // Math: Mirroring the left channel, the right edge boundary sits at +1.75. Add half of the gutter width (+0.2).
  // Total X coordinate = 1.75 + 0.2 = 1.95. Keep Y dropped at -0.05 and Z centered at -30.
  rightGutter.position.set(1.95, -0.05, -30);
  
  // Allow the right side gutter surfaces to display depth values and shadow layers accurately
  rightGutter.receiveShadow = true;
  
  // Add the completed right structural drainage track directly into the visible simulation world
  scene.add(rightGutter);

  // Set up the specialized high-impact target pin deck plate plane located at the absolute back boundary
  // Plate parameters: Width matches lane (3.5), depth thickness sheet (0.01), length covers pin array zone (5)
  const pinDeckGeometry = new THREE.BoxGeometry(3.5, 0.01, 5);
  
  // Differentiate the pin target floor by generating a distinct matte light grey synthetic plate
  const pinDeckMaterial = new THREE.MeshPhongMaterial({
    color: 0xD3D3D3,  // Clean high-contrast off-white light gray hex color code
    shininess: 40     // Standard non-reflective satin profile coating properties
  });
  
  // Instatitate the unique structural pin deck plate object into graphic execution frames
  const pinDeck = new THREE.Mesh(pinDeckGeometry, pinDeckMaterial);
  
  // Center is at Z = -57.5 (covering Z = -55 to -60). Lift Y to exactly 0.101 so it sits perfectly flush
  // on top of the main lane platform (which has a upper boundary of Y = 0.1) without clipping issues.
  pinDeck.position.set(0, 0.101, -57.5);
  
  // Enable the pin deck floor area to display cast drop shadows calculated from active standing pins
  pinDeck.receiveShadow = true;
  
  // Commit the structural pin deck node element straight into the global render loop index tree
  scene.add(pinDeck);

  // --------------------------------------------------------------------------
  // MILESTONE 3: ANALYTICAL SURFACE MARKINGS (EXACT GEOMETRIC DEFINITIONS)
  // --------------------------------------------------------------------------
  // DESIGN ARCHITECTURE EXPLANATION: To permanently stop "Z-Fighting" artifacts (where two flat planes
  // compete for the same pixel depth interpolation values, creating broken flickering textures),
  // all surface analytical shapes are positioned at an elevated offset plane height set exactly at Y = 0.101.

  // --- TASK 3.1: THE FOUL LINE ---
  // Create a flat 2D plane strip crossing the complete lane width with an explicit structural thickness of 0.08 units
  const foulLineGeometry = new THREE.PlaneGeometry(3.5, 0.08);
  
  // Use a cost-efficient MeshBasicMaterial because simple functional solid vectors do not need complex lighting calculations
  const foulLineMaterial = new THREE.MeshBasicMaterial({ color: 0xE74C3C }); // Standard safety red hex color code
  
  // Compile structural definitions together into a single foul boundary node object mesh
  const foulLine = new THREE.Mesh(foulLineGeometry, foulLineMaterial);
  
  // Position exactly at Z = 0. Lift Y coordinate to 0.101 to float millimetrically above the wood board seam.
  foulLine.position.set(0, 0.101, 0);
  
  // Built-in 2D plane primitives initialize facing vertically standing up. Rotate -90° on the X axis to lay it flat.
  foulLine.rotation.x = degrees_to_radians(-90);
  
  // Append the newly completed foul line warning stripe directly into our renderable graphics world index
  scene.add(foulLine);

  // --- TASK 3.2: APPROACH ALIGNMENT DOTS ---
  // Instantiate an explicit circular geometry structure to define true spherical approach markings
  // Parameters: Circle radius size boundary (0.04 units), radial triangulation resolution segments (32 steps)
  const dotGeometry = new THREE.CircleGeometry(0.04, 32);
  
  // Use a flat unlit basic material structure to render solid ink color indices across the deck surface
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 }); // Deep charcoal black hex color representation
  
  // Define precise horizontal layout intervals matching standard bowling lanes across the width (X axis)
  const dotPositionsX = [-1.2, -0.6, 0, 0.6, 1.2];
  
  // Define two independent tracking baseline markers along the depth length of the approach walkway (Z axis)
  const dotRowsZ = [3.0, 11.0]; 

  // Map out coordinates across a nested iterator loop to cleanly construct the alignment dot grids
  dotRowsZ.forEach((zPos) => { // Outer loop tracking step: Process individual horizontal rows down the walkway
    dotPositionsX.forEach((xPos) => { // Inner loop tracking step: Process individual vertical tracks spanning across width
      // Create a fresh independent circular mesh structure reference for this coordinate index
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      // Place the circular dot mesh at the intersecting grid coordinate, floating flat over the approach boards
      dot.position.set(xPos, 0.101, zPos);
      // Twist the circular plane vector 90° down around its X axis to lay face up flat against the floorboards
      dot.rotation.x = degrees_to_radians(-90);
      // Mount the completed alignment circle asset mesh into our active scene management group
      scene.add(dot);
    });
  });

  // --- TASK 3.3: LANE TARGETING ARROWS (CHEVRONS) ---
  // Design Note: Creating a CircleGeometry setting with exactly 3 radial segments produces a flat plane triangle.
  // This satisfies the prompt requirement to assemble true "plane geometry arrowhead shapes".
  // Parameters: Outer bounding radius (0.07 units), structural division segments forced to 3 (triangle plane)
  const arrowGeometry = new THREE.CircleGeometry(0.07, 3);
  
  // Allocate dark wood stain color basic material scripts to represent traditional embedded lane vectors
  const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x5c4033 }); // Traditional dark brown finish color hex
  
  // Define layout coordinate bounds tracking an accurate symmetrical V-formation chevron pattern pointing forward
  // The center apex arrow positions at exactly Z = -15.0, with outer flank pairs expanding symmetrically.
  const arrowOffsets = [
    { x: 0, z: -15.0 },       // Core apex center target arrow pointer (15 units out down the lane)
    { x: -0.4, z: -14.6 }, { x: 0.4, z: -14.6 }, // Symmetrical step offset pair flanking the center track
    { x: -0.8, z: -14.2 }, { x: 0.8, z: -14.2 }, // Intermediate step chevron pair widening outward
    { x: -1.2, z: -13.8 }, { x: 1.2, z: -13.8 }  // Outer gutter-adjacent margin arrow chevron indicators
  ];

  // Step through the targeting matrix data structure to draw every chevron plane asset into memory
  arrowOffsets.forEach((offset) => {
    // Instantiate a new flat regular triangle mesh pointer reference object
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    // Align current indicator arrow to its designated structural tracking slot over the lane surface
    arrow.position.set(offset.x, 0.101, offset.z);
    // Pivot 90° on the X axis to force the flat triangle plane to lie face up flush with the floor boards
    arrow.rotation.x = degrees_to_radians(-90);
    // Pivot 30° around its local Z axis to orient the triangle vertex point facing straight down negative Z (the pins)
    arrow.rotation.z = degrees_to_radians(30);
    // Inject the completed arrowhead geometric plane model straight into the operational scene index list
    scene.add(arrow);
  });
}

// Execute the full initialization routine to construct the physical lane meshes and vector indicators
createBowlingLane();

// ============================================================================
// CAMERA DESKTOP ORIENTATION & STANDPOINT CONFIGURATION
// ============================================================================

// Instantiate an empty transformation identity matrix block tracking view coordinate displacements
const cameraTranslate = new THREE.Matrix4();

// Configure the allocation matrix parameters to translate view positioning coordinates
// Displacements: Slide horizontally zero, elevate viewpoint up (Y=5), pull camera back behind player line (Z=12)
cameraTranslate.makeTranslation(0, 5, 12);

// Pipe the compiled translation matrix operations into the camera container to orient the default bowler view
camera.applyMatrix4(cameraTranslate);

// ============================================================================
// USER DESKTOP INTERACTION LAYER INTERACTION CODE
// ============================================================================

// Mount an active instance of OrbitControls monitoring human inputs covering the graphics drawing window canvas
const controls = new OrbitControls(camera, renderer.domElement);

// Instantiate a master boolean status flag determining if mouse coordinate tracking logic is running
let isOrbitEnabled = true;

// Evaluate structural computer hardware key events typed by the user layout
function handleKeyDown(e) {
  // Check if character inputs match standard capitalized or lowercase character "O" keycodes
  if (e.key === "o" || e.key === "O") {
    // Invert current state logic values cleanly using an algebraic NOT switch command
    isOrbitEnabled = !isOrbitEnabled;
  }
}

// Bind the keyboard event tracking method onto the global web browser window document framework scope
document.addEventListener('keydown', handleKeyDown);

// ============================================================================
// WINDOW VIEWPORT DYNAMIC RESPONSIVENESS MODULE
// ============================================================================

// Callback loop execution block correcting dimensional distortion profiles when modifying browser scales
function onWindowResize() {
  // Re-evaluate frustum coordinate fractions to match new real-time width and height dimensions
  camera.aspect = window.innerWidth / window.innerHeight;
  // Order the camera transformation engine to rebuild its view bounds and matrix map projection array
  camera.updateProjectionMatrix();
  // Readjust active WebGL graphic drawing canvas pixel boundaries to fill updated frame spaces
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Map the screen resizing tracker wrapper function to listen directly to native system resize signals
window.addEventListener('resize', onWindowResize, false);

// ============================================================================
// REFRESH ENGINE SIMULATION EXECUTION RUNTIME
// ============================================================================

// Core animation scheduling script cycling view calculations up to hardware refresh bounds each second
function animate() {
  // Enqueue this parent loop routine to execute again immediately on the next system video redraw frame
  requestAnimationFrame(animate);

  // Synchronize internal orbital input states with our master application boolean configuration setting
  controls.enabled = isOrbitEnabled;
  
  // Calculate and apply updated camera positioning angles if orbital drag mechanics are enabled
  controls.update();

  // Order the hardware WebGL context pipeline to re-render the fully updated scene tree array onto screen
  renderer.render(scene, camera);
}

// Engage the engine framework runtime loop to launch display window updates into active states
animate();
