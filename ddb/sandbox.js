//@flow
// Functions to compose DynamoDB operations.

type GetItemParams
  = {|
    TableName: string,
    Key: Key,
    ConsistentRead: boolean,
    ReturnConsumedCapacity: 'INDEXES' | 'TOTAL' | 'NONE',
    ProjectionExpression?: ProjectionExpression,
    ExpressionAttributeNames?: { [name:NamePlaceholder]: string }
  |}

type PutItemParams
  = {|
    TableName: string,
    Item: Attributes,
    ReturnValues: 'NONE' | 'ALL_OLD', // Only these are supported by putItem
    ReturnConsumedCapacity: 'INDEXES' | 'TOTAL' | 'NONE',
    ReturnItemCollectionMetrics: 'SIZE' | 'NONE'
  |}

// TODO: also create structure for ReturnConsumedCapacity, ReturnItemCollectionMetrics
type ConditionExpressionParams
  = {
    ExpressionAttributeNames: { [name:NamePlaceholder]: string },
    ExpressionAttributeValues: { [name:ValuePlaceholder]: AttributeValue },
    ConditionExpression: ConditionExpression
  }

type ProjectionExpressionParams
  = {
    ProjectionExpression: ProjectionExpression,
    ExpressionAttributeNames: { [name:NamePlaceholder]: string }
  }

// type GetOperation
//   = {|
//     type: 'getItem',
//     params: GetItemParams,
//     projection?: ProjectionExpression
//   |}

// type PutOperation
//   = {|
//     type: 'putItem',
//     params: PutItemParams,
//     condition?: ConditionExpressionParams
//   |}

// type Operations
//   = GetOperation
//   | PutOperation

// type Get
//   = (tableName: string, consistentRead: boolean) => Key => { key: Key, attributes: Attributes }

type Entity<K:Key,A:Attributes> = { key: K, attributes: A }

opaque type GetOperation<K:Key,A:Attributes>
  = {
    type: 'getItem',
    params: { TableName: string, ... },
    decodeAttributes: mixed => A
  }
opaque type PutOperation<K:Key,A:Attributes>
  = {
    type: 'putItem',
    params: { TableName: string, ... },
    decodeKey: mixed => K,
    decodeAttributes: mixed => A
  }

// type DbClient = Object // TODO
const toItem = (obj:Object) => ({}:any) // TODO
const fromItem = (obj:Object) => ({}:any) // TODO
type TableName = string

// const getOperation
//   : (tableName: string, consistentRead: boolean) => GetOperation
//   = (tableName, consistentRead=false) => ({
//     type: 'getItem',
//     params: { TableName: tableName, ConsistentRead: consistentRead }
//   })

// const withProjection
//   : (projection: ProjectionExpression) => GetOperation => GetOperation
//   = projection => operation => ({
//     ...operation,
//     params: {
//       ...operation.params,
//       ProjectionExpression: projection,
//       ExpressionAttributeNames: { /*TODO*/ }
//     }
//   })

// const runGet
//   : <K:Key,A:Attributes>(DbClient, GetOperation<K,A>) => K => Promise<Entity<K,A>>
//   = (db, op) => key => {
//     const { params, decodeAttributes } = op
//     return db.getItem({ ...params, Key: toItem(key) }).promise()
//       .then(({ Item }) => fromItem(Item))
//       .then(item => ({ key, attributes: decodeAttributes(item) }))
//   }
//
// const runGet2
//   : <K:Key,A:Attributes>(DbClient, TableName, mixed => A) => K => Promise<Entity<K,A>>
//   = (db, tableName, decodeAttributes) => {
//     const params = { TableName: tableName }
//     return key => {
//       return db.getItem({ ...params, Key: toItem(key) }).promise()
//         .then(({ Item }) => fromItem(Item))
//         .then(item => ({ key, attributes: decodeAttributes(item) }))
//     }
//   }

// **********
opaque type Getter<K,A>
  = {
    params: () => Object,
    run: Object => Promise<{ Item: mixed, ... }>,
    decodeAttributes: mixed => A
  }

type DynamoDbClient
  = { getItem: Object => ({ promise: () => Promise<{ Item: mixed, ... }> }) }

type Decoder<A> = mixed => A

const getter
  : <K:{...},A:{...}>(DynamoDbClient, TableName, Decoder<A>) => Getter<K,A>
  = (db, tableName, decodeAttributes:Function) => ({
    params: () => { TableName: tableName },
    run: params => db.getItem(params).promise(),
    decodeAttributes
  })

const runGet3
  : <K,A>(Getter<K,A>) => K => Promise<Entity<K,A>>
  = ({ run, params, decodeAttributes }) => key =>
    run({ ...params(), Key: toItem(key) })
      .then(({ Item }) => fromItem(Item))
      .then(item => ({ key, attributes: decodeAttributes(item) }:any))

const db = { getItem: (obj:Object) => ({ promise: () => Promise.resolve({}) }) }
const result = runGet3(getter(db, 'foo', a => ({ Item: { S: a } })))({})
// **********

// const withCondition
//   : (condition: string, handler: Function) => PutOperation => PutOperation
//   = (condition, handler) => a => a

// const runPut
//   : <K:Key,A:Attributes>(DbClient, PutOperation<K,A>) => Entity<K,A> => Promise<Entity<K,A>>
//   = (db, op) => ({ key, attributes }) => {
//     const { params, decodeAttributes } = op
//     return db.putItem({ ...params, Item: toItem({ ...attributes, ...key }) }).promise()
//       .then(({ Attributes }) => fromItem(Attributes))
//       .then(item => ({ key, attributes: decodeAttributes(item) }))
//   }


type Key = { [key:string]: AttributeValue }

type Attributes = { [key:string]: AttributeValue }

type AttributeValue
  = { B: Base64EncodedBinary }
  | { BS: Array<Base64EncodedBinary> }
  | { BOOL: string }
  | { S: string }
  | { L: Array<AttributeValue> }
  | { M: { [key:string]: AttributeValue } }
  | { N: StringifiedNumber }
  | { NS: Array<StringifiedNumber> }
  | { NULL: boolean }
  | { S: string }
  | { SS: Array<string> }

type StringifiedNumber = string // Must be coercible to number
type Base64EncodedBinary = string // Must be Base64-encoded
type NamePlaceholder = string // Starts with #
type ValuePlaceholder = string // Starts with :
type ConditionExpression = string
type ProjectionExpression = string

const stringifyNumber
  : number => StringifiedNumber
  = String
