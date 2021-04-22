import { execSync } from 'child_process'
import { basename } from 'path'

import { Index } from '../../types'

const filesIndexBuild = () => {
  const filesNames = execSync('find ./files | grep pdf').toString().split('\n')

  return filesNames.reduce((res: Index<string>, fileName) => {
    if (fileName) {
      res[basename(fileName.split('/').pop()!, '.pdf')] = fileName
    }

    return res
  }, {})
}

export { filesIndexBuild }
