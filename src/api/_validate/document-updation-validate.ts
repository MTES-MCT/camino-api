import { IDocument } from '../../types'

import { dateValidate } from '../../tools/date-validate'

const documentUpdationValidate = async (document: IDocument) => {
  const errors = [] as string[]

  const error = dateValidate(document.date)

  if (error) {
    errors.push(error)
  }

  return errors
}

export default documentUpdationValidate
