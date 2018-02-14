//@flow

// Functions to work with AWS SNS.
// TODO: increase the type safety herein.

// Create a function that will publish a message.
// Pass in an `encode` function that is able to format a message for all
// listener types (json, email, iOS, etc.).
export const publish
    : (snsClient:SnsClient, encode:Encode, topic:string, options?:Object)
    => (message:mixed) => Promise<Object>
    = (snsClient, encode, topic, options) => {
        const base = Object.assign({}, { TopicArn: topic }, options)
        return message => {
            const op = Object.assign({}, base, { Message: encode(message) })
            return snsClient.publish(op).promise()
        }
    }

// Create a function that will publish an SMS message.
export const sendSms
    : (snsClient:SnsClient, encode:string=>string, options?:Object)
    => (phone:string, message:string) => Promise<Object>
    = (snsClient, encode, options) => (phone, message) => {
          const Message = encode(message)
          const MessageAttributes = smsAttributes(options)
          const op
            = Object.assign(
                {},
                options,
                { PhoneNumber: phone, Message, MessageAttributes }
            )
          return snsClient.publish(op).promise()
    }

const smsAttributes
    = ({ transactional, senderId }={}) => {
      const SMSType
        = {
            DataType: 'String',
            StringValue: transactional ? 'Transactional' : 'Promotional'
        }
      return senderId
        ? ({
            SenderID: { DataType: 'String', StringValue: String(senderId) },
            SMSType
        })
        : ({ SMSType })
    }

// Create a function that will receive a message from an Sns topic.
// Pass in an `decode` function that is able to extract a message for a
// specific listener type (json, email, iOS, etc.).
export const receive
    : (decode:Decode) => (record:{ Sns:{ Message:string } }) => mixed
    = (decode) => ({ Sns }) =>
        decode(Sns.Message)

// Encodes a string as utf-8
export const encodeUtf8
  = (s:string) => Buffer.from(s).toString('utf8')

// TODO: subscribe

// Create a function that will encode a JavaScript value to be sent as an
// SNS message.  Provide a `msgType` to indicate the receiver format or just
// let it default to "default".
export const encodeJson
    : (msgType?:string) => Encode
    = (msgType='default') => value => {
        const payload = JSON.stringify(value)
        const payloads = {}
        payloads[msgType] = payload
        return JSON.stringify(payloads)
    }

// Create a function that will decode an SNS message back into a JavaScript
// value.  Provide a `msgType` to indicate which format to return or just
// let is default to "default".
export const decodeJson
    : (msgType?:string) => Decode
    = (msgType='default') => message => {
        const payloads = JSON.parse(message)
        const payload = payloads[msgType]
        return JSON.parse(payload)
    }

type Encode = (value:mixed) => string
type Decode = (message:string) => mixed

const defaultPublishOptions = { MessageStructure: 'json' }

// Transform a promise callback into a Sns callback.
const snsCallback
    = (resolve, reject) => (err, result) => {
        err ? reject(err) : resolve(result)
    }

type SnsClient
    = {
        publish: (op:Object) => PromiseStub<Object>
    }

type PromiseStub<T> = { promise: () => Promise<T> }
