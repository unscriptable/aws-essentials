//@flow
// Functions to implement CORS in a lambda.

export const addCorsHeaders
    : (?string, ?string, ?string) => ApiProxy => ApiProxy
    = (origin, methods, headers) => proxy => {
        if (!proxy.headers) proxy.headers = {}
        proxy.headers['Access-Control-Allow-Origin'] = origin || allOrigins
        proxy.headers['Access-Control-Allow-Methods'] = methods || allMethods
        proxy.headers['Access-Control-Allow-Headers'] = headers || mostHeaders
        return proxy
    }

const allOrigins = '*'
const allMethods = 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
const mostHeaders = 'Content-Type,Origin,Accept,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'

type ApiProxy
    = {
        statusCode:number,
        headers:{[key:string]:string},
        body:string
    }
