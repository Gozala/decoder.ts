import * as Decoder from "./Decoder"
import {BadPrimitive, Result} from "./Result"

export type Float = number
export type float = Float

export class FloatDecoder implements Decoder.Float {
  type:Decoder.Type.Float = Decoder.Type.Float
  static decode(input:any, _:Decoder.Decoder<Float>):Result<Float> {
    if (Number.isFinite(input)) {
      return <Float>input
    } else {
      return new BadPrimitive('a Float', input)
    }
  }
}

export default FloatDecoder



