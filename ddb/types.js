//@flow

// TODO: refine the types of Promise fulfillment values:

export type DynamoDbClient
    = {
        putItem: (op:DynamoDbOp) => PromiseStub<{ Attributes: Attributes, ... }>,
        updateItem: (op:DynamoDbOp) => PromiseStub<{ Attributes: Attributes, ... }>,
        getItem: (op:DynamoDbOp) => PromiseStub<{ Item: Attributes, ... }>,
        scan: (op:DynamoDbOp) => PromiseStub<{ Items: Array<Attributes>, ... }>,
        deleteItem: (op:DynamoDbOp) => PromiseStub<{ Attributes: Attributes, ... }>,
        query: (op:DynamoDbOp) => PromiseStub<{ Items: Array<Attributes>, ... }>,
        describeTable: (op:DynamoDbOp) => PromiseStub<Object>,
        batchWriteItem: (op:Object) => PromiseStub<Object>,
        transactWriteItems: (op:{ TransactItems: Array<Object> }) => PromiseStub<Object>,
        createBackup: (op:{ TableName: string, BackupName: string }) => PromiseStub<Object>
    }

export type DynamoDbOp
    = {
        TableName: string, ...
    //     Item?: Attributes,
    //     ConditionExpression?: string,
    //     FilterExpression?: string,
    //     IndexName?: string,
    //     Limit?: number,
    //     ReturnValues?:
    //         'NONE' | 'ALL_OLD' | 'UPDATED_OLD' | 'ALL_NEW' | 'UPDATED_NEW',
    //     ProjectionExpression?: string,
    //     UpdateExpression?: string,
    //     ExpressionAttributeNames?: Object,
    //     ExpressionAttributeValues?: Attributes
    }

export type Key = { [key:string]: AttributeValue }

export type Attributes = { [key:string]: AttributeValue }

export type AttributeValue
  = { B: Base64EncodedBinary }
  | { BS: Array<Base64EncodedBinary> }
  | { BOOL: boolean }
  | { L: Array<AttributeValue> }
  | { M: { [key:string]: AttributeValue } }
  | { N: StringifiedNumber }
  | { NS: Array<StringifiedNumber> }
  | { NULL: boolean }
  | { S: string }
  | { SS: Array<string> }

export type TableName = string
export type Base64EncodedBinary = string
export type StringifiedNumber = string

// export type DdbBuilder
//     = {
//         table: (name:string) => string,
//         item: (o:Object) => DynamoDbItem,
//         attr: (v:mixed) => AttributeValue,
//         fromItem: (i:DynamoDbItem) => Object,
//         fromAttr: (a:AttributeValue) => mixed,
//         patch: Object => UpdateExpressionParams,
//         id: () => string
//     }

export type UpdateExpressionParams
    = {
        UpdateExpression: string,
        ExpressionAttributeValues?: Attributes,
        ExpressionAttributeNames: { [key:string]: string }
    }

type PromiseStub<T> = { promise: () => Promise<T> }
