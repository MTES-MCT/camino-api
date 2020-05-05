import * as expressGraphql from 'express-graphql'
import * as http from 'http'

import rootValue from '../api/resolvers'
import schema from '../api/schemas'

interface IAuthRequestHttp extends http.IncomingMessage {
  user?: {
    [id: string]: string
  }
}

const middlewareGraphql = expressGraphql(
  (req: IAuthRequestHttp, res, graphQLParams) => ({
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
  })
)

export default middlewareGraphql
