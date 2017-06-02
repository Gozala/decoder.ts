import {Type, Decoder, Boolean} from "./Decoder"
import {BadPrimitive, Result} from "./Result"


export default class BooleanDecoder implements Boolean {
  type:Type.Boolean = Type.Boolean
  static decode(input:any, _:Decoder<boolean>):Result<boolean> {
    if (input === true) {
      return true
    } else if (input === false) {
      return false
    } else {
      return new BadPrimitive('a Boolean', input)
    }
  }
}
