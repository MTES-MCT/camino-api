// trouve les titres qui ont plusieurs groupes de points et plusieurs contours

import 'dotenv/config'
import '../../../database/index'

import { titresGet } from '../../../database/queries/titres'

const groupe = points =>
  points.reduce((groupes, point) => {
    groupes[point.groupe - 1] = groupes[point.groupe - 1] || []
    groupes[point.groupe - 1][point.contour - 1] =
      groupes[point.groupe - 1][point.contour - 1] || []
    groupes[point.groupe - 1][point.contour - 1][point.point - 1] = {
      id: point.id,
      nom: point.nom,
      groupe: point.groupe,
      contour: point.contour,
      point: point.point,
      coordonnees: point.coordonnees,
      description: point.description,
      references: point.references
    }

    return groupes
  }, [])

async function main() {
  const titres = await titresGet()

  const titresFiltered = titres.filter(({ id, points }) => {
    if (!points.length) return false

    const groupes = groupe(points)

    if (!(groupes.length > 1)) return false

    const contoursLength = groupes.reduce(
      (acc, contours) => (contours.length > 1 ? true : acc || false),
      false
    )
    return contoursLength
  })

  console.log(titresFiltered.map(({ id }) => ({ id })))

  process.exit()
}

main()
