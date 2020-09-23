import { graphqlUploadExpress } from 'graphql-upload'

const upload = graphqlUploadExpress({
  maxFileSize: Infinity,
  maxFiles: 10
})

export { upload }
