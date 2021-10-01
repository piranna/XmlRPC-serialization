if(!global.btoa) global.btoa = function(data)
{
  return Buffer.from(data, 'binary').toString('base64');
}


export {default} from './stringify'
