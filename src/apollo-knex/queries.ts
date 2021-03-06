import { pipe } from '@fop-ts/core/Pipe'
import { Maybe } from '@fop-ts/core/Types'
import { Knex } from 'knex'

export const limitArgToQuery =
  (args: { limit?: Maybe<number> }) =>
  <Q extends Knex.QueryBuilder>(query: Q): Q => {
    if (args.limit) {
      return query.limit(args.limit) as Q
    }

    return query
  }

export const offsetArgToQuery =
  (args: { offset?: Maybe<number> }) =>
  <Q extends Knex.QueryBuilder>(query: Q): Q => {
    if (args.offset) {
      return query.offset(args.offset) as Q
    }

    return query
  }

export const orderByArgToQuery =
  (args: { orderBy?: Maybe<Record<string, Maybe<string>>> }) =>
  <Q extends Knex.QueryBuilder>(query: Q): Q => {
    if (args.orderBy) {
      return Object.entries(args.orderBy).reduce((reducedQuery, [name, val]) => {
        if (val) {
          return reducedQuery.orderBy(name, val) as Q
        }

        return reducedQuery
      }, query)
    }

    return query
  }

export const mapCommonSearchParamsToQuery = (args: {
  orderBy?: Maybe<Record<string, Maybe<string>>>
  offset?: Maybe<number>
  limit?: Maybe<number>
}) => pipe(limitArgToQuery(args), offsetArgToQuery(args), orderByArgToQuery(args))
