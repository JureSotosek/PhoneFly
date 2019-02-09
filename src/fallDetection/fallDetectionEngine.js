import EventEmitter from 'events'

class FallDetectionEngine extends EventEmitter {
  startedFallingAt: ?Date = null
  lastRecordAt: ?Date = null
  bigFall: boolean = false

  start: (FBInstant: any) => void = FBInstant => {
    window.addEventListener('devicemotion', this.handleDeviceMotionEvent, true)
    FBInstant.onPause(() => {
      this.emit('invalid')
      this.startedFallingAt = null
    })

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
    const root2over2 = Math.pow(2, 0.5) / 2
    const zAbs = Math.abs(z)
    const rotationTreshold =
      zAbs < 7 &&
      (betaSquared + root2over2 * alphaSquared > 80000 + zAbs * 60000 ||
        gammaSquared + root2over2 * alphaSquared > 80000 + zAbs * 60000)

    let sinceLastRecord: ?number = null
    if (this.lastRecordAt != null) {
      sinceLastRecord = new Date() - this.lastRecordAt
    }
    this.lastRecordAt = new Date()

    if (sinceLastRecord != null && sinceLastRecord > 50) {
      this.emit('invalid')
      this.startedFallingAt = null
      this.bigFall = false
    } else if (
      (accelerationTreshold || rotationTreshold) &&
      this.startedFallingAt === null
    ) {
      //Fall started
      this.startedFallingAt = new Date()
      this.emit('started')
    } else if (
      !accelerationTreshold &&
      !rotationTreshold &&
      this.startedFallingAt != null
    ) {
      //Fall finished
      const fallLasted = new Date() - this.startedFallingAt
      const height = (9.81 * ((fallLasted * 1.1) / 2000) ** 2) / 2
      const heightRounded = Math.round(height * 100) / 100

      this.emit('ended', { height: heightRounded, bigFall: this.bigFall })
      this.startedFallingAt = null
      this.bigFall = false
    } else if (this.startedFallingAt != null) {
      //Fall in progress but not finished
      const fallLasted = new Date() - this.startedFallingAt

      if (fallLasted > 200 && this.bigFall === false) {
        //Ignore small/accidental throws
        this.emit('bigfall')
        this.bigFall = true
      }
    }
  }
}

export type EndedEvent = {
  height: number,
  bigFall: boolean,
}

export default FallDetectionEngine
