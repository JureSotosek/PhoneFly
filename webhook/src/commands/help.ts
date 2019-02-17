import { Command } from '../types'

const help: Command = () => ({
  text: `
Available commands ⚙️
  /kudos send @                   Send kudos to someone
  /kudos leaderboard           See the current standings of a competition
  /kudos stats #/@               See the stats of a channel or a member
  /kudos me                          See your own stats
  /kudos engagement          Setup engagement for the current channel
  /kudos competition          Start a competition in the current channel`,
})

export default help
