import { graphqlHTTP } from 'express-graphql'
import http from 'http'

import rootValue from '../api/graphql/resolvers'
import schema from '../api/graphql/schemas'

interface IAuthRequestHttp extends http.IncomingMessage {
  user?: {
    [id: string]: string
  }
}

const graphql = graphqlHTTP((req: IAuthRequestHttp) => ({
  context: { user: req.user },
  customFormatErrorFn: err => ({
    locations: err.locations,
    message: err.message,
    path: err.path,
    stack: err.stack ? err.stack.split('\n') : []
  }),
  graphiql: true,
  pretty: true,
  rootValue,
  schema
}))

export { graphql }
