import {NamedAccessor, Type, Decoder} from "./Decoder"
import * as Any from "./Any"
import {BadPrimitive, BadField, BadAccessor, Error, Result} from "./Result"

export class AccessorDecoder <a> implements NamedAccessor<a> {
  type:Type.NamedAccessor = Type.NamedAccessor
  constructor(public name:string, public decoder:Decoder<a>) {
  }
  static decode <a> (input:any, {name, decoder}:NamedAccessor<a>):Result<a> {
    if (input == null || !(name in input)) {
      return new BadPrimitive(`an object with a field named '${name}'`, input);
    } else {
      try {
        const value = input[name]()
        const data = Any.decode(value, decoder)
        if (data instanceof Error) {
          return new BadField(name, data)
        } else {
          return data
        }
      } catch (error) {
        return new BadAccessor(name, error)
      }
    }
  }
}

export default AccessorDecoder