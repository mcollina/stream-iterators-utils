# Stream Iterators Utils

[![Build Status](https://travis-ci.com/mcollina/stream-iterators-utils.svg?branch=master)](https://travis-ci.com/mcollina/stream-iterators-utils)

This is a toolbelt of functions to facilitate the usage of async
iterators with Streams in Node.js. Requires Node 10+.

## Install

```
npm i stream-iterators-utils
```

## API

### utils.toReadable(generator, opts)

Create a new `Readable` stream from the async generator. `opts` are
passed to the `Readable` constructor

```js
const { toReadable } = require('stream-iterators-utils')

async function * generate () {
  yield 'a'
  yield 'b'
  yield 'c'
}

const stream = toReadable(generate(), { objectMode: true })

stream.on('data', (chunk) => {
  console.log(chunk)
})
```

### utils.once(emitter, event)

Creates a promise that is resolved when the `EventEmitter` emits the
given event or `'error'`.

```js
const { once } = require('stream-iterators-utils')

async function run () {
  const ee = new EventEmitter()

  process.nextTick(() => {
    ee.emit('myevent', 42)
  })

  const [value] = await once(ee, 'myevent')

  const err = new Error('kaboom')
  process.nextTick(() => {
    ee.emit('error', err)
  })

  try {
    await once(ee, 'myevent')
  } catch (err) {
    console.log('error happened', err)
  }
}

run()
```

## License

MIT
