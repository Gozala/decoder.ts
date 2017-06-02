import * as Decoder from "./Decoder"
import {Bad, Error} from "./Result"

export default class FailDecoder implements Decoder.Error {
  type:Decoder.Type.Error = Decoder.Type.Error
  constructor(public reason:string) {
  }
  static decode (_:any, decoder:Decoder.Error):Error {
    return new Bad(decoder.reason)
  }
}