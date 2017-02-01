if (typeof window){
  this.require = new Function("return this")
}
// Подключение api
import SorterApi = require("./api")


// Функция вывода в консоль
function printRoute(route: any[], builder: SorterApi.IRouteBuilder) {
  for(let i = 0; i < route.length; i++){
    if (route[i].from == null)
      console.log(`to ${route[i].to} (${route[i].data})`); else
    if (route[i].to == null)
      console.log(`from ${route[i].from} (${route[i].data})`);
    else
      console.log(`${i}. from ${route[i].from} to ${route[i].to} (${route[i].data})`);
  }
}

// Список билетов
var tickets:any[] = [
  { from: "A", to: "B", data: {by: "1"} },
  { from: "B", to: "C", data: {by: "2"} },
  { from: "C", to: "D", data: {by: "3"} },
  { from: "D", to: "E", data: {by: "4"} },
  { from: "E", to: "F", data: {by: "5"} },
  { from: "F", to: "G", data: {by: "6"} },
  { from: "G", to: "H", data: {by: "7"} },
  { from: "H", to: "I", data: {by: "8"} },
];

// ----------------

SorterApi.shaffle(tickets)
tickets = SorterApi.sortTickets(tickets)
printRoute(tickets, null) // TODO: send builder