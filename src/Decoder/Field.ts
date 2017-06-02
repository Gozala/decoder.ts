import {Decoder, NamedMember, Type} from "./Decoder"
import * as Any from "./Any"
import {BadPrimitive, BadField, Error, Result} from "./Result"

export default class FieldDecoder <a> implements NamedMember<a> {
  type:Type.NamedMember = Type.NamedMember
  constructor(public name:string, public decoder:Decoder<a>) {
  }
  static decode <a> (input:any, {name, decoder}:NamedMember<a>):Result<a> {
    if (typeof input !== 'object' || input === null || !(name in input)) {
      return new BadPrimitive(`an object with a field named '${name}'`, input);
    } else {
      const value = input[name]
      const data = Any.decode(value, decoder)
      if (data instanceof Error) {
        return new BadField(name, data)
      } else {
        return data
      }
    }
  }
}