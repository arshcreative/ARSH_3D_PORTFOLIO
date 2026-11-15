import linkedIn from './linkedin.js'
import discord from './discord.js'
import email from './email.js'

export default [
    { name: 'Contact', modal: 'discord', align: 'right', anchor: 'refCenter' },
    { name: 'LinkedIn', url: linkedIn, align: 'right', anchor: 'linkedInPhysicalDynamic' },
    { name: 'Discord', url: discord, align: 'right', anchor: 'discordPhysicalDynamic' },
    { name: 'Email', url: email, align: 'right', anchor: 'mailPhysicalDynamic' }
]
