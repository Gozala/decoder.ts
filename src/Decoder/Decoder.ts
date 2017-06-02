export enum Type {
  String,
  Boolean,
  Integer,
  Float,
  Array,
  Entries,
  Dictionary,
  IndexedMember,
  NamedMember,
  NamedAccessor,
  Maybe,
  Either,
  Null,
  Undefined,
  RecordBase,
  RecordExtension,
  Ok,
  Error
}


export interface String {
  type:Type.String
}

export interface Boolean {
  type:Type.Boolean
}

export interface Integer {
  type:Type.Integer
}

export interface Float {
  type:Type.Float
}

export interface Undefined<a> {
  type:Type.Undefined
  replacement:a
}

export interface Null<a> {
  type:Type.Null
  replacement:a
}


export interface NamedMember<a> {
  type:Type.NamedMember
  name:string
  decoder:Decoder<a>
}

export interface IndexedMember<a> {
  type:Type.IndexedMember
  index:number
  decoder:Decoder<a>
}

export interface NamedAccessor<a> {
  type:Type.NamedAccessor
  name:string
  decoder:Decoder<a>
}

export interface Maybe<a> {
  type:Type.Maybe
  decoder:Decoder<a>
}

export interface Either<a> {
  type:Type.Either
  decoders:Decoder<a>[]
}

export interface Ok<a> {
  type:Type.Ok
  value:a
}

export interface Error {
  type:Type.Error
  reason:string
}

export interface Array <a> {
  type:Type.Array
  decoder:Decoder<a>
}

export interface Entries <a> {
  type:Type.Entries,
  decoder:Decoder<a>
}

export interface Dictionary <a> {
  type:Type.Dictionary
  decoder:Decoder<a>
}

export interface Pipeline <record> {
  virtual <key extends string, a> (name:key, decoder:Decoder<a>):Struct<record, key, a>
  field<key extends string, a> (name:key, decoder:Decoder<a>):Struct<record, key, a>
}

export type Struct <record, key extends string, value> =
  & ExtensionStruct<record & Record<key, value>, record, key, value>
  & Pipeline<record & Record<key, value>>

export interface BaseStruct {
  type:Type.RecordBase
}

export interface ExtensionStruct <record extends base & Record<key, value>, base extends {}, key extends string, value> {
  type:Type.RecordExtension
  baseDecoder:Decoder<base>
  fieldDecoder:Decoder<value>
  name:key
  _?:record
}


export type Decoder <a> =
  | Error
  | String
  | Boolean
  | Float
  | Integer
  | Ok <a>
  | Undefined <a>
  | Null <a>
  | Maybe <a>
  | NamedMember <a>
  | NamedAccessor <a>
  | IndexedMember <a>
  | Either <a>

  | Array <any>
  | Entries <any>
  | Dictionary <any>

  | BaseStruct
  | ExtensionStruct<a, any, any, any>
