const adId = '746821112354806_758067227896861'

class AdManager {
  FBInstant: any
  adLoaded: boolean
  preloadedInterstitial: any = null

  constructor(FBInstant) {
    this.FBInstant = FBInstant

    this.loadAd()
  }

  async loadAd(): Promise<void> {
    try {
      const interstitial = await this.FBInstant.getInterstitialAdAsync(adId)
      this.preloadedInterstitial = interstitial
      await this.preloadedInterstitial.loadAsync()

      this.adLoaded = true
    } catch (error) {
      console.log(error)
      this.loadAd()
    }
  }

  async showAd(): Promise<boolean> {
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
