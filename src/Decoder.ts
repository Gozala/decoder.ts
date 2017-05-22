import {Dictionary} from "./Dictionary"
import {Type, Decoder} from "./Interface"
import * as Decoders from "./Interface"


export type Integer = number & {tag:"integere"}
export type Float = number & {tag:"float"}

export {Type, Decoder}


class StringDecoder implements Decoders.String {
  type:Type.String = Type.String
}
export const string:Decoder<string> = new StringDecoder()

class BooleanDecoder implements Decoders.Boolean {
  type:Type.Boolean = Type.Boolean
}
export const boolean:Decoder<boolean> = new BooleanDecoder()




class IntegerDecoder implements Decoders.Integer {
  type:Type.Integer = Type.Integer
}
export const integer:Decoder<Integer> = new IntegerDecoder()

class FloatDecoder implements Decoders.Float {
  type:Type.Float = Type.Float
}
export const float:Decoder<Float> = new FloatDecoder

export const nullable = <a> (decoder:Decoder<a>):Decoder<null|a> =>
  either(decodeNull(null), decoder)

class ArrayDecoder <a> implements Decoders.Array<a> {
  type:Type.Array = Type.Array
  constructor(public decoder:Decoder<a>) {
  }
}
export const array = <a> (decoder:Decoder<a>):Decoder<a[]> =>
  new ArrayDecoder(decoder)


class DictionaryDecoder <a> implements Decoders.Dictionary<a> {
  type:Type.Dictionary = Type.Dictionary
  constructor(public decoder:Decoder<a>) {
  }
}

export const dictionary = <a> (decoder:Decoder<a>):Decoder<Dictionary<a>> =>
  new DictionaryDecoder(decoder)

class EntriesDecoder <a> implements Decoders.Entries<a> {
  type:Type.Entries = Type.Entries
  constructor(public decoder:Decoder<a>) {
  }
}

export const entries = <a> (decoder:Decoder<a>):Decoder<Array<[string, a]>> =>
  new EntriesDecoder(decoder)

class FieldDecoder <a> implements Decoders.NamedMember<a> {
  type:Type.NamedMember = Type.NamedMember
  constructor(public name:string, public decoder:Decoder<a>) {
  }
}


export const field = <a> (name:string, decoder:Decoder<a>):Decoder<a> =>
  new FieldDecoder(name, decoder)

export const at = <a> (path:Array<string>, decoder:Decoder<a>):Decoder<a> =>
  path.reduce((decoder:Decoder<a>, name) => field(name, decoder), decoder)

class IndexDecoder <a> implements Decoders.IndexedMember<a> {
  type:Type.IndexedMember = Type.IndexedMember
  constructor(public index:number, public decoder:Decoder<a>) {
  }
}
export const index = <a> (index:number, decoder:Decoder<a>):Decoder<a> =>
  new IndexDecoder(index, decoder)

class MaybeDecoder <a> implements Decoders.Maybe<a> {
  type:Type.Maybe = Type.Maybe
  constructor(public decoder:Decoder<a>) {
  }
}
export const maybe = <a> (decoder:Decoder<a>):Decoder<null|a> =>
  new MaybeDecoder(decoder)

class EitherDecoder <a> implements Decoders.Either<a> {
  type:Type.Either = Type.Either
  constructor(public decoders:Decoder<a>[]) {
  }
}

export function either <a, b> (d1:Decoder<a>, d2:Decoder<b>):Decoder<a|b>
export function either <a, b, c> (d1:Decoder<a>,
                                  d2:Decoder<b>,
                                  d3:Decoder<c>):Decoder<a|b|c>
export function either <a, b, c, d> (d1:Decoder<a>,
                                      d2:Decoder<b>,
                                      d3:Decoder<c>,
                                      d4:Decoder<d>):Decoder<a|b|c|d>
export function either <a, b, c, d, e> (d1:Decoder<a>,
                                        d2:Decoder<b>,
                                        d3:Decoder<c>,
                                        d4:Decoder<d>,
                                        d5:Decoder<e>):Decoder<a|b|c|d|e>
export function either <a, b, c, d, e, f> (d1:Decoder<a>,
                                            d2:Decoder<b>,
                                            d3:Decoder<c>,
                                            d4:Decoder<d>,
                                            d5:Decoder<e>,
                                            d6:Decoder<f>):Decoder<a|b|c|d|e|f>
export function either <a, b, c, d, e, f, g> (d1:Decoder<a>,
                                              d2:Decoder<b>,
                                              d3:Decoder<c>,
                                              d4:Decoder<d>,
                                              d5:Decoder<e>,
                                              d6:Decoder<f>,
                                              d7:Decoder<g>):Decoder<a|b|c|d|e|f|g>
export function either <a> (decoder:Decoder<a>, ...rest:Decoder<a>[]):Decoder<a> {
  return new EitherDecoder([decoder, ...rest])
}

class SucceedDecoder <a> implements Decoders.Ok<a> {
  type:Type.Ok = Type.Ok
  constructor(public value:a) {

  }
}

export const succeed = <a> (value:a):Decoder<a> =>
  new SucceedDecoder(value)

class FailDecoder implements Decoders.Error {
  type:Type.Error = Type.Error
  constructor(public reason:string) {
  }
}

export const fail = (message:string):Decoder<any> =>
  new FailDecoder(message)


class NullDecoder <a> implements Decoders.Null<a> {
  type:Type.Null = Type.Null
  constructor(public replacement:a) {
  }
}

export const decodeNull = <a> (value:a):Decoder<a> =>
  new NullDecoder(value)


class UndefinedDecoder <a> implements Decoders.Undefined<a> {
  type:Type.Undefined = Type.Undefined
  constructor(public replacement:a) {
  }
}

export const decodeUndefined = <a> (value:a):Decoder<a> =>
  new UndefinedDecoder(value)

export const decodeVoid = <a> (value:a):Decoder<a> =>
  either(decodeNull(value), decodeUndefined(value))


abstract class Pipeline<record> implements Decoders.Pipeline<record> {
  abstract custom <key extends string, a> (name:key, decoder:Decoder<a>):Decoders.Struct<record, key, a>
  required <key extends string, a> (name:key, decoder:Decoder<a>):Decoders.Struct<record, key, a> {
    return this.custom(name, field(name, decoder))
  }
  optional<key extends string, a> (name:key, decoder:Decoder<a>, fallback:a):Decoders.Struct<record, key, a> {
    return this.required(name, either(decoder, decodeNull(fallback)))
  }
  hardcoded<key extends string, a> (name:key, value:a):Decoders.Struct<record, key, a> {
    return this.required(name, succeed(value))
  }
}

class RecordBaseDecoder extends Pipeline<{}> implements Decoders.BaseStruct {
  type:Type.RecordBase = Type.RecordBase
  custom <k extends string, a> (name:k, decoder:Decoder<a>):Decoders.Struct<{}, k, a> {
    return new RecordExtensionDecoder(this, name, decoder)
  }
}

class RecordExtensionDecoder <base, key extends string, value> extends Pipeline<base & Record<key, value>> implements Decoders.Extension<base & Record<key, value>, base, key, value> {
  type:Type.RecordExtension = Type.RecordExtension
  constructor(public baseDecoder:Decoder<base>,
              public name:key,
              public fieldDecoder:Decoder<value>) {
    super()
  }
  custom <k extends string, a> (name:k, decoder:Decoder<a>):Decoders.Struct<base & Record<key, value>, k, a> {
    return <Decoders.Struct<base & Record<key, value>, k, a>> new RecordExtensionDecoder(this, name, decoder)
  }
}

export const record:Decoders.Pipeline<{}> & Decoders.BaseStruct = new RecordBaseDecoder()




// const profile = record
//   .required('id', integer)
//   .required('email', string)
//   .optional('name', string, '')
//   .hardcoded('followers', 0)
//   .custom('other', at(['_private', 'messages', 'count'], string))

// const user = profile.decode('foo')
// if (!(user instanceof Error)) {
//   user.name.toUpperCase()
//   user.email.split('@')
//   user.id.toFixed()
//   user.followers + 2
// }

