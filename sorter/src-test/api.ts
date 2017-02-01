import { sortTickets, shaffle, RouteBuilder } from '../src/api';

var TestError = (function(){
  return function(message?:string){
    return Error.call(this, message)
  }
})()

export class Tester{
  static sortTickets_bigArray(){
    let tickets = Array(10000)
    for(let i = 0; i < tickets.length; i++){
      tickets[i] = {from: i, to: i+1}
    }

    let saved = tickets.slice()
    shaffle(tickets)
    tickets = sortTickets(tickets)


    for (let i = 0; i < tickets.length; i++){
      if (tickets[i] === saved[i]) continue;
      let s1 = `1. from: ${tickets[i].from}, to: ${tickets[i].to}`
      let s2 = `2. from: ${saved[i].from}, to: ${saved[i].to}`
      throw TestError(s1 + "\n" + s2)
    }
  }

  static shaffle(){
    let numbers = Array(10)
    // fills by empty arrays (faster than {})
    for (let i = 0; i < numbers.length; i++)
      numbers[i] = []
    let saved = numbers.slice()

    shaffle(numbers)

    let ok = numbers.every(function(v,i) { return v !== saved[i] })
    if (!ok) throw TestError()
  }

  static RouteBuilder_buildAndResult(){
    let expected:any[] = [
      { from: "A", to: "B", data: {by: "Car"} },
      { from: "B", to: "C", data: {by: "Train"} },
      { from: "C", to: "D", data: {by: "Plane"} },
      { from: "D", to: "E", data: {by: "Bus"} },
    ];
    let trips = new RouteBuilder(expected).build().trips

    for (var i = 0; i < trips.length; i++) {
      if (trips[i].indexOf(expected[i].from) < 0 ||
          trips[i].indexOf(expected[i].to) < 0 ||
          trips[i].indexOf(expected[i].data.by) < 0)
      {
        throw TestError(`Trip[${i}] has no information: ${trips[i]}`);
      }
    }
  }

  private static RouteBuilder__makeSentences(){
    let prepared = ["info 1", "info 2.", "go here;", "go there", "happyness!"]
    let expected = ["Info 1.", "Info 2.", "Go here;", "go there.", "Happyness!"]

    let result = RouteBuilder["_makeSentences"](prepared)
    
    for (let i = 0; i < expected.length; i++){
      if (expected[i] !== result[i])
        throw TestError(`Wrong answer on ${i} index`)
    }
  }

  static testAll(){
    console.log("All tests get started")
    Tester.sortTickets_bigArray()
    Tester.shaffle()
    Tester.RouteBuilder_buildAndResult()
    Tester.RouteBuilder__makeSentences()
    console.log("ok")
  }
}