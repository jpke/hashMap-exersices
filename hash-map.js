// var HashMap = function(initialCapacity) {
//     this.length = 0;
//     this._slots = [];
//     this._capacity = initialCapacity || 8;
// };
// HashMap.MAX_LOAD_RATIO = 0.9;
// HashMap.SIZE_RATIO = 3;

// HashMap._hashString = function(string) {
//     var hash = 5381;
//     for (var i=0; i<string.length; i++) {
//         hash = (hash << 5) + hash + string.charCodeAt(i);
//         hash = hash & hash;
//     }
//     return hash >>> 0;
// };

// HashMap.prototype.set = function(key, value) {
//     var loadRatio = (this.length + 1) / this._capacity;
//     if (loadRatio > HashMap.MAX_LOAD_RATIO) {
//         this._resize(this._capacity * HashMap.SIZE_RATIO);
//     }

//     var index = this._findSlot(key);
//     this._slots[index] = {
//         key: key,
//         value: value
//     };
//     this.length++;
// };

// HashMap.prototype._findSlot = function(key) {
//     var hash = HashMap._hashString(key);
//     var start = hash % this._capacity;

//     for (var i=start; i<start + this._capacity; i++) {
//         var index = i % this._capacity;
//         var slot = this._slots[index];
//         if (slot === undefined || slot.key == key) {
//             return index;
//         }
//     }
//     // Unreachable
// };

// HashMap.prototype._resize = function(size) {
//     var oldSlots = this._slots;
//     this._capacity = size;
//     // Reset the length - it will get rebuilt as you add the items back
//     this.length = 0;
//     this._slots = [];
//     for (var i=0; i<oldSlots.length; i++) {
//         var slot = oldSlots[i];
//         if (slot !== undefined) {
//             this.set(slot.key, slot.value);
//         }
//     }
// };

var HashMap = function(initialCapacity) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity || 8;
    this._deleted = 0;
};
HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

HashMap._hashString = function(string) {
    var hash = 5381;
    for (var i=0; i<string.length; i++) {
        hash = (hash << 5) + hash + string.charCodeAt(i);
        hash = hash & hash;
    }
    return hash >>> 0;
};

HashMap.prototype.get = function(key) {
    var index = this._findSlot(key);
    if (this._slots[index] === undefined) {
        throw new Error('Key error');
    }
    return this._slots[index].value;
};

HashMap.prototype.contains = function(key) {
    var index = this._findSlot(key);
    if (this._slots[index] === undefined) {
        return false;
    }
    return true;
};

HashMap.prototype.set = function(key, value) {
    var loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
        this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    var index = this._findSlot(key);
    this._slots[index] = {
        key: key,
        value: value,
        deleted: false
    };
    this.length++;
};

HashMap.prototype.remove = function(key) {
    var index = this._findSlot(key);
    var slot = this._slots[index];
    if (slot === undefined) {
        throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
};

HashMap.prototype._findSlot = function(key) {
    var hash = HashMap._hashString(key);
    var start = hash % this._capacity;

    for (var i=start; i<start + this._capacity; i++) {
        var index = i % this._capacity;
        var slot = this._slots[index];
        if (slot === undefined || (slot.key == key && !slot.deleted)) {
            return index;
        }
    }
    // Unreachable
};

HashMap.prototype._resize = function(size) {
    var oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];
    for (var i=0; i<oldSlots.length; i++) {
        var slot = oldSlots[i];
        if (slot !== undefined && !slot.deleted) {
            this.set(slot.key, slot.value);
        }
    }
};



// Write an algorithm to check whether any permutation of a string is a palindrome (a string which reads the same forwards and backwards). For example, "madam", "amadm" and "cllci" should all return true, whereas "caabl" and "aaxxis" should return false.

function checkForPalindrome(string) {
  let hashmap = new HashMap()
  for (let i = 0; i < string.length; i ++) {
    if(hashmap.contains(string[i])) {
      hashmap.remove(string[i]);
    }
    else {
      hashmap.set(string[i], "")
    }
  }
  console.log(hashmap);
  return hashmap.length <= 1;
}


// Write an algorithm to group a list of words into anagrams. For example, if the input was ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race'], the output should be: [['east', 'teas', 'eats'], ['cars', 'arcs'], ['acre', 'race']].

function anagramGroups(array) {
  let hashmap = new HashMap();
  let output = []
  for (let word in array) {
    let sortedWord = array[word].split("").sort().join("");
    if(!hashmap.contains(sortedWord)) {
      hashmap.set(sortedWord, "");
      let tempArray = [];
      tempArray.push(array[word]);
      output.push(tempArray);
      }
    else {
      for(let element in output) {
        let pushed = false;
        output[element].forEach(outputWord => {
          let sortedOutputWord = outputWord.split("").sort().join("");
          if(sortedWord == sortedOutputWord && !pushed) {
            output[element].push(array[word]);
            pushed = !pushed;
          }
        })
      }
    }
  }
  return output;
}


// Write a hash map implementation which uses separate chaining
var HashMap = function(initialCapacity) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity || 8;
    this._deleted = 0;
    this._nodeCount = 0;
};
HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

HashMap._hashString = function(string) {
    var hash = 5381;
    for (var i=0; i<string.length; i++) {
        hash = (hash << 5) + hash + string.charCodeAt(i);
        hash = hash & hash;
    }
    return hash >>> 0;
};

HashMap.prototype.get = function(key) {
    var index = this._findSlot(key);
    if (this._slots[index] === undefined) {
        throw new Error('Key error');
    }
    function getRightValue(node, key) {
      if(node.key === key) return node.value;
      if(node.next === undefined) return "Key not found";
      return getRightValue(node.next, key);
    }
    return getRightValue(this._slots[index], key);
};

HashMap.prototype.set = function(key, value) {
    var loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
        this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    var index = this._findSlot(key);
    let existingNode = this._slots[index];
    if(!existingNode || existingNode.deleted) {
      this.length++;
      this._nodeCount++;
      this._slots[index] = {
        key: key,
        value: value,
        deleted: false,
        next: undefined
      }
    } else if (existingNode.key === key) {
        existingNode.value = value;
    } else {
      this._nodeCount++;
      let tempNode = existingNode;
      this._slots[index] = {
        key: key,
        value: value,
        deleted: false,
        next: {
          key: tempNode.key,
          value: tempNode.value,
          deleted: false,
          next: tempNode.next
        }
      }
    }
};

HashMap.prototype._findSlot = function(key) {
    var hash = HashMap._hashString(key);
    return hash % this._capacity;
};

HashMap.prototype.remove = function(key) {
    var index = this._findSlot(key);
    var slot = this._slots[index];
    if (slot === undefined) {
        throw new Error('Key error');
    }
    if(slot.key === key) {
      this._slots[index] = undefined;
      this.length--;
      this._nodeCount--;
    }
    let getRightValue = (node, key, replacementNode) => {
      replacementNode.push(node);
      if(!node.next) {
        console.log("this ran");
          return replacementNode;
        }
      if(node.key === key) {
          node.key = node.next.key;
          node.value = node.next.value;
          if(node.next.next) {
            node.next = node.next.next;
            node.deleted = node.next.deleted;
          } else {
            node.next = undefined;
            node.deleted = undefined;
          }
          this._nodeCount--;
          console.log("_nodeCount --");
        }
      return getRightValue(node.next, key, replacementNode);
    }
    let tempSlotArray = getRightValue(slot, key, []);
    let tempNode;
    function arrayToLinkedList(array, linkedList) {
      linkedList.next = array.shift()
      if(!linkedList.next) return linkedList;
      return arrayToLinkedList(array, linkedList)
    }
    this._slots[index] = arrayToLinkedList(tempSlotArray, {});
};


hashmap = new HashMap();
hashmap.set("key", "value");
hashmap.set("kei", "value2");
hashmap.set("kea", "value3");

hashmap.remove("kei");








