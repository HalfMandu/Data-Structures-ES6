/* 
	Binary Search Tree - augmented for select/rank
	Stephen Rinkus
	
	Each key has a value greater than all the values in its left subtree and less than all values in its right subtree. 
	Time complexity is proportional to the height of the tree.
	Lookup performance is logarithmic.
	The performance of the tree is dependent on the order of insertion of the nodes into the tree.
	On average, insert/delete/search take O(logn) for n nodes. 
	In the worst case, BST degrades to a singly linked list: O(n).
	Min value is at the bottom-left leaf, Max value is at the bottom-right leaf.
	
	Algorithm		Average		Worst case
	Space			O(n)		O(n)
	Search			O(log n)	O(n)
	Insert			O(log n)	O(n)
	Delete			O(log n)	O(n)
	inOrder			O(n)		O(n)
	
	Graph 1    (5)			Graph 2      (8)   
             /    \	                   /    \
          (2)     (7)                (3)    (10)
         /  \     /  \              /  \       \
       (1) (3)  (6)  (8)       	 (1)  (6)     (14)		
									  / \     /
									(4) (7) (13)		
*/

import { Queue } from "./Queue.js";
import { Stack } from "./Stack.js";

//Node instance
class Node{
	//every Node knows its own value, an optional (lesser) left Node, and an optional (greater) right Node
	constructor(value) {
		this.value = value;	//int value
		this.left = null;	//Node object
		this.right = null;  //Node object
		this.size = 1;  	//number of nodes in subtree
	}
}

//BST instance
class BinarySearchTree {
	
	//A new tree will have no nodes
	constructor(){
		this.root = null;
	}
	
	//A new node is inserted at the bottom level as a leaf. start searching a key from the root until hit a leaf node. Once a leaf node is found, the new node is added as a child 
	insert(value){
	
        const newNode = new Node(value);
		
		//if there is no root, set incoming node as root
        if (!this.root){
            this.root = newNode;
            return;
        }
		
		//make a copy of the root to dig down with
        let currNode = this.root;
		
		//starting from root, start comparing to the new node
        while(currNode){
			
			//the new node already exists
            if (value === currNode.value){
				console.log("New node already exists");
				return undefined;
			}
			
			//new value is greater than current spot, move to the left
            if (value < currNode.value){
                if (!currNode.left){
                    currNode.left = newNode;	//reached the bottom of the tree, add the new node
                    currNode.size++;			//one more node in the subtree
					return;
                }
				currNode.size++;
                currNode = currNode.left;
            } 
			
			//new value is greater than current spot, move to the right
			else {
                if (!currNode.right){
                    currNode.right = newNode;   
                    currNode.size++;
                    return;
                } 
				currNode.size++;
                currNode = currNode.right;
            }
        }
    }
	
	//Return the node which holds this target search value, if such a node exists
	search(value) {
		
		//make sure tree's not empty
		if (!this.root){ 
			console.log("Empty tree...");
			return;
		}
		
		//begin search from the root
		let currNode = this.root;
		
		//keep drilling until target is found
		while (currNode){
			if (value === currNode.value){
				console.log("Target found.");
				return currNode;
			} else if (value < currNode.value){
				currNode = currNode.left;
			} else if (value > currNode.value){
				currNode = currNode.right;
			}
		}
		
		console.log("Target not found.");
		return null;
	}
	
	//Wrapper to trap recursion for the removal and return of a node from the tree
	delete(value){
		return this.findAndDelete(this.root, value);
	}
	
	//Search for the node (recursively) and delete it...running time based on height of the tree
	findAndDelete(currNode, value){
		
		//make sure node exists
		if (!currNode){
			return null;
		}
		
		//if found the node, delete it, otherwise keep recursing
		if (value === currNode.value) {
			currNode = this.deleteNode(currNode);  //needs to go find which node to replace currNode with
		} else if (value < currNode.value) {
			currNode.left = this.findAndDelete(currNode.left, value);
			//currNode.size--;
		} else {
			currNode.right = this.findAndDelete(currNode.right, value);
		}
		
		//return the updated root
		return currNode;
	}
	
	//Delete a given node from the tree
	deleteNode(node){
	
		//easy case: no children -- delete node (set it to null)
		if (!node.left && !node.right) {
            return null;
        }
		
		//hard case: 2 children -- start from node, compute node's predecessor (or successor), then swap the nodes, then delete new leaf node using easier approach (for 1 or 0 children)
		else if (node.left && node.right) {

			//delete predecessor's spot, and re-assign node the predecessor's value
			const predecessor = this.getBottomRightLeaf(node.left);
			this.findAndDelete(node, predecessor.value);	 
			node.value = predecessor.value; 
			
            return node;
        }
		
		//medium case: 1 child -- splice out node, replace with the child
		else if (node.left) {
            return node.left;
        }

		//otherwise just the right child exists, it can replace its parent
        return node.right;
	}
	
	//Alternative search and delete approach...wrapper for deleteRec()
	delete2(value){
		return this.searchAndRemove(this.root, value);  //returning the deleted node
	}
		
	//Alternate recursive search and delete, takes a starting point and a target search value
	searchAndRemove(root, value){
				
		//base case -- the tree is empty
		if (!root){
			return root;
		}
		
		//otherwise, recurse down the tree
		if (value < root.value){
			root.left = this.searchAndRemove(root.left, value);
		} else if (value > root.value){
			root.right = this.searchAndRemove(root.right, value);
		}
		
		//this must be the target node, now it must be deleted
		else {
		
			//node has one child or no child
			if (!root.left){
				return root.right;
			} 
			else if (!root.right){
				return root.left;
			}
			
			//node has two children, replace node with its inorder successor (smallest in the right subtree)
			root.value = this.getSuccessor(root);
  
			//find and delete the inorder successor position, tracing the way back, reattach to right child
			root.right = this.searchAndRemove(root.right, root.value);
		}
  
		return root;
	}
	
	//Keep drilling left until can't anymore, then start printing values
	//n recursive calls each doing constant time work
	inOrder(root) {
		
		//left, root, right
		if (root){
			this.inOrder(root.left);
			console.log(root.value);
			this.inOrder(root.right);
		}
	}
	
	//Print root, then start going left and printing as you go
	preOrder(root) {
		
		//root, left, right
		if (root){
			console.log(root.value);
			this.preOrder(root.left);
			this.preOrder(root.right);
		}
	}
	
	//Start at the bottom and print your way up to the top, finishing at the root
	postOrder(root) {
		
		//left, right, root
		if (root){
			this.postOrder(root.left);
			this.postOrder(root.right);
			console.log(root.value);
		}
	}
	
	//Invert tree
	invert(root) {
	
		//dig to the bottom leaves
		let currNode = root;
		if (currNode.left && currNode.right) {
			this.invert(currNode.left);
			this.invert(currNode.right);
		} 
	
		//swap left and right
		const temp = currNode.left;
		currNode.left = currNode.right;
		currNode.right = temp;
	}
	
	//BFS - breadth first search - start from the top (root) and print horizontal levels going downward
	bfs(){
		
		//FIFO to govern order of discovery
		let currNode = this.root;
		let queue = new Queue();
		queue.push(currNode);
		
		//don't finish a node until all of it's child have been queued up
		while (!queue.isEmpty()) {
			currNode = queue.dequeue();
			console.log(currNode.value);
			if (currNode.left) {
				queue.enqueue(currNode.left);
			}
			if (currNode.right) {
				queue.enqueue(currNode.right);
			}
		}
	}
	
	//DFS - depth first search 
	dfs() {
	
		let currNode = this.root;
		let stack = new Stack();
		stack.push(currNode);
		
		while (!stack.isEmpty()) {
			currNode = stack.pop();
			console.log(currNode.value);
			if (currNode.left) {
				stack.push(currNode.left);
			}
			if (currNode.right) {
				stack.push(currNode.right);
			}
		}
	}
	
	//DFS - recursive implementation
	dfsRecursive(node) {
				
		console.log(node.value);
		
		//explore children before finish exploring self
		if (node.left) {
			this.dfsRecursive(node.left);
		}
		if (node.right) {
			this.dfsRecursive(node.right);
		}
		
	}
		 
	//Helper to return the lowest right leaf from a given starting node, AKA max element
	getBottomRightLeaf(node) {
		
		if (!node){
			console.log("empty");
			return null;
		}
		
		//keep drilling to the right until can't anymore, then return what's found
        let currNode = node;
		
		while (currNode.right){
			currNode = currNode.right;
		}
		
		return currNode;
		
    }
	
	//Return the max element
 	getMax(node = this.root) {
		
		if (!node){
			console.log("empty");
			return null;
		}
		
		let currNode = node;
		
		while (currNode.right) {
			currNode = currNode.right;
		}
		
		return currNode.value;
		
	} 
	
	//Return the min element
	getMin() {
		
		if (!this.root){
			console.log("empty tree");
			return null;
		}
		
		let currNode = this.root;
		
		while (currNode.left) {
			currNode = currNode.left;
		}
		
		return currNode.value;
		
	}
	
	//return the min value of a subtree starting from a given root 
	minValue(root = this.root) {
	
		let min = root.value;
		
		while (root.left) {
			min = root.left.value;
			root = root.left;
		}
		
		return min;
	}
	
	//Return the next smallest element 
	//if left subtree nonempty, return max key in left subtree
	//otherwise follow parents pointers until find a smaller value..."left turn"
	//from starting point k, go to left child, then go right until can't anymore
	getPredecessor(root = this.root){
		
		if (!root.left) {
			console.log("No predecessor available");
			return null;
		}
		
		root = root.left;
		
		while (root.right){
			root = root.right;
		}
		
		return root.value
	}
	
	//Return the next largerst element, AKA the minimun element from the right subtree
	getSuccessor(root = this.root){
		
		//making sure path available
		if (!root.right) {
			console.log("No successor available");
			return null;
		}
		
		root = root.right;
		
		while (root.left) {
			root = root.left;
		}
		
		return root.value;
	}
	
	//given an order statistic i, return ith smallest key in the tree.
	/*-start at root, check size of left subtree
		-if larger than requested ith order statistic, then the target MUST be in the right subtree
			-because the smallest values by definition to the left of the root
		-if smaller, target must exist within a left subtree at node whose size is > i
	-subtract the subtree size + 1 (self) from i to identify how far to other side to go
	-let a = size of subtree
		-if a = i - 1, return x's key
		-if a >= i, recursivley compute ith order statistic at y //left subtree is larger
		-if a < i - 1, recurse on right subtree   		//left subtree too small
			-recursivley compute (i-a-1)th order stat on right subtree 
	x.size = x.left.size + x.right.size + 1
	-While augmenting the tree, we should keep in mind, that we should be able to maintain the augmented information as well as do other operations like insertion, deletion, updating in O(lg n) time.
	Since, we know that the value of x.left.size will give us the number of nodes which proceed x in the order traversal of the tree. Thus, x.left.size + 1 is the rank of x within the subtree rooted at x.
	*/
	select(i) {
		 return this.selectRecursive(this.root, i).value;
	}
	
	//Recursive helper for select
	selectRecursive(currNode, i) {   
		
		if (!currNode){ 
			return null; 
		}
		
		const leftSize = this.size(currNode.left);
		
		//if left subtree greater than i, left tree must encompass i...dig to the left
		if (leftSize > i){
			return this.selectRecursive(currNode.left,  i);
		}
		
		//if left subtree smaller than i, right tree must encompass i...dig to the right
		else if (leftSize < i) {
			return this.selectRecursive(currNode.right, i-leftSize-1); 	//update the 2nd param
		}
		
		else { 
			return currNode;
		}
	}
	
	//Given a key value, return number of keys in the tree <= that value
	rank(currNode = this.root, value) {
	
		let rank = 0;
		
		while (currNode) {
			if (value < currNode.value){ 	//dig on left subtree
				currNode = currNode.left;
			}
			else if (value > currNode.value) {
				rank += 1 + this.size(currNode.left);
				currNode = currNode.right;
			}
			else {
				return rank + this.size(currNode.left);
			}
		}
		return null; 	//not found
	}
	
	//Recursive implementation
	rankRecursive(currNode = this.root, value) {
        
		if (!currNode){ 
			return 0; 
		}
		
        if (value < currNode.value) { 
			return this.rankRecursive(currNode.left, value); 
		}
		
        else if (value > currNode.value){
			return 1 + this.size(currNode.left) + this.rankRecursive(currNode.right, value);
		}
        else {
			return this.size(currNode.left);
		}
    }  
	
	//Size(x) = size(left(x)) + size(right(x)) + 1
	size(node){
		
		if (!node){
			return 0;
		}
		
		let res = 1;
		
		if (node.left){
			res += node.left.size;
		}
		if (node.right){
			res += node.right.size;
		}
		
		return res;
		
	}
	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Driver

/* Graph 1     (5)			Graph 2     (8)   
             /    \	                   /   \
          (2)     (7)                (3)    (10)
         /  \     /  \              /  \       \
       (1) (3)  (6)  (8)       	 (1)  (6)     (14)		
									  / \     /
									(4) (7) (13)		*/
const bst = new BinarySearchTree();

//Populating Tree
/* bst.insert(5);
bst.insert(2);
bst.insert(3);
bst.insert(1);
bst.insert(7);
bst.insert(6);
bst.insert(8); */

bst.insert(8);
bst.insert(3);
bst.insert(10);
bst.insert(1);
bst.insert(6);
bst.insert(14);
bst.insert(4);
bst.insert(7);
bst.insert(13);

/* console.log("Getting min/max: ");
console.log("min: " + bst.getMin());  
console.log("max: " + bst.getMax());  
console.log("minValue: " + bst.minValue());   */

/* console.log("size: ");  
console.log(bst.search(8).size); */

/* let i = 7;
console.log("select order i: " + i);  
//console.log(bst.select2(bst.root, i).value);
console.log(bst.select(i-1)); */

const r = 10;
console.log("rank: " + r);  
console.log(bst.rank(bst.root, r)); 
console.log("rank recursive: " + r);  
console.log(bst.rankRecursive(bst.root, r));

/* console.log("Getting Predecessor: ");
console.log(bst.getPredecessor());  

console.log("Getting Successor: ");
console.log(bst.getSuccessor());  

console.log("Traversing in-order...");  
bst.inOrder(bst.root);		//1, 2, 3, 5, 6, 7, 8

//Removing node
console.log("Traversing pre-order...");  
bst.preOrder(bst.root);		
let delNode = 6;
console.log("Removing node " + delNode);  
bst.delete(delNode);  
console.log("Traversing pre-order...");  
bst.preOrder(bst.root);		
 */
//Searching
/* let target = 14;
console.log("Searching for target: " + target);
console.log(bst.search(target));  //returns found node */

/* //Getting bottom right leaf
console.log("Successor right leaf: ");  
console.log(bst.getBottomRightLeaf(bst.root));  //8

//Traversing in-order
console.log("Traversing in-order...");  
bst.inOrder(bst.root);		//1, 2, 3, 5, 6, 7, 8

//Traversing pre-order
console.log("Traversing pre-order...");  
bst.preOrder(bst.root);		//5, 2, 1, 3, 7, 6, 8

//Traversing post-order
console.log("Traversing post-order...");  
bst.postOrder(bst.root);	//1, 3, 2, 6, 8, 7, 5

//Breadth first search
console.log("Breadth first searching...");  
bst.bfs();		//5, 2, 7, 1, 3, 6, 8

//Depth first search
console.log("Depth first searching...");  
bst.dfs();		//5, 7, 8, 6, 2, 3, 1

//Depth first search - recursive
console.log("Depth first searching - recursive...");  
bst.dfsRecursive(bst.root); 	//5, 2, 1, 3, 7, 6, 8
 */


/* 
//Inverting tree
console.log("Inverting tree...");  //8, 7, 6, 5, 3, 2, 1
bst.invert(bst.root);
console.log("Tree after inversion: ");  //8, 7, 6, 5, 3, 1
bst.inOrder(bst.root);
 */
