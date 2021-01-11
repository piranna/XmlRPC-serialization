function methodCall(children)
{
  let method, params

  for(const child of children)
  {
    const {nodeName, textContent} = child

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

function methodResponse(children)
{
  let error, result

  for(const child of children)
  {
    const {firstElementChild, nodeName} = child

    switch(nodeName)
    {
      case 'fault':
      {
        if(error !== undefined)
          throw new Error(`Duplicated node '${nodeName}'`)

        error = parseValue(firstElementChild)
      }
      break

      case 'params':
      {
        if(result !== undefined)
          throw new Error(`Duplicated node '${nodeName}'`)

        result = parseParams(child)[0]
      }
      break

      default:
        throw new Error(`Unknown node '${nodeName}'`)
    }
  }

  return {error, result}
}


function parseArray({firstElementChild})
{
  return firstElementChild.children.map(parseValue)
}

function parseMember(acum, {children})
{
  let name, value

  for(const child of children)
  {
    const {nodeName, textContent} = child

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

function parseParam({firstElementChild})
{
  return parseValue(firstElementChild)
}

function parseParams({children})
{
  return Array.from(children).map(parseParam)
}

function parseStruct(children)
{
  return children.reduce(parseMember, {})
}

function parseValue(
  {firstElementChild: {children, firstElementChild, nodeName, textContent}}
) {
  switch(nodeName)
  {
    case 'array': return parseArray(firstElementChild)

    case 'base64': return btoa(textContent)

    case 'boolean': return Boolean(textContent)

    case 'dateTime.iso8601': return new Date(textContent)

    case 'double': return parseFloat(textContent)

    case 'i4':
    case 'int': return parseInt(textContent)

    case 'string': return textContent

    case 'struct': return parseStruct(children)
  }

  throw new Error(`Unknown node '${nodeName}'`)
}


export default function({children, nodeName})
{
  switch(nodeName)
  {
    case 'methodCall'    : return methodCall    (children)
    case 'methodResponse': return methodResponse(children)
  }

  throw new Error(`Unknown node '${nodeName}'`)
}
