import { graphqlUploadExpress } from 'graphql-upload'

const upload = graphqlUploadExpress({
  maxFileSize: 10000000,
  maxFiles: 10
})

export default upload
