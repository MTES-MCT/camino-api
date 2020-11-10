import { execSync } from 'child_process'
import { Index } from '../../types'
import { basename } from 'path'

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
