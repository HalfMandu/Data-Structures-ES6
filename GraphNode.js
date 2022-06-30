/* 
*	Graph
*   Stephen Rinkus 
*
*	A Graph implementation which uses Vertex objects to represent nodes in the graph
*	Each map key is an int, and is mapped to a Vertex object
* 	Each Vertex object has: 
*		an int value (representing itself)
*		an array of Vertex objects (representing adjacent vertices)
*	This implementation handles directed and undirected graphs
*	Queue and Stack are used for BFS/DFS
*  	
*/

import { Vertex } from "./Vertex.js";
import { Queue } from "./Queue.js";
import { Stack } from "./Stack.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Main

class Graph {
	
	//Each Graph instance keeps track of its vertices and direction type (defaults to undirected)
	constructor(graphType = "UNDIRECTED") {
		this.vertices = new Map();   //int keys are the unique graph vertices, mapped to Vertex objects
		this.graphType = graphType;      //DIRECTED, UNDIRECTED
	}  
	
	//Add to map new edge: (int vert1 -> int vert2) and returns an array of two Vertex objs [v1, v2]
	addEdge(vert1, vert2) {
	
		//add vert1 and vert2 keys to the map (if they don't already exist)
		const v1 = this.addVertex(vert1);   
		const v2 = this.addVertex(vert2);  
		
		//add a ref of v2 to v1
		v1.addNeighbor(v2);

		//only add a ref of v1 to v2 if graph is undirected
		this.graphType === "UNDIRECTED" ? v2.addNeighbor(v1) : null;

		//return the freshly added edge
		return [v1, v2];
	}
	
	//Add a vertex key (int) to the graph and return the Vertex object
	addVertex(vertexKey) {
	
		//if it already exists, just return the Vertex obj, otherwise create a new node and set it
		if (this.vertices.has(vertexKey)) {
			return this.vertices.get(vertexKey);
		} else {
			const vertex = new Vertex(vertexKey);
			this.vertices.set(vertexKey, vertex);
			return vertex;
		}
	}
	
	//Delete edge (int vert1, int vert2), and return deleted edge
	removeEdge(vert1, vert2) {
	
		const v1 = this.vertices.get(vert1);
		const v2 = this.vertices.get(vert2);

		//if they exist and are adjacent, remove their mutual refs
		if (v1 && v2 && v1.isNeighbor(v2)) {
			v1.removeNeighbor(v2);  //remove one neighbor (v2) from v1's list
			this.graphType === "UNDIRECTED" ? v2.removeNeighbor(v1) : null;
		}

		return [v1, v2];
	}
	
	//Delete a vertex from the map and return deleted vertex
	removeVertex(vertexKey) {
		
		//make sure it exists
		if (this.vertices.has(vertexKey)) {
		
			let targetVert = this.vertices.get(vertexKey);
			
			//only remove neighbor if they are neighbors to begin with...only works in undirected case
			if (this.graphType === "UNDIRECTED"){
				for (let neighbor of targetVert.neighbors) {
					neighbor.removeNeighbor(targetVert); 
				} 			
			}
			
			//directed case - check all adajaceny lists and delete any reference 
			for (let [vert] of this.vertices){
				if (this.vertices.get(vert).isNeighbor(targetVert)){
					this.vertices.get(vert).removeNeighbor(targetVert);
				}
			}
		}
		
		//finally, delete now-defunct vertex key from the map
		return this.vertices.delete(vertexKey);
	}	
	
	//Breadth first search - takes in a Vertex object
	bfs(firstVert) {
		
		const explored = new Map();     //keeps track of which vertices have been visited
		const toExplore = new Queue();  //governs (FIFO) order of exploration for the remaining vertices

		toExplore.enqueue(firstVert);       //queue up the root element to explore from
		
		//while there are still vertices to explore, keep digging
		while (!toExplore.isEmpty()) {
			const nextVertex = toExplore.dequeue();
			//if the vertex exists and the map hasn't seen it yet, explore it and queue up its neighbors
			if (nextVertex && !explored.has(nextVertex)) {
				explored.set(nextVertex);    //mark as visited
				nextVertex.neighbors.forEach(neighbor => toExplore.enqueue(neighbor));
				console.log(nextVertex.value);
			}
		}
	}
	
	//Depth first search, similar to bfs except using Stack to explore
	dfsStack(firstVert) {
			
		const explored = new Map();	   //keeps track of which vertices have been visited
		const toExplore = new Stack(); //governs (LIFO) order of exploration for the remaining vertices

		toExplore.push(firstVert);

		while (!toExplore.isEmpty()) {
			const nextVertex = toExplore.pop();
			if (nextVertex && !explored.has(nextVertex)) {
				explored.set(nextVertex);
				nextVertex.neighbors.forEach(neighbor => toExplore.push(neighbor));
				console.log(nextVertex.value);
			}
		}
	}
	
	//Depth first search - recursive implementation
	dfsRecursive(start, explored) {
		
		//explored begins as empty {}
		explored[start.value] = true;
		console.log(start.value);
		
		for (let neighbor of start.neighbors){
			if (!explored[neighbor.value]){
				explored[neighbor.value] = true;
				this.dfsRecursive(neighbor, explored);
			}
		}		
	};
	
	//JS generator, iterating one val at a time, good for large graphs 
	*bfsGen(first) {
	
		const explored = new Map();    
		const toExplore = new Queue();  

		toExplore.enqueue(first);       
		
		while (!toExplore.isEmpty()) {
			const nextVertex = toExplore.dequeue();
			if (nextVertex && !explored.has(nextVertex)) {
				yield nextVertex;
				explored.set(nextVertex);   
				nextVertex.neighbors.forEach(neighbor => toExplore.enqueue(neighbor));
			}
		}
	}
	
	//Depth first search, similar to bfs except using Stack to explore
	*dfsGen(first) {
	
		const explored = new Map();	   
		const toExplore = new Stack(); 

		toExplore.push(first);

		while (!toExplore.isEmpty()) {
			const nextVertex = toExplore.pop();
			if (nextVertex && !explored.has(nextVertex)) {
				yield nextVertex;
				explored.set(nextVertex);
				nextVertex.neighbors.forEach(neighbor => toExplore.push(neighbor));
			}
		}
	}
	
	//Helper for topologicalSort() to recurse on a vertex
	topSortRecurser(vertex, numVerts, explored, order) {
	   
		//visit this vert
		explored[vertex] = true;
	   	   
		//check each neighbor -- if they aren't explored, recurse on them
		for (let neighbor of this.vertices.get(vertex).neighbors){
			if (!explored[neighbor.value]) {
				numVerts = this.topSortRecurser(neighbor.value, numVerts, explored, order);
			}
		} 
		
		//when there's no more outbound arcs, decrement size and put the vertex in its rightful place now
		order[vertex] = numVerts;
		return numVerts - 1;
	}
	
	//This approach passes the information forward with parameters
	topologicalSort(){
	
		let explored = {};		//keeps track of which verts have been visited
		let order = {};			//object tracking vertices to their final order position
		let numVerts = [...this.vertices.keys()].length - 1;
		
		//For every unvisited vertex, explore it and neighors
		for (let [vertex] of this.vertices){	
			if (!explored[vertex]) {
				this.topSortRecurser(vertex, numVerts, explored, order);
			}
		};
		
		return order;
	}
	
	//Helper for topologicalSortStack() to recurse on a vertex
	topSortStackRecurser(vertex, explored, stack) {
	   
		//visit this vert
		explored[vertex] = true;
	   	   
		//check each neighbor -- if they aren't explored, recurse on them
		for (let neighbor of this.vertices.get(vertex).neighbors){
			if (!explored[neighbor.value]) {
				this.topSortStackRecurser(neighbor.value, explored, stack);
			}
		} 

		//only push to the stack when vert's neighbors have been recursed on
		stack.push(vertex);
	}

	//Uses Stack to retun an ordering of the verts such that for every directed edge (u, v), u comes before v
	topologicalSortStack() {
	
		let stack = new Stack();  //Stack to govern LIFO exploration
		let explored = {};		  //keeps track of which verts have been visited

		//For every unvisited vertex, explore it and neighors
		for (let [vertex] of this.vertices){	
			if (!explored[vertex]) {
				this.topSortStackRecurser(vertex, explored, stack);
			}
		};
		
		while (!stack.isEmpty()) {
			console.log(stack.pop());
		}
	}
	
	//Return a sink vertex - a vertex without any outbound edges
	getSink(){
	
		//returns the first sink it finds
		for (let [vert] of this.vertices){
			if (this.vertices.get(vert).neighbors.length < 1){
				return this.vertices.get(vert);
			}
		}
	};
	
	//Map already tells if a key is present
	contains(value){ 
		return this.vertices.has(value);
	};
	
	//Check if graph holds a certain edge
	hasEdge(v1, v2){ 
		
		//if v1 exists, check if v2 is one of its neighbors
		if (this.vertices.has(v1)){
			return this.vertices.get(v1).isNeighbor(this.vertices.get(v2));
		}
		
		return false;
	};
	
	//Display the current state of Graph
	printGraph(){
		
		console.log(this.graphType + " GRAPH: ");
		
		for (let [vertex, neighbors] of this.vertices){
			console.log(vertex, neighbors);
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Driver

/** 	UNDIRECTED - 9 edges, 10 nodes
	*
	*           1
	*         / | \
	*       2   3  4
	*      /   / \  \
	*     5   6   7  8
	*    /    |   
	*   9     10	   		     
	*         
*/
const graph = new Graph("UNDIRECTED");
const [firstVert] = graph.addEdge(1, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(5, 2);
graph.addEdge(6, 3);
graph.addEdge(7, 3);
graph.addEdge(8, 4);
graph.addEdge(9, 5);  
graph.addEdge(10, 6);
graph.printGraph();

/** 	DIRECTED - 11 edges, 9 nodes
	*
	*           1
	*        / |  \
	*      2  3 -> 4
	*     / \ |    |
	*    6   5 ->  7
	*        |     |
	*        8 	   9
	*         
	*         
*/
const dirGraph = new Graph("DIRECTED");
const [firstVertDir] = dirGraph.addEdge(1, 2);
dirGraph.addEdge(1, 3);
dirGraph.addEdge(1, 4);
dirGraph.addEdge(2, 6);
dirGraph.addEdge(2, 5);
dirGraph.addEdge(3, 4);
dirGraph.addEdge(3, 5);
dirGraph.addEdge(4, 7);
dirGraph.addEdge(5, 7);
dirGraph.addEdge(5, 8);
dirGraph.addEdge(7, 9); 
dirGraph.printGraph();

console.log("Topological Sort: ");
console.log(dirGraph.topologicalSort());

console.log("Topological Sort (Stack): ");
dirGraph.topologicalSortStack();

console.log("BFS: ");
graph.bfs(firstVert); 

console.log("BFS with generator: ");
let bsfVals = graph.bfsGen(firstVert);
console.log(bsfVals.next().value.value); // 1
console.log(bsfVals.next().value.value); // 2
console.log(bsfVals.next().value.value); // 3
console.log(bsfVals.next().value.value); // 4
console.log(bsfVals.next().value.value); // 5
console.log(bsfVals.next().value.value); // 6
console.log(bsfVals.next().value.value); // 7
console.log(bsfVals.next().value.value); // 8
console.log(bsfVals.next().value.value); // 9
console.log(bsfVals.next().value.value); // 10 
//console.log(bsfVals.next().value.value); // error

console.log("DFS with generator: ");
console.log([...graph.dfsGen(firstVert)].map(vertex => vertex.value));	// [1, 4, 8, 3, 7, 6, 10, 2, 5, 9] 

console.log("DFS stack: ");
graph.dfsStack(firstVert);

console.log("DFS recursive: ");
graph.dfsRecursive(firstVert, {}); 

//Helpers

console.log("Removing vertex...");
graph.removeVertex(3); 

console.log("Removing edge...");
graph.removeEdge(10, 6);

graph.printGraph(); 

console.log(graph.contains(5));		//true
console.log(graph.contains(11));	//false
console.log(graph.hasEdge(5, 2));	//true
console.log(graph.hasEdge(5, 3));	//false */





