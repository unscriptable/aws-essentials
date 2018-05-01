//@flow

// Functions to build DynamoDB queries.

import type {
    DynamoDbItem, DynamoDbAttribute, UpdateExpressionParams
} from './types'

// Convert a plain JavaScript object to a DynamoDbItem.
export const item
    : (obj:Object) => DynamoDbItem
    = obj =>
        mapKeys(obj, attr)

// Convert a JavaScript value into a DynamoDbAttribute.
// TODO: Maps and Sets require special attention.
export const attr
    : (value:mixed) => DynamoDbAttribute
    = value => {
        if (typeof value === 'string') return { S: value }
        if (typeof value === 'number') return { N: String(value) }
        if (typeof value === 'boolean') return { BOOL: value }
        if (value == null) return { NULL: true }
        if (Array.isArray(value)) return { L: value.map(attr) }
        if (toString.call(value) === '[object Object]')
          return { M: mapKeys(((value:any):Object), attr) }
        return { B: String(value) }
    }

// Convert a DynamoDBItem back into a normal JavaScript object.
export const fromItem
    : (item:DynamoDbItem) => Object
    = item =>
        mapKeys(item, fromAttr)

// Convert a DynamoDBAttribute back into a JavaScript value.
// If the developer wants a true Map, they should transform the output of this
// function.
export const fromAttr
    : (attr:DynamoDbAttribute) => mixed
    = attr => {
        if (attr.S) return attr.S
        if (attr.N) return Number(attr.N)
        if (attr.BOOL) return Boolean(attr.BOOL)
        if (attr.NULL) return null
        if (attr.L) return attr.L.map(fromAttr)
        if (attr.M) return mapKeys(attr.M, fromAttr)
        if (attr.B) return attr.B
        throw new Error(`Unknown DynamoDB attribute: ${ JSON.stringify(attr) }`)
    }

// Generates the UpdateExpression, ExpressionAttributeValues, and
// ExpressionAttributeNames params for a ddb updateItem operation.
// Does not (yet) merge lists or maps, not recursive! TODO
export const patch
    : Object => UpdateExpressionParams
    = obj => {
        const { sets, removes, names, values } = Object.keys(obj).reduce(
            ({ sets, removes, names, values }, key) => {
                const name = `#${key}`
                const value = `:${key}`
                if (obj[key] == null) {
                    removes.push(name)
                    names[name] = key
                }
                else {
                    sets.push(`${name} = ${value}`)
                    names[name] = key
                    values[value] = attr(obj[key])
                }
                return { sets, removes, names, values }
            },
            { sets: [], removes: [], names: {}, values: {} }
        )
        const setClause = sets.length ? `SET ${sets.join(',')}` : ''
        const removeClause = removes.length ? `REMOVE ${removes.join(',')}` : ''
        return {
            UpdateExpression: `${setClause} ${removeClause}`,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values
        }
    }

const toString = Object.prototype.toString

const mapKeys
    = (o1, f) =>
        Object.keys(o1).reduce(
            (o2, key) => addProp(o2, key, f(o1[key])),
            {}
        )

const addProp
    = (obj, key, value) =>
        (obj[key] = value, obj)
