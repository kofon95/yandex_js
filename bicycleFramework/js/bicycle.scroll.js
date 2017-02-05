bicycle.extensions.scroll = function(){
  if (this.length !== 1)
    throw Error("scroll works only with one element. There's " + this.length);

  var elem = this.first();
  window.scroll(0, elem.offsetTop);
}