import * as Decoder from "./Decoder"

export default class SucceedDecoder <a> implements Decoder.Ok<a> {
  type:Decoder.Type.Ok = Decoder.Type.Ok
  constructor(public value:a) {

  }
  static decode <a> (_:any, decoder:Decoder.Ok<a>):a {
    return decoder.value
  }
}
