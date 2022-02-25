import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

import { getSpaceSector } from './graphql.js';
import PlanetGenerator from './PlanetGenerator.js';

let renderer, scene, camera, controls, raycaster, clientX, clientY, isCursorChunk, cursorChunk, currChunk;

let spaceState = {}
let renderDistance = 50;
let isCursor = true;
let isIntersect = false;
let isInfo = true;
let isNav = true;
let isPortal = true;
let isOptions = false;

const information = document.getElementById("information");
const close_info = document.getElementById("close-info");
const hover_info = document.getElementById('hover-info');
const hover_img = document.getElementById('hover-img');
const hover_text = document.getElementById('hover-text');
const nav_menu = document.getElementById('nav-menu');
const close_nav = document.getElementById('close-nav');
const toggle_options = document.getElementById('toggle-options');
const toggle_cursor = document.getElementById('toggle-cursor');
const toggle_borders = document.getElementById('toggle-borders');
const options = document.getElementById('options');

document.addEventListener('DOMContentLoaded',
   () => { setTimeout(() => { document.getElementById('loading-screen').style.display = 'none' }, 2000); }
);

function initScene () {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('map').appendChild(renderer.domElement);

    // ============= setup the scene =============
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // ============= setup the camera =============
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(10, 10, 10);
    scene.add(camera);

    // ============= setup resize listener ==========
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // ============= setup controls =============
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 20;
    controls.minDistance = 1;
    controls.enablePan = false;

    // ============= setup light =============
    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    // ============ setup raycaster ================
    raycaster = new THREE.Raycaster();
    document.addEventListener('mousemove', onDocumentMouseMove);

    // ======= setup the cursor ======
    cursorChunk = emptyChunk(0, 0, 0)
    currChunk = cursorChunk.position.clone();
    isCursorChunk = true;
    toggleCursorChunk();
}

async function loadSector (x, y ,z) {
    // get the state of that sector
    const newChunks = await getSpaceSector(  
        x-renderDistance, 
        x+renderDistance, 
        y-renderDistance, 
        y+renderDistance, 
        z-renderDistance, 
        z+renderDistance
    )

    const keys = Object.keys(newChunks)
    keys.forEach(key => {
        if(typeof spaceState[key] === "undefined"){
            try { renderChunk(newChunks[key]) } 
            catch (error) { console.log(error) }
        }
    });

    // update the space state
    spaceState = {...spaceState, ...newChunks}
}

function removeOutOfRange(x, y, z) { 
    for(var i=0; i<scene.children.length ;i++){
        const child = scene.children[i]
        if(typeof child.chunk !== 'undefined'){
            const location = child.chunk;
            if(
                location.x > x+renderDistance ||
                location.x < x-renderDistance ||
                location.y > y+renderDistance ||
                location.y < y-renderDistance ||
                location.z > z+renderDistance ||
                location.z < z-renderDistance
            ){
                scene.remove(child)
                delete spaceState[ID(location.x, location.y, location.z)]
                i--;
            }
        }
    }
}

function IPFS(CID) { return `https://ipfs.io/ipfs/${CID}` }
function ID(x, y, z) { return `${x},${y},${z}` }

// glb loader
function GLBSpawner (path, x, y, z) {
    const loader = new GLTFLoader();
    loader.load( path,  (object) => {
        object.scene.position.set(x, y, z);
        var helper = new THREE.BoxHelper(object.scene, 0xffffff)
        helper.update()
        
        var rad = helper.geometry.boundingSphere.radius 
        if(rad > 1 && ID(x,y,z) != ID(0,0,0)){
            object.scene.scale.x = object.scene.scale.x / rad;
            object.scene.scale.y = object.scene.scale.y / rad;
            object.scene.scale.z = object.scene.scale.z / rad;
        }
        object.scene.chunk = new THREE.Vector3(x, y, z);
        object.scene.source = 'gltf'
        scene.add(object.scene)
    })
}

// Planet generator
function PlanetSpawner(x, y, z) {
    scene.add(PlanetGenerator.spawn(x,y,z));
}

function renderChunk(objData) {
    if (objData.planet !== "") {
        GLBSpawner(IPFS(objData.planet),
            objData.location.x,
            objData.location.y,
            objData.location.z)
    }
    else {
        PlanetSpawner(objData.location.x,
            objData.location.y,
            objData.location.z)
    }
}

// create an empty chunk for the cursor
function emptyChunk(x, y, z) {
    var c;
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const color = (new THREE.Color()).setHSL(1, 1, 0);
    const material = new THREE.MeshPhongMaterial({
        color,
        opacity: 0.25,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const cube = new THREE.Mesh(cubeGeo, material);
    cube.position.set(x, y, z);
    c = cube;

    const edges = new THREE.EdgesGeometry(cubeGeo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    line.position.set(x, y, z);

    const group = new THREE.Group();
    group.add(line);
    group.add(c);
    scene.add(group);
    return group;
}


//update mouse mouvement
function onDocumentMouseMove(event) {
    event.preventDefault();
    clientX = event.clientX;
    clientY = event.clientY;
    hover_info.style.left = event.pageX + 'px';
    hover_info.style.top = event.pageY + 'px';
}

// ============= setup onclick listener ===================
document.getElementById('map').addEventListener('mousedown', onDocumentMouseDown);
function onDocumentMouseDown( event ) {    
    event.preventDefault();
    var res = getIntersect(event.clientX, event.clientY)

    if ( res ) {
        safeMove(res.x, res.y, res.z);
    }
}

function updateHover() {
    const res = getIntersect(clientX, clientY);
    if (res && !isIntersect) {
        const projectInfo = spaceState[ID(res.x, res.y, res.z)]
        hover_info.style.display = 'block';
        if (projectInfo.logo.length != 46) { hover_img.src = projectInfo.logo } else { hover_img.src = IPFS(projectInfo.logo) }
        hover_text.innerHTML = projectInfo.name;
        isIntersect = true;
    } else {
        if (typeof res == 'undefined' && isIntersect) {
            hover_info.style.display = 'none';
            isIntersect = false;
        }
    }
}


function getIntersect(x, y) {
    var mouse3D = new THREE.Vector3(  
        x / window.innerWidth * 2 - 1,   
        y / window.innerHeight * -2 + 1,  
        0.5 
    ); 
    raycaster.setFromCamera( mouse3D, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    
    if (intersects.length > 0) {
        let object = intersects[0].object;
        try {
            while (!object.chunk) { object = object.parent }
        } catch (e) { return undefined }
        return object.chunk;
    }
}














let oldTarget = new THREE.Vector3();
let cameraTransitionFrames = -1;
let originalCameraPos, targetCameraPos, originalTargetPos, targetTargetPos;

function moveOrbit(x, y, z) {
    const location = new THREE.Vector3(x, y, z);
    if (camera.position.distanceTo(location) <= 5 && oldTarget.equals(location)) {
        return;
    }
    const toLocation = location.clone().sub(camera.position).normalize();
    if (camera.position.distanceTo(location) > 5 || !oldTarget.equals(location)) {
        originalCameraPos = camera.position.clone();
        targetCameraPos = camera.position.clone().add(toLocation.multiplyScalar(location.clone().sub(camera.position).length() - 10));
    } 
    else {
        originalCameraPos = camera.position.clone();
        targetCameraPos = camera.position.clone();
    }

    originalTargetPos = controls.target.clone();
    targetTargetPos = location.clone();
    cameraTransitionFrames = 60;
    oldTarget = location;
}

function updateCamera() {
    if (cameraTransitionFrames > 0) {
        if(cameraTransitionFrames == 60 && isPortal) { togglePortal() }
        camera.position.copy(originalCameraPos.clone().lerp(targetCameraPos, THREE.Math.smootherstep(1 - cameraTransitionFrames / 60, 0, 1)));
        controls.target.copy(originalTargetPos.clone().lerp(targetTargetPos, THREE.Math.smootherstep(1 - cameraTransitionFrames / 60, 0, 1)));
        cameraTransitionFrames--;
        if(cameraTransitionFrames == 1 && !isPortal) { togglePortal() }
    }
}

document.getElementById('move-cursor').addEventListener("click", navigate);
function navigate() {
    var x = parseInt(document.getElementById("cursor-control-x").value);
    var y = parseInt(document.getElementById("cursor-control-y").value);
    var z = parseInt(document.getElementById("cursor-control-z").value);
    safeMove(x, y, z);
}




async function safeMove (x, y, z) {
    // console.log("safeMove to: "+x+" "+y+" "+z)

    document.getElementById("cursor-control-x").value = x;
    document.getElementById("cursor-control-y").value = y;
    document.getElementById("cursor-control-z").value = z;
    
    cursorChunk.position.set(x, y, z);

    moveOrbit(x, y, z)

    await loadSector(x, y, z)

    displayInfo(x, y, z)
    
    removeOutOfRange(x, y, z)

    //save the location
    localStorage.setItem('lastLocation', ID(x, y, z));
}














document.getElementById('close-info').addEventListener("click", closeInfo);
document.getElementById('close-portal').addEventListener("click", togglePortal);
document.getElementById('open-portal').addEventListener("click", togglePortal);
document.getElementById('change-render-distance').addEventListener("click", changeRenderDistance);
close_nav.addEventListener("click", toggleNav);
toggle_options.addEventListener("click", toggleOptions);
toggle_cursor.addEventListener("click", toggleCursor);
toggle_borders.addEventListener("click", toggleCursorChunk);

function closeInfo() {
    if (isInfo) {
        information.innerHTML = "join our <a href='https://discord.gg/MQ5dPHxCJ9' target='_blank'>Discord</a> community!";
        close_info.style.top = "55px";
        close_info.innerHTML = "+";
    } else {
        information.innerHTML = "To learn more about the Spacetime Meta Project and join the discussion about decentralized Metaverse, join our <a href='https://discord.gg/MQ5dPHxCJ9' target='_blank'>Discord</a> community!<br><br>Add your project to the map! Let the world know you will be Metaverse compatible! Become a Spacetime Meta partner today.";
        close_info.style.top = "270px";
        close_info.innerHTML = "-";
    }
    isInfo = !isInfo;
}
closeInfo()

function toggleNav() {
    if (isNav) {
        nav_menu.style.display = 'none';
        close_nav.style.left = "0";
        close_nav.style.bottom = "2px";
        close_nav.style.width = "75px";
        close_nav.innerHTML = "Menu";
    } else {
        if (isOptions) { toggleOptions() }
        nav_menu.style.display = 'block';
        close_nav.style.left = "251px";
        close_nav.style.bottom = "135px";
        close_nav.style.width = "20px";
        close_nav.innerHTML = "X";

    }
    isNav = !isNav
}

function toggleOptions() {
    if (!isOptions) {
        toggle_options.innerHTML = 'Options -';
        nav_menu.style.height = '350px';
        close_nav.style.bottom = "325px";
        options.style.display = 'block';
    } else {
        nav_menu.style.height = '160px';
        close_nav.style.bottom = "135px";
        toggle_options.innerHTML = 'Options +';
        options.style.display = 'none';
    }
    isOptions = !isOptions
}

function toggleCursor() {
    isCursor = !isCursor;
    hover_info.style.display = 'none';
}

function togglePortal() {
    if (isPortal) {
        document.getElementById('portal').style.display = "none";
        document.getElementById('point_1').style.display = "none";
        document.getElementById('point_2').style.display = "none";
        document.getElementById('point_3').style.display = "none";
        document.getElementById('point_4').style.display = "none";
        document.getElementById('point_5').style.display = "none";
        document.getElementById('close-portal').style.display = "none";
        document.getElementById('open-portal').style.display = "block";
        document.getElementById('enter-link').style.display = "block";
    } else {
        document.getElementById('portal').style.display = "block";
        document.getElementById('point_1').style.display = "block";
        document.getElementById('point_2').style.display = "block";
        document.getElementById('point_3').style.display = "block";
        document.getElementById('point_4').style.display = "block";
        document.getElementById('point_5').style.display = "block";
        document.getElementById('close-portal').style.display = "block";
        document.getElementById('open-portal').style.display = "none";
        document.getElementById('enter-link').style.display = "none";
    }
    isPortal = !isPortal;
}

function displayInfo(x, y, z) {
    var projectData = spaceState[ID(x, y, z)];
    if (typeof projectData !== 'undefined') {
        // display link info
        document.getElementById('prtl-img').style.display = "block"
        if (projectData.image.length != 46) { document.getElementById('prtl-img').src = projectData.image; } else { document.getElementById('prtl-img').src = IPFS(projectData.image); }
        document.getElementById('enter').innerHTML = "Enter";
    } else {
        // display default chunk data
        document.getElementById('prtl-img').style.display = "none";
        document.getElementById('enter').innerHTML = "Empty Chunk";
        document.getElementById('enter-link').innerHTML = "Empty Chunk"
        // if (!isCursorChunk) { toggleCursorChunk() }
    }
}

function toggleCursorChunk() {
    if (isCursorChunk) { scene.remove(cursorChunk) } 
    else { scene.add(cursorChunk) }
    isCursorChunk = !isCursorChunk
}

function changeRenderDistance() {
    renderDistance = parseInt(document.getElementById('render-distance').value);

    let savedLoc = getSavedLocation();
    safeMove(parseInt(savedLoc[0]), parseInt(savedLoc[1]), parseInt(savedLoc[2]));
}





















document.getElementById("portal").addEventListener("click", followLink)
function followLink () {
    const loc = getSavedLocation()
    window.top.postMessage(
        JSON.stringify({
            error: false,
            message: {
                link: spaceState[ID(loc[0],loc[1],loc[2])].portal
            }
        }),
        '*'
    );
}























function getSavedLocation() {
    if (localStorage.getItem('lastLocation') != null) {
        return localStorage.getItem('lastLocation').split(',')
    } else { return [0, 0, 0]; }
}

initScene();
let savedLoc = getSavedLocation();
safeMove(parseInt(savedLoc[0]), parseInt(savedLoc[1]), parseInt(savedLoc[2]));


function animate() {
    updateCamera()
    if (isCursor) { updateHover(); }

    scene.children.forEach(child => {
        if(child.source === 'generator'){
            PlanetGenerator.update(child)
        }
    })

    controls.update()
    renderer.render(scene, camera)
    
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);