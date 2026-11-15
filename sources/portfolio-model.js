import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export async function mountModel(container, url, active) {
    const renderer = new THREE.WebGLRenderer({ antialias:true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#151923')
    const cleanup = () => {
        renderer.setAnimationLoop(null)
        scene.traverse(node => {
            node.geometry?.dispose()
            for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
                if (!material) continue
                for (const value of Object.values(material)) if (value?.isTexture) value.dispose()
                material.dispose()
            }
        })
        renderer.dispose()
    }
    try {
        const gltf = await new GLTFLoader().loadAsync(url)
        scene.add(gltf.scene)
        if (!active()) { cleanup(); return }
        const bounds = new THREE.Box3().setFromObject(gltf.scene)
        const radius = Math.max(.01,bounds.getBoundingSphere(new THREE.Sphere()).radius)
        const center = bounds.getCenter(new THREE.Vector3())
        const camera = new THREE.PerspectiveCamera(36,1,radius/100,radius*80)
        camera.position.copy(center).add(new THREE.Vector3(1.65,.9,3).multiplyScalar(radius))
        scene.add(new THREE.HemisphereLight(0xe5eefc,0x5a4958,2.4))
        const key = new THREE.DirectionalLight(0xffead4,3)
        key.position.copy(camera.position)
        scene.add(key)
        const controls = new OrbitControls(camera,renderer.domElement)
        controls.target.copy(center)
        controls.enableDamping = true
        controls.update()
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))
        container.append(renderer.domElement)
        container.hidden = false
        const resize = () => {
            const w = Math.max(container.clientWidth,1), h = Math.max(container.clientHeight,1)
            renderer.setSize(w,h,false)
            camera.aspect = w/h
            camera.updateProjectionMatrix()
        }
        const observer = new ResizeObserver(resize)
        observer.observe(container)
        resize()
        const mixer = new THREE.AnimationMixer(gltf.scene)
        if(gltf.animations.length) mixer.clipAction(gltf.animations[0]).play()
        let last = performance.now()
        renderer.setAnimationLoop(now => {
            mixer.update(Math.min(.05,(now-last)/1000))
            last = now
            controls.update()
            renderer.render(scene,camera)
        })
        return () => { observer.disconnect(); controls.dispose(); mixer.stopAllAction(); cleanup() }
    } catch(error) {
        cleanup()
        throw error
    }
}
