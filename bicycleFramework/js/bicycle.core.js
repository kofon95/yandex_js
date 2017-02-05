(function() {

  /**
   * Pushes in "result" found elements
   * @param {HTMLElement|string} [querySelector]
   * @param {HTMLElement} [dom]
   * @param {HTMLElement[]=} [result]
   * @returns {HTMLElement[]} Taken parameter "result"
   */
  function convertElements(querySelector, dom, result){
    if (!result) result = [];

    var iter = dom.querySelectorAll(querySelector);
    iter.forEach(function(elem){ result.push(elem); });

    return result;
  }

  function select(stringOrArrayOrElement, dom){
    var items;
    
    if (isElement(stringOrArrayOrElement))
      items = [stringOrArrayOrElement];
    else if (typeof stringOrArrayOrElement === "string" || stringOrArrayOrElement instanceof String)
      items = convertElements(stringOrArrayOrElement, dom);
    else if (Array.isArray(stringOrArrayOrElement)){
      var t = [];
      stringOrArrayOrElement.forEach(function(it){
        if (isElement(it))
          t.push(it);
        else if (typeof it === "string" || it instanceof String)
          convertElements(it, dom, t);
        else
          throw TypeError("Argument, which's the array, has unknown element: " + it);
      });
      items = t;
    }
    else
      throw TypeError("Wrong argument taken: " + stringOrArrayOrElement);

    return items;
  }

  function selectAny(stringOrArrayOrElementOrSelf, dom){
    if (stringOrArrayOrElementOrSelf instanceof framework)
      return stringOrArrayOrElementOrSelf._items;
    return select(stringOrArrayOrElementOrSelf, dom);
  }

  function getAncestryPosition(elem, dom){
    var count = 0;
    while (elem !== dom) {
      if ((elem = elem.parentNode) === null) return -1;
      count++;
    }
    return count;
  }

  // for instance:
  // "body" has child "one" which has "two" as child too. "dom" is body's parent
  // <body> <one> <two> </two> </one> </body>
  // ([one, body, one, two]) => [[body, one, two], [1, 2, 3]]
  // ([one, body, two, head, two]) =>
  //   [[body, head, one, two], [1, 1, 2, 3]] or
  //   [[head, body, one, two], [1, 1, 2, 3]]
  // in case "dom" is body, there's only one less result
  function sortByDepthAndRemoveDuplicate(elems, dom){
    var sortedIndexes = [];
    elems.forEach(function(it, i){
      var depth = getAncestryPosition(it, dom);
      if (depth < 0) throw Error("dom doesn't includes element with index: " + i);
      if (!sortedIndexes[depth]) sortedIndexes[depth] = [];

      var hasDuplicate = false;
      for (var j = 0; j < sortedIndexes[depth].length; j++){
        if (elems[sortedIndexes[depth][j]] === elems[i]){
          hasDuplicate = true;
          break;
        }
      }
      if (!hasDuplicate)
        sortedIndexes[depth].push(i);
    });

    var items = [];
    var depths = [];
    sortedIndexes.forEach(function(it, depth){
      // if (!it) return;
      it.forEach(function(i){
        items.push(elems[i])
        depths.push(depth);
      });
    });
    return [items, depths];  // elems and depth
  }
  
  var framework = function(stringOrArrayOrElement, dom) {
    var items = stringOrArrayOrElement ? select(stringOrArrayOrElement, dom) : [];
    this._dom = dom;
    this._items = items;
    this.refine();
  }

  // sorts removes and duplicate
  framework.prototype.refine = function(){
    var sorted = sortByDepthAndRemoveDuplicate(this._items, this._dom);
    this._items = sorted[0];
    this._depthsForEveryItem = sorted[1];
    return this;
  };

  var _main = function(stringOrArrayOrElementOrSelf, dom){
    if (stringOrArrayOrElementOrSelf instanceof framework) return stringOrArrayOrElementOrSelf;
    if (dom === void 0) dom = document;
    return new framework(stringOrArrayOrElementOrSelf, dom);
  };

  // O(log(n) + (count of elements with the same depth))
  framework.prototype.contains = function(elem){
    if (!isElement(elem)) throw TypeError("elem must be instance of HTMLElement");
    var depth = getAncestryPosition(elem, this._dom);

    var f = 0;
    var l = this._depthsForEveryItem.length;
    while (f < l){
      var m = Math.floor((l-f)/2) + f;
      if (depth <= this._depthsForEveryItem[m])
        l = m;
      else if (depth > this._depthsForEveryItem[m])
        f = m+1;
    }
    
    if (depth !== this._depthsForEveryItem[f]) return false;

    for (var i = f-1; i >= 0 && this._depthsForEveryItem[i] === depth; i--) {
      if (this._items[i] === elem) return true;
    }

    for (var i = f; i < this._depthsForEveryItem.length && this._depthsForEveryItem[i] === depth; i++) {
      if (this._items[i] === elem) return true;
    }

    return false;
  }

  // O(n)
  framework.prototype.combines = function(any){
    items = selectAny(any, this._dom).concat(this._items);
    return new framework(items, this._dom);
  };

  // O(n^m)  // todo: reduce complexity. Calc the depths for both...
  framework.prototype.excludes = function(any){
    var items = selectAny(any, this._dom);
    var isSubtracts = Array(this._items.length).fill(false);
    for (var i = 0; i < this._items.length; i++) {
      for (var j = 0; j < items.length; j++) {
        if (this._items[i] === items[j]){
          isSubtracts[i] = true;
        }
      }
    }

    var result = [];
    for (var i = 0; i < this._items.length; i++) {
      if (!isSubtracts[i])
        result.push(this._items[i]);
    }
    return new framework(result, this._dom);
  }

  framework.prototype.intersects = function(any){
    var items = selectAny(any, this._dom);
    var isSubtracts = Array(this._items.length).fill(false);
    for (var i = 0; i < this._items.length; i++) {
      for (var j = 0; j < items.length; j++) {
        if (this._items[i] === items[j]){
          isSubtracts[i] = true;
        }
      }
    }

    var result = [];
    for (var i = 0; i < this._items.length; i++) {
      if (isSubtracts[i])
        result.push(this._items[i]);
    }
    return new framework(result, this._dom);
  }


  framework.prototype.clone = function(){
    return new framework(this._items.slice(), this._dom);
  }
  framework.prototype.toArray = function(){
    return this._items.slice.apply(this._items, arguments);
  }
  framework.prototype.first = function(){
    if (this._items.length === 0) throw Error("Empty!");
    return this._items[0];
  }
  framework.prototype.item = function(index){
    return this._items[index];
  }
  framework.prototype[Symbol.iterator] = function(){
    return this._items[Symbol.iterator]();
  }
  framework.prototype.forEach = function(callback){
    var items = this.toArray();
    for (var i = 0; i < items.length; i++)
      callback(items[i], i, items);
  };
  Object.defineProperty(framework.prototype, "context", {
    get: function(){ return this._dom; }
  });
  Object.defineProperty(framework.prototype, "length", {
    get: function(){
      return this._items.length;
    }
  });


  _main.onReady = function(elem, callback){
    if (document.readyState !== "complete"){
      elem = window;
    } else if (elem instanceof Document){
      if (elem.readyState === "complete" || elem.children.length === 0){
        callback(null);
        return;
      } else {
        elem = elem.children[0];
      }
    }

    elem.addEventListener("load", callback, true);
  };
  _main.select = function(selector, context){
    if (!context) context = document;
    return selectAny(selector, context);
  };
  
  function isElement(elem) { return elem instanceof HTMLElement; }

  // IE
  if (!NodeList.prototype.forEach)
    NodeList.prototype.forEach = function(f){
      for (var i = 0; i < this.length; i++)
        f(this[i], i, this);
    }



  _main.extensions = framework.prototype;

  // initializing
  if (window.bicycle)
    console.warn("bicycle was changed");
  window.bicycle = _main;
})();
