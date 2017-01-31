import { sortTickets as sort, shaffle } from '../src/api';

export class Tester{
  static sortTickets_bigArray(){
    let tickets = Array(10000)
    for(let i = 0; i < tickets.length; i++){
      tickets[i] = {from: i, to: i+1}
    }

    let saved = tickets.slice()
    shaffle(tickets)
    tickets = sort(tickets)


    for (let i = 0; i < tickets.length; i++){
      if (tickets[i] === saved[i]) continue;
      var s1 = `1. from: ${tickets[i].from}, to: ${tickets[i].to}`
      var s2 = `2. from: ${saved[i].from}, to: ${saved[i].to}`
      throw Error(s1 + "\n" + s2)
    }
  }

  static shaffle(){
    let numbers = Array(10)
    // fills by empty arrays (faster than {})
    for (var i = 0; i < numbers.length; i++)
      numbers[i] = []
    let saved = numbers.slice()

    shaffle(numbers)

    let ok = numbers.every(function(v,i) { return v !== saved[i] })
    if (!ok) throw Error()
  }

  static testAll(){
    console.log("All tests get started")
    Tester.sortTickets_bigArray()
    Tester.shaffle()
    console.log("ok")
  }
}