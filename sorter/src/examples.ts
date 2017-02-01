if (typeof window){
  this.require = new Function("return this")
}
// Подключение api
import SorterApi = require("./api")


// Функция вывода в консоль
function printRoute(route:SorterApi.ITicket[], builder: SorterApi.IRouteBuilder) {
    let trips = builder.build(route)
    console.log(trips.join("\n"))
}

// Список билетов
// var tickets:SorterApi.DataTicket[] = [
//   { from: "A", to: "B", data: {by: 1} },
//   { from: "B", to: "C", data: {by: 2} },
//   { from: "C", to: "D", data: {by: 3} },
//   { from: "D", to: "E", data: {by: 4} },
//   { from: "E", to: "F", data: {by: 5} },
//   { from: "F", to: "G", data: {by: 6} },
//   { from: "G", to: "H", data: {by: 7} },
//   { from: "H", to: "I", data: {by: 8} },
// ];
var tickets:SorterApi.DataTicket[] = [
  { from: "Madrid", to: "Barcelona", data: {by: "train 78A", extraSentences: ["seat 45B"]} },
  { from: "Barcelona", to: "Gerona Airport", data: {by: "the airport bus", extraSentences: ["No seat assignment."]} },
  { from: "Gerona Airport", to: "Stockholm", data: {by: "flight SK455", extraSentences: ["gate 45B", "seat 3A", "Baggage drop at ticket counter 344"]} },
  { from: "Stockholm", to: "New York JFK", data: {by: "flight SK22", extraSentences: ["Gate 22", "Seat 7B", "Baggage will be automatically transferred from your last leg"]} },
];

// ----------------

SorterApi.shaffle(tickets)
tickets = SorterApi.sortTickets(tickets)
let builder = new SorterApi.DataRouteBuilder()

printRoute(tickets, builder)