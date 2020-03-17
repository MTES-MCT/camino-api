declare module 'geojson-rewind' {
  interface IGeoJson {
    type: 'Feature' | 'FeatureCollection'
    geometry?: IGeometry
    bbox?: number[]
    properties: { [id: string]: string | number }
    features?: IGeoJson[]
  }

  interface IGeometry {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[] | number[][] | number[][][] | number[][][][]
  }

  function rewind(
    gj: IGeoJson | IGeometry,
    outer?: boolean
  ): IGeoJson | IGeometry
  namespace rewind {}
  export = rewind
}
