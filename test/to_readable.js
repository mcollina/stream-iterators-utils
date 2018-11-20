'use strict'

const { test } = require('tap')
const { Readable } = require('stream')
const { once, toReadable } = require('..')

test('toReadable basic support', async ({ is }) => {
  async function * generate () {
    yield 'a'
    yield 'b'
    yield 'c'
  }

  const stream = toReadable(generate(), { objectMode: true })

  let expected = ['a', 'b', 'c']

  for await (let chunk of stream) {
    is(chunk, expected.shift())
  }
})

test('toReadable with on(\'data\')', ({ plan, is }) => {
  plan(3)

  async function * generate () {
    yield 'a'
    yield 'b'
    yield 'c'
  }

  const stream = toReadable(generate(), { objectMode: true })

  let expected = ['a', 'b', 'c']

  stream.on('data', (chunk) => {
    is(chunk, expected.shift())
  })
})

// TODO need to test backpressure

test('destroys the stream when throwing', async ({ is }) => {
  async function * generate () {
    throw new Error('kaboom')
  }

  const stream = toReadable(generate(), { objectMode: true })

  stream.read()

  try {
    await once(stream, 'error')
  } catch (err) {
    is(err.message, 'kaboom')
    is(stream.destroyed, true)
  }
})

test('as a transform stream', async ({ is }) => {
  async function * generate (stream) {
    for await (let chunk of stream) {
      yield chunk.toUpperCase()
    }
  }

  const source = new Readable({
    objectMode: true,
    read () {
      this.push('a')
      this.push('b')
      this.push('c')
      this.push(null)
    }
  })

  const stream = toReadable(generate(source), { objectMode: true })

  let expected = ['A', 'B', 'C']

  for await (let chunk of stream) {
    is(chunk, expected.shift())
  }
})
