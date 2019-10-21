import { graphqlUploadExpress } from 'graphql-upload'

const middlewareUpload = graphqlUploadExpress({
  maxFileSize: 3000000,
  maxFiles: 10
})

export default middlewareUpload
