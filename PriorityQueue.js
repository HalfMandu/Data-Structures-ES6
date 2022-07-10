/*
	Stephen Rinkus
	Priority Queue
	
		Store nodes in an array
		Array works as a Queue, with the Node priorities determining the order of Nodes
*/

class PqNode{

	constructor(value, priority) {
		this.value = value;
		this.priority = priority;
	}

}

class PriorityQueue{
	
	constructor() {
		this.queue = [];
	}
	
	//Push a new item to the queue using its priority to judge placement
	enqueue(value, priority){
	
		const newNode = new PqNode(value, priority);
	
		if (this.isEmpty()) {
			this.queue.push(newNode);
		} else {
			let added = false;
			for (let i = 0; i < this.queue.length; i++) {
				if (priority < this.queue[i].priority) {
					this.queue.splice(i, 0, newNode);
					added = true;
					break;
				}
			}
			if (!added) {
				this.queue.push(newNode);
			}
		}
	};
	
	//Remove and return the first item in the queue AKA highest priority
	dequeue(){
		const value = this.queue.shift();
		return value.value;
	};
	
	front(){
		return this.queue.value;
	};
	  
	size(){
		return this.queue.length;
	};
	  
	isEmpty() {
		return this.queue.length === 0;
	};
	
	print() {
		console.log(this.queue);
	};
}

///////////////////////////////////////////////////////////////////////////////////////////////
//Driver

const pq = new PriorityQueue();

pq.enqueue("Bob", 2);
pq.enqueue("Bill", 3);
pq.enqueue("Mike", 1);
pq.enqueue("Allen", 2);

pq.print();