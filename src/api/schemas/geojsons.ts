export default `
"Paire de coordonnées géographiques"
type Coordonnees {
  "La valeur des coordonnées en X sous forme d'un nombre décimal"
  x: Float

  "La valeur des coordonnées en Y sous forme d'un nombre décimal"
  y: Float
}

type GeojsonMultiPolygons {
  type: FeatureCollectionType!
  features: [GeojsonMultiPolygon]
}

type GeojsonMultiPolygon {
  type: FeatureType!
  properties: Titre
  geometry: GeometryMultiPolygon!
}

type GeometryMultiPolygon {
  type: GeometryTypeMultipolygon!
  coordinates: [[[[Float]]]]
}

type GeojsonPoints {
  type: FeatureCollectionType!
  features: [FeaturePoint]
}

type FeaturePoint {
  type: FeatureType!
  geometry: GeometryPoints!
  properites: FeaturePointProperties
}

type FeaturePointProperties {
  groupe: Int
  contour: Int
  point: Int
  nom: String
  description: String
}

type GeometryPoints {
  type: GeometryTypePoint!
  coordinates: [Float]
}

input InputCoordonnees {
  x: Float

  y: Float
}

input InputGeojson {
  type: FeatureCollectionType!
  feature: [InputFeature]
}

input InputFeature {
  type: FeatureType!
  geometry: InputGeometry!
}

input InputGeometry {
  type: GeometryType
  coordinates: Json
}

enum FeatureCollectionType {
  FeatureCollection
}

enum FeatureType {
  Feature
}

enum GeometryType {
  MultiPolygon
  Point
}

enum GeometryTypeMultipolygon {
  MultiPolygon
}

enum GeometryTypePoint {
  Point
}`
