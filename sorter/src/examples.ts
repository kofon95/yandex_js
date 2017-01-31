import { sortTickets, shaffle } from "./api"

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

shaffle(path)
