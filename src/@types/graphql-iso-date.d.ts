declare module 'graphql-iso-date' {
  import { GraphQLScalarType } from 'graphql'

  export class GraphQLDate extends GraphQLScalarType {
    public name: 'Date'
  }

  export class GraphQLDateTime extends GraphQLScalarType {
    public name: 'DateTime'
  }

  export class GraphQLTime extends GraphQLScalarType {
    public name: 'Time'
  }
}
