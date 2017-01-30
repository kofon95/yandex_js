function sortCards(cards) {
  
}

function randInt(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b))
    throw TypeError("Arguments are supposed to be numbers");
  if (a > b)
    throw RangeError("1st argument must be less or equal than 2nd");
  return Math.floor(Math.random() * (b-a) + a);
}

// method doesn't make copy
function shaffle(array){
  for (let i = 0; i < array.length-1; i++) {
    let j = randInt(i+1, array.length);
    // swap (i,j)
    let t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
}

var path = [
  { from: null, to: "B", description: "A" },
  { from: "A", to: "C", description: "B" },
  { from: "B", to: "D", description: "C" },
  { from: "C", to: "E", description: "D" },
  { from: "D", to: null, description: "E" },
];


sortCards(path);
