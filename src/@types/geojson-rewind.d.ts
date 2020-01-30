declare module 'geojson-rewind' {
  interface IGeoJsonRewind {
    type: string
    geometry?: IGeometryRewind
    bbox?: number[]
    properties?: { [id: string]: string | number }
    features?: IGeoJsonRewind[]
  }

  interface IGeometryRewind {
    type: string
    coordinates: number[] | number[][] | number[][][] | number[][][][]
  }

  function rewind(
    gj: IGeoJsonRewind | IGeometryRewind,
    outer?: boolean
  ): IGeoJsonRewind
  namespace rewind {}
  export = rewind
}
