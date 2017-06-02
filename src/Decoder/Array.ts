import * as Decoder from "./Decoder"
import * as Any from "./Any"
import {BadPrimitive, BadIndex, Error, Result} from "./Result"



export default class ArrayDecoder <a> implements Decoder.Array<a> {
  type:Decoder.Type.Array = Decoder.Type.Array
  constructor(public decoder:Decoder.Decoder<a>) {
  }
  static decode <a> (input:any, {decoder}:Decoder.Array<a>):Result<a[]> {
    if (Array.isArray(input)) {
      let index = 0
      const array = []
      for (let element of input) {
        const data = Any.decode(element, decoder)
        if (data instanceof Error) {
          return new BadIndex(index, data)
        } else {
          array[index] = data
        }
        index ++
      }
      return array
    } else {
      return new BadPrimitive('an Array', input)
    }
  }
}