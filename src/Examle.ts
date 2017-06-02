import {record, Integer, String, at, optional, always, decode, Error} from "./Decoder"
import * as Any from "./Decoder/Any"
import * as Decoder from "./Decoder"

const profile = record()
  .field('id', Integer)
  .field('email', String)
  .field('name', optional(String, ''))
  .field('followers', always(0))
  .virtual('other', at(['_private', 'messages', 'count'], String))

const user = Any.decode('foo', profile)
if (!(user instanceof Error)) {
  user.name.toUpperCase()
  user.email.split('@')
  user.id.toFixed()
  user.followers + 2
  user.other.toUpperCase()
}

const user2 = decode('foo', Decoder.maybe(profile))
if (user2.isOk) {
  if (user2.value != null) {
    const user = user2.value
    user.name.toUpperCase()
    user.email.split('@')
    user.id.toFixed()
    user.followers + 2
    user.other.toUpperCase()
  }
}

Decoder.String

// var s = decode('foo', Decoder.string)
// var b = decode(null, Decoder.boolean)
// var f = decode('bar', Decoder.float)
// var i = decode('foo', Decoder.integer)
// var u = decode('bar', Decoder.decodeUndefined(5))
// var n = decode(null, Decoder.decodeNull(''))
// var m = decode(null, Decoder.maybe(profile))
// var mem = decode(null, Decoder.field('foo', Decoder.string))
// var idx = decode(null, Decoder.index(5, Decoder.float))
// var ok = decode(null, Decoder.succeed({ hello: 'you'}))
// var notok = decode(null, Decoder.fail('whatever'))
// var arr = decode(null, Decoder.array(Decoder.array(Decoder.integer)))
// var kv = decode(null, Decoder.entries(Decoder.array(Decoder.float)))
// var dict = decode(null, Decoder.dictionary(Decoder.array(Decoder.float)))

// // TODO:!!!
// var wtv = decode(null, Decoder.either(Decoder.string, Decoder.boolean))


