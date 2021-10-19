//@flow
// Composable functions to build DynamoDB operations

import type { DynamoDbClient, TableName } from './types'

type KeyValue = string | number | boolean
type Key = KeyValue | [ KeyValue, KeyValue ]
type DynamoDbItem = {...}
type GetItemBuilder<T:Key> = { params: GetItemParams, run: GetItemRunner<T> }
type GetItemParams
  = {| TableName: TableName |}
  | {|
    TableName: TableName,
    ProjectionExpression: string,
    ...ParamsWithExpression
  |}
  | {|
    TableName: TableName,
    ConditionExpression: string,
    ...ParamsWithExpression
  |}
  | {|
    TableName: TableName,
    ProjectionExpression: string,
    ConditionExpression: string,
    ...ParamsWithExpression
  |}
type ParamsWithExpression
  = {|
    ExpressionAttributeNames: {...},
    ExpressionAttributeValues: {...}
  |}
type ProjectionParams
  = {|
    ProjectionExpression: string,
    ExpressionAttributeNames: {...},
    ExpressionAttributeValues: {...}
  |}
type ConditionParams
  = {
    ConditionExpression: string,
    ExpressionAttributeNames: {...},
    ExpressionAttributeValues: {...}
  }
type GetItemRunner<T:Key> = T => DynamoDbItem
type Attributes = Array<string>
type Conditions = Array<Condition>
type Condition = Object // TODO




export const getItemParams
  : (DynamoDbClient, TableName) => {| TableName: TableName |}
  = (dbClient, tableName) =>
    ({ TableName: tableName })

export const withProjection
  : Attributes => <T:{...}>(T) => { ...T, ...ProjectionParams }
  = attributes => {
    const projectionExpression = ''
    const expressionNames = {}
    const expressionValues = {}

    return params =>
      ({
        ...params,
        ProjectionExpression: projectionExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
      })
  }

export const withContitions
  : Conditions => <T:{...}>(T) => { ...T, ...ConditionParams }
  = conditions => {
    const conditionExpression = ''
    const expressionNames = {}
    const expressionValues = {}

    return params =>
      ({
        ...params,
        ConditionExpression: conditionExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
      })
  }
