import {Type, Decoder, String} from "./Decoder"
import {BadPrimitive, Result} from "./Result"

export default class StringDecoder implements String {
  type:Type.String = Type.String
  static decode(input:any, _:Decoder<string>):Result<string> {
    if (typeof input === 'string') {
      return input
    } else if (input instanceof String) {
      return `${input}`
    } else {
      return new BadPrimitive('a String', input)
    }
  }
}