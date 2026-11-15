import './threejs-override.js'
import { Game } from './Game/Game.js'
import consoleLog from './data/consoleLog.js'
import linkedIn from './data/linkedin.js'
import discord from './data/discord.js'
import email from './data/email.js'
fetch('./portfolio.json').then(response => response.json()).then(data =>
{
    const container = document.querySelector('#arsh-contact-links')
    for(const [label, value] of Object.entries({ ...(data.contacts ?? {}), LinkedIn: linkedIn, Discord: discord, Email: email }))
    {
        try
        {
            const url = new URL(value)
            if(!['https:', 'mailto:'].includes(url.protocol)) continue
            const link = document.createElement('a')
            const icon = { LinkedIn: 'linkedin', Discord: 'discord', Email: 'email' }[label]
            if(icon)
            {
                const mark = document.createElement('img')
                mark.src = './ui/' + icon + '.svg'
                mark.alt = ''
                mark.width = 18
                mark.height = 18
                link.className = 'arsh-social arsh-social--' + icon
                link.append(mark)
            }
            link.append(document.createTextNode(label === 'Email' ? url.pathname : label))
            link.href = url.href
            if(url.protocol === 'https:') link.target = '_blank'
            link.rel = 'noopener noreferrer'
            container.append(link)
        }
        catch {}
    }

}).catch(() => {})
try
{
    const best = Number(localStorage.getItem('arsh-full-world-circuit-best'))
    const readout = document.querySelector('#arsh-personal-best')
    if(readout && best > 0) readout.textContent = 'Personal best on this device: ' + best.toFixed(3) + ' s'
}
catch {}

if(import.meta.env.VITE_LOG)
    console.log(
        ...consoleLog
    )

if(import.meta.env.VITE_GAME_PUBLIC)
    window.game = new Game()
else
    new Game()