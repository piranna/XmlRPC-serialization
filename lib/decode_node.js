if(!global.atob) global.atob = function(data)
{
  return Buffer.from(data, 'base64').toString('binary');
}


export {default} from './decode'
