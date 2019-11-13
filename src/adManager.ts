import { IFBInstant } from 'types'

class AdManager {
  private FBInstant: any
  private adLoaded: boolean = false
  private preloadedInterstitial: any = null

  constructor(FBInstant: IFBInstant) {
    this.FBInstant = FBInstant

    this.loadAd()
  }

  public async loadAd(): Promise<void> {
    try {
      const interstitial = await this.FBInstant.getInterstitialAdAsync(
        '746821112354806_758067227896861'
      )
      this.preloadedInterstitial = interstitial
      await this.preloadedInterstitial.loadAsync()

      this.adLoaded = true
    } catch (error) {
      console.log(error)
      if (
        error.code !== 'CLIENT_UNSUPPORTED_OPERATION' &&
        error.code !== 'INVALID_PARAM'
      ) {
        this.loadAd()
      }
    }
  }

  public async showAd(): Promise<boolean> {
    if (this.adLoaded) {
      try {
        await this.preloadedInterstitial.showAsync()
        this.adLoaded = false
        this.loadAd()
      } catch (error) {
        console.log(error)
        return false
      }
      return true
    } else {
      return false
    }
  }
}

export default AdManager
