import * as three from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import * as PlayerController from './PlayerController.js';
import { loadDataFromFiles } from './loader.js';

const fov = 75;
const aspect = 2;
const near = 0.01;
const far = 1000;

let renderer, scene, camera;
let controls;

let selectedIndex = 0;
// const files = [
//     {
//         fileName: 'data/testcloud.txt',
//         displayText: document.getElementById("test"),
//         checkbox: document.getElementById("testcloudCheckbox"),
//         pointCloud: NaN,
//     },
//     {
//         fileName: 'data/apt-seq131.txt',
//         displayText: document.getElementById("131"),
//         checkbox: document.getElementById("131checkBox"),
//         pointCloud: NaN,
//     },
//     {
//         fileName: 'data/apt-seq136.txt',
//         displayText: document.getElementById("136"),
//         checkbox: document.getElementById("136checkBox"),
//         pointCloud: NaN,
//     },
//     {
//         fileName: 'data/myformat.txt',
//         displayText: document.getElementById("da2"),
//         checkbox: document.getElementById("da2box"),
//         pointCloud: NaN,
//     },
// ]

const inputFiles = [
    'data/testcloud.txt',
    'data/apt-seq131.txt',
    'data/apt-seq136.txt',
    'data/myformat.txt',
];
let files = [];


function main() {
    // force canvas to be fullscreen
    document.documentElement.style.height = '100vh';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.padding = '0';

    // create controls for each file dynamically
    const controlDiv = document.getElementById("control-div");
    inputFiles.forEach((file, index) => {
        const fileName = file.split('/').pop().replace(/\.[^/.]+$/, "");
        
        // parent div
        const fileControl = document.createElement('div');
        fileControl.style.display = 'flex';
        fileControl.style.flexDirection = 'row';
        fileControl.style.alignItems = 'center';
        fileControl.style.margin = '2px 0';
        
        // checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${fileName}Checkbox`;
        checkbox.checked = false;
        
        // label
        const text = document.createElement('p');
        text.id = fileName;
        text.style.margin = '0 0 0 5px';
        text.textContent = `(${index + 1}) ${fileName}`;
        
        fileControl.appendChild(checkbox);
        fileControl.appendChild(text);
        controlDiv.appendChild(fileControl);
        
        files[index] = {
            fileName: file,
            displayText: text,
            checkbox: checkbox,
            pointCloud: NaN
        };
    });



    // renderer
    const canvas = document.querySelector("#webgl");
    renderer = new three.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // perpsective camera
    camera = new three.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })

    // scene
    scene = new three.Scene();

    // controls
    controls = new PointerLockControls(camera, document.body);
    canvas.addEventListener('click', function () {
        controls.lock();
    });
    scene.add(controls.object);
    PlayerController.setupController();

    // switch between scenes
    document.addEventListener('keypress', function (ev) {
        if (!/^[0-9]$/.test(ev.key)) return;
        const index = Number(ev.key) - 1;
        if (index >= files.length) return

        files[index].checkbox.checked = !files[index].checkbox.checked;
        updateSceneVisibility();
    });

    // handle checkbox clicks
    files.forEach((fileData, _) => {
        fileData.checkbox.addEventListener('change', function () {
            updateSceneVisibility();
        });
    });


    // array of promises to load each file
    const loadPromises = files.map(fileData => {
        return loadDataFromFiles(fileData.fileName).then(data => {
            const pointGeometry = new three.BufferGeometry();
            pointGeometry.setAttribute('position', new three.Float32BufferAttribute(data.positions, 3));
            pointGeometry.setAttribute('color', new three.Float32BufferAttribute(data.colors, 3));

            const pointMaterial = new three.PointsMaterial({
                size: 5,
                sizeAttenuation: false,
                vertexColors: true
            });

            fileData.pointCloud = new three.Points(pointGeometry, pointMaterial);
        });
    });

    // start rendering after all promises get resolved (so after all files have been loaded)
    Promise.all(loadPromises).then(() => {
        console.log("all point clouds loaded");
        scene.add(files[selectedIndex].pointCloud);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    });

}


let lastCalledTime, fps, delta;
let fpsCounter = document.getElementById("fpsCounter");
function render(time) {
    time *= 0.001;
    PlayerController.movePlayer(controls);

    renderer.render(scene, camera);

    //fps counter code from https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
    } else {
        delta = (Date.now() - lastCalledTime) / 1000;
        lastCalledTime = Date.now();
        fps = 1 / delta;
    }

    fpsCounter.innerText = "FPS: " + fps.toFixed(3);

    requestAnimationFrame(render);
}


//update scene visibility based on checkbox states
function updateSceneVisibility() {
    files.forEach(file => {
        if (file.checkbox.checked)
            scene.add(file.pointCloud);
        else
            scene.remove(file.pointCloud);
    });
}


main();