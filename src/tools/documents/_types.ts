import { IDocument, Index } from '../../types'

type IndexFile = Index<{ document: IDocument; path: string }>

export { IndexFile }
