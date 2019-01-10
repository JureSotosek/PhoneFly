import React from "react";

import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;

  padding-top: 60px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

class Index extends React.Component {
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

    this.setState({ acceleration });
  }

  render() {
    const { acceleration, highestFallLasted } = this.state;

    const height = (9.81 * (highestFallLasted / 2000) ** 2) / 2;

    return (
      <div>
        <div>Acceleration: {acceleration}</div>
        <div>Fall lasted: {highestFallLasted / 1000}s</div>
        <div>Height: {height}m</div>
        <div>
          <button onClick={() => this.setState({ highestFallLasted: null })}>
            Reset fall
          </button>
        </div>
      </div>
    );
  }
}

export default Index;
