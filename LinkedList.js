/* 
	Linked List
	Stephen Rinkus
	
	Methods:
	
		add(value)
		insertAt(value, index)
		removeFrom(index)
		removeElement(value)
		getLast()
		getFirst()
		indexOf(value) 
		isEmpty()
		size()
		clear()
		print()
*/

class Node {
	constructor(value, next = null) {
		this.value = value;
        this.next = next;
	}
}

class LinkedList {

	constructor() {
		this.head = null;
		this.size = 0;
	}
	
	//Add a new Node with the given value...tacks it onto the end
	add(value) {
	
		const node = new Node(value);
		let current;

		if (this.head == null) {
			this.head = node;
		}
		
		else {
			current = this.head;

			//keep digging
			while (current.next) {
				current = current.next;
			}

			//advance
			current.next = node;
		}
		
		this.size++;
	}
	
	//Insert a node at a location
	insertAt(data, index) {
	
		if (index < 0 || index > this.size){
			return console.log("Not a valid index...");
		}
		else {
		
			//new node
			const node = new Node(data);
			let curr, prev;

			curr = this.head;

			if (index == 0) {
				node.next = this.head;
				this.head = node;
			} else {
				curr = this.head;
				let iter = 0;

				//step through the list to find position
				while (iter < index) {
					iter++;
					prev = curr;
					curr = curr.next;
				}

				node.next = curr;
				prev.next = node;
			}
			
			this.size++;
		}
	}

	//Remove and return an element from a specific location
	removeFrom(index) {
	
		if (index < 0 || index >= this.size) {
			return console.log("Invalid index");
		}
		else {
			let curr, prev, it = 0;
			curr = this.head;
			prev = curr;

			//check if first element
			if (index === 0) {
				this.head = curr.next;
			} else {
				//push through list
				while (it < index) {
					it++;
					prev = curr;
					curr = curr.next;
				}

				//remove the element
				prev.next = curr.next;
			}
			this.size--;

			//return the removed element
			return curr.value;
		}
	}
	
	//Remove an element from the list
	removeElement(value) {
	
		let current = this.head;
		let prev = null;

		//keep searching
		while (current != null) {
			//element found
			if (current.value === value) {
				if (prev == null) {
					this.head = current.next;
				} else {
					prev.next = current.next;   //clip it out
				}
				this.size--;
				return current.value;
			}
			prev = current;
			current = current.next;
		}
		return -1;
	}
	
	//Return the last element
	getLast() {
		let lastNode = this.head;
		if (lastNode) {
			while (lastNode.next) {
				lastNode = lastNode.next
			}
		}
		return lastNode
	}

	//Return the first element
	getFirst() {
		return this.head;
	}
	
	//Find the index of a value
	indexOf(value) {
	
		let count = 0;
		let current = this.head;

		//keep digging
		while (current != null) {
			if (current.value === value)
				return count;
			count++;
			current = current.next;
		}

		//not found
		return -1;
	}

	//Boolean check if list is empty
	isEmpty() {
		return this.size == 0;
	}

	//Return the size of the list
	listSize() {
		console.log(this.size);
	}
	
	//Empty the list
	clear() {
		this.head = null;
		this.size = 0;
	}

	//Step through linked list, printing values
	print() {
		let current = this.head;
		while (current) {
			console.log(current.value);
			current = current.next;
		}
	}


}
	
export { LinkedList };

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Driver

// creating an object for the Linkedlist class

/* const ll = new LinkedList();

// testing isEmpty on an empty list returns true
console.log(ll.isEmpty());

// adding element to the list
ll.add(10);

// prints 10
ll.print();

// returns 1
ll.listSize();

// adding more elements to the list
ll.add(20);
ll.add(30);
ll.add(40);
ll.add(50);

// returns 10 20 30 40 50
ll.print();

// prints 50 from the list
console.log("is element removed ? " + ll.removeElement(50));

// prints 10 20 30 40
ll.print();

// returns 3
console.log("Index of 40 " + ll.indexOf(40));

// insert 60 at second position ll contains 10 20 60 30 40
ll.insertAt(60, 2);

ll.print();

// returns false
console.log("is List Empty ? " + ll.isEmpty());

// remove 3rd element from the list
console.log(ll.removeFrom(3));

// prints 10 20 60 40
ll.print();


 */