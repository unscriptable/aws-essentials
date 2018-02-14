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
        describeTable: (op:DynamoDbOp) => PromiseStub<Object>
    }

export type DynamoDbOp
    = {
        TableName: string,
        Item?: DynamoDbItem,
        ConditionExpression?: string,
        FilterExpression?: string,
        IndexName?: string,
        Limit?: number,
        ProjectionExpression?: string
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
    | {| M: { [name:string]: DynamoDbAttribute } |}
    | {| BOOL: boolean |}
    | {| NULL: true |}

type PromiseStub<T> = { promise: () => Promise<T> }
