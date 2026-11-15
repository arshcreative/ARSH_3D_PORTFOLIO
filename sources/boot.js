const panel = document.querySelector('#startup')
const message = document.querySelector('#startup-message')
const detail = document.querySelector('#startup-detail')
const retry = document.querySelector('#startup-retry')
const url = new URL(location.href)
const usingWebGPU = url.searchParams.get('renderer') === 'webgpu'
let finished = false

retry.textContent = usingWebGPU ? 'Try WebGL instead' : 'Try WebGPU instead'
retry.addEventListener('click', () => {
    url.searchParams.set('renderer', usingWebGPU ? 'webgl' : 'webgpu')
    location.href = url.href
})

function showFailure(text, error) {
    if (finished) return
    message.textContent = text
    retry.hidden = false
    if (error) {
        detail.hidden = false
        detail.textContent = String(error.message ?? error).slice(0, 230)
    }
}

const timer = setTimeout(() => showFailure('The full island is still loading. You can keep waiting or switch renderers.'), 18000)
window.addEventListener('arsh:ready', () => {
    finished = true
    clearTimeout(timer)
    panel.hidden = true
}, { once: true })
window.addEventListener('arsh:error', event => {
    clearTimeout(timer)
    showFailure('The full island could not start in this browser.', event.detail)
})
import('./index.js').catch(error => {
    console.error('ARSH 3D startup import failed', error)
    clearTimeout(timer)
    showFailure('The full island could not load its startup files.', error)
})
