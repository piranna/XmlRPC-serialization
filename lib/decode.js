const ELEMENT_NODE = 1


function methodCall(childNodes)
{
  let method, params

  for(const child of Array.from(childNodes))
  {
    const {nodeName, nodeType, textContent} = child

    if (nodeType !== ELEMENT_NODE) continue

    switch(nodeName)
    {
      case 'methodName':
      {
        if(method !== undefined)
          throw new Error(`Duplicated node '${nodeName}'`)

        method = textContent
      }
      break

      case 'params':
      {
        if(params !== undefined)
          throw new Error(`Duplicated node '${nodeName}'`)

        params = parseParams(child)
      }
      break

      default:
        throw new Error(`Unknown node '${nodeName}'`)
    }
  }

  return {method, params}
}

function methodResponse(childNodes)
{
  const children = Array.prototype.filter.call(childNodes, filterElements)

  if(children.length > 1) throw new SyntaxError('Invalid methodResponse')

  let error, result

  const [child] = children
  if(child)
  {
    const {firstChild, nodeName} = child

    switch(nodeName)
    {
      case 'fault' : error  = parseValue (firstChild); break
      case 'params': result = parseParams(child)[0]  ; break

      default:
        throw new Error(`Unknown node '${nodeName}'`)
    }
  }

  return {error, result}
}


function filterElements({nodeType})
{
  return nodeType === ELEMENT_NODE
}

function parseArray({firstChild: {childNodes}})
{
  return Array.prototype.filter.call(childNodes, filterElements).map(parseValue)
}

function parseMember(acum, {childNodes})
{
  let name, value

  for(const child of childNodes)
  {
    const {nodeName, nodeType, textContent} = child

    if (nodeType !== ELEMENT_NODE) continue

    switch(nodeName)
    {
      case 'name':
      {
        if(name !== undefined)
          throw new Error(`Duplicated node '${nodeName}'`)

        name = textContent
      }
      break

      case 'value':
      {
        if(value !== undefined)
          throw new Error(`Duplicated node '${nodeName}'`)

        value = parseValue(child)
      }
      break

      default:
        throw new Error(`Unknown node '${nodeName}'`)
    }
  }

  acum[name] = value

  return acum
}

function parseParam({firstChild})
{
  return parseValue(firstChild)
}

function parseParams({childNodes})
{
  return Array.prototype.filter.call(childNodes, filterElements).map(parseParam)
}

function parseStruct(childNodes)
{
  return Array.prototype.filter
  .call(childNodes, filterElements)
  .reduce(parseMember, {})
}

function parseValue(
  {firstChild: {childNodes, firstChild, nodeName, textContent}}
) {
  switch(nodeName)
  {
    case 'array': return parseArray(firstChild)

    case 'base64': return atob(textContent)

    case 'boolean': return Boolean(textContent)

    case 'dateTime.iso8601': return new Date(textContent)

    case 'double': return parseFloat(textContent)

    case 'i4':
    case 'int': return parseInt(textContent)

    case 'string': return textContent

    case 'struct': return parseStruct(childNodes)
  }

  throw new Error(`Unknown node '${nodeName}'`)
}


export default function({childNodes, nodeName})
{
  switch(nodeName)
  {
    case 'methodCall'    : return methodCall    (childNodes)
    case 'methodResponse': return methodResponse(childNodes)
  }

  throw new Error(`Unknown node '${nodeName}'`)
}
