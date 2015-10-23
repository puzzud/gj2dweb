/*jshint -W069*/

// Function to facilitate Javascript "class" inheritence.
function extend( subConstructor, superConstructor )
{
  var constructor =
  {
    constructor:
    {
      value: subConstructor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  };
  
  subConstructor.prototype = Object.create( superConstructor.prototype, constructor );
}

window["extend"] = extend; // Google Closure

// Function to provide traditional string comparison.
// Returns -1, if string1 < string2.
// Returns  0, if string1 === string2.
// Returns  1, if string1 > string2.
function strcmp( string1, string2 )
{
  return string1 < string2 ? -1 : ( string1 > string2 ? 1 : 0 );
}

window["strcmp"] = strcmp; // Google Closure
