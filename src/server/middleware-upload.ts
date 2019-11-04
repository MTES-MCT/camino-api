import { graphqlUploadExpress } from 'graphql-upload'

const middlewareUpload = graphqlUploadExpress({
  maxFileSize: 10000000,
  maxFiles: 10
})

export default middlewareUpload
