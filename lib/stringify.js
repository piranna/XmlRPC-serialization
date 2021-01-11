function data(values)
{
  return `<data>${values.map(value)}</data>`
}

function member([key, val])
{
  return `<member><name>${key}</name>${value(val)}</member>`
}

function members(value)
{
  const entries = Object.entries(value)

  if(!entries.length) return ''

  return entries.map(member).join('')
}

function sParams(params)
{
  if(!params?.length) return ''

  return `<params>${params.map(param)}</params>`
}

function param(param)
{
  return `<param>${value(param)}</param>`
}

function value(value)
{
  if(value == null) return ''

  let type

  if(Array.isArray(value))
  {
    type = 'array'
    value = data(value)
  }

  else if(Number.isInteger(value))
    type = 'i4'

  else if(typeof value === 'number')
    type = 'double'

  else if(typeof value === 'string')
    type = 'string'

  else if(typeof value === 'boolean')
  {
    type = 'boolean'
    value = value ? 1 : 0
  }

  else if(value instanceof Date)
  {
    type = 'dateTime.iso8601'
    value = value.toISOString()
  }

  else if(value instanceof ArrayBuffer)
  {
    type = 'base64'
    value = btoa(value)
  }

  else
  {
    type = 'struct'
    value = members(value)
  }

  return `<value><${type}>${value}</${type}></value>`
}


export default function({error, method, params, result})
{
  if(method)
    return `<?xml version="1.0"?><methodCall><methodName>${method}</methodName>${sParams(params)}</methodCall>`

  const methodResponse = error
  ? `<fault>${value({faultCode: error.code, faultString: error.message})}</fault>`
  : sParams(result !== undefined ? [result] : '')

  return `<?xml version="1.0"?><methodResponse>${methodResponse}</methodResponse>`
}
