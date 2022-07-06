/* 
	Stephen Rinkus
	HashTable -- Open Addressing
	
	Methods:
		hashFunc(key)
		set(key, value)
		get(key)
		setLinearProbe(key, value)
		getLinearProbe(key)
		resize(size)
		getLoad()
		display()
*/


class HashTable {
	
	constructor() {
		this.table = new Array(37);
		this.size = 0;
		this.MAX_LOAD = 0.75;
		this.MIN_LOAD = 0.25;
	}
	
	//Hashing function to derive first index from a key -- returns some number between 0 - <numBuckets>
	hashFunc(key) {
		
		let hash = 0;
		
		//sum the ASCII code of the characters in the key
		for (let i = 0; i < key.length; i++) {
			hash += key.charCodeAt(i);
		}
		
		//ensure that the hash value doesn't exceed the bucket size
		return hash % this.table.length;

	}
	
	//Set a key/value pair in the HashTable -- open addressing with offsets
	set(key, value) {
			
		let index = this.hashFunc(key);		//hash index for first attempt
		let collisionCount = 0;  			//tracking the number of collisions created from this set() call
		
		//collisions -- keep trying hash indexes until find a slot that isn't taken 
		while (this.table[index]){
			
			//if key is already stored -- overwrite it
			if (this.table[index][0] == key){
				this.table[index][1] = value;
				return;
			}

			//offset the index
			index += 2 * ++collisionCount - 1;
			
			//if new index is out of bounds, bring it back down
			if (index >= this.table.length){
				index -= this.table.length;
			}
		}
		
		//add the new pair and increment total size
		this.table[index] = [key, value];
		this.size++;
				
		//check if a resize is needed
		if (this.getLoad() >= this.MAX_LOAD){
			this.resize(this.table.length * 2);
		} 
		
	}
	
	//Return the value tied to a given key...offset for probing
	get(key){
		
		let index = this.hashFunc(key);
		let collisionCount = 0;    
		
		//while still finding a collision, keep trying a new index
		while (this.table[index]){
		
			if (this.table[index][0] == key){
				return this.table[index][1];
			}
			
			index += 2 * ++collisionCount - 1;
			
			if (index >= this.table.length){
				index -= this.table.length;
			}
			
		}
		
		console.log("Item not found.");
		return false;
	}
	
	//Set using linear probing approach
	setLinearProbe(key, value){
		
		let index = this.hashFunc(key);
		const indexStart = index;
		let collisionCount = 0; 	//optional counting collisions for informational purposes
		
		//if this index hasn't been used yet, easy case to just set it there
        if (!this.table[index]) {
			this.size++;
            return this.table[index] = [key, value];
        } else {
			//index has been used -- collision...increment until first open slot appears
            while (this.table[index]) {
                index++;
				collisionCount++;
				//if it did a full lap, item must not be present
				if (index == indexStart){
					console.log("No open spots...");
					return false;
				} 
				//if searched to the end, circle back to the front
				if (index >= this.table.length){
					index = 0;
				} 
            }
        }
		
		//if code reached this far, the table has a spot open for setting
        this.table[index] = [key, value];
		this.size++;
		
		//check if a resize is needed
		if (this.getLoad() >= this.MAX_LOAD){
			this.resize(this.table.length * 2);
		}	
	}
	
	//Linear probing
	getLinearProbe(key) {
        
		let index = this.hashFunc(key);
		const indexStart = index;
		
		//starting from the derived hash position, march through array searching for key
        while (this.table[index]){
		
            if (this.table[index][0] === key) {
                return this.table[index][1];	//found it
            }
			
            index++;  //otherwise keep searching
			
			//if scan cycled back to its starting point, table is full (shouldn't happen, but still...)
			if (index == indexStart){
				console.log("Table is full");
				return false;
			} 
			//if scan marched all the way to the end, circle it back to the front
			if (index >= this.table.length){
				index = 0;
			} 
        }
		
		//key not present in table
		console.log("Item not found");
        return false;
    }
	
	//Resize table to alleviate load issues
	resize(bucketSize){
	
		console.log("Resizing...current load: " + this.getLoad()*100 + "%");
		console.log("Current length: " + this.table.length);

		//make a copy of class table, overwrite it with new table (with prime size)
		const oldTable = this.table;
		this.table = new Array(this.getNextPrimeNum(bucketSize));
		this.size = 0;

		//for the non-empty slots in the old table, copy items to the new table				
		oldTable.filter(keyVal => keyVal).forEach(([key, val]) => this.set(key, val));
		
		console.log("New load: " + this.getLoad()*100 + "%");
		console.log("New length: " + this.table.length);
	};
	
	//Return the current load on the hash table -- items / slots
	getLoad(){
		return (this.size / this.table.length).toFixed(2);
	}
	
	//Display all key/value pairs stored in the HashTable
	display() {
		
		console.log("Hash Table: ");
		console.log("Size: " + this.size);
		console.log("------------------------------------------");
		for (let [key, val] of this.table.entries()){
			console.log(key, val);
		}
		console.log("------------------------------------------");
		
	}
	
//////////////////////////////////////////////////////////////////////////////////////////
//Helpers

	//Get a prime number nearby the bucketSize to use as the new bucket count 
	getNextPrimeNum(num){
		num = Math.round(num);
		while (!this.isPrime(++num)){};		//increment from given number until reach a prime num
		return num;
	};
	
	//Boolean prime number checker
	isPrime(num) {
		let start = 2;
		while (start <= Math.sqrt(num)) {
			if (num % start++ < 1) {
				return false;
			}
		}
		return num > 1;
	}
	
}

////////////////////////////////////////////////////////////////////////////////////////////////
//Driver

/* 
ht.display();

ht.setLinearProbe("France", 33); 
ht.setLinearProbe("bill", 17);
ht.setLinearProbe("amy", 4);
ht.setLinearProbe("sam", 51);
ht.setLinearProbe("tim", 17);
ht.setLinearProbe("phil", 53);
ht.setLinearProbe("jane", 78);  */


/* console.log("Getting pos...");
console.log(ht.get("France"));
console.log(ht.get("Spain"));
console.log(ht.get("bill"));  
console.log(ht.get("amy"));  
console.log(ht.get("sam"));  
console.log(ht.get("ǻ"));  
console.log(ht.get("tim"));  
console.log(ht.get("phil"));  
console.log(ht.get("jane"));   
console.log(ht.get("bobby"));   //not present
console.log(ht.get("lama"));    //not present  */

/* console.log("Get2...");
console.log(ht.get2("France"));
console.log(ht.get2("Spain"));
console.log(ht.get2("bill"));  
console.log(ht.get2("amy"));  
console.log(ht.get2("sam"));  
console.log(ht.get2("ǻ"));  
console.log(ht.get2("tim"));  
console.log(ht.get2("phil"));  
console.log(ht.get2("jane"));   
console.log(ht.get2("bobby"));   //not present
console.log(ht.get2("lama"));    //not present */

/* console.log("getting linear probe...");
console.log(ht.getLinearProbe("France"));
console.log(ht.getLinearProbe("Spain"));
console.log(ht.getLinearProbe("ǻ")); 
console.log(ht.getLinearProbe("bill"));  
console.log(ht.getLinearProbe("amy"));  
console.log(ht.getLinearProbe("sam"));  
console.log(ht.getLinearProbe("ǻ"));  
console.log(ht.getLinearProbe("tim"));  
console.log(ht.getLinearProbe("phil"));  
console.log(ht.getLinearProbe("jane")); 
console.log(ht.getLinearProbe("bobby"));  //not present


ht.display();


 */












