import {Decoder, Pipeline, Struct, BaseStruct, ExtensionStruct, Type} from "./Decoder"
import {BadPrimitive, Error, Result} from "./Result"
import FieldDecoder from "./Field"
import * as Any from "./Any"

export {BaseStruct, ExtensionStruct, Struct, Pipeline}

export abstract class RecordDecoder<record> implements Pipeline<record> {
  abstract virtual <key extends string, a> (name:key, decoder:Decoder<a>):Struct<record, key, a>
  field <key extends string, a> (name:key, decoder:Decoder<a>):Struct<record, key, a> {
    return this.virtual(name, new FieldDecoder(name, decoder))
  }
}

export class BaseDecoder extends RecordDecoder<{}> implements BaseStruct {
  type:Type.RecordBase = Type.RecordBase
  virtual <k extends string, a> (name:k, decoder:Decoder<a>):Struct<{}, k, a> {
    return new ExtensionDecoder(this, name, decoder)
  }
  static decode(input:any, _:BaseStruct):Result<{}> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return new BadPrimitive('an object', input)
    } else {
      return Object.create(null)
    }
  }
}

export class ExtensionDecoder <base, key extends string, value> extends RecordDecoder<base & Record<key, value>> implements ExtensionStruct<base & Record<key, value>, base, key, value> {
  type:Type.RecordExtension = Type.RecordExtension
  constructor(public baseDecoder:Decoder<base>,
              public name:key,
              public fieldDecoder:Decoder<value>) {
    super()
  }
  virtual <k extends string, a> (name:k, decoder:Decoder<a>):Struct<base & Record<key, value>, k, a> {
    return <Struct<base & Record<key, value>, k, a>> new ExtensionDecoder(this, name, decoder)
  }

  static decode <base extends {}, k extends string, v> (input:any, decoder:ExtensionStruct<base & Record<k, v>, base, k, v>):Result<base & Record<k, v>> {
    const {baseDecoder, name, fieldDecoder} = decoder
    const record = Any.decode(input, baseDecoder)
    const value = Any.decode(input, fieldDecoder)
    if (record instanceof Error) {
      return record
    } else if (value instanceof Error) {
      return value
    } else {
      const extension = <base & Record<k, v>> record
      extension[name] = value
      return extension
    }
  }
}


