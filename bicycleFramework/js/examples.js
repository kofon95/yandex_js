bicycle.onReady(document, function(){

  // scrolling to last li
  var lastLi = bicycle("ul>li:last-child");
  lastLi.text('Click here for scrolling ("once" event)')
        .style("font-size", "20px")
        .style("color", "white");
  // once event
  lastLi.onceOn("click", function(){
    lastLi.scroll();
    lastLi.text("Element has scrolled");
  });


  // clicking on altering color box
  // on - addEventListener, off - removeEventListener
  bicycle(".test-rectangle").on("click", function(e){
    bicycle(this).style("background-color", randomColor());
  });
  function randomColor(){
    var r = Math.floor(Math.random()*256).toString(16);
    var g = Math.floor(Math.random()*256).toString(16);
    var b = Math.floor(Math.random()*256).toString(16);
    return "#"+r+g+b;
  }


  var button = bicycle("#button-with-text-which-is-to-be-changed")
    .on("click", function(){
      button.text("Ok, next...");
    });
  var input = bicycle("#input-with-value-which-is-to-be-changed")
    .on("click", function(){
      input.val("Done!");
    });


  // draggable
  bicycle(".draggable").draggable(5);  // 5 - left & middle buttons
});
