const graph = new TinyGraph(false, new TinyVertex("A"), new TinyVertex("B"), new TinyVertex("C"),new TinyVertex("D"), new TinyVertex("E"), new TinyVertex("F"));
graph.AddLine("B","C",10,"R")
graph.AddLine("A","B",17,"L")
graph.AddLine("A","D",20,"R")
graph.AddLine("F","A",5,"L")
graph.AddLine("E","F",2,"L")
graph.AddLine("D","C",10,"R")
console.log(graph.toConsole())
const canvasOption = graph.toCanvas(500,500,5,"white","black",document.querySelector(".graph"))
canvasOption.canvas.style = "border: 5px solid white; margin: 10px; border-radius: 25px;"

document.getElementById("reload").addEventListener("click",()=>{
    canvasOption.reloadposition()
    canvasOption.reload()
})

document.getElementById("find").addEventListener("click",()=>{
    console.log(graph.FindPath("D","E",canvasOption))
})
document.getElementById("finds").addEventListener("click",()=>{
    console.log(graph.FindPaths("D","E"))
})