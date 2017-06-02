import {Result, ok, error} from "result.ts"
import * as JSON from "json.ts"
import {Decoder, Type} from "./Decoder/Decoder"
import {Error} from "./Decoder/Result"
import * as Any from "./Decoder/Any"

import {Pipeline, BaseStruct} from "./Decoder/Decoder"

import SucceedDecoder from "./Decoder/Succeed"
import UndefinedDecoder from "./Decoder/Undefined"
import NullDecoder from "./Decoder/Null"
import EitherDecoder from "./Decoder/Either"
import AccessorDecoder from "./Decoder/Accessor"
import ArrayDecoder from "./Decoder/Array"
import StringDecoder from "./Decoder/String"
import BooleanDecoder from "./Decoder/Boolean"
import {integer, IntegerDecoder} from "./Decoder/Integer"
import {float, FloatDecoder} from "./Decoder/Float"
import FieldDecoder from "./Decoder/Field"
import {DictionaryDecoder, Dict} from "./Decoder/Dictionary"
import {Entry, Entries, EntriesDecoder} from "./Decoder/Entries"
import IndexDecoder from "./Decoder/Index"
import MaybeDecoder from "./Decoder/Maybe"
import {BaseDecoder} from "./Decoder/Record"

export {Decoder, Error, Result, Entry, Entries, integer, float, Type}

export const always = <a extends JSON.Value> (value:a):Decoder<a> =>
  new SucceedDecoder(value)

export const optional = <a extends JSON.Value> (decoder:Decoder<a>, fallback:a):Decoder<a> =>
  either(decoder, new NullDecoder(fallback), new UndefinedDecoder(fallback), )

export const maybe = <a> (decoder:Decoder<a>):Decoder<null|a> =>
  new MaybeDecoder(decoder)

export const accessor = <a> (name:string, decoder:Decoder<a>):Decoder<a> =>
  new AccessorDecoder(name, decoder)

export const array = <a> (decoder:Decoder<a>):Decoder<a[]> =>
  new ArrayDecoder(decoder)

export const String:Decoder<string> = new StringDecoder()
export const Boolean:Decoder<boolean> = new BooleanDecoder()
export const Integer:Decoder<integer> = new IntegerDecoder()
export const Float:Decoder<float> = new FloatDecoder()


export const field = <a> (name:string, decoder:Decoder<a>):Decoder<a> =>
  new FieldDecoder(name, decoder)

export const index = <a> (index:number, decoder:Decoder<a>):Decoder<a> =>
  new IndexDecoder(index, decoder)

export const at = <a> (path:Array<string>, decoder:Decoder<a>):Decoder<a> =>
  path.reduce((decoder:Decoder<a>, name) => field(name, decoder), decoder)

export const dictionary = <a> (decoder:Decoder<a>):Decoder<Dict<a>> =>
  new DictionaryDecoder(decoder)

export const entries = <a> (decoder:Decoder<a>):Decoder<Entries<a>> =>
  new EntriesDecoder(decoder)


export function either <a, b> (d1:Decoder<a>, d2:Decoder<b>):Decoder<a|b>
export function either <a, b, c> (d1:Decoder<a>,
                                  d2:Decoder<b>,
                                  d3:Decoder<c>):Decoder<a|b|c>
export function either <a, b, c, d> (d1:Decoder<a>,
                                      d2:Decoder<b>,
                                      d3:Decoder<c>,
                                      d4:Decoder<d>):Decoder<a|b|c|d>
export function either <a, b, c, d, e> (d1:Decoder<a>,
                                        d2:Decoder<b>,
                                        d3:Decoder<c>,
                                        d4:Decoder<d>,
                                        d5:Decoder<e>):Decoder<a|b|c|d|e>
export function either <a, b, c, d, e, f> (d1:Decoder<a>,
                                            d2:Decoder<b>,
                                            d3:Decoder<c>,
                                            d4:Decoder<d>,
                                            d5:Decoder<e>,
                                            d6:Decoder<f>):Decoder<a|b|c|d|e|f>
export function either <a, b, c, d, e, f, g> (d1:Decoder<a>,
                                              d2:Decoder<b>,
                                              d3:Decoder<c>,
                                              d4:Decoder<d>,
                                              d5:Decoder<e>,
                                              d6:Decoder<f>,
                                              d7:Decoder<g>):Decoder<a|b|c|d|e|f|g>
export function either <a> (decoder:Decoder<a>, ...rest:Decoder<a>[]):Decoder<a> {
  return new EitherDecoder([decoder, ...rest])
}


const Record = new BaseDecoder()
export const record = ():Pipeline<{}> & BaseStruct =>
  Record

// export function decode <a extends base & Record<key, value>, base, key extends string, value> (input:any, decoder:Decoders.Extension<a, base, key, value>):Result<Error, a>
// export function decode <a> (input:any, decoder:Decoder<a>):Result<Error, a>
export const decode = <a> (input:any, decoder:Decoder<a>):Result<Error, a> => {
  const data = Any.decode(input, decoder)
  const result = data instanceof Error
    ? error(data)
    : ok(data)
  return result
}