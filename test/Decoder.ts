import * as Decoder from ".."
import * as test from "blue-tape"
import * as Result from "result.ts"
import * as JSON from "json.ts"


test("exports", async test => {
  test.equal(typeof Decoder, "object")
  test.equal(typeof Decoder.Type, "object")
  test.equal(typeof Decoder.decode, 'function')
  test.deepEqual(typeof Decoder.String, 'object')
  test.deepEqual(typeof Decoder.Boolean, 'object')
  test.deepEqual(typeof Decoder.Integer, 'object')
  test.deepEqual(typeof Decoder.Float, 'object')
  test.deepEqual(typeof Decoder.array, 'function')
  test.deepEqual(typeof Decoder.dictionary, 'function')
  test.deepEqual(typeof Decoder.entries, 'function')
  test.deepEqual(typeof Decoder.field, 'function')
  test.deepEqual(typeof Decoder.index, 'function')
  test.deepEqual(typeof Decoder.accessor, 'function')
  test.deepEqual(typeof Decoder.at, 'function')
  test.deepEqual(typeof Decoder.maybe, 'function')
  test.deepEqual(typeof Decoder.optional, 'function')
  test.deepEqual(typeof Decoder.always, 'function')
  test.deepEqual(typeof Decoder.either, 'function')
  test.deepEqual(typeof Decoder.record, 'function')
})

test("Decoder.String", async test => {
  test.deepEqual(Decoder.String, {type:Decoder.Type.String})
  assert(Decoder.String,
          inputs,
          {
            '""': Result.ok(""),
            'new String("")': Result.ok(""),
            '"hello"': Result.ok("hello"),
            'new String("Hello")': Result.ok("Hello"),
          },
          (decoder, input, expect, key) =>
            test.deepEqual(format(Decoder.decode(input, decoder)),
                            expect || Result.error(`Expecting a String but instead got: \`${key}\``),
                            `Decoder.decode(${key}, Decoder.String)`))
})

test("Decoder.Boolean", async test => {
  test.deepEqual(Decoder.Boolean, {type:Decoder.Type.Boolean})

  assert(Decoder.Boolean,
          inputs,
          {
            'true': Result.ok(true),
            'false': Result.ok(false)
          },
          (decoder, input, expect, key) =>
            test.deepEqual(format(Decoder.decode(input, decoder)),
                            expect || Result.error(`Expecting a Boolean but instead got: \`${key}\``),
                            `Decoder.decode(${key}, Decoder.Boolean)`))
})

test("Decoder.Integer", async test => {
  test.deepEqual(Decoder.Integer, {type:Decoder.Type.Integer})

  assert(Decoder.Integer,
          inputs,
          {
            '0': Result.ok(0),
            '-15': Result.ok(-15),
            '15': Result.ok(15),
          },
          (decoder, input, expect, key) =>
            test.deepEqual(format(Decoder.decode(input, decoder)),
                            expect || Result.error(`Expecting an Integer but instead got: \`${key}\``),
                            `Decoder.decode(${key}, Decoder.Integer)`))
})

test("Decoder.Float", async test => {
  test.deepEqual(Decoder.Float, {type:Decoder.Type.Float})

  assert(Decoder.Float,
          inputs,
          {
            '0': Result.ok(0),
            '-15': Result.ok(-15),
            '15': Result.ok(15),
            '0.2': Result.ok(0.2),
            '-9.8': Result.ok(-9.8),
          },
          (decoder, input, expect, key) =>
            test.deepEqual(format(Decoder.decode(input, decoder)),
                            expect || Result.error(`Expecting a Float but instead got: \`${key}\``),
                            `Decoder.decode(${key}, Decoder.Float)`))
})

test("Dedoder.always", async test => {
  for (let value of [4, null, true, false, {a:5}, [{a:5}]]) {
    const show = JSON.stringify(value).toValue('')
    test.deepEqual(
      Decoder.always(value),
      {type:Decoder.Type.Ok, value},
      `Decoder.always(${show}) : {type:Decoder.Type.Ok, value:${show}}`)

    assert(Decoder.always(value),
            inputs,
            {},
            (decoder, input, expect, key) =>
              test.deepEqual(format(Decoder.decode(input, decoder)),
                              expect || Result.ok(value),
                              `Decoder.decode(${key}, Decoder.always(${show})) -> Result.ok(${show})`))
  }
})


test("Decoder.optional", async test => {
  const options = [
    // { decoder:Decoder.Float,
    //   fallback:4,
    //   name: 'Decoder.Float',
    //   expect: {

    //   }
    // },
    // {
    //   decoder:Decoder.Integer,
    //   fallback:7,
    //   name: 'Decoder.Integer',
    //   expect: {

    //   }
    // },
    {
      decoder:Decoder.String,
      fallback: '<nothing>',
      name: 'Decoder.String',
      expect: {
        '""': Result.ok(""),
        'new String("")': Result.ok(""),
        '"hello"': Result.ok("hello"),
        'new String("Hello")': Result.ok("Hello"),
        'null':Result.ok('<nothing>'),
        'undefined': Result.ok('<nothing>')
      }
    }
  ]


  for (let {decoder, fallback, name, expect} of options) {
    const show = `Decoder.optional(${name}, ${JSON.stringify(fallback).toValue('')})`
    test.deepEqual(Decoder.optional(decoder, fallback),
                    {
                      type:Decoder.Type.Either,
                      decoders: [
                        decoder,
                        {
                          type: Decoder.Type.Null,
                          replacement: fallback
                        },
                        { type: Decoder.Type.Undefined,
                          replacement: fallback
                        }
                      ]
                    },

                    `${show} : { type: Decoder.Type.Either, decoders: [...] }`)

    assert(Decoder.optional(decoder, fallback),
            inputs,
            expect,
            (decoder, input, expect, key) =>
              test.deepEqual(format(Decoder.decode(input, decoder)),
                              expect || Result.error(`I ran into the following problems:

Expecting a String but instead got: \`${key}\`
Expecting null but instead got: \`${key}\`
Expecting undefined but instead got: \`${key}\``),
                              `Decoder.decode(${key}, ${show})`))
  }
})


const format = <a> (result:Result.Result<Error, a>):Result.Result<string, a> =>
  Result.format(error => error.message, result)

type Assert <a> =
  (state:a, input:any, expect:any, key:string) => void

const assert = <a> (init:a,
                    inputs:{[key:string]: any},
                    expect:{[key:string]: any},
                    assert:Assert<a>):void => {
  for (let key of Object.keys(inputs)) {
    assert(init, inputs[key], expect[key], key)
  }
}

const inputs = {
  'null': null,
  'undefined': undefined,
  'true': true,
  'false': false,
  'new Boolean(true)':  new Boolean(true),
  'new Boolean(false)': new Boolean(false),
  '0': 0,
  'new Number(0)': new Number(0),
  '-15': -15,
  'new Number(-15)': new Number(-15),
  '15': 15,
  'new Number(15)': new Number(15),
  '0.2': 0.2,
  'new Number(0.2)': new Number(0.2),
  '-9.8': -9.8,
  'new Number(-9.8)': new Number(-9.8),
  'Infinity': Infinity,
  '-Infinity': -Infinity,
  'NaN': NaN,
  '[]':[],
  '[7]': [7],
  '["foo"]': ["foo"],
  '[true]': [true],
  '[false]': [false],
  '""': "",
  'new String("")': new String(""),
  '"hello"': "hello",
  'new String("Hello")': new String("Hello"),
  'Symbol(foo)': Symbol("foo"),
  '{"a":2}': {a: 2}
}