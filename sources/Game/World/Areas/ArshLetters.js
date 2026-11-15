import * as THREE from 'three/webgpu'

const outlines = {
    A: ['0,0 3,10 7,10 10,0 7.1,0 6.4,2.6 3.6,2.6 2.9,0', '4.25,5 5.75,5 5,7.8'],
    R: ['0,0 0,10 6.3,10 8.2,9.3 9.3,7.8 9.3,5.6 7.9,4.1 6.9,3.8 10,0 6.8,0 3.3,4 2.8,4 2.8,0', '2.8,6.3 6.4,6.3 6.4,7.7 2.8,7.7'],
    S: ['0,2 2,2.9 3.1,2.15 6.8,2.15 7.4,2.85 7.2,3.7 1.9,4.5 .4,5.7 .4,8 2.1,10 7.8,10 9.8,8.2 7.9,6.8 6.6,7.8 3.7,7.8 3.1,7.3 3.2,6.7 8.2,5.9 9.8,4.8 10,2.1 8.1,0 2,0'],
    H: ['0,0 0,10 2.8,10 2.8,6.2 7.2,6.2 7.2,10 10,10 10,0 7.2,0 7.2,3.8 2.8,3.8 2.8,0'],
    3: ['0,0 0,2.35 6.8,2.35 7.4,3 6.8,3.75 3,3.75 3,6.05 6.8,6.05 7.4,6.9 6.8,7.65 0,7.65 0,10 8,10 9.9,8.35 9.9,6.5 8.4,5 9.9,3.5 9.9,1.6 8,0'],
    D: ['0,0 0,10 5.8,10 8.5,8.7 10,6.75 10,3.25 8.5,1.3 5.8,0', '2.8,2.4 5.4,2.4 7.2,3.9 7.2,6.1 5.4,7.6 2.8,7.6']
}

export function makeArshLetter(character)
{
    const contours = outlines[character]
    if(!contours) return null
    const shape = new THREE.Shape()
    for(const [index, contour] of contours.entries())
    {
        const path = index === 0 ? shape : new THREE.Path()
        for(const [point, pair] of contour.split(' ').entries())
        {
            const [x,y] = pair.split(',').map(Number)
            if(point === 0) path.moveTo(x * .125, y * .153)
            else path.lineTo(x * .125, y * .153)
        }
        path.closePath()
        if(index > 0) shape.holes.push(path)
    }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .43, bevelEnabled: true, bevelSize: .024, bevelThickness: .024, bevelSegments: 1 })
    geometry.center()
    const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertNodeMaterial({ color: '#ff96dc' }))
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
}
