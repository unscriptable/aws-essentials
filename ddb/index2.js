//@flow
// Composition plan for DynamoDb API

import { item as toItem, fromItem } from './autoConvert'

import type { DynamoDbClient, Attributes } from './types'
import type { GetParams, Entity } from './operations'

type TableName = string
type Decode<A> = Attributes => A
type Encode<A> = A => Attributes

export { getItem, withProjection } from './operations'

export const get
  : <K:{...},A:{...}>(DynamoDbClient, GetParams, Decode<A>) => K => Promise<Entity<K,A>>
  = (db, { params }, decodeAttributes=fromItem) => key =>
    db.getItem({ ...params({ key }), Key: toItem(key) }).promise()
      .then(({ Item }) => decodeAttributes(Item))
      .then(attributes => ({ key, attributes }:any))

export const decodeWith
  = <A>(decode: {...} => A) => (input: Attributes) => decode(fromItem(input))

export const encodeWith
  = <A:{...}>(encode: A => {...}) => (input: A) => toItem(encode(input))

// example
const db = {}
const myDecoder = input => ({ param: 'foo' })
// const getFoo = get(db, getParams('foo'), decodeWith(myDecoder))
