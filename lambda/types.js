// @flow
// Types useful for AWS Lambda

import type { DynamoDbItem } from '../ddb'

// The standard siganture for AWS Lambda functions.
export type ApiHandler
    = (event:ApiProxiedEvent, context:{}, callback:NodeCallback) => Promise<mixed>

export type DdbStreamHandler
    = (event:DdbStreamEvent, context:{}, callback:NodeCallback) => Promise<mixed>

export type KinesisStreamHandler
    = (event:KinesisStreamEvent, context:{}, callback:NodeCallback) => Promise<mixed>

export type SnsMessageHandler
    = (event:SnsMessageEvent, context:{}, callback:NodeCallback) => Promise<mixed>

export type SqsMessageHandler
    = (event:SqsMessageEvent, context:{}, NodeCallback) => Promise<mixed>

export type CognitoPreSignupHandler
    = (event:CognitoPreSignupEvent, context:{}, callback:NodeCallback) => Promise<mixed>

export type ScheduleHandler
    = (event:ScheduleEvent, context:{}, callback:NodeCallback) => Promise<mixed>

// The proxied event sent from AWS when Lambda integration is enabled.
export type ApiProxiedEvent = {
    body: string,
    resource: string,
    requestContext: Object,
    queryStringParameters: Object,
    headers: Object,
    pathParameters: Object,
    httpMethod: string,
    stageVariables: Object,
    path: string
}

export type DdbStreamEvent
    = {
        Records: Array<DdbStreamEventRecord>
    }

export type DdbStreamEventRecord
    = {
        dynamodb: DdbStreamEventInfo,
        eventName: 'INSERT' | 'MODIFY' | 'REMOVE',
        eventSourceARN: string
    }

export type DdbStreamEventInfo
  = {|
    ApproximateCreationDateTime: number,
    Keys: DynamoDbItem,
    NewImage: DynamoDbItem
  |} 
  | {|
    ApproximateCreationDateTime: number,
    Keys: DynamoDbItem,
    OldImage: DynamoDbItem
  |} 
  | {|
    ApproximateCreationDateTime: number,
    Keys: DynamoDbItem,
    NewImage: DynamoDbItem,
    OldImage: DynamoDbItem
  |}

export type KinesisStreamEvent
  = {
    Records: Array<KinesisStreamRecord>
  }

export type KinesisStreamRecord
  = {
    kinesis: KinesisStreamEventInfo,
    eventSource: string,
    eventVersion: string,
    eventID: string,
    eventName: string,
    invokeIdentityArn: string,
    awsRegion: string,
    eventSourceARN: string
  }

export type KinesisStreamEventInfo
  = {
    kinesisSchemaVersion: string,
    partitionKey: string,
    sequenceNumber: string,
    data: string,
    approximateArrivalTimestamp: number
  }

export type SnsMessageEvent
    = {
        Records: Array<{
            Sns: {
                TopicArn: string,
                Message: string,
                Timestamp: string
            }
        }>
    }

export type SqsMessageEvent
    = {
      Records: Array<{
          body: string,
          eventSourceARN: string,
          attributes: { SentTimestamp: number }
      }>
    }

export type CognitoPreSignupEvent
    = {
        userName: string,
        request: {
            userAttributes: {
                email_verified?: 'true'|'false',
                phone_number_verified?: 'true'|'false',
                phone_number?: string, // '+16175557679'
                email?: string  // 'john@example.com'
            },
            validationData?: Object
        },
        response: {
            autoConfirmUser: boolean,
            autoVerifyEmail: boolean,
            autoVerifyPhone: boolean
        },
        version: '1',
        region: string, //'us-west-2'
        userPoolId: string, // 'us-west-2_yIr34j59pG'
        callerContext: {
            clientId: string
        }
    }

type ScheduleEvent
    = {
        version: string,
        source: string,
        time: string,
        account: string,
        id: string,
        resources: Array<string>
    }

// The standard node callback signature.
export type NodeCallback = (err:?Error, value:mixed) => mixed
