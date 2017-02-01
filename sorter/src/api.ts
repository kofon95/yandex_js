if (typeof window !== "undefined" && !this.hasOwnProperty("exports")){
  this.exports = this;
}


declare class Map<TKey, TValue>{
  get(key:TKey): TValue
  set(key:TKey, value:TValue):this
  has(key:TKey):boolean
  entries(): { next:() => {value:[TKey, TValue], done:boolean} }
}

/**
 * Ticket
 */
export declare interface ITicket {
  from: string
  to: string
}

// Функция сортировки
export var sortTickets: (tickets:ITicket[]) => ITicket[];

if (typeof Map !== "undefined"){
  // Используется словарь Map
  sortTickets = function(tickets) {
    // TKey - from
    // TValue[0] - to
    // TValue[1] - index of ticket
    let dest = new Map<string, [string, number]>()

    // хранит "1" для первой и последней вершин,
    // для остальных "2"
    let used = new Map<string, number>()


    // build
    for (let i = 0; i < tickets.length; i++) {
      let from = tickets[i].from
      let to   = tickets[i].to
      dest.set(from, [to, i])

      if (used.has(from))
        used.set(from, 2)
      else
        used.set(from, 1)
      if (used.has(to))
        used.set(to, 2)
      else
        used.set(to, 1)
    }

    // find start
    let from: string
    let it = used.entries()
    while (true) {
      let next = it.next()
      if (next.value[1] === 1 && dest.has(next.value[0])){
        from = next.value[0]
        break
      }
    }

    // здесь from - вершина, на которую не указывает не одно ребро
    // (точка отправления)
    
    let result:ITicket[] = []
    // пока можно идти из from в to:
    //    идём
    //    сохраняем результат
    //    ставим метку from на место to
    while (dest.has(from)) {
      let edge = dest.get(from)
      result.push(tickets[edge[1]])
      from = edge[0]
    }
    return result
  }
} else {
  // Используется объект в качестве словаря
  sortTickets = function(tickets) {
    // IDistionary<string, [string, number]>
    // or
    // IDistionary<typeof(Ticket.from), [typeof(Ticket.from), number]> // number - index of array
    let dest = {}

    // IDistionary<string, number>
    let used = {}

    // build
    for (let i = 0; i < tickets.length; i++) {
      // ребро инцидентно from и to 
      let from = tickets[i].from, to = tickets[i].to
      dest[from] = [to, i]

      if (used.hasOwnProperty(from))
        used[from]++
      else
        used[from] = 1

      if (used.hasOwnProperty(to))
        used[to]++
      else
        used[to] = 1
    }

    // find start
    for (var from in used) {
      // only the last vertex doesn't have a destination
      if (used[from] === 1 && dest.hasOwnProperty(from))
        break
    }

    // здесь from - точка отправления
    
    // build result
    let result = []
    while (true){
      let edge:[string, number] = dest[from]
      if (!edge) break
      result.push(tickets[edge[1]])
      from = edge[0]
    }
    return result
  }
}

// method doesn't make copy
export function shaffle<T>(array: T[]): T[] {
  for (let i = 0; i < array.length-1; i++) {
    let j = randInt(i+1, array.length);
    // swap (i,j)
    let t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
}


export function randInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b-a) + a);
}

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

export abstract class DataTicket implements ITicket{
  abstract from: string
  abstract to: string
  abstract data?: {
    by?:any,
    prefix?:string,
    postfix?:string,
    extraSentences?:any[],
  }
}

// Builders

export interface IRouteBuilder{
  build(route:ITicket[]): string[]
}

export class DataRouteBuilder implements IRouteBuilder{

  constructor(capitalize:boolean = true){
    if (!capitalize) this._toCapitalize = function(s){return s}
  }

  build(route: DataTicket[]){
    let viewLen = DataRouteBuilder._views.length
    let trips:string[] = []
    for (let i = 0; i < route.length; i++) {
      let ticket = DataRouteBuilder._safeTicket(route[i])
      let view = DataRouteBuilder._views[randInt(0, viewLen)]  // random view
      trips[i] = ticket.data.prefix + view(ticket, this) + ticket.data.postfix
    }
    return trips
  }

  // список функций, формирующих предложения поездки от i до i+1
  private static _views: ((ticket: DataTicket, self:DataRouteBuilder) => string)[] = [
    function(t, self){
      return `From ${t.from} to ${t.to}` + (t.data.by ? ` by ${t.data.by}. ` : ". ") +
             self._makeSentences(t.data.extraSentences, self).join(" ")
    },
    function(t, self){
      return `From ${t.from}${t.data.by ? `, take ${t.data.by} ` : " "}to ${t.to}. ` +
             self._makeSentences(t.data.extraSentences, self).join(" ")
    },
    function(t, self){
      return (t.data.by ? `Take ${t.data.by} f` : "F") + `rom ${t.from} to ${t.to}. ` +
             self._makeSentences(t.data.extraSentences, self).join(" ")
    },
  ]

  private static _safeTicket(ticket:DataTicket):DataTicket{
    if (ticket.data == null){
      ticket.data = {by:null, extraSentences:[], prefix:"", postfix:""}
    } else {
      let d = ticket.data
      if (d.prefix == null) d.prefix = ""
      if (d.postfix == null) d.postfix = ""
      if (d.extraSentences == null) d.extraSentences = []
    }
    return ticket;
  }

  // Формирует из каждой строки предложение:
  // в случае отсутствия точки или точки с запятой, добавляет точку;
  // 
  // ["info 1", "info 2.", "go here;", "go there"] =>
  // ["Info 1.", "Info 2.", "Go here;", "go there."]
  private _makeSentences(strings:any[], self: DataRouteBuilder):string[]{
    let sentences = Array<string>(strings.length)
    let lastWasWithSemicolon = false
    for (let i = 0; i < strings.length; i++) {
      let s = DataRouteBuilder._toString(strings[i]).trim()
      if (s.length === 0) continue

      if (!lastWasWithSemicolon)
        s = self._toCapitalize(s)

      let lastLetter = s[s.length-1]
      if (lastLetter === ";")
        lastWasWithSemicolon = true  // already current
      else {
        if (".?!".indexOf(lastLetter) < 0)
          s += "."   // if string isn't empty and without period at the end, then put it (dot)
        lastWasWithSemicolon = false
      }
      sentences[i] = s
    }
    return sentences
  }

  private _toCapitalize(s:string):string{
    if (s.length > 0){
      let lr = s[0].toUpperCase()
      if (lr !== s[0])
        s = lr + s.substr(1)
    }
    return s
  }

  private static _toString(s): string{
    return s == null ? "" : s.toString()
  }
}