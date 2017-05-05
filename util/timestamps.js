(function() {
  let x = console.log;
  console.log = function() {
   x.apply(console, [new Date().toUTCString() + " |||", ...arguments]);
  };

  let y = console.error;
  console.error = function() {
   y.apply(console, [new Date().toUTCString() + " |||", ...arguments]);
  };
})();
