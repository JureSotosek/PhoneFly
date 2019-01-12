import React from "react";

class Play extends React.Component {
  constructor() {
    super();

    this.state = {
      startedFallingAt: null,
      highestFallLasted: null,
      fallInProgress: false
    };

    this.handleAccelerometer = this.handleAccelerometer.bind(this);
  }

  componentDidMount() {
    window.addEventListener("devicemotion", this.handleAccelerometer, true);
  }

  componentWillUnmount() {
    window.removeEventListener("devicemotion", this.handleAccelerometer, true);
  }

  handleAccelerometer(event) {
    const { startedFallingAt, highestFallLasted } = this.state;
    const { x, y, z } = event.accelerationIncludingGravity;

    const acceleration = (x ** 2 + y ** 2 + z ** 2) ** 0.5;

    if (acceleration < 2 && !startedFallingAt) {
      this.setState({ startedFallingAt: new Date() });
    } else if (acceleration > 2 && startedFallingAt) {
      const fallLasted = new Date() - startedFallingAt;
      if (fallLasted > highestFallLasted) {
        this.setState({
          highestFallLasted: fallLasted
        });
      }
      this.setState({ startedFallingAt: null });
    }
  }

  render() {
    const { highestFallLasted } = this.state;
    const { history } = this.props;

    const height = (9.81 * (highestFallLasted / 2000) ** 2) / 2;

    return (
      <div>
        <div>Height/Score: {height.toFixed(2)}m</div>
        <div>
          <button onClick={() => this.setState({ highestFallLasted: null })}>
            RESET
          </button>
          <button onClick={() => history.push("")}>BACK</button>
        </div>
      </div>
    );
  }
}

export default Play;
