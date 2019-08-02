const helper = { random: null, map: null, color: null }

helper.random = ( from, to ) => Math.floor( Math.random() * ( to - from ) + from )

helper.map = ( input, inputFrom, inputTo, outputFrom, outputTo ) =>
  ( input - inputFrom ) * ( outputTo - outputFrom ) / ( inputTo - inputFrom ) + outputFrom

helper.color = ( brightness ) => {

  let luminance = 40

  if ( brightness === 'dark' ) luminance /= 2
  else if ( brightness === 'light' ) luminance *= 2

  return `hsl( ${ helper.random( 0, 360 ) }, ${ helper.random( 0, 101 ) }%, ${ luminance }% )`

}

export default helper
