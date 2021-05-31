/* eslint-disable node/no-callback-literal */
import { Client, GuildMember, VoiceChannel, VoiceState } from 'discord.js'

type Listener = (member: GuildMember) => any
type EventTypes = 'join' | 'leave' | 'empty' | 'first'
type EventListeners = { join: Listener[], leave: Listener[], empty: Listener[], first: Listener[] }

export class TargetChannel {
  public eventListeners: EventListeners =
    { join: [], leave: [], empty: [], first: [] }

  constructor (client: Client, channel: VoiceChannel) {
    client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
      if (oldState.member?.id === client.user?.id) return
      if (newState.member?.id === client.user?.id) return

      if (oldState.channel?.id === newState.channel?.id) return
      if (oldState.member?.user.bot || newState.member?.user.bot) return

      if (!newState.channelID || oldState.channel?.id === channel.id) {
        const members = oldState.channel?.members!
        const many = members.filter((member) => !member.user.bot).array().length

        for (const callback of this.eventListeners.leave) callback(oldState.member!)
        if (many > 0) return

        for (const callback of this.eventListeners.empty) callback(oldState.member!)
        return
      }

      // 들어왔을때
      if (!oldState.channelID || newState.channel?.id === channel.id) {
        if (newState.channel?.id !== channel.id) return

        const members = newState.channel?.members!
        const many = members.filter((member) => !member.user.bot).array().length

        for (const callback of this.eventListeners.join) callback(oldState.member!)

        if (many < 1) return
        for (const callback of this.eventListeners.first) callback(oldState.member!)
      }
    })
  }

  public on = (type: EventTypes, cb: () => any) =>
    this.eventListeners[type].push(cb)
}
