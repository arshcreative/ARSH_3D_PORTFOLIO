import * as THREE from 'three/webgpu'
import { texture, uv } from 'three/tsl'

export function fitImage(width, height, frameWidth, frameHeight) {
    const scale = Math.min(frameWidth / width, frameHeight / height)
    const w = width * scale
    const h = height * scale
    return [(frameWidth - w) / 2, (frameHeight - h) / 2, w, h]
}

export function createBoardImages(mesh, directory) {
    const canvas = document.createElement('canvas')
    canvas.width = 960
    canvas.height = 540
    const context = canvas.getContext('2d')
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    // The board's authored glTF UVs use the same origin as its original KTX textures.
    map.flipY = false
    map.minFilter = THREE.LinearFilter
    map.magFilter = THREE.LinearFilter
    map.generateMipmaps = false
    const material = new THREE.MeshBasicNodeMaterial({ toneMapped: false })
    material.colorNode = texture(map, uv()).rgb
    mesh.material = material
    mesh.castShadow = false
    mesh.receiveShadow = false
    mesh.visible = false

    let selected
    let request = 0
    const backdrop = () => {
        context.fillStyle = '#20212b'
        context.fillRect(0, 0, canvas.width, canvas.height)
    }
    function show(key) {
        if (!key || selected === key) return
        selected = key
        const current = ++request
        backdrop()
        map.needsUpdate = true
        mesh.visible = true
        const image = new Image()
        image.onload = () => {
            if (current !== request) return
            backdrop()
            context.drawImage(image, ...fitImage(image.naturalWidth, image.naturalHeight, canvas.width, canvas.height))
            map.needsUpdate = true
        }
        image.onerror = () => {
            if (current !== request) return
            selected = undefined
            context.fillStyle = '#f6eaff'
            context.font = '28px sans-serif'
            context.textAlign = 'center'
            context.fillText('Image unavailable. Open the project gallery for more views.', canvas.width / 2, canvas.height / 2)
            map.needsUpdate = true
        }
        image.src = directory + '/' + key
    }
    return { show }
}
