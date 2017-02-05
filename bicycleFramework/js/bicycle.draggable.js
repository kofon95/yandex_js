/**
 * @param {number} [maskOfButton] - Which button was pressed.
 * For more, see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
 */
bicycle.extensions.draggable = function(maskOfButton){
  if (maskOfButton === void 0)
    maskOfButton = 1;   // so, left button as default

  window.b = document.body
  window.bb = bicycle(b);
  window.t = this.first();

  for (let each of this)
    init(each, this.context);

  function init(elem, context){
    function move(e){
      elem.style.left = e.pageX - deltaX + "px";
      elem.style.top = e.pageY - deltaY + "px";
    }


    let wrap = bicycle(elem, context);
    var top = elem.offsetTop;
    var left = elem.offsetLeft;
    wrap
      .style("position", "absolute")
      .style("top", top + "px")
      .style("left", left + "px")
      .style("margin", 0);

    let deltaX, deltaY;

    wrap.on("mousedown", function(e){
      if ((maskOfButton & e.buttons) === 0)
        return;
      e.stopPropagation();
      deltaX = e.offsetX;
      deltaY = e.offsetY;
      wrap.context.addEventListener("mousemove", move);
    });
    wrap.context.addEventListener("mouseup", function(){
      wrap.context.removeEventListener("mousemove", move);
    });
  }
};
