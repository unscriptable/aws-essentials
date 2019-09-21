//@flow

// TODO: refine the types of Promise fulfillment values:

export type DynamoDbClient
    = {
        putItem: (op:DynamoDbOp) => PromiseStub<Object>,
        updateItem: (op:DynamoDbOp) => PromiseStub<Object>,
        getItem: (op:DynamoDbOp) => PromiseStub<Object>,
        scan: (op:DynamoDbOp) => PromiseStub<Object>,
        deleteItem: (op:DynamoDbOp) => PromiseStub<Object>,
        query: (op:DynamoDbOp) => PromiseStub<Object>,
        describeTable: (op:DynamoDbOp) => PromiseStub<Object>,
        batchWriteItem: (op:Object) => PromiseStub<Object>
    }

export type DynamoDbOp
    = {
        TableName: string,
        Item?: DynamoDbItem,
        ConditionExpression?: string,
        FilterExpression?: string,
        IndexName?: string,
        Limit?: number,
        ReturnValues?:
            'NONE' | 'ALL_OLD' | 'UPDATED_OLD' | 'ALL_NEW' | 'UPDATED_NEW',
        ProjectionExpression?: string,
        UpdateExpression?: string,
        ExpressionAttributeNames?: Object,
        ExpressionAttributeValues?: DynamoDbItem
    }

export type DynamoDbItem
    = {
        [name:string]: DynamoDbAttribute
    }

export type DynamoDbAttribute
    = {| S: string |}
    | {| N: string |}
    | {| B: string |}
    | {| L: Array<DynamoDbAttribute> |}
    | {| SS: Array<string> |}
    | {| NS: Array<string> |}
    | {| M: { [name:string]: DynamoDbAttribute } |}
    | {| BOOL: boolean |}
    | {| NULL: true |}

export type DdbBuilder
    = {
        table: (name:string) => string,
        item: (o:Object) => DynamoDbItem,
        attr: (v:mixed) => DynamoDbAttribute,
        fromItem: (i:DynamoDbItem) => Object,
        fromAttr: (a:DynamoDbAttribute) => mixed,
        patch: Object => UpdateExpressionParams,
        id: () => string
    }

export type UpdateExpressionParams
    = {
        UpdateExpression: string,
        ExpressionAttributeValues: DynamoDbItem,
        ExpressionAttributeNames: Object
    }

type PromiseStub<T> = { promise: () => Promise<T> }
