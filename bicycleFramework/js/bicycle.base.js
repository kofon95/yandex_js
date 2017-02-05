// set html(content)
// get html()
bicycle.extensions.html = function(content){
  // set
  if (arguments.length){
    for (var it of this)
      it.innerHTML = content;
    return this;
  }
  // get
  else {
    if (this.length !== 1)
      throw Error("There's more or less than one element consisted");
    
    var elem = this.toArray()[0];
    return elem.innerHTML;
  }
}

bicycle.extensions.text = function(content){
  // set
  if (arguments.length){
    for (var it of this)
      it.textContent = content;
    return this;
  }
  // get
  else {
    if (this.length !== 1)
      throw Error("There's more or less than one element consisted");
    
    var elem = this.toArray()[0];
    return elem.textContent;
  }
}

bicycle.extensions.val = function(content){
  // set
  if (arguments.length){
    for (var it of this){
      if (!(it instanceof HTMLInputElement))
        throw TypeError(it + " is not a input element");
      it.value = content;
    }
    return this;
  }
  // get
  else {
    if (this.length !== 1)
      throw Error("There's more or less than one element consisted");
    
    var elem = this.toArray()[0];
    if (!(elem instanceof HTMLInputElement))
      throw TypeError(elem + " is not a input element");
    return elem.value;
  }
}

bicycle.extensions.on = function(eventType, callback, useCapture){
  for (var elem of this){
    elem.addEventListener(eventType, callback, useCapture);
  }
  return this;
}

bicycle.extensions.off = function(eventType, callback, useCapture){
  for (var elem of this){
    elem.removeEventListener(eventType, callback, useCapture);
  }
  return this;
}

bicycle.extensions.onceOn = function(eventType, callback, useCapture){
  for (var elem of this){
    elem.addEventListener(eventType, function(){
      callback.apply(this, arguments);
      this.removeEventListener(eventType, arguments.callee);
    }, useCapture);
  }
  return this;
}

bicycle.extensions.style = function(key, value){
  // get
  if (arguments.length === 1){
    if (this.length !== 1) throw Error("length != 1");

    var elem = this.first();
    var styleValue = elem.style[key];
    if (styleValue === void 0) throw Error("Incorrect style: " + key);
    if (styleValue === "") styleValue = getComputedStyle(elem)[key];
    return styleValue;
  }
  // set
  else if (arguments.length >= 2) {
    for (var it of this) it.style[key] = value;
    return this;
  } else throw Error("Count of arguments cannot be zero");
}