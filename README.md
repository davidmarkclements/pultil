# pultil

Granular Utilities for pull-streams


## Funnel

A `funnel` is a convenient way to create `pull.Sink` (a.k.a reader, a.k.a writable) streams

### Requiring funnel

#### Minimal code generation
Generates least amount of code when browserified/webpacked

```javascript
var funnel = require('pultil/funnel');
```

#### Full package:

```javascript
var funnel = require('pultil').funnel;
```

### Funnel API
```javascript
funnel(fn:(data) => end?) => Sink Factory
```

`Funnel` provides a quick and easy way to create 
sinks (i.e. write streams). 

### End signalling
To abort a stream, simply return `true` from the `funnel`

```
var count = 0;
funnel(function (data) {
  if (count++ > 100) { return true; }
  console.log(data);
})
```

### Funnel Example

```javascript
var funnel = require('pultil/funnel');
var src = getSomePullSourceStream();

var sink = funnel(function (data) {
  console.log(data);
})

src().pipe(sink());
```

The above could be created with the more advanced
`wsps.Sink` stream factory (as inherited from `pull-stream`)

```javascript
var wsps = require('websocket-pull-stream')
var ws = new WebSocket('ws://localhost:8081')

var src = wsps(ws);

var sink = wsps.Sink(function (read) {
  read(null, function next (end, data) {
    if (end) { return }
    console.log(data);
    read(null, next)
  })
})

src().pipe(sink());
```
Evidently, `funnel` takes away much of the boiler plate
involved with creating a `Sink` factory. We only need
use `Sink` when `funnel` doesn't supply the required 
flexibility. 


## Tunnel

A `tunnel` is convenient way to create `pull.Through` streams.

### Requiring tunnel

#### Minimal code generation
Generates least amount of code when browserified/webpacked

```javascript
var tunnel = require('pultil/tunnel');
```

#### Full package:

```javascript
var tunnel = require('pultil').tunnel;
```

### Tunnel API
```
tunnel(fn:(data, cb?:(mutation)) => mutation?) => Through Factory
```

### Synchronous Tunnel

```
var syncTransformStream = src.Tunnel(function (data) {
  return data * 100;
})
```

### Asynchronous Tunnel

```
var asyncTransformStream = src.Tunnel(function (data, cb) {
  cb(data / 2)
})
```

### Passthrough style

```
var logStream = src.Tunnel(function (data) {
  console.info('data passing through:', data)
})
```

### Tunnel Example

```javascript
var tunnel = require('pultil/tunnel')
var src = getSomePullSourceStream();

var sink = funnel(function (data) {
  console.log('final', data);
})

var throughA = tunnel(function (data) {
  console.debug('initial', data)
  return data * 100;
})

var throughB = tunnel(function (data) {
  console.info('intermediate', data)
})

var throughC = tunnel(function (data, cb) {
  cb(data / 2)
})

src()
  .pipe(throughA())
  .pipe(throughB())
  .pipe(throughC())
  .pipe(sink());
```