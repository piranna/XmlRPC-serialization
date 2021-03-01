# XmlRPC serialization

XmlRPC decode and stringify serialization functions

This package provides helper functions to work with XML-RPC messages format,
with 100% tests code coverage. It doesn't provides any actual processing of the
messages themselves, if you need that, then use
[@piranna/rpc](https://github.com/piranna/RPC) instead.

## API

### decode({childNodes, nodeName})

Decode a XML-RPC message provided as a
[XMLDocument](https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument)
object. It returns a plain object with fields `method` and `params` for method
calls, or `error` and `result` for method responses.

### stringify({error, method, params, result})

Serialize a RPC message provided as a plain object with fields `method` and
`params` for method calls, or `error` and `result` for method responses. It
returns a minimized XML string.
