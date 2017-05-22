import {Error, Bad, BadPrimitive, BadIndex, BadField, BadEither} from "./Error"
import {Integer, Float, Type} from "./Decoder"
import {Decoder} from "./Interface"
import * as Decoders from "./Interface"
import {Result, ok, error} from "result.ts"
import {Dictionary} from "./Dictionary"

export type Read <a> =
  | Error
  | a


export function read <a> (input:any, decoder:Decoders.Error):Error
export function read <a extends string> (input:any, decoder:Decoders.String):Read<a>
export function read <a extends boolean> (input:any, decoder:Decoders.Boolean):Read<a>
export function read <a extends Float> (input:any, decoder:Decoders.Float):Read<a>
export function read <a extends Integer> (input:any, decoder:Decoders.Integer):Read<a>

export function read <a> (input:any, decoder:Decoders.Ok<a>):Read<a>
export function read <a> (input:any, decoder:Decoders.Undefined<a>):Read<a>
export function read <a> (input:any, decoder:Decoders.Null<a>):Read<a>
export function read <a> (input:any, decoder:Decoders.Maybe<a>):Read<a>
export function read <a> (input:any, decoder:Decoders.NamedMember<a>):Read<a>
export function read <a> (input:any, decoder:Decoders.IndexedMember<a>):Read<a>
export function read <a> (input:any, decoder:Decoders.Either<a>):Read<a>

export function read <array extends a[], a> (input:any, decoder:Decoders.Array<a>):Read<array>
export function read <pair extends [string, a], a> (input:any, decoder:Decoders.Entries<a>):Read<pair>
export function read <dict extends Dictionary<a>, a> (input:any, decoder:Decoders.Dictionary<a>):Read<dict>

export function read <a extends {}> (input:any, decoder:Decoders.BaseStruct):Read<a>
export function read <a extends base & Record<key, value>, base, key extends string, value> (input:any, decoder:Decoders.Extension<a, base, key, value>):Read<a>

export function read <a> (input:any, decoder:Decoder<a>):Read<a>

export function read (input:any, decoder:Decoder<any>):Read<any> {
  switch (decoder.type) {
    case Type.String:
      return readString(input, decoder)
    case Type.Boolean:
      return readBoolean(input, decoder)
    case Type.Integer:
      return readInteger(input, decoder)
    case Type.Float:
      return readFloat(input, decoder)
    case Type.Undefined:
      return readUndefined(input, decoder)
    case Type.Null:
      return readNull(input, decoder)
    case Type.Maybe:
      return readMaybe(input, decoder)
    case Type.Error:
      return readError(input, decoder)
    case Type.Ok:
      return readOk(input, decoder)
    case Type.Array:
      return readArray(input, decoder)
    case Type.Dictionary:
      return readDictionary(input, decoder)
    case Type.Entries:
      return readEntries(input, decoder)
    case Type.NamedMember:
      return readNamedMember(input, decoder)
    case Type.IndexedMember:
      return readIndexedMember(input, decoder)
    case Type.Either:
      return readEither(input, decoder)
    case Type.RecordBase:
      return readRecordBase(input, decoder)
    case Type.RecordExtension:
      return readRecordExtension(input, decoder)
    default:
      throw TypeError('Unknown decoder type')
  }
}

const readString = (input:any, _:Decoder<string>):Read<string> => {
  if (typeof input === 'string') {
    return input
  } else if (input instanceof String) {
    return `${input}`
  } else {
    return new BadPrimitive('a String', input)
  }
}

const readBoolean = (input:any, _:Decoder<boolean>):Read<boolean> => {
  if (input === true) {
    return true
  } else if (input === false) {
    return false
  } else {
    return new BadPrimitive('a Boolean', input)
  }
}

const readInteger = (input:any, _:Decoder<Integer>):Read<Integer> => {
  if (typeof input !== 'number') {
    return new BadPrimitive('an Integer', input)
  }

  if (-2147483647 < input && input < 2147483647 && (input | 0) === input) {
    return <Integer>input
  }

  if (isFinite(input) && !(input % 1)) {
    return <Integer>input
  }

  return new BadPrimitive('an Integer', input)
}

const readFloat = (input:any, _:Decoder<Float>):Read<Float> => {
  if (typeof input == 'number') {
    return <Float>input
  } else {
    return new BadPrimitive('a Float', input)
  }
}

const readUndefined = <a> (input:any, decoder:Decoders.Undefined<a>):Read<a> => {
  if (input === null) {
    return decoder.replacement
  } else {
    return new BadPrimitive('undefined', input)
  }
}


const readNull = <a> (input:any, decoder:Decoders.Null<a>):Read<a> => {
  if (input === null) {
    return decoder.replacement
  } else {
    return new BadPrimitive('null', input)
  }
}

const readError = (_:any, decoder:Decoders.Error):Error => {
  return new Bad(decoder.reason)
}

const readOk = <a> (_:any, decoder:Decoders.Ok<a>):a => {
  return decoder.value
}

const readArray = <a> (input:any, {decoder}:Decoders.Array<a>):Read<a[]> => {
  if (Array.isArray(input)) {
    let index = 0
    const array = []
    for (let element of input) {
      const data = read(element, decoder)
      if (data instanceof Error) {
        return new BadIndex(index, data)
      } else {
        array[index] = data
      }
      index ++
    }
    return array
  } else {
    return new BadPrimitive('an Array', input)
  }
}

const readDictionary = <a> (input:any, {decoder}:Decoders.Dictionary<a>):Read<Dictionary<a>> => {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return new BadPrimitive('an object', input)
  } else {
    const dictionary = Object.create(null)
    for (let key in input) {
      const data = read(input[key], decoder)
      if (data instanceof Error) {
        return new BadField(key, data)
      } else {
        dictionary[key] = data
      }
    }
    return dictionary
  }
}

const readEntries = <a> (input:any, {decoder}:Decoders.Entries<a>):Read<Array<[string, a]>> => {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return new BadPrimitive('an object', input)
  } else {
    const pairs = []
    for (let key in input) {
      const data = read(input[key], decoder)
      if (data instanceof Error) {
        return new BadField(key, data)
      } else {
        const entry:[string, a] = [key, data]
        pairs.push(entry)
      }
    }
    return pairs
  }
}

const readNamedMember = <a> (input:any, {name, decoder}:Decoders.NamedMember<a>):Read<a> => {
  if (typeof input !== 'object' || input === null || (name in input)) {
    return new BadPrimitive(`an object with a field named '${name}'`, input);
  } else {
    const value = input[name]
    const data = read(value, decoder)
    if (data instanceof Error) {
      return new BadField(name, data)
    } else {
      return data
    }
  }
}

const readIndexedMember = <a> (input:any, {index, decoder}:Decoders.IndexedMember<a>):Read<a> => {
  if (!Array.isArray(input)) {
    return new BadPrimitive('an array', input)
  } else if (index >= input.length) {
    return new BadPrimitive(`a longer array. Need index ${index} but there are only ${input.length}  entries`, input)
  } else {
    const data = read(input[index], decoder)
    if (data instanceof Error) {
      return new BadIndex(index, data)
    } else {
      return data
    }
  }
}

const readMaybe = <a> (input:any, {decoder}:Decoders.Maybe<a>):Read<null|a> => {
  const data = read(input, decoder)
  if (data instanceof Error) {
    return null
  } else {
    return data
  }
}

const readEither = <a> (input:any, {decoders}:Decoders.Either<a>):Read<a> => {
  let problems = null
  for (let decoder of decoders) {
    const data = read(input, decoder)
    if (data instanceof Error) {
      problems = problems == null
        ? [data]
        : (problems.push(data), problems)
    } else {
      return data
    }
  }
  
  return new BadEither(problems || [])
}

const readRecordBase = (input:any, _:Decoders.BaseStruct):Read<{}> => {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return new BadPrimitive('an object', input)
    } else {
      return Object.create(null)
    }
}

const readRecordExtension = <base extends {}, key extends string, value> (input:any, decoder:Decoders.Extension<base & Record<key, value>, base, key, value>):Read<base & Record<key, value>> => {
  const {baseDecoder, name, fieldDecoder} = decoder
  const record = read(input, baseDecoder)
  const value = read(input, fieldDecoder)
  if (record instanceof Error) {
    return record
  } else if (value instanceof Error) {
    return value
  } else {
    const extension = <base & Record<key, value>> record
    extension[name] = value
    return extension
  }
}


// export function decode <a extends base & Record<key, value>, base, key extends string, value> (input:any, decoder:Decoders.Extension<a, base, key, value>):Result<Error, a>
// export function decode <a> (input:any, decoder:Decoder<a>):Result<Error, a>
export function decode <a> (input:any, decoder:Decoder<a>):Result<Error, a> {
    const data = read(input, decoder)
    const result = data instanceof Error
      ? error(data)
      : ok(data)
    return result


}


