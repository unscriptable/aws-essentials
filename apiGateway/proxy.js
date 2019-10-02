//@flow
// Functions to convert lambda JSON to API Gateway proxy responses.

// Given a callback, create a callback that's skips node's error parameter.
// We use this for *all handled API calls*, even if we're sending an error
// back to the client.
export const successCallback
    : (callback:NodeCallback) => (value:mixed) => mixed
    = callback => value =>
        callback(null, value)

// Create an API success response with a json body.
// Provide a function to generate the correct status code from the json.
export const successResponse
    : (status?:(o?:mixed)=>number) => (json?:mixed) => ApiProxy
    = (status=always200) => json =>
        ({
            statusCode: status(json),
            headers: { 'Content-Type': 'application/json' },
            body: stringify(json)
        })

// Create an API failure response with a json body.
// Provide a function to generate the correct status code from the json.
export const failureResponse
    : (status?:(o?:mixed)=>number) => (err:Error) => ApiProxy
    = (status=always400) => err => {
        const message = err.message
        const code = 'code' in err ? String((err:any).code) : ''
        return {
            statusCode: status(err),
            headers: { 'Content-Type': 'application/json' },
            body: stringify({ message: message, code: code })
        }
    }

// Generate a status code from a set of pre-defined Error classes.
// Alternatively, pass your own Error object that has a `statusCode` number
// property.
export const statusCodeFromError
    : (error?:Error|{statusCode?:number}) => number
    = error => {
        if (error instanceof NotFoundError) return 404
        if (error instanceof NotImplementedError) return 404
        return error && typeof error.statusCode === 'number'
            ? error.statusCode
            : 500
    }

// Some pre-defined Error classes.
export class NotFoundError extends Error {}
export class NotImplementedError extends Error {}

const always200
    = _ => 200

const always400
    = _ => 400

const stringify
  = it => JSON.stringify(it) || ''

type ApiProxy
    = {
        statusCode:number,
        headers:{[key:string]:string},
        body:string
    }
type NodeCallback = (err:Error|null, value:mixed) => mixed
