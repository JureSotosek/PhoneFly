import EventEmitter from 'events'

class FallDetectionEngine extends EventEmitter {
  startedFallingAt: ?Date = null
  lastRecordAt: ?Date = null
  bigFallEmitted: boolean = false

  start: () => void = () => {
    window.addEventListener('devicemotion', this.handleDeviceMotionEvent, true)
    const currentDate = new Date()
    this.lastRecordAt = currentDate
    setTimeout(() => {
      if (this.lastRecordAt === currentDate) {
        this.emit('error')
      }
    }, 500)
  }

  stop: () => void = () => {
    window.removeEventListener(
      'devicemotion',
      this.handleDeviceMotionEvent,
      true,
    )
  }

  handleDeviceMotionEvent: (event: any) => void = event => {
    const {
      x,
      y,
      z,
    }: { x: number, y: number, z: number } = event.accelerationIncludingGravity
    const accelerationTreshold = (x ** 2 + y ** 2 + z ** 2) ** 0.5 < 3

    const {
      alpha,
      beta,
      gamma,
    }: { alpha: number, beta: number, gamma: number } = event.rotationRate
    const alphaSquared = Math.pow(alpha, 2)
    const betaSquared = Math.pow(beta, 2)
    const gammaSquared = Math.pow(gamma, 2)
    const rotationTreshold =
      z < 4 &&
      (betaSquared > 40000 || gammaSquared > 40000 || alphaSquared > 40000)

    let sinceLastRecord: ?number = null
    if (this.lastRecordAt != null) {
      sinceLastRecord = new Date() - this.lastRecordAt
    }
    this.lastRecordAt = new Date()

    if (sinceLastRecord != null && sinceLastRecord > 50) {
      this.emit('invalid')
      this.startedFallingAt = null
    } else if (
      (accelerationTreshold || rotationTreshold) &&
      this.startedFallingAt === null
    ) {
      //Fall started
      this.startedFallingAt = new Date()
      this.emit('started')
      this.bigFallEmitted = false
    } else if (
      !accelerationTreshold &&
      !rotationTreshold &&
      this.startedFallingAt != null
    ) {
      //Fall finished
      const fallLasted = new Date() - this.startedFallingAt
      const height = (9.81 * (fallLasted / 2000) ** 2) / 2
      const heightRounded = Math.round(height * 100) / 100

      this.emit('ended', { height: heightRounded })
      this.startedFallingAt = null
    } else if (this.startedFallingAt != null) {
      //Fall in progress but not finished
      const fallLasted = new Date() - this.startedFallingAt

      if (fallLasted > 500 && this.bigFallEmitted === false) {
        //Ignore small/accidental throws
        this.emit('bigfall')
        this.bigFallEmitted = true
      }
    }
  }
}

export type EndedEvent = {
  height: number,
}

export default FallDetectionEngine
