import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

// Get html element
const canvasEl = document.getElementById("canvas")

/*
* Get size for window application 
*/
const sizes = {
    width: window.innerWidth,
    height: innerHeight
}

window.addEventListener("resize", () => {
    // Get width and height from browser
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera with new aspec ratio
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)

    // Fix if user moves window between screens with different aspect ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/* 
* Scene
*/
const scene = new THREE.Scene()


/*
* Textures and Materials
*/
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load("/textures/matcaps/3.png")
matcapTexture.colorSpace = THREE.SRGBColorSpace // matcap is incoded in SRGB colourspace 
const masterMaterial = new THREE.MeshMatcapMaterial( {matcap: matcapTexture} )


/*
* Scattered donuts
*/
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

for (let i = 0; i<100; i++) {
    const donut = new THREE.Mesh(donutGeometry, masterMaterial)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI // use Math.PI*2 if you needed full rotation
    donut.rotation.y = Math.random() * Math.PI 

    const donusScale = Math.random() + 0.02 
    donut.scale.set(donusScale, donusScale, donusScale)

    scene.add(donut)
}


/*
* Fonts
*/ 
const fontLoader = new FontLoader()

fontLoader.load(
    "/fonts/helvetiker_regular.typeface.json",
    (font) => {
        const textGeometry = new TextGeometry(
            "Daft Punk",
            { 
                font, 
                size: 0.5,
                depth: 0.2, 
                curveSegments: 12,
                bevelEnabled: true, 
                bevelThickness: 0.03,
                bevelSize: 0.02, 
                bevelOffset: 0, 
                bevelSegments: 3 
            }
        )
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial( { matcap: matcapTexture} )
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)


/*
* Camera
*/ 
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 200)
camera.position.set(0, 0, 5)

/*
* Renderer
*/ 
const renderer = new THREE.WebGLRenderer( {canvas: canvasEl, antialias: true} )
renderer.setSize(sizes.width, sizes.height)

const controller = new OrbitControls(camera, canvasEl)
controller.enableDamping = true

const tick = () => {
    controller.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
