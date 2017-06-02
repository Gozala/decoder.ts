import {Type, Decoder, Either} from "./Decoder"
import {BadEither, Error, Result} from "./Result"
import * as Any from "./Any"


export default class EitherDecoder <a> implements Either<a> {
  type:Type.Either = Type.Either
  constructor(public decoders:Decoder<a>[]) {
  }
  static decode <a> (input:any, {decoders}:Either<a>):Result<a> {
    let problems = null
    for (let decoder of decoders) {
      const data = Any.decode(input, decoder)
      if (data instanceof Error) {
        problems = problems == null
          ? [data]
          : (problems.push(data), problems)
      } else {
        return data
      }
    }
    
    return new BadEither(problems || [])
  }
}



