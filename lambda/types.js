// @flow

// Types useful for AWS Lambda

// The standard siganture for AWS Lambda functions.
export type ApiHandler
    = (event:ApiProxiedEvent, context:{}, callback:NodeCallback) => mixed

export type DdbStreamHandler
    = (event:DdbStreamEvent, context:{}, callback:NodeCallback) => mixed

export type SnsMessageHandler
    = (event:SnsMessageEvent, context:{}, callback:NodeCallback) => mixed

export type CognitoPreSignupHandler
    = (event:CognitoPreSignupEvent, context:{}, callback:NodeCallback) => mixed

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

type DdbStreamEvent
    = {
        Records: Array<{
            dynamodb: {
                ApproximateCreationDateTime: string,
                Keys: Object, // TODO: actually DdbItem
                NewImage: Object, // TODO: actually DynamoDbAttribute
                OldImage: Object // TODO: actually DynamoDbAttribute
            },
            eventSourceARN: string
        }>
    }

type SnsMessageEvent
    = {
        Records: Array<{ Sns: { Message: string } }>
    }

type CognitoPreSignupEvent
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

// The standard node callback signature.
export type NodeCallback = (err:?Error, value:mixed) => mixed
