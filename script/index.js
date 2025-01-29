const graph = new TinyGraph(false, new TinyVertex("A"), new TinyVertex("B"), new TinyVertex("C"),new TinyVertex("D"), new TinyVertex("E"), new TinyVertex("F"));
graph.AddLine("B","C",10,null,true)
graph.AddLine("A","B",17,null,true)
graph.AddLine("A","D",20,null,true)
graph.AddLine("F","A",5,null,true)
graph.AddLine("E","F",2,null,true)
graph.AddLine("D","C",10,null,true)
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
    console.log(graph.FindPaths("D","E",3,canvasOption))
})