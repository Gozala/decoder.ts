import {Undefined, Type} from "./Decoder"
import {BadPrimitive, Result} from "./Result"

export default class UndefinedDecoder <a> implements Undefined<a> {
  type:Type.Undefined = Type.Undefined
  constructor(public replacement:a) {
  }
  static decode <a> (input:any, decoder:Undefined<a>):Result<a> {
    if (input === undefined) {
      return decoder.replacement
    } else {
      return new BadPrimitive('undefined', input)
    }
  }
}
