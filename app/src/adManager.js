class AdManager {
  FBInstant
  adLoaded
  preloadedInterstitial = null

  constructor(FBInstant) {
    this.FBInstant = FBInstant

    this.loadAd()
  }

  async loadAd() {
    try {
      const interstitial = await this.FBInstant.getInterstitialAdAsync(
        '746821112354806_758067227896861',
      )
      this.preloadedInterstitial = interstitial
      await this.preloadedInterstitial.loadAsync()

      this.adLoaded = true
    } catch (error) {
      console.log(error)
      this.loadAd()
    }
  }

  async showAd() {
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
