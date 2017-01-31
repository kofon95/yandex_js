
/**
 * Ticket
 */
interface Ticket {
  from: string
  to: string
  data: any
}

function sortCards(path:Ticket[]):Ticket[] {
  // IDistionary<string, [string, number]>
  // or
  // IDistionary<typeof(Ticket.from), [typeof(Ticket.from), number]> // number - index of array
  let dest = {}

  // IDistionary<string, number>
  let used = {}

  // build
  for (let i = 0; i < path.length; i++) {
    // ребро инцидентно from и to 
    let from = path[i].from, to = path[i].to
    dest[from] = [to, i]

    if (!used.hasOwnProperty(from))
      used[from] = 1
    else
      used[from]++

    if (!used.hasOwnProperty(to))
      used[to] = 1
    else
      used[to]++
  }

  // find start
  for (var from in used) {
    // dest don't has only the last vertex
    if (used[from] === 1 && dest.hasOwnProperty(from))
      break
  }
  
  // build result
  let result = []
  while (true){
    let edge:[string, number] = dest[from]
    if (!edge) break
    result.push(path[edge[1]])
    from = edge[0]
  }
  return result
}


function randInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b-a) + a);
}

// method doesn't make copy
function shaffle<T>(array: any[]): T[] {
  for (let i = 0; i < array.length-1; i++) {
    let j = randInt(i+1, array.length);
    // swap (i,j)
    let t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
}

function printPath(path) {
  for(let i = 0; i < path.length; i++){
    if (path[i].from == null)
      console.log(`to ${path[i].to} (${path[i].data})`); else
    if (path[i].to == null)
      console.log(`from ${path[i].from} (${path[i].data})`);
    else
      console.log(`${i}. from ${path[i].from} to ${path[i].to} (${path[i].data})`);
  }
}

var path = [
  { from: "A", to: "B", data: "1" },
  { from: "B", to: "C", data: "2" },
  { from: "C", to: "D", data: "3" },
  { from: "D", to: "E", data: "4" },
  { from: "E", to: "F", data: "5" },
  { from: "F", to: "G", data: "6" },
  { from: "G", to: "H", data: "7" },
  { from: "H", to: "I", data: "8" },
];

shaffle(path);
printPath(path);
path = sortCards(path);
console.log("\n-------\n\n");
printPath(path);

