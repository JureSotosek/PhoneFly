import { IAssets } from 'types'

// Relative to the index.html file in /public
const ASSETS_FOLDER = 'assets'

// Include all of the assets you want to be accsible
// trough the assets prop in the React app
const ASSETS_TO_DOWNLOAD = [
  'ChallengeImage',
  'HighScoreImage',
  'IndexBanner',
  'PlayBanner',
]

async function loadAsset(image: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const src = `${ASSETS_FOLDER}/${image}`

    const canvas = document.createElement('canvas')
    const img = document.createElement('img')

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }
    img.onerror = error => {
      reject(error)
    }

    img.src = src
  })
}

export default async function loadAssets(): Promise<IAssets> {
  const assets: IAssets = {}

  ASSETS_TO_DOWNLOAD.forEach(async (asset, index) => {
    assets[asset] = await loadAsset(asset + '.png')

    const numberOfAssets = ASSETS_TO_DOWNLOAD.length
    const progress = ((Number(index) + 1) / (numberOfAssets + 1)) * 100
    window.FBInstant.setLoadingProgress(progress)
  })

  return assets
}
