
class TreeNode {
    constructor(left, right, parent) {
        this.leftchild = left;      //index of left child in array
        this.rightchild = right;    //index of right child in array
        this.parent = parent;       //index of parent in array
    }
};

class SymbolInfo {
    constructor(symbol, frequency, leaf) {
        this.symbol = symbol;       //character from text
        this.frequency = frequency; //frequency of the character
        this.leaf = leaf;           //TreeNode for this character
    }
}

class ForestRoots {
    constructor(weight, root) {
        this.weight = weight;   //combined frequency of all the chanracters belonging to this root
        this.root = root;       //index of this root in array
    }
}

class PriorityQueue {
    constructor(prioritizer) {
        this.arr = [];
        this.prioritizer = prioritizer;
    }
    enqueue(forestRoot) {
        if (this.arr.length == 0) {
            this.arr.push(forestRoot);
            return;
        }
        let added = false;
        for (let i = 0; i < this.arr.length; i++) {
            if (this.prioritizer(forestRoot.weight, this.arr[i].weight) < 0) {
                continue;
            }
            this.arr.splice(i, 0, forestRoot);
            added = true;
            break;
        }
        if (!added) {
            this.arr.push(forestRoot);
        }
    }
    dequeue() {
        return this.arr.shift();
    }
    peek() {
        return this.arr[0];
    }
    get length() {
        return this.arr.length;
    }
};

module.exports = {
    PriorityQueue: PriorityQueue,
    TreeNode: TreeNode,
    SymbolInfo: SymbolInfo,
    ForestRoots: ForestRoots,
}