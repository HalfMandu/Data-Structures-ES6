/* 
	HashTable -- basic chaining example
	Stephen Rinkus
	
	HashTable implementation which uses a 2D array to store key/val pairs
	Uses chaining to resolve collisions
	Hashing function is the sum of the ASCII codes of the chars of the key
	
	Methods
		hashFunc(key)
		set(key, value) 
		get(key)
		remove(key)
		display()
*/

class HashTable {
	
	//Defauts to 127 buckets
	constructor(buckets = 127) {
		this.table = new Array(buckets);
		this.size = 0;		//total number of stored elements
	}
	
	//Hashing function to derive index from a key
	hashFunc(key) {
		
		let hash = 0;
		
		//sum the ASCII code of the characters in the key
		for (let currChar of [...key]) {
			hash += currChar.charCodeAt(0);
		}
				
		//ensure that the hash value doesn't exceed the bucket size AKA array slots
		return hash % this.table.length;

	}
	
	//Set a key/value pair in the HashTable -- chaining
	set(key, value) {
	
		const index = this.hashFunc(key);	//1st dimension -- hash index
		const chain = this.table[index];	//2nd dimension	-- chain
		
		//check if something has been set with this derived hash index before (not necessarily the input key)
		if (chain) {
		
			//index exists, now checking if key exists						
 			const keyLoc = chain.findIndex(keyVal => keyVal[0] == key);
			
			//if key exists, overwrite it
			if (keyLoc > -1){
				chain[keyLoc][1] = value;
				return;
			} 
		} 
		//derived index hasn't been used yet, intialize it with second dimension array...
		else {
			this.table[index] = [];
		}
		
		//hash index must exist, push the new pair
		this.table[index].push([key, value]);	
		this.size++;
	}
	
	//Get a value from the HashTable
	get(key) {
	
		const index = this.hashFunc(key);
		const chain = this.table[index];
		
		//check the chain at the derived index and return the correct key/value pair if key found
		if (chain) {
			return chain.find(keyVal => keyVal[0] === key)[1];
		}
		
		return undefined;  //key not present
	}

	//Delete a key/value pair from the Hash Table
	remove(key) {
	
		const index = this.hashFunc(key);		
		const chain = this.table[index];	
		
		if (chain) {
			
			//identify location of the key within the second-level chain
			const keyLoc = chain.findIndex(keyVal => keyVal[0] == key);
			
			//if key is present, chop it out
			if (keyLoc > -1){
				chain.splice(keyLoc, 1);
				this.size--;
				return true;
			} 
			
		} else {
			return false;
		}
	}
	
	//Display all key/value pairs stored in the HashTable
	display() {
		
		console.log("Hash Table: ");
		console.log("Size: " + this.size);
		console.log("------------------------------------------");
		
		this.table.forEach((values, index) => {
			const chainedValues = values.map(
				([key, value]) => `[ ${key}: ${value} ]`
			);
			console.log(`${index}: ${chainedValues}`);
		});
	
		console.log("------------------------------------------");
	
	}
	
}

