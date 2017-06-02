import {Decoder, Maybe, Type} from "./Decoder"
import {Error, Result} from "./Result"
import * as Any from "./Any"

export class MaybeDecoder <a> implements Maybe<a> {
  type:Type.Maybe = Type.Maybe
  constructor(public decoder:Decoder<a>) {
  }
  static decode <a> (input:any, {decoder}:Maybe<a>):Result<null|a> {
    const data = Any.decode(input, decoder)
    if (data instanceof Error) {
      return null
    } else {
      return data
    }
  }
}

export default MaybeDecoder