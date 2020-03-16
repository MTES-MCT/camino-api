declare module '@mapbox/geojsonhint' {
  interface IError {
    line: number
    message: string
    error: { message: string }
  }

  interface IGeoJson {
    type: string
    geometry?: IGeometry | null
    bbox?: number[] | null
    properties: { [id: string]: string | number }
    features?: IGeoJson[] | null
  }

  interface IGeometry {
    type: string
    coordinates: number[] | number[][] | number[][][] | number[][][][]
  }

  export function hint(gj: IGeoJson): IError[]
}
