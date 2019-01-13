import React from 'react'
import type { RouterHistory } from 'react-router-dom'

type Props = {
  history: RouterHistory,
}

type State = {
  startedFallingAt: ?Date,
  highestFallLasted: number,
  fallInProgress: boolean,
}

class Play extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      startedFallingAt: null,
      highestFallLasted: 0,
      fallInProgress: false,
    }
  }

  componentDidMount() {
    window.addEventListener('devicemotion', this.handleAccelerometer, true)
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.handleAccelerometer, true)
  }

  handleAccelerometer: (event: any) => void = event => {
    const { startedFallingAt, highestFallLasted } = this.state
    const {
      x,
      y,
      z,
    }: { x: number, y: number, z: number } = event.accelerationIncludingGravity

    const acceleration = (x ** 2 + y ** 2 + z ** 2) ** 0.5

    if (acceleration < 2 && !startedFallingAt) {
      this.setState({ startedFallingAt: new Date() })
    } else if (acceleration > 2 && startedFallingAt != null) {
      const fallLasted = new Date() - startedFallingAt
      if (highestFallLasted === null || fallLasted > highestFallLasted) {
        this.setState({
          highestFallLasted: fallLasted,
        })
      }
      this.setState({ startedFallingAt: null })
    }
  }

  render() {
    const { highestFallLasted } = this.state
    const { history } = this.props

    const height = (9.81 * (highestFallLasted / 2000) ** 2) / 2

    return (
      <div style={{ backgroundColor: 'white' }}>
        <div>Height/Score: {height.toFixed(2)}m</div>
        <div>
          <button onClick={() => this.setState({ highestFallLasted: 0 })}>
            RESET
          </button>
          <button onClick={() => history.push('')}>BACK</button>
        </div>
      </div>
    )
  }
}

export default Play
