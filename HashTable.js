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
		resize(bucketSize)
		getLoad()
		display()
*/

class HashTable {
	
	constructor(buckets = 37) {
		this.table = new Array(buckets);
		this.size = 0;		//total number of stored elements
		this.MAX_LOAD = 0.75;
		this.MIN_LOAD = 0.25;
		this.coefficients = this.getCoefficients();
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
 			const keyLoc = chain.findIndex(([currKey]) => currKey === key);
			
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
		
		//check if a resize is needed
		if (this.getLoad() >= this.MAX_LOAD){
			this.resize(this.table.length * 2);
		}
	}
	
	//Get a value from the HashTable
	get(key) {
	
		const index = this.hashFunc(key);
		const chain = this.table[index];
		
		//check the chain at the derived index and return the key/value pair if key found
		if (chain) {
			return chain.find(([currKey]) => currKey === key)[1];
		}
		
		return false;  //key not present
	}

	//Delete a key/value pair from the Hash Table
	remove(key) {
	
		const index = this.hashFunc(key);		
		const chain = this.table[index];	
		
		if (chain) {
			
			//identify location of the key within the second-level chain
			const keyLoc = chain.findIndex(([currKey]) => currKey === key);
			
			//if key is present, chop it out...resize table if needed
			if (keyLoc > -1){
				chain.splice(keyLoc, 1);
				this.size--;
				if (this.getLoad() <= this.MIN_LOAD){
					this.resize(this.table.length / 2);
				}
				return true;
			} 
			
		}
		
		return false;	//key not present
		
	}
	
	//Resize table to better suit the load (using prime nums)...O(n) time, visit every item
	resize(bucketSize){
	
		console.log("Resizing...current load: " + this.getLoad()*100 + "%");

		//make a copy of old table, create new hash table and reset count
		const oldTable = this.table;
		this.table = new Array(this.getNextPrimeNum(bucketSize));
		this.size = 0;

		//step through non-empty buckets of old table array and transfer chain items to new table	
		oldTable.filter(chain => chain).forEach(chain => {
			return chain.forEach(([key, val]) => this.set(key, val));
		});	
		
		console.log("New load: " + this.getLoad()*100 + "%");
	};
	
	//Return the current load on the hash table -- items/slots
	getLoad(){
		return (this.size / this.table.length).toFixed(2);
	}
	
	//Convert string to an int -- between 0 and max - 1
	hashFunc2(str){
		
		let hash = 0;
		
		for (let [currChar] of [...str]){
			hash = (hash << 5) + hash + currChar.charCodeAt(0);
			hash = hash & hash;		//convert to 32bit int
			hash = Math.abs(hash);
		}
		
		return hash % this.table.length;;
		
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
	
	//Hashing for IP addresses
	hashIP(ipAddr){
				
		let parts = ipAddr.split(".");
		let coefficients = this.coefficients;		
		let hash = 0;
		
		//ha(x1,x2,x3,x4) = (a1x1 + a2x2 + a3x3 + a4x4) mod n 
		for (let [i, coefficient] of coefficients.entries()){
			hash = hash + (coefficient * parts[i]);
		};
		
		hash = hash % this.table.length;		
		
		return hash;
	}
	
	//Return array of 4 coefficients used for multipling IP parts
	getCoefficients(){
		
		let coefficients = new Array(4);
		
		for (let [i] of coefficients.entries()){
			coefficients[i] = this.getRandomBoundedNumb();			
		}; 
				
		return coefficients;
	}
	
	//Return random number between 1 - bucketSize
	getRandomBoundedNumb(){
		return Math.floor(Math.random() * (this.table.length)) + 1;
	}
	
	//Get a prime number nearby the bucketSize to use as the new bucket count 
	getNextPrimeNum(num){
		num = Math.round(num);
		while (!this.isPrime(++num)){};	//increment from bucketSize until reach a prime num
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

///////

const ht = new HashTable();

//set elements in the table
ht.set("France", 111);
ht.set("Spain", 150);
ht.set("ǻ", 192);    	//creates collision with Spain -- both hash to 126
ht.set("France", 99);
ht.set("bill", 17);
ht.set("amy", 4);
ht.set("sam", 51);
ht.set("tim", 17);
ht.set("phil", 53);
ht.set("jane", 78); 

ht.display();

console.log(ht.get("ǻ")); 
console.log(ht.get("Spain")); 
console.log(ht.get("bill"));  
console.log(ht.get("amy"));  
console.log(ht.get("sam"));  
console.log(ht.get("ǻ"));  
console.log(ht.get("tim"));  
console.log(ht.get("phil"));  
console.log(ht.get("jane"));   
console.log(ht.get("lama"));    //not present 










