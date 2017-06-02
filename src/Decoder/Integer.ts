import * as Decoder from "./Decoder"
import {BadPrimitive, Result} from "./Result"

export type Integer = number & {tag:"integer"}
export type integer = Integer

export class IntegerDecoder implements Decoder.Integer {
  type:Decoder.Type.Integer = Decoder.Type.Integer
  static decode(input:any, _:Decoder.Decoder<Integer>):Result<Integer> {
    if (Number.isInteger(input)) {
      return <Integer>input
    } else {
      return new BadPrimitive('an Integer', input)
    }
  }
}

export default IntegerDecoder