//@flow
// Functions to create DynamoDb operations.

import type { DynamoDbClient, TableName } from './types'

// type Decoder<A> = mixed => A
//
// type TableName = string

export type Entity<K:{...},A:{...}> = { key: K, attributes: A }

export type GetParams = { params: Object => Object }
export type PutParams<K,A> = { params: Entity<K,A> => Object }

// Base getItem parameters.
export const getItem
  : TableName => GetParams
  = tableName =>
    ({ params: () => ({ TableName: tableName }) })

// getItem modifiers.
export const withProjection
  : string => GetParams => GetParams
  = projection => ({ params }) => {
    const { ExpressionAttributeNames: prevNames, ...rest } = params()
    const newNames = projectionAttributeNames(projection)
    const names = prevNames ? { ...prevNames, ...newNames } : newNames
    const projectionProps
      = { ProjectionExpression: projection, ExpressionAttributeNames: names }

    if ('ProjectionExpression' in rest)
      throw new Error(`ProjectionExpression already in ${JSON.stringify(params)}.`)

    return { params: () => ({ ...rest, ...projectionProps }) }
  }

const projectionAttributeNames
  = projection =>
    Object.fromEntries(
      projection.split(/\s*,\s*/g).map(name => [ `#name`, name ])
    )

// Base putItem parameters.
export const putItem
  : <K,A>(TableName) => PutParams<K,A>
  = tableName =>
  ({ params: () => ({ TableName: tableName }) }:any)

// putItems modifiers
export const itemNotExists
  : <K:{...},A:{...}>($Keys<K>) => PutParams<K,A> => PutParams<K,A>
  = keyName => ({ params }) => {
    const { ConditionExpression: prevExpression, ...rest } = params()
    const conditionProps = attributeNotExistsProps(keyName)

    return { params: ({ key }) => ({ ...rest, ...conditionProps(key) })}
  }

const firstPropName
  = obj =>
    Object.keys(obj)[0]

const attributeNotExistsProps
  = attrName =>
    ({ ConditionExpression: `attribute_not_exists(${attrName})` })
