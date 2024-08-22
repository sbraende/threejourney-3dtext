import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"
// import typefont from "three/examples/fonts/helvetiker_regular.typeface.json" // Default font
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

const canvasEl = document.getElementById("canvas")
const gui = new GUI()

const sizes = {
    "width": 1024,
    "height": 1024
}


/* 
* Scene
*/
const scene = new THREE.Scene()

/* 
* Material
*/ 
const material = new THREE.MeshBasicMaterial( {color: "red"} )

/*
* Texture loader
*/
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load("/textures/matcaps/3.png")
matcapTexture.colorSpace = THREE.SRGBColorSpace // matcap is incoded in SRGB colourspace 



/*
* Torus
*/
console.time("donuts") // used to time how long a section of JS takes
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial() // Could use same mat on donut and text
donutMaterial.matcap = matcapTexture
donutMaterial.colorSpace = THREE.SRGBColorSpace

for (let i = 0; i<100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI // use Math.PI*2 if you needed full rotation
    donut.rotation.y = Math.random() * Math.PI * 2 

    const donusScale = Math.random()
    donut.scale.set(donusScale, donusScale, donusScale)

    scene.add(donut)
}

console.timeEnd("donuts") // used to time how long a section of JS takes

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
                font: font, // We can use 'font' shorthand instead of writing 'font: font'
                size: 0.5,
                depth: 0.2, 
                curveSegments: 6, // How many segments cicular forms (eg. e)
                bevelEnabled: true, 
                bevelThickness: 0.03,
                bevelSize: 0.02, 
                bevelOffset: 0, 
                bevelSegments: 3 // Keep to minimum
            }
        )

        /*
        * How to center text with the use of boundingbox
        */

        // We translate the geometry by half of the max boundingbox to center the text to its pivot. 
        // We have to correct for bevel size to get exact center
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Correct for bevelSize
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Correct for bevelSize
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Correct for bevelThickness
        // )
        // console.log(textGeometry.boundingBox)

        /*
        * Or use this
        */
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial( { matcap: matcapTexture} )
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)


    }
)
// const textMesh = new THREE.Mesh(textGeometry, material)
// scene.add(textMesh)


// Cam
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height)
camera.position.set(0, 0, 5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer( {"canvas": canvasEl, antialias: true} )
renderer.setSize(sizes.width, sizes.height)

// Controller
const controller = new OrbitControls(camera, canvasEl)
controller.enableDamping = true

// Clock
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controller.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
