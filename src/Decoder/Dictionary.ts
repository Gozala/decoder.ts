import {Decoder, Dictionary, Type} from "./Decoder"
import * as Any from "./Any"
import {BadPrimitive, BadField, Error, Result} from "./Result"
import {Dict} from "dictionary.ts"

export class DictionaryDecoder <a> implements Dictionary<a> {
  type:Type.Dictionary = Type.Dictionary
  constructor(public decoder:Decoder<a>) {
  }
  static decode <a> (input:any, {decoder}:Dictionary<a>):Result<Dict<a>> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return new BadPrimitive('an object', input)
    } else {
      const dictionary = Object.create(null)
      for (let key in input) {
        const data = Any.decode(input[key], decoder)
        if (data instanceof Error) {
          return new BadField(key, data)
        } else {
          dictionary[key] = data
        }
      }
      return dictionary
    }
  }
}

export {Dict}

export default DictionaryDecoder