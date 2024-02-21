import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import bike from './bike.glb';

var canvas, scene, camera, renderer, controls
var sceneSize = {
    width: 0,
    height: 0
}

class App {
    init() {

        canvas = document.getElementById('canvas')

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

        scene = new THREE.Scene()

        sceneSize.height = window.innerHeight
        sceneSize.width = window.innerWidth

        camera = new THREE.PerspectiveCamera(60, sceneSize.width / sceneSize.height, 1, 50)
        camera.position.z = 5

        scene.add(camera);

        renderer.setSize(sceneSize.width, sceneSize.height)
        // renderer.setClearColor(0xa0a0a0)
        scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

        renderer.shadowMap.enabled = true;
        // renderer.shadowMap.autoUpdate = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(renderer.domElement);

        scene.add(camera)

        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
        scene.add(ambientLight);

        var pointLight = new THREE.PointLight(0xffffff, 1.8);
        camera.add(pointLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(- 3, 10, - 10);
        dirLight.castShadow = true
        dirLight.shadow.camera.top += -3;
        // dirLight.shadow.camera.bottom = - 2;
        // dirLight.shadow.camera.left = - 2;
        // dirLight.shadow.camera.right = 2;
        // dirLight.shadow.camera.near = 0.1;
        // dirLight.shadow.camera.far = 40;
        scene.add(dirLight)

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1.5);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);



        const geometry = new THREE.PlaneGeometry(104, 104)
        const material = new THREE.MeshPhongMaterial({
            color: 0xcbcbcb,
            // side: THREE.Side,
            depthWrite: false
        })


        let plane = new THREE.Mesh(geometry, material)
        plane.rotation.x = Math.PI / 2
        plane.rotation.y = Math.PI

        plane.position.y += -1
        plane.receiveShadow = true

        // MeshPhongMaterial



        // plane.rotation.x += 3.14

        scene.add(plane)

        const fbxLoader = new FBXLoader()
        const gltfLoader = new GLTFLoader()

        let url = new URL('../assets/models/10k.glb', import.meta.url)
        url = "" + url

        gltfLoader.load(url, function (gltf) {
            const model = gltf.scene
            model.rotation.y = Math.PI


            model.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    console.log(child)
                    console.log(child.castShadow)
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            // console.log('ddd')

            // console.log(model)

            scene.add(model)
        }, undefined, (xhr) => {
            const loadedVal = `loaded: ${Math.floor(100.0 * xhr.loaded / xhr.total)}%`;
            console.log(loadedVal);
            console.log('error')
            // document.querySelector('.loader').innerHTML = loadedVal;
        })

        const textureLoader = new THREE.TextureLoader()

        const diffuseMap = textureLoader.load('../assets/models/Korobka_10k_poly/Color_new.jpg')
        diffuseMap.colorSpace = THREE.SRGBColorSpace
        diffuseMap.wrapS = THREE.RepeatWrapping;
        console.log(diffuseMap)

        // let url2 = new URL('../assets/models/Korobka_10k_poly/casket_v06.fbx', import.meta.url)
        // url2 = "" + url2

        const tMaterial = new THREE.MeshLambertMaterial({
            color: '#B4523C',
        });

        // fbxLoader.load(url2, function (fbx) {
            // const model = fbx
            // const newCube = fbxLoader.parse(new TextEncoder().encode(fbx), );

            // console.log(fbx)

            // scene.add(fbx)

            // fbx.scale.set(0.001, 0.001, 0.001)

            // const box = new THREE.Box3();
            // box.copy(fbx.geometry.boundingBox).applyMatrix4(fbx.matrixWorld);
            // const box = new THREE.BoxHelper(fbx, 0x000000);
            // scene.add(box);

            // fbx.traverse(child => {
        //         if (child instanceof THREE.Mesh && child.name == "korobka") {
        //             console.log(child)

        //             // tMaterial.map = diffuseMap

        //             child.material[2] = tMaterial

        //         }
        //     })
        // }, undefined, (xhr) => {
        //     const loadedVal = `loaded: ${Math.floor(100.0 * xhr.loaded / xhr.total)}%`;
        //     console.log(loadedVal);
        //     console.log('error')
        //     // document.querySelector('.loader').innerHTML = loadedVal;
        // })

        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        animate()
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    controls.update();

}

export default App;