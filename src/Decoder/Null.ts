import {Null, Type} from "./Decoder"
import {BadPrimitive, Result} from "./Result"

export default class <a> implements Null<a> {
  type:Type.Null = Type.Null
  constructor(public replacement:a) {
  }
  static decode <a> (input:any, decoder:Null<a>):Result<a> {
    if (input === null) {
      return decoder.replacement
    } else {
      return new BadPrimitive('null', input)
    }
  }
}