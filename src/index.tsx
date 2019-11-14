import App from 'App'
import loadAssets from 'loadAssets'
import React from 'react'
import ReactDOM from 'react-dom'
import { IFBInstant } from 'types'

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    FBInstant: IFBInstant
  }
}

// Main function thats going to run
async function main() {
  const { FBInstant } = window

  // Init FBInstant
  await FBInstant.initializeAsync()

  // Load assets
  const assets = await loadAssets()
  FBInstant.setLoadingProgress(100)

  // Start the game
  await FBInstant.startGameAsync()

  // Render the React app
  ReactDOM.render(
    <App assets={assets} FBInstant={FBInstant} />,
    document.getElementById('root')
  )
}

// Run the whole thing 🙄
main()
