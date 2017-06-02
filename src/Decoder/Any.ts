import {Result} from "./Result"

import {
  Type, Decoder, Error, String, Boolean, Float, Integer, Ok,
  Undefined, Null, Maybe, NamedMember, IndexedMember, NamedAccessor,
  Either, Array, Entries, Dictionary, BaseStruct, ExtensionStruct
} from "./Decoder"

import StringDecoder from "./String"
import BooleanDecoder from "./Boolean"
import {integer, IntegerDecoder} from "./Integer"
import {float, FloatDecoder}  from "./Float"
import UndefinedDecoder from "./Undefined"
import NullDecoder from "./Null"
import EitherDecoder from "./Either"
import FieldDecoder from "./Field"
import AccessorDecoder from "./Accessor"
import ArrayDecoder from "./Array"
import FailDecoder from "./Fail"
import SucceedDecoder from "./Succeed"
import {DictionaryDecoder, Dict} from "./Dictionary"
import EntriesDecoder from "./Entries"
import IndexDecoder from "./Index"
import MaybeDecoder from "./Maybe"
import {BaseDecoder, ExtensionDecoder} from "./Record"

export function decode <a> (input:any, decoder:Error):Result<a>
export function decode <a extends string> (input:any, decoder:String):Result<a>
export function decode <a extends boolean> (input:any, decoder:Boolean):Result<a>
export function decode <a extends float> (input:any, decoder:Float):Result<a>
export function decode <a extends integer> (input:any, decoder:Integer):Result<a>
export function decode <a> (input:any, decoder:Ok<a>):Result<a>
export function decode <a> (input:any, decoder:Undefined<a>):Result<a>
export function decode <a> (input:any, decoder:Null<a>):Result<a>
export function decode <a> (input:any, decoder:Maybe<a>):Result<a>
export function decode <a> (input:any, decoder:NamedMember<a>):Result<a>
export function decode <a> (input:any, decoder:NamedAccessor<a>):Result<a>
export function decode <a> (input:any, decoder:IndexedMember<a>):Result<a>
export function decode <a> (input:any, decoder:Either<a>):Result<a>

export function decode <array extends a[], a> (input:any, decoder:Array<a>):Result<array>
export function decode <pair extends [string, a], a> (input:any, decoder:Entries<a>):Result<pair>
export function decode <dict extends Dict<a>, a> (input:any, decoder:Dictionary<a>):Result<dict>
export function decode <a extends {}> (input:any, decoder:BaseStruct):Result<a>
export function decode <a extends base & Record<key, value>, base, key extends string, value> (input:any, decoder:ExtensionStruct<a, base, key, value>):Result<a>
export function decode <a> (input:any, decoder:Decoder<a>):Result<a>
export function decode (input:any, decoder:Decoder<any>):Result<any> {
  switch (decoder.type) {
    case Type.String:
      return StringDecoder.decode(input, decoder)
    case Type.Boolean:
      return BooleanDecoder.decode(input, decoder)
    case Type.Integer:
      return IntegerDecoder.decode(input, decoder)
    case Type.Float:
      return FloatDecoder.decode(input, decoder)
    case Type.Undefined:
      return UndefinedDecoder.decode(input, decoder)
    case Type.Null:
      return NullDecoder.decode(input, decoder)
    case Type.Maybe:
      return MaybeDecoder.decode(input, decoder)
    case Type.Error:
      return FailDecoder.decode(input, decoder)
    case Type.Ok:
      return SucceedDecoder.decode(input, decoder)
    case Type.Array:
      return ArrayDecoder.decode(input, decoder)
    case Type.Dictionary:
      return DictionaryDecoder.decode(input, decoder)
    case Type.Entries:
      return EntriesDecoder.decode(input, decoder)
    case Type.NamedMember:
      return FieldDecoder.decode(input, decoder)
    case Type.NamedAccessor:
      return AccessorDecoder.decode(input, decoder)
    case Type.IndexedMember:
      return IndexDecoder.decode(input, decoder)
    case Type.Either:
      return EitherDecoder.decode(input, decoder)
    case Type.RecordBase:
      return BaseDecoder.decode(input, decoder)
    case Type.RecordExtension:
      return ExtensionDecoder.decode(input, decoder)
    default:
      throw TypeError('Unknown decoder type')
  }
}
