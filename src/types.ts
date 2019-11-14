export interface IAssets {
  [src: string]: string
}

export interface IFBInstant {
  [property: string]: any
}

export interface IEntryPointData {
  challengedBy: string
  height: number
  id: string
}

export type Units = 'metric' | 'imperial'
