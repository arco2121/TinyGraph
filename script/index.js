let graph = TinyGraph.GenGraph();
console.log(graph.toConsole())
let canvasOption = graph.toCanvas(500,500,3,"white","black",document.querySelector(".graph"))
canvasOption.canvas.style = "border: 5px solid white; margin: 10px; border-radius: 25px;"
let vertex1 = 0
let vertex2 = graph.vertexs.length -1
document.getElementById("reload").addEventListener("click",()=>{
    canvasOption.reloadposition()
    canvasOption.reload()
    graph = TinyGraph.GenGraph();
    vertex2 = graph.vertexs.length - 1
    canvasOption = graph.toCanvas(500,500,3,"white","black",document.querySelector(".graph"))
    canvasOption.canvas.style = "border: 5px solid white; margin: 10px; border-radius: 25px;"
})

document.getElementById("find").addEventListener("click",(e)=>{
    console.log(graph.FindPath(vertex1,vertex2,canvasOption))
})
document.getElementById("finds").addEventListener("click",()=>{
    console.log(graph.FindPaths(vertex1,vertex2,5,canvasOption))
})