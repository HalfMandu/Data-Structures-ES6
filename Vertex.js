
//Vertex = Node in the Graph
class Vertex {
	
	//each vertex holds that vertex’s value along with a list of it's adjacent vertices
	constructor(value) {
		this.value = value;
		this.neighbors = [];   // adjacency list, each element is a Vertex object 
	}
	
	//append a Vertex object to end of adjacency list
	addNeighbor(vertex) {
		this.neighbors.push(vertex);  //push() natively returns the new length of array
	}
	
	//if Vertex object exists as a neighbor, delete it and return it
	removeNeighbor(vertex) {
		if (this.neighbors.includes(vertex)) {
			this.neighbors.splice(this.neighbors.indexOf(vertex), 1);  //remove it from the list
			return vertex;
		}
		
		//vertex was not a neighbor
		return null;
	}
	
	//return a list of all vertices that share and edge with this vertex
	getNeighbors() {
		return this.neighbors;
	}

	//boolean check if a Vertex object has another Vertex object in its neighbors list
	isNeighbor(vertex) {
		return this.neighbors.includes(vertex);
	}
	
	//display a vertex's neighbors
	printNeighbors(vertex){
		console.log("PRINTING NEIGHBORS FOR VERTEX " + vertex);
		for (const neighbor of this.neighbors) {
			console.log("neighbor: " + neighbor.value);
		} 	
	}

}

export { Vertex };
