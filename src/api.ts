function sortCards(path: {from: any, to: any}[]) {
  throw Error("not implement")
}

function randInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b-a) + a);
}

// method doesn't make copy
function shaffle<T>(array): T[] {
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
  { from: null, to: "B", description: "this is A" },
  { from: "A", to: "C", description: "this is B" },
  { from: "B", to: "D", description: "this is C" },
  { from: "C", to: "E", description: "D" },
  { from: "D", to: null, description: "this is E" },
];


sortCards(path);
