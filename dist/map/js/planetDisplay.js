import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

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

const hover_info = document.getElementById('hover-info');
const hover_img = document.getElementById('hover-img');
const hover_text = document.getElementById('hover-text');

document.addEventListener('DOMContentLoaded',
   () => { setTimeout(() => { document.getElementById('loading-screen').style.display = 'none' }, 500); }
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
    if (objData.icon.type == '.gltf') {
        GLBSpawner(IPFS(objData.icon.gltf),
            objData.location.x,
            objData.location.y,
            objData.location.z)
    }
    if (objData.icon.type == 'gen') {
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

document.getElementById('close-portal').addEventListener("click", togglePortal);
function togglePortal() {
    if (isPortal) {
        document.getElementById('portal').style.display = "none";
        document.getElementById('point_1').style.display = "none";
        document.getElementById('point_2').style.display = "none";
        document.getElementById('point_3').style.display = "none";
        document.getElementById('point_4').style.display = "none";
        document.getElementById('point_5').style.display = "none";
        document.getElementById('close-portal').style.display = "none";
    } else {
        document.getElementById('portal').style.display = "block";
        document.getElementById('point_1').style.display = "block";
        document.getElementById('point_2').style.display = "block";
        document.getElementById('point_3').style.display = "block";
        document.getElementById('point_4').style.display = "block";
        document.getElementById('point_5').style.display = "block";
        document.getElementById('close-portal').style.display = "block";
    }
    isPortal = !isPortal;
}

function displayInfo(x, y, z) {
    var projectData = spaceState[ID(x, y, z)];
    if (typeof projectData !== 'undefined') {
        // display link info
        document.getElementById('prtl-img').style.display = "block"
        if (projectData.img.length != 46) { document.getElementById('prtl-img').src = projectData.img; } else { document.getElementById('prtl-img').src = IPFS(projectData.img); }
        document.getElementById('portal').href = projectData.prtl;
        document.getElementById('enter').innerHTML = "Enter";
    } else {
        // display default chunk data
        document.getElementById('prtl-img').style.display = "none"
        document.getElementById('portal').href = "";
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


window.addEventListener("message", (event) => {
    for(var i=0; i<scene.children.length ;i++){
        const child = scene.children[i]
        if(typeof child.chunk !== 'undefined'){
            const location = child.chunk;
            scene.remove(child)
            delete spaceState[ID(location.x, location.y, location.z)]
            i--;
        }
    }
    
    try {
        const data = JSON.parse(event.data)
        // console.log(data.message)
        spaceState[ID('0','0','0')] = {
            "name": data.message.name === "" ? "Cool Planet" : data.message.name ,
            "img": data.message.image === "" ? "QmQ52o7KZJ6kGKt9cjuzJd1KtJ64pYQrUsPKKb52JM17hp" : data.message.image,
            "logo": data.message.logo === "" ? "QmfD8B3U5pzKDxV5XC2SbmysVWUwDvQ4eVLrZuUfJMBGEt" : data.message.logo,
            "prtl": data.message.portal === "" ? "https://spacetime-meta.github.io/spawn-planet/" : data.message.portal,
            "location": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "icon": {}
        }
        if(data.message.planet === ""){
            spaceState[ID('0','0','0')]['icon'].type = 'gen';
        } else {
            spaceState[ID('0','0','0')]['icon'].type = '.gltf';
            spaceState[ID('0','0','0')]["icon"]["gltf"] = data.message.planet;
        }
        
        
        renderChunk(spaceState[ID('0','0','0')])
        displayInfo(0,0,0)
        if(isCursorChunk){ toggleCursorChunk() }
        if(!isPortal){ togglePortal() }
    } catch (e) {}
})

initScene();
togglePortal();


function animate() {
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