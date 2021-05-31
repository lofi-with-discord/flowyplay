const { Client } = require('discord.js')
const { TargetChannel } = require('..')

const client = new Client()

client.on('ready', () => {
  const channel = client.channels.resolve(process.env.CHANNEL)
  const target = new TargetChannel(client, channel)

  target.on('join', () => console.log('joined'))
  target.on('leave', () => console.log('leaved'))

  target.on('first', () => channel.join())
  target.on('empty', () => channel.leave())
})

client.login(process.env.TOKEN)
