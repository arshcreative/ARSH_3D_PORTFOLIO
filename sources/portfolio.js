import './style/portfolio.css'
import projects from './data/portfolio-catalog.js'
import linkedIn from './data/linkedin.js'
import discord from './data/discord.js'
import email from './data/email.js'

document.querySelector('#linkedin').href = linkedIn
document.querySelector('#discord').href = discord
document.querySelector('#email').href = email

const section = document.querySelector('#cards')
const filters = document.querySelector('#filters')
const count = document.querySelector('#count')
const dialog = document.querySelector('#project')
const film = document.querySelector('#film')
const hero = document.querySelector('#hero')
const viewer = document.querySelector('#viewer')
const video = document.querySelector('#project-video')
const actions = document.querySelector('#model-actions')
const status = document.querySelector('#model-status')
let generation = 0
let disposeModel

function textElement(tag, value, className) {
    const element = document.createElement(tag)
    element.textContent = value
    if (className) element.className = className
    return element
}

function stopModel() {
    generation++
    disposeModel?.()
    disposeModel = undefined
    viewer.replaceChildren()
    viewer.hidden = true
    if (video.hasAttribute('src')) {
        video.pause()
        video.removeAttribute('src')
        video.load()
    }
    video.hidden = true
    hero.hidden = false
    status.textContent = ''
}

function showProject(project) {
    stopModel()
    document.querySelector('#project-title').textContent = project.title
    document.querySelector('#project-tags').textContent = project.categories.join(' · ')
    film.replaceChildren()
    actions.replaceChildren()
    const showImage = (file,index) => {
        stopModel()
        hero.src = './projects/images/' + file
        hero.alt = project.title + ', view ' + (index + 1)
        for (const [i,button] of [...film.children].entries()) button.setAttribute('aria-pressed',String(index===i))
    }
    for(const [index,file] of project.images.entries()) {
        const button = document.createElement('button')
        button.setAttribute('aria-label','View image ' + (index + 1))
        const image = new Image()
        image.src = './projects/images/' + file
        image.loading = 'lazy'
        image.alt = ''
        button.append(image)
        button.addEventListener('click',() => showImage(file,index))
        film.append(button)
    }
    const cover = project.images.indexOf(project.cover)
    showImage(project.cover,cover)
    for (const [index,file] of (project.videos ?? []).entries()) {
        const button = textElement('button',project.videos.length > 1 ? 'Video ' + (index + 1) : 'Watch project video')
        button.addEventListener('click', () => {
            stopModel()
            hero.hidden = true
            video.hidden = false
            video.src = './projects/videos/' + file
            for (const item of film.children) item.setAttribute('aria-pressed','false')
        })
        actions.append(button)
    }
    if (project.model) {
        const button = textElement('button','Inspect 3D model')
        button.addEventListener('click',async () => {
            stopModel()
            const token = generation
            status.textContent = 'Loading 3D model…'
            try {
                const { mountModel } = await import('./portfolio-model.js')
                if (token !== generation) return
                const dispose = await mountModel(viewer,'./projects/models/' + project.model,() => token === generation)
                if (token !== generation) return
                disposeModel = dispose
                status.textContent = 'Drag to orbit · Scroll to zoom'
                hero.hidden = true
                viewer.hidden = false
            } catch {
                if (token === generation) status.textContent = '3D preview unavailable in this browser. The rendered views are available above.'
            }
        })
        actions.append(button)
    }
    if (!dialog.open) dialog.showModal()
}

function render(category) {
    section.replaceChildren()
    const visible = category === 'All' ? projects : projects.filter(project => project.categories.includes(category))
    count.textContent = visible.length + (visible.length === 1 ? ' project' : ' projects')
    for (const project of visible) {
        const card = document.createElement('button')
        card.className = 'card'
        const image = new Image()
        image.src = './projects/images/' + project.cover
        image.alt = ''
        image.loading = 'lazy'
        const meta = textElement('div',project.categories.join(' · '),'tag')
        card.append(image,textElement('h2',project.title),meta)
        card.addEventListener('click', () => showProject(project))
        section.append(card)
    }
    for (const button of filters.children) button.setAttribute('aria-pressed',String(button.textContent === category))
}

for (const category of ['All','Characters','Weapons','Modeling','Texturing','Rigging']) {
    const filter = textElement('button',category)
    filter.addEventListener('click',() => render(category))
    filters.append(filter)
}
document.querySelector('#close').addEventListener('click',() => dialog.close())
dialog.addEventListener('close',stopModel)
render('All')
const requested = new URL(location.href).searchParams.get('project')
const project = projects.find(item => item.id === requested)
if (project) showProject(project)
