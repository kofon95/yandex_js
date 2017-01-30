
/**
 * Deque
 */
class Deque<T> {
  _values: T[]
  _currentStartPos: number  // can be -1, if set is empty
  constructor() {
    this._values = []
    this._currentStartPos = -1
  }

  // const
  // ----------------------
  get size(): number{
    return this._values.length - (this._currentStartPos + 1)
  }
  isEmpty(): boolean{
    return this.size === 0
  }
  front(): T {
    if (this.isEmpty()) throw RangeError("Is empty!")
    return this._values[this._currentStartPos+1]
  }
  back(): T {
    if (this.isEmpty()) throw RangeError("Is empty!")
    return this._values[this._values.length-1]
  }
  makeArray(): T[]{
    return this._values.slice(this._currentStartPos+1)
  }
  fill(value: T) {
    for (let i = this._currentStartPos+1; i < this._values.length; i++)
      this._values[i] = value
  }
  clear() {
    this.fill(void 0)
    this._currentStartPos = this._values.length
  }
  // ----------------------

  pushBack(value: T){ this._values.push(value); }
  pushFront(value: T){
    if (this._currentStartPos === -1){
      let len = this._values.length
      let t = Array((len << 1) + 1)
      for (let i = 0; i < len; i++){
        t[i+len+1] = this._values[i]
      }
      this._currentStartPos = len
      this._values = t
    }

    this._values[this._currentStartPos--] = value
  }
}
// END - Deque

/**
 * Ticket
 */
interface Ticket {
  from: string
  to: string
}

function sortCards(path:Ticket[]) {
  if (path.length === 0) throw RangeError("Path is empty")
  let deqs = new Deque<Deque<Ticket>>()
  deqs.pushBack(new Deque<Ticket>())
  deqs.back().pushBack(path[0])

  let froms: any = {}, tos: any = {}
  for (let i = 1; i < path.length; i++){
    let p = path[i]
    if (deqs.front().front().from === p.from){
      
    } else
    if (deqs.back().back().to === p.to){

    }
  }
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
      console.log(`to ${path[i].to} (${path[i].description})`); else
    if (path[i].to == null)
      console.log(`from ${path[i].from} (${path[i].description})`);
    else
      console.log(`${i}. from ${path[i].from} to ${path[i].to} (${path[i].description})`);
  }
}

var path = [
  { from: "A", to: "B", description: "1" },
  { from: "B", to: "C", description: "2" },
  { from: "C", to: "D", description: "3" },
  { from: "D", to: "E", description: "4" },
  { from: "E", to: "F", description: "5" },
];

shaffle(path);
printPath(path);
sortCards(path);
console.log("\n-------\n\n");
printPath(path);
