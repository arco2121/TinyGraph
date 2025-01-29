const alphabet = "abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM1234567890";

class TinyGraph
{
    constructor(oriented, ...map)
    {
        this.oriented = oriented;
        this.map = Array.from({ length: map.length }, () => 
            Array.from({ length: map.length }, () => new TinyLine())
        );
        this.vertexs = [];
        for (let i = 0; i < map.length; i++)
        {
            if(!(map[i] instanceof TinyVertex))
                return;
            map[i].number = i;
            this.vertexs.push(map[i]);
        }
    }

    AddVertex(vertex)
    {
        if(!(vertex instanceof TinyVertex))
            return;
        if(vertex instanceof TinyVertex)
            vertex.number = this.vertexs.length;
        this.vertexs.push(vertex);
        this.map.push(Array.from({ length: this.map.length }, () => new TinyLine()));
    }

    RemoveVertex(vertex)
    {
        const v = this.FindVertex(vertex);
        if(this.isValid(v))
        {
            this.vertexs.splice(v, 1);
            this.map.splice(v, 1);
            this.vertexs.forEach((vertex, index) => {
                vertex.number = index;
            });
        }
    }
    
    AddLine(vertex1, vertex2, weight = 1, direction = null, oneway = true)
    {
        const one = this.isValid(this.FindVertex(vertex1))
        const two = this.isValid(this.FindVertex(vertex2))
        if(this.oriented)
        {
            if (one && two) 
            {
                this.map[this.FindVertex(vertex1)][this.FindVertex(vertex2)] = new TinyLine(weight, direction);
                if(!oneway)
                    this.map[this.FindVertex(vertex2)][this.FindVertex(vertex1)] = new TinyLine(weight, TinyLine.Opposite(direction));
            } 
            else 
            {
                console.error("Vertex not found");
            }
        }
        else
        {
            this.map[this.FindVertex(vertex1)][this.FindVertex(vertex2)] = new TinyLine(weight, direction);
            this.map[this.FindVertex(vertex2)][this.FindVertex(vertex1)] = new TinyLine(weight, TinyLine.Opposite(direction));
        }
    }

    RemoveLine(vertex1, vertex2) 
    {
        if (this.isValid(this.FindVertex(vertex1)) && this.isValid(this.FindVertex(vertex2))) 
        {
            this.map[this.FindVertex(vertex1)][this.FindVertex(vertex2)] = new TinyLine();
            if(this.oriented == false)
                this.map[this.FindVertex(vertex2)][this.FindVertex(vertex1)] = new TinyLine();
        } 
        else 
        {
            console.error("Vertex not found");
        }
    }
    
    FindVertex(vertex)
    {
        for(let i = 0; i<this.vertexs.length; i++)
        {
            if(this.vertexs[i].name == vertex || this.vertexs[i].adress == vertex || this.vertexs[i].id == vertex)
            {
                return this.vertexs[i].number;
            }
        }
    }

    GetVertex(vertex)
    {
        return this.vertexs[vertex];
    }

    isValid(vertex) 
    {
        return vertex >= 0 && vertex < this.map.length && this.vertexs[vertex] != null;
    }

    toCanvas(width = 100, height = 100, boder = 3, colorlin = "black", colorfil = "lightblue", where = document.body)
    {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const center = {x: width / 2, y: height / 2};
        const radius = Math.min(width, height) / 3;
        let dim = (2*Math.PI*(Math.min(canvas.width, canvas.height) / 15)) / this.vertexs.length;
        const position = () => {
            for(let i = 0; i<this.vertexs.length; i++)
            {
                const angle = (2*Math.PI*i) / this.vertexs.length;
                const y = center.y + radius * Math.cos(angle);
                const x = center.x + radius * Math.sin(angle);
                this.vertexs[i].info.x = x;
                this.vertexs[i].info.y = y;
                this.vertexs[i].info.angle = dim;
            }
        }
        const colors = () =>{
            for(let i = 0; i<this.vertexs.length; i++)
            {
                this.vertexs[i].info.invertcolor = false
            }
        }
        const ctx = canvas.getContext("2d");
        const load = (colorfill = colorfil, colorline = colorlin,border) => 
        {
            dim = (2*Math.PI*(Math.min(canvas.width, canvas.height) / 15)) / this.vertexs.length;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.strokeStyle = colorline;
            ctx.font = `${Math.log(dim) * 5}px `;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = border - 2;
            for (let i = 0; i < this.map.length; i++) 
            {
                for (let j = 0; j < this.map[i].length; j++) 
                {
                    if (this.map[i][j].weight != 0) 
                    {
                        const startX = this.vertexs[i].info.x;
                        const startY = this.vertexs[i].info.y;
                        const endX = this.vertexs[j].info.x;
                        const endY = this.vertexs[j].info.y;
        
                        const weight = this.map[i][j].weight;
                        const dx = endX - startX;
                        const dy = endY - startY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const midX = (startX + endX) / 2;
                        const midY = (startY + endY) / 2;
                        const offset = dim/2;
                        if (distance > 8 * dim) 
                        {
                            const controlX = midX - dy / 4; 
                            const controlY = midY + dx / 4;
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                            ctx.stroke();
                            const curveMidX = (startX + endX + controlX) / 3;
                            const curveMidY = (startY + endY + controlY) / 3;
                            const textOffsetX = curveMidX + offset * (dy / distance);
                            const textOffsetY = curveMidY - offset * (dx / distance); 
                            ctx.fillStyle = colorline;
                            ctx.fillText(weight, textOffsetX, textOffsetY);
                            ctx.closePath();
                            const t = 0.9;
                            const curveEndX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
                            const curveEndY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

                            const dxCurve = curveEndX - controlX;
                            const dyCurve = curveEndY - controlY;
                            const angleCurve = Math.atan2(dyCurve, dxCurve);

                            const headlen = (border * 3)
                            ctx.beginPath();
                            ctx.moveTo(curveEndX, curveEndY);
                            ctx.lineTo(
                                curveEndX - headlen * Math.cos(angleCurve + Math.PI / 6),
                                curveEndY - headlen * Math.sin(angleCurve + Math.PI / 6)
                            );
                            ctx.lineTo(
                                curveEndX - headlen * Math.cos(angleCurve - Math.PI / 6),
                                curveEndY - headlen * Math.sin(angleCurve - Math.PI / 6)
                            );
                            ctx.closePath();
                            ctx.fillStyle = colorline;
                            ctx.fill();
                        } 
                        else 
                        {
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                            ctx.stroke();
                            const textOffsetX = midX + offset * (dy / distance);
                            const textOffsetY = midY - offset * (dx / distance);
                            ctx.fillStyle = colorline;
                            ctx.fillText(weight, textOffsetX, textOffsetY);
                            ctx.closePath();
                            const angle = Math.atan2(endY - startY, endX - startX);
                            const arrowX = endX - dim * Math.cos(angle);
                            const arrowY = endY - dim * Math.sin(angle);
                            ctx.beginPath();
                            ctx.moveTo(arrowX, arrowY);
                            const headlen = (border * 2)
                            ctx.lineTo(
                                arrowX - headlen * Math.cos(angle + Math.PI / 6),
                                arrowY - headlen * Math.sin(angle + Math.PI / 6)
                            );
                            ctx.lineTo(
                                arrowX - headlen * Math.cos(angle - Math.PI / 6),
                                arrowY - headlen * Math.sin(angle - Math.PI / 6)
                            );
                            ctx.closePath();
                            ctx.fillStyle = colorline;
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                }
            }
            ctx.lineWidth = border;
            this.vertexs.forEach(vertex => 
            {
                ctx.beginPath();
                ctx.arc(vertex.info.x, vertex.info.y, dim, 0, 2 * Math.PI);
                if(vertex.info.invertcolor)
                {
                    ctx.fillStyle = colorline;
                    ctx.fill();
                    ctx.strokeStyle = colorline;
                    ctx.stroke();
                    ctx.fillStyle = colorfill;
                }
                else
                {
                    ctx.fillStyle = colorfill;
                    ctx.fill();
                    ctx.strokeStyle = colorline;
                    ctx.stroke();
                    ctx.fillStyle = colorline;
                }
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `${Math.log(dim) * 5}px`;
                ctx.fillText(vertex.name, vertex.info.x, vertex.info.y);
            });
        };            
        position();
        load(colorfil,colorlin,boder);
        where.appendChild(canvas);  
        let snode = null;
        /*Touch*/
        canvas.addEventListener("mousedown", (e) => {
            const {offsetX, offsetY} = e;
            snode = this.vertexs.find(node =>  Math.sqrt((offsetX - node.info.x) ** 2 + (offsetY - node.info.y) ** 2) < node.info.angle)
        });
        canvas.addEventListener("touchstart", (e) => {
            const {offsetX, offsetY} = e;
            snode = this.vertexs.find(node =>  Math.sqrt((offsetX - node.info.x) ** 2 + (offsetY - node.info.y) ** 2) < node.info.angle)
        });
        canvas.addEventListener("mousemove", (event) => {
            if(snode) 
            {
                const { offsetX, offsetY } = event;
                snode.info.x = offsetX;
                snode.info.y = offsetY;
                load(colorfil,colorlin,boder);
            }
        });
        /*Leave*/
        canvas.addEventListener("mouseup",(e) => {
            snode = null
        })
        canvas.addEventListener("mouseleave",(e) => {
            snode = null
        })
        canvas.addEventListener("touchend",(e) => {
            snode = null
        })
        canvas.addEventListener("touchcancel",(e) => {
            snode = null
        })
        //Se si vogliono applicare modifiche di stile

        return {canvas : canvas, ctx : ctx, reloadcolors : colors, reload : () => {load(colorfil,colorlin,boder); colors();}, reloadposition : position, selectedColor : colorlin, valid : true};
    }

    FindPath(startVertex, endVertex, canvasOption = {}) 
    {
        return this.FindPaths(startVertex, endVertex, 1, canvasOption)[0] || {};
    }

    FindPaths(startVertex, endVertex, k = 3, canvasOption = {}) 
    {
        const startIndex = this.FindVertex(startVertex);
        const endIndex = this.FindVertex(endVertex);

        if (startIndex === undefined || endIndex === undefined) {
            console.error("Start or end vertex not found.");
            return [];
        }

        const pq = new PriorityQueue();
        const paths = [];

        pq.enqueue({ path: [startIndex], cost: 0, lines: [] }, 0);

        while (!pq.isEmpty() && paths.length < k) 
        {
            const { element: { path, cost, lines } } = pq.dequeue();
            const lastNode = path[path.length - 1];

            if (lastNode === endIndex) {
                const combinedPath = [];
                for (let i = 0; i < path.length; i++) {
                    combinedPath.push(this.GetVertex(path[i]));
                    if (i < lines.length) combinedPath.push(lines[i]); 
                }

                paths.push({ path: combinedPath, cost });
                continue;
            }

            for (let neighbor = 0; neighbor < this.vertexs.length; neighbor++) 
            {
                const weight = this.map[lastNode][neighbor]?.weight;
                if (weight === undefined || weight <= 0 || path.includes(neighbor)) {
                    continue;
                }
                const newPath = [...path, neighbor];
                const newLines = [...lines, this.map[lastNode][neighbor]];
                const newCost = cost + weight;
                pq.enqueue({ path: newPath, cost: newCost, lines: newLines }, newCost);
            }
        }

        if (canvasOption.valid) {
            canvasOption.reloadcolors();
            paths.forEach(({ path }) => {
                path.forEach(element => {
                    if (element instanceof TinyVertex) {
                        this.vertexs[element.number].info.invertcolor = true;
                    }
                });
            });
            canvasOption.reload();
        }

        return paths;
    }    

    toConsole()
    {
        let y = ""
        this.map.forEach((row) => { 
            row.forEach((ele) => {
                y += ele.weight + " ";
            })
            y += "\n"
        });
        return y;
    }
}
class TinyLine
{
    constructor(weight = 0,direction = null)
    {
        this.direction = direction;
        this.weight = weight;
    }

    static Opposite(direction)
    {
        switch (direction) 
        {
            case "L":
                return "R";
            case "R":
                return "L";
            default:
                return null;
        }
    }
}
class TinyVertex
{
    constructor(name = null, adress = null, info = {})
    {
        this.name = name;
        this.id = (() => {
            let u = ""
            for(let i = 0; i<Math.floor(Math.random() * (alphabet.length - 10) + 10); i++)
            {
                u+= alphabet[Math.floor(Math.random() * alphabet.length)]
            }
            return u
        })();
        this.adress = adress;
        this.info = info;
        this.number = 0;
    }
}
class PriorityQueue 
{
    constructor() 
    {
        this.collection = [];
    }

    enqueue(element, priority)
  	{
        let item = { element, priority }
        if (this.isEmpty()) 
        {
            this.collection.push(item)
        } 
      else
        {
            let added = false;
            for (let i = 0; i < this.collection.length; i++) 
            {
                if (this.collection[i].priority > priority) 
                {
                    this.collection.splice(i, 0, item);
                    added = true;
                    break;
                }
            }
            if (!added) this.collection.push(item);
        }
    }

    dequeue() 
  	{
        return this.isEmpty() ? undefined : this.collection.shift();
    }

    isEmpty() 
  	{
        return this.collection.length === 0;
    }
}