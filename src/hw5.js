// ============================================================================
// COMPUTER GRAPHICS HW05 - MASTER BOWLING ALLEY SIMULATION ENGINE
// ============================================================================

// Import OrbitControls from our local vendor file to allow interactive click-and-drag camera orbiting, zooming, and panning
import { OrbitControls } from './OrbitControls.js';

// 1. CORE WEBGL GLOBAL CONTEXT INITIALIZATION
// Instantiate the root Scene object which serves as the top-level 3D container tree for all meshes, lights, and cameras
const scene = new THREE.Scene();

// Initialize a Perspective Camera to mimic the optical properties of human eyes where objects further away appear smaller
// Arguments: Field of View (75°), Aspect Ratio fraction, Near clipping boundary plane (0.1), Far clipping limit boundary (1000)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Instantiate the core WebGL Renderer component responsible for translating our vector math mathematical matrices onto screen pixels
// Enable internal hardware antialiasing passes to eliminate jagged stair-step artifacts along high-contrast silhouettes
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Match the drawing frame buffer size allocation to fill the active user browser window viewport configuration dimensions exactly
renderer.setSize(window.innerWidth, window.innerHeight);

// Mount the compiled WebGL graphics canvas HTML element directly into the visible document object model body layer
document.body.appendChild(renderer.domElement);

// Apply a uniform dark midnight blue background hex fill color value directly to clear the frame color buffer every render frame
scene.background = new THREE.Color(0x1a1a2e);


// ============================================================================
// SYSTEM ILLUMINATION LOGIC & DYNAMIC DEPTH SHADOW MAP LAYOUTS
// ============================================================================

// Initialize an un-targeted Ambient Light source to uniformly brighten up dark face polygons and simulate bounced scatter light
// Arguments: Light tint color hex representation (pure white), radiant intensity scalar coefficient multiplier (0.5 strength)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// Add the configured ambient light node directly into our root active scene graph layout index array for global application
scene.add(ambientLight);

// Instantiate a high-power overhead Directional Light source emitting parallel vector light rays to simulate long lane fixtures
// Arguments: Light tint color hex value (white), radiant beam strength scale intensity threshold modifier (0.8 strength)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

// Position the light vector origin high overhead, offset slightly right, and far down-lane to project crisp directional shadow maps
// Coordinates: X = 5 (right side flank spread), Y = 20 (high ceiling elevation plane), Z = -20 (positioned forward toward the pins)
// zahi: trying to change to z=20 to addm ore lights on the pins. 
directionalLight.position.set(5, 20, 20);

// Localized overhead light to fully illuminate the pin deck area
const pinDeckLight = new THREE.DirectionalLight(0xffffff, 0.4);
pinDeckLight.position.set(0, 10, -55); // Directly above the pin formation
pinDeckLight.castShadow = true;
scene.add(pinDeckLight);

// Append the overhead directional light source transform pointer reference directly into our root scene hierarchy index
scene.add(directionalLight);

// Set the global master renderer state configuration variable to true to enable dynamic stencil shadow depth calculation matrices
renderer.shadowMap.enabled = true;

// Configure this specific directional light object source instance to compile and actively project real-time depth occlusion masks
directionalLight.castShadow = true;


// ============================================================================
// MATHEMATICAL COORDINATE SYSTEM UTILITIES
// ============================================================================

// Helper conversion subroutine transforming degree angular values into standard Cartesian radian metrics required by Three.js
function degrees_to_radians(degrees) {
  // Grab the immutable mathematical constant Archimedes Pi ratio property value approximation (3.14159)
  var pi = Math.PI;
  // Calculate conversion: multiply input scalar degrees by Pi divided by a standard half-circle angular index limit (180)
  return degrees * (pi / 180);
}


// ============================================================================
// MASTER ALLEY INFRASTRUCTURE CREATION FUNCTION
// ============================================================================
function createBowlingLane() {
  
  // --------------------------------------------------------------------------
  // MILESTONE 2: PHYSICAL FLOORS, PLATES, AND DRAINAGE INFRASTRUCTURE
  // --------------------------------------------------------------------------

  // 1. MAIN WOOD LANE PLATFORM
  // Allocate hardware memory structures tracking a standard box profile matching standard regulation lane proportions
  // Specs: Width (3.5 units), physical vertical core thickness thickness (0.2), lane length extension span (60)
  const laneGeometry = new THREE.BoxGeometry(3.5, 0.2, 60);
  
  // Construct a reflective material fragment shader layout model to enable dynamic light specular reflection maps
  const laneMaterial = new THREE.MeshPhongMaterial({
    color: 0xDEB887,  // Light maple wood floor varnish tint hex representation code
    shininess: 80     // Sets a high specularity index score to generate a polished, glossy lane appearance
  });
  
  // Blend spatial coordinate vertex data tracking bounds and material shaders together into a visible independent Mesh object
  const lane = new THREE.Mesh(laneGeometry, laneMaterial);
  
  // Translate the box -30 units along the Z axis to center the 60-unit block, placing the lane entrance (Foul Line) exactly at Z = 0
  lane.position.set(0, 0, -30);
  
  // Instruct active graphics fragment passes to capture dynamic shadow mapping textures overlapping this floor plane
  lane.receiveShadow = true;
  
  // Allow the physical boundaries of this lane mesh block to actively cast baseline depth values onto elements below
  lane.castShadow = true;
  
  // Insert the compiled master lane mesh instance tree pointer straight into our master view scene array node
  scene.add(lane);


  // 2. PLAYER APPROACH RUNWAY PLATFORM
  // Define physical boundaries tracking the player stance walkway track stretching out right behind the foul line boundary
  // Sizing: Width matches lane floor (3.5), vertical deck thickness matches lane (0.2), approach length scales out 15 units
  const approachGeometry = new THREE.BoxGeometry(3.5, 0.2, 15);
  
  // Differentiate approach walkways visually by selecting a less glossy, un-buffed warmer satin wood finish hue
  const approachMaterial = new THREE.MeshPhongMaterial({
    color: 0xCD853F,  // Peru rich wood floorboard tone hexadecimal designation
    shininess: 50     // Lower specularity coefficient simulates high shoe-traction properties for player sliding steps
  });
  
  // Instantiate the standalone runway platform block object structure inside our virtual scene index array
  const approach = new THREE.Mesh(approachGeometry, approachMaterial);
  
  // Position the approach zone behind the foul line (`Z = 0`), extending into positive Z space.
  // Setting `Z = 7.5` places the center of this 15-unit block exactly between `Z = 0` and `Z = 15`.
  approach.position.set(0, 0, 7.5);
  
  // Configure approach platform surface planes to capture dynamic shadows cast from balls or players standing on it
  approach.receiveShadow = true;
  
  // Ensure the structural side edges of the approach boundary contribute accurate values to global shadow generation passes
  approach.castShadow = true;
  
  // Mount the finished player approach runway platform component directly into the live scene rendering tree
  scene.add(approach);


  // 3. FLANKING BALL DROP GUTTER TRACKS
  // Generate the side drainage drop tracks utilizing narrow elongated bounding boxes parallel to the main lane profile
  // Structural settings: Width (0.4 units), thickness height depth (0.1, half the lane level), length extends full length (60)
  const gutterGeometry = new THREE.BoxGeometry(0.4, 0.1, 60);
  
  // Setup a matte low-reflection compound shader profile to simulate dark industrial synthetic gutter composite materials
  const gutterMaterial = new THREE.MeshPhongMaterial({
    color: 0x2c3e50,  // Dark slate navy gray hex color code profile identity
    shininess: 20     // Flat diffusion profile prevents light reflections from bleeding over onto the wood lane
  });

  // Assemble the left side gutter track mesh child layout instance
  const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  
  // Math: Lane center is 0. Left lane edge sits at -1.75 (3.5 / 2). Gutter half-width is -0.2 (0.4 / 2).
  // Total X coordinate = -1.75 + (-0.2) = -1.95. Position Y at -0.05 to depress its deck line visibly below the lane.
  leftGutter.position.set(-1.95, -0.05, -30);
  
  // Force left hand drainage channels to receive cast shadows dropped from tracking items sliding nearby
  leftGutter.receiveShadow = true;
  
  // Append the completed left structural channel directly into our master visible world simulation group index
  scene.add(leftGutter);

  // Assemble the right side gutter track mesh child layout instance
  const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  
  // Math: Mirroring the left track, the right lane boundary sits at +1.75. Add half of the gutter width (+0.2).
  // Total X coordinate = 1.75 + 0.2 = 1.95. Position Y dropped at -0.05 and Z centered parallel at -30.
  rightGutter.position.set(1.95, -0.05, -30);
  
  // Force right hand drainage channels to receive cast shadows dropped from tracking items sliding nearby
  rightGutter.receiveShadow = true;
  
  // Append the completed right structural channel directly into our master visible world simulation group index
  scene.add(rightGutter);


  // 4. REINFORCED COMPOSITE TARGET PIN DECK PLATE
  // Configure the high-impact base sheet layer located at the far terminal end to ground the pin setup array
  // Sheet sizing: Width covers lane (3.5), depth thickness layer (0.01), length covers pin formation space (5)
  const pinDeckGeometry = new THREE.BoxGeometry(3.5, 0.01, 5);
  
  // Differentiate the pin deck zone floorboards by generating an independent light grey synthetic layout face skin
  const pinDeckMaterial = new THREE.MeshPhongMaterial({
    color: 0xD3D3D3,  // High-visibility matte light grey hex color spectrum assignment code
    shininess: 40     // Standard non-glare satin light scattering properties
  });
  
  // Instantiate the final standalone structural pin deck base mesh object into system scene graphs
  const pinDeck = new THREE.Mesh(pinDeckGeometry, pinDeckMaterial);
  
  // Position center at Z = -57.5 (covering Z = -55 to Z = -60). Lift vertical height Y to 0.101 so it mounts perfectly flush
  // on top of the main lane platform (which sits at Y = 0.1) without encountering rendering layout overlap bugs.
  pinDeck.position.set(0, 0.101, -57.5);
  
  // Enable the rear pin deck floor plate to receive cast drop shadow textures generated from standing pins
  pinDeck.receiveShadow = true;
  
  // Commit the structural pin deck component securely into our primary master scene tree layout index array
  scene.add(pinDeck);


  // --------------------------------------------------------------------------
  // MILESTONE 3: ANALYTICAL SURFACE VECTOR MARKINGS
  // --------------------------------------------------------------------------
  // DEPTH BUFFER MITIGATION CONFIGURATION: To permanently prevent "Z-Fighting" bugs where overlapping flat
  // planes struggle for drawing priority and flicker randomly, all vector indicators sit elevated at Y = 0.102.

  // 5. REGULATION FOUL LINE STRIPE
  // Create a flat 2D lane boundary indicator crossing full width with an explicit structural depth thickness of 0.08 units
  const foulLineGeometry = new THREE.PlaneGeometry(3.5, 0.08);
  
  // Use a cost-effective MeshBasicMaterial because simple solid color lines do not require lighting or specularity calculations
  const foulLineMaterial = new THREE.MeshBasicMaterial({ color: 0xE74C3C }); // Standard tournament warning red hex color code
  const foulLine = new THREE.Mesh(foulLineGeometry, foulLineMaterial);
  
  // Situate line edge intersection exactly at Z = 0. Float Y to 0.102 to clear the lower floorboard bounds safely.
  foulLine.position.set(0, 0.102, 0);
  foulLine.rotation.x = degrees_to_radians(-90); // Rotate 2D plane primitive 90 degrees forward to lay completely face up
  scene.add(foulLine);


  // 6. APPROACH ALIGNMENT DOTS
  // Allocate exact 2D circle shapes to generate high-fidelity circular player tracking markers across the wood floor
  // Sizing parameters: Circular radius size (0.04 units), smooth perimeter triangulation interpolation count (32 steps)
  const dotGeometry = new THREE.CircleGeometry(0.04, 32);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 }); // Deep ink charcoal black color mask
  const dotPositionsX = [-1.2, -0.6, 0, 0.6, 1.2]; // Precise horizontal offset lines crossing width layout tracks
  const dotRowsZ = [3.0, 11.0]; // Two independent row paths positioned along the length of the player approach zone

  // Run nested iteration sweeps to distribute the double row marker circle index meshes cleanly
  dotRowsZ.forEach((zPos) => { // Outer loop path: Step sequentially along the length tracking depth down the approach runway
    dotPositionsX.forEach((xPos) => { // Inner loop path: Align components horizontally crossing across the width track
      const dot = new THREE.Mesh(dotGeometry, dotMaterial); // Allocate a fresh circular vector indicator mesh reference
      dot.position.set(xPos, 0.102, zPos); // Center dot at intersecting grid slot, floating just over floorboards
      dot.rotation.x = degrees_to_radians(-90); // Pivot plane 90 degrees forward around X to face skyward flat
      scene.add(dot); // Save instance into active scene array tree
    });
  });


  // 7. LANE TARGETING CHEVRONS (AIMING ARROWS)
  // Design Architecture: Initializing a flat CircleGeometry restricted to exactly 3 perimeter segments forces a triangle plane.
  // This satisfies requirements to engineer native "chevron arrowhead shapes utilizing flat geometric plane models".
  // Sizing parameters: Bounding radius threshold scale (0.07), radial segments locked to 3 (triangle configuration)
  const arrowGeometry = new THREE.CircleGeometry(0.07, 3);
  const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x5c4033 }); // Traditional dark walnut wood inlay stain hex color code
  
  // Configure layout vector settings mapping an accurate symmetrical chevron V-formation pointing down-lane
  // The central apex arrow locks exactly 15 units out at Z = -15.0, with outer flank pairs tapering back symmetrically.
  const arrowOffsets = [
    { x: 0, z: -15.0 },       // Core tracking apex center target chevron (exactly 15 units out from foul line)
    { x: -0.4, z: -14.6 }, { x: 0.4, z: -14.6 }, // First interior flank branch pairs bordering the core track
    { x: -0.8, z: -14.2 }, { x: 0.8, z: -14.2 }, // Intermediate flank branch chevron pairs widening outward
    { x: -1.2, z: -13.8 }, { x: 1.2, z: -13.8 }  // Outer wing indicator chevron marks bordering adjacent gutter tracks
  ];

  // Loop across definitions array block to assemble every target chevron indicator model into active memory
  arrowOffsets.forEach((offset) => {
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial); // Instantiate fresh independent flat triangle mesh pointer
    arrow.position.set(offset.x, 0.102, offset.z); // Align arrowhead to its matching track slot over the maple boards
    arrow.rotation.x = degrees_to_radians(-90); // Twist 90 degrees forward on X to sit flat facing skyward
    arrow.rotation.z = degrees_to_radians(30); // Rotate 30 degrees around local Z to lock the sharp vertex pointing down-lane towards negative Z
    scene.add(arrow); // Save element pointer node straight to root scene graph index list
  });
}

// Invoke lane creation module to draw physical components and indicators into the scene matrix
createBowlingLane();


// ============================================================================
// MILESTONE 4: PROCEDURAL COMPONENT PIN ASSEMBLY & TRIANGULAR DEPLOYMENT
// ============================================================================

// PROCEDURAL COMPONENT CONSTRUCTION & MATERIAL ATTRIBUTE WRAPPER
// Factory script processing composite shapes into a single complete tracking group modeling a regulation pin
function createBowlingPin() {
  // Create an independent Group node to manage transformations across all internal child meshes collectively
  const pinGroup = new THREE.Group();

  // Define highly polished white plastic coating parameters for primary pin body layers
  const pinWhiteMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,   // Pure brilliant regulation tournament white color hex
    shininess: 100     // Ultra-high specularity yields sharp glass-like reflections catching overhead rays
  });

  // Define solid vibrant red paint material shader properties to color the target tracking neck stripe bands
  const pinRedMaterial = new THREE.MeshPhongMaterial({
    color: 0xd32f2f,   // Standard crimson red tournament identifier hex color
    shininess: 100     // Matches uniform gloss coats to prevent visual fragment mismatches under lighting loops
  });

  // 8. PIN LOWER BELLY BODY COMPONENT
  // Generate a tapered cylinder primitive mapping out the wide bottom base belly curve profiles of a pin
  // Dimensions: Top circle radius (0.2), bottom base circle radius (0.13), total slice vertical height (0.55), segments (32)
  const baseGeometry = new THREE.CylinderGeometry(0.2, 0.13, 0.55, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, pinWhiteMaterial);
  // Shift center vertical position upward by half its height to sit flush over the local group pivot baseline (Y = 0)
  baseMesh.position.y = 0.275; 
  baseMesh.castShadow = true;     // Permit belly body polygons to intercept directional rays and drop shadows
  baseMesh.receiveShadow = true;  // Enable surface sections to receive ambient shadow overlays
  pinGroup.add(baseMesh);         // Inject child mesh node securely inside parent pin coordination group folder container

  // 9. PIN TAPERED SLENDER NECK COLUMN
  // Model the narrow inward-sloping neck column transitions utilizing an inverted slender cone cylinder segment
  // Dimensions: Top head join radius (0.08), bottom base join radius (0.2), segment vertical height (0.45), segments (32)
  const neckGeometry = new THREE.CylinderGeometry(0.08, 0.2, 0.45, 32);
  const neckMesh = new THREE.Mesh(neckGeometry, pinWhiteMaterial);
  // Position vertically right on top of the base mesh rim. Height center equation: base length + half neck length: 0.55 + 0.225 = 0.775.
  neckMesh.position.y = 0.775;
  neckMesh.castShadow = true;     // Attach shadow processing properties
  neckMesh.receiveShadow = true;
  pinGroup.add(neckMesh);         // Bind neck slice child straight into parent tracking coordinate group

  // 10. PIN IDENTIFICATION RED NECK STRIPE BAND
  // Assemble a thin hollow ring collar sleeve wrapping exactly around the slim center line of the white neck cylinder
  // Design Note: Inner radius expanded to 0.111 to wrap over the neck mesh cleanly without structural clipping or Z-fighting.
  // Dimensions: Top radius scale (0.111), bottom radius scale (0.125), component vertical ring stripe height (0.08), segments (32)
  // const stripeGeometry = new THREE.CylinderGeometry(0.111, 0.125, 0.08, 32);
  // const stripeMesh = new THREE.Mesh(stripeGeometry, pinRedMaterial);
  // // Center collar alignment covering the red identifier ring zone on the neck column at local height position coordinate Y = 0.75
  // stripeMesh.position.y = 0.75;
  
  // EDIT: Bumping up the radii (0.135 and 0.145) and moving the elevation up to Y = 0.83 
  // forces the red ring to sit beautifully on the outside skin of the white bottleneck.
  const stripeGeometry = new THREE.CylinderGeometry(0.135, 0.145, 0.06, 32);
  const stripeMesh = new THREE.Mesh(stripeGeometry, pinRedMaterial);
  stripeMesh.position.y = 0.83;

  
  stripeMesh.castShadow = true;   // Compute shadow maps tracking the custom colored ring stripes
  stripeMesh.receiveShadow = true;
  pinGroup.add(stripeMesh);       // Bind stripe ring component into the parent coordinate node list folder

  // 11. PIN ROUNDED HEAD CROWN CAP
  // Create a sphere geometry primitive representing the smooth spherical top head tip of the target pin
  // Dimensions: Crown sphere radius boundary (0.095 units), horizontal latitude steps (32), vertical longitude loops (32)
  const headGeometry = new THREE.SphereGeometry(0.095, 32, 32);
  const headMesh = new THREE.Mesh(headGeometry, pinWhiteMaterial);
  // Mount the head sphere right on the upper rim of the underlying neck column cylinder box. Elevation height equation: 0.55 + 0.45 = 1.0.
  headMesh.position.y = 1.0;
  headMesh.castShadow = true;     // Allow head crowns to block light tracks and calculate cast shadows
  headMesh.receiveShadow = true;
  pinGroup.add(headMesh);         // Mount rounded top crown directly inside target parent alignment group node

  // Apply a master uniform scale adjustment tweak to verify compiled output proportions match assignment metrics (~1.25 units tall)
  pinGroup.scale.set(1.15, 1.15, 1.15);

  // Return the completed integrated procedural pin group package assembly back to execution triggers
  return pinGroup;
}

// MASTER REGULATION TRIANGULAR DEPLOYMENT ARRAY CONTROLLER MODULE
function deployPinFormation() {
  // Input the precise regulation spatial setup matrix tracking grid slots supplied within your assignment manual
  // System rules map the foul line boundary at Z = 0 with target pins arrayed inside negative Z ranges over the pin deck.
  const pinPositions = [
    { x:  0.0, z: -57.000 }, // Pin 1  - Front Apex Head Pin (Positioned exactly 57 units out from foul line)
    
    { x: -0.5, z: -57.866 }, // Pin 2  - Second row left wedge boundary position
    { x:  0.5, z: -57.866 }, // Pin 3  - Second row right wedge boundary position
    
    { x: -1.0, z: -58.732 }, // Pin 4  - Third row far left pocket tracking element
    { x:  0.0, z: -58.732 }, // Pin 5  - Third row absolute heart center axis element
    { x:  1.0, z: -58.732 }, // Pin 6  - Third row far right pocket tracking element
    
    { x: -1.5, z: -59.598 }, // Pin 7  - Back row terminal left wing drop corner pin
    { x: -0.5, z: -59.598 }, // Pin 8  - Back row interior left channel deck foundation pin
    { x:  0.5, z: -59.598 }, // Pin 9  - Back row interior right channel deck foundation pin
    { x:  1.5, z: -59.598 }  // Pin 10 - Back row terminal right wing drop corner pin
  ];

  // Map across individual coordinate entries to deploy the procedural pin collections down the alley line
  pinPositions.forEach((pos) => {
    // Call our factory processing script to construct a separate, custom structural 3D pin group mesh instance
    const pinInstance = createBowlingPin();
    
    // Assign position transformations. Y elevation locks at 0.101 so the pin base mounts perfectly flush
    // on top of the composite grey pin deck layer sheet (which sits at level Y = 0.101) without sinking or floating.
    pinInstance.position.set(pos.x, 0.101, pos.z);
    
    // Mount the completed, transformed pin collection mesh directly into our primary renderable world scene node array
    scene.add(pinInstance);
  });
}

// Fire the deployment mechanism script to arrange all ten standing target pins onto the rear deck platform
deployPinFormation();


// ============================================================================
// MILESTONE 5: STATIC HIGH-POLISH POLYGON BOWLING BALL
// ============================================================================
function createStaticBowlingBall() {
  // Create an independent parent transformation Group node to bundle the core sphere and drilled finger holes together
  const ballGroup = new THREE.Group();

  // TASK 5.1: CORE GEOMETRY & HIGH SPECULARITY SHADER MATERIAL SELECTION
  // Instantiate an explicit sphere geometry primitive tracking a regulation radius size of exactly 0.45 units (0.9 diameter)
  // Sizing matrix: Bounding radius (0.45), horizontal width segments (64), vertical height loops (64) for perfect curved smoothness
  const ballGeometry = new THREE.SphereGeometry(0.45, 64, 64);
  
  // Allocate an ultra-glossy Phong material script model applying a deep reactive cosmic violet theme coat
  const ballMaterial = new THREE.MeshPhongMaterial({
    color: 0x2e0854,   // Polished deep cosmic midnight violet plum purple hexadecimal color mask selection code
    shininess: 140     // Highly elevated specularity coefficient produces crisp mirror-like glints catching room light tubes
  });

  // Compile definition settings together into our primary structural core bowling ball mesh object reference
  const ballCoreMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  
  // Configure the bowling ball core shell mesh to dynamically compute, calculate, and project crisp drop shadows
  ballCoreMesh.castShadow = true;
  
  // Allow spherical skin surfaces to receive incoming ambient environmental shadows dropped across them
  ballCoreMesh.receiveShadow = true;
  
  // Mount the primary sphere child mesh firmly inside our local bundle coordination group container folder
  ballGroup.add(ballCoreMesh);


  // TASK 5.2: ASYMMETRIC DRILL PATHS MODELING (GRIPPING HOLES)
  // Shape structure setup: Tiny dark cylinder primitives embedded slightly into the upper outer face shell of the core ball sphere.
  // Dimensions: Top radius (0.03), bottom base radius (0.03), depth drill length thickness (0.08), resolution segments (16)
  const holeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16);
  
  // Assign a completely unlit, dead matte pitch black core color index to visually simulate interior hollow hole darkness
  const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });

  // Define relative local offset positions array mapping standard asymmetric gripping configurations across the upper hemisphere skin zone
  // Coordinates are mapped as a traditional triangle: two closely spaced finger channels and one distant thumb anchor point.
  const holeLayouts = [
    { x: -0.07, y: 0.38, z: -0.20, rotX: 60, rotY: -10 }, // Grip Channel A: Middle Finger drill line (adjacent layout pair left side)
    { x:  0.07, y: 0.38, z: -0.20, rotX: 60, rotY:  10 }, // Grip Channel B: Ring Finger drill line (adjacent layout pair right side)
    { x:  0.00, y: 0.28, z:  0.32, rotX: -40, rotY:  0 }  // Grip Channel C: Traditional Thumb drill line (offset single back anchor position)
  ];

  // Loop across definitions array block to drill, align, and mount all three finger hole meshes onto the ball core
  holeLayouts.forEach((holeData) => {
    const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial); // Instantiate a distinct independent dark cylinder mesh node index
    holeMesh.position.set(holeData.x, holeData.y, holeData.z);  // Position cylinder origin point to cross and clip outer skin borders
    
    // Rotate cylinder tracks independently to point inward toward core group origin, making holes look realistically drilled
    holeMesh.rotation.x = degrees_to_radians(holeData.rotX);
    holeMesh.rotation.y = degrees_to_radians(holeData.rotY);
    
    ballGroup.add(holeMesh); // Mount dark finger gripping circle mesh asset directly into our local parent ball grouping container
  });


  // TASK 5.3: PLATFORM CENTERING & STATIONARY RUNTIME PLACEMENT
  // Placement: Align ball centered along X axis = 0. Position back on approach track at Z = 10.0 per assignment example specifications.
  // Height calculation math: Approach platform top surface sits at Y = 0.1. Bounding sphere core radius tracks at 0.45.
  // Center translation equation: Y = 0.1 (floor level) + 0.45 (radius offset) = 0.55. This forces the ball base to sit perfectly flush *on* the track.
  ballGroup.position.set(0, 0.55, 10.0);

  // Tilt the ball 45 degrees forward so all 3 holes face up at the camera
  ballGroup.rotation.x = degrees_to_radians(45);
  
  // Register the complete composite static bowling ball group system node directly into the master active scene graph collection tree
  scene.add(ballGroup);
}

// Trigger ball creation script to mount the polished stationary bowling ball onto the player approach runway
createStaticBowlingBall();


// ============================================================================
// CAMERA DESKTOP ORIENTATION VANTAGE STANDPOINT CONFIGURATION
// ============================================================================

// Initialize an empty transformation identity matrix block tracking camera vector displacements
const cameraTranslate = new THREE.Matrix4();

// Configure the allocation matrix parameters to transform spatial coordinates for user viewpoints
// Displacements: No horizontal pan (X=0), elevate camera above walkway (Y=5), pull behind player approach track (Z=12)
cameraTranslate.makeTranslation(0, 5, 12);

// Pipe compiled matrix operations into the camera container to lock down the default bowler angle viewpoint frame
camera.applyMatrix4(cameraTranslate);


// ============================================================================
// INTERACTIVE DESKTOP CONSOLE RECEPTION ACTION INTERACTION CODE
// ============================================================================

// Bind an active instance of OrbitControls monitoring human inputs covering the graphics drawing window canvas
const controls = new OrbitControls(camera, renderer.domElement);

// Instantiate a master boolean status flag determining if mouse coordinate drag tracking loops are active
let isOrbitEnabled = true;

// Evaluate alphanumeric console key events pressed down by the application client user
function handleKeyDown(e) {
  // Validate if keyboard key strokes match capitalized or lowercase character string representations of the "O" key
  if (e.key === "o" || e.key === "O") {
    // Invert the boolean state logic flag values cleanly using an algebraic logic inverse switch command
    isOrbitEnabled = !isOrbitEnabled;
  }
}

// Attach keyboard window listeners onto the primary web browser global document tree framework scope boundaries
document.addEventListener('keydown', handleKeyDown);


// ============================================================================
// VIEWPORT RESOLUTION DYNAMIC RESPONSIVENESS MODULE
// ============================================================================

// Callback routine correcting screen fraction aspect ratios when scaling or modifying browser boundaries
function onWindowResize() {
  // Recompute camera aspect ratio fractional maps to correspond with updated width and height screen space allocations
  camera.aspect = window.innerWidth / window.innerHeight;
  // Order camera projection systems to rebuild internal matrix frustum fields to avoid shape compression anomalies
  camera.updateProjectionMatrix();
  // Readjust active WebGL renderer drawing canvas pixel boundaries to fill the revised screen outline completely
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Map the window resizing trigger wrapper to listen directly to native browser system resize signal pipelines
window.addEventListener('resize', onWindowResize, false);


// ============================================================================
// FRAME REFRESH EMULATION RUNTIME LOOP SYSTEM
// ============================================================================

// Main frame clock routine updating display assets up to hardware processing refresh limits each second
function animate() {
  // Request system rendering schedules to cycle this execution method loop on the next available video frame swap
  requestAnimationFrame(animate);

  // Synchronize internal orbit status values with our master application toggle control setting state
  controls.enabled = isOrbitEnabled;
  
  // Recalculate camera position transformation properties if user mouse drag gestures match true
  controls.update();

  // Draw the completely updated scene tree node graph perspective matrix directly back onto screen canvas buffer
  renderer.render(scene, camera);
}

// Engage the engine runtime scheduling loops to launch viewport graphics draws into active, rendering states
animate();
