(function() {
  let x = console.log;
  console.log = function() {
   x.apply(console, [Date.now() + " |||", ...arguments]);
  };

  let y = console.error;
  console.error = function() {
   y.apply(console, [Date.now() + " |||", ...arguments]);
  };
})();
