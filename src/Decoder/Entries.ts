import * as Decoder from "./Decoder"
import * as Any from "./Any"
import {BadPrimitive, BadField, Error, Result} from "./Result"

export type Entry <a> = [string, a]
export type Entries <a> = Entry<a>[]

export class EntriesDecoder <a> implements Decoder.Entries<a> {
  type:Decoder.Type.Entries = Decoder.Type.Entries
  constructor(public decoder:Decoder.Decoder<a>) {
  }
  static decode <a> (input:any, {decoder}:Decoder.Entries<a>):Result<Entries<a>> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return new BadPrimitive('an object', input)
    } else {
      const pairs = []
      for (let key in input) {
        const data = Any.decode(input[key], decoder)
        if (data instanceof Error) {
          return new BadField(key, data)
        } else {
          const entry:[string, a] = [key, data]
          pairs.push(entry)
        }
      }
      return pairs
    }
  }
}

export default EntriesDecoder
