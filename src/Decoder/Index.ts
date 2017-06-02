import {Decoder, IndexedMember, Type} from "./Decoder"
import * as Any from "./Any"
import {BadPrimitive, BadIndex, Error, Result} from "./Result"


export class IndexDecoder <a> implements IndexedMember<a> {
  type:Type.IndexedMember = Type.IndexedMember
  constructor(public index:number, public decoder:Decoder<a>) {
  }
  static decode <a> (input:any, {index, decoder}:IndexedMember<a>):Result<a> {
    if (!Array.isArray(input)) {
      return new BadPrimitive('an array', input)
    } else if (index >= input.length) {
      return new BadPrimitive(`a longer array. Need index ${index} but there are only ${input.length}  entries`, input)
    } else {
      const data = Any.decode(input[index], decoder)
      if (data instanceof Error) {
        return new BadIndex(index, data)
      } else {
        return data
      }
    }
  }

}

export default IndexDecoder