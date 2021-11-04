import { geoConvert } from './geo-convert'

describe('teste la conversion des projections', () => {
  test.each`
    epsgId    | x                     | newX
    ${'4326'} | ${1234}               | ${1234}
    ${'4326'} | ${1.199826706437144}  | ${1.199826706437144}
    ${'4326'} | ${49.869381812347456} | ${49.869381812347456}
  `('teste geoConvert', ({ epsgId, x, newX }) => {
    expect(geoConvert(epsgId, { x, y: 1 })).toEqual({ x: newX, y: 1 })
  })
})
