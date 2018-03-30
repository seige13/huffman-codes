const fs = require('fs');
const path = require("path");
const readline = require("readline");
const classes = require('./hf_classes');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let counts = [];
let letters = [];
let outputString = [];  //string to be saved to the output file

// Read and process test file and produce results in output file
rl.question('Please enter the  input file path: ', (inFile) => {
    let inputFilePath = inFile || path.join(__dirname, 'infile.dat');
    fs.readFile(inputFilePath, 'utf8', function (error, data) {
        if (error) {
            throw error;
        }

        processString(data);
        outputString = outputString.join('\n');
        console.log(outputString);

        rl.question('Please enter the output file path: ', (outFile) => {
            let outputFilePath = outFile || path.join(__dirname, 'outfile.dat');
            fs.writeFile(outputFilePath, outputString, (error) => {
                if (error) {
                    throw error;
                }

                console.log(`Results saved to ${outputFilePath}`);
            });
            rl.close();
        });
    });
});

/**
 * Counts the char frequency of a string
 *
 * @param {String} string
 *
 * @return {}
 */
function characterCounter(string) {
    return string
        .split('')
        .reduce((total, letter) => {
            total[letter] ? total[letter]++ : total[letter] = 1;
            return total;
        }, {});
}

/**
 * Process the input string and return an array of sorted char code objects
 *
 * @param data {String}
 *
 * @return {array}
 */
function processString(data) {
    // Removes spaces and punctuation from the string
    data = data.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s\n]+/g, '');

    let textInput = characterCounter(data);
    let charCodeArray = Object
        .keys(textInput)
        .map(char =>
            charCode = {
                'char': char,
                'count': textInput[char],
                'frequency': textInput[char] / data.length
            })
        .sort((a, b) =>
            a.count < b.count ? 1 : -1
        );

    for (var i = 0; i < charCodeArray.length; i++) {
        counts.push(charCodeArray[i].count)
        letters.push(charCodeArray[i].char)
    }

    printFrequency(charCodeArray);
    generateHCodes(charCodeArray);

}

/**
 * Prints frequency of char codes
 *
 * @param {Array} data
 */
function printFrequency(data) {
    outputString.push('Symbol Frequency');
    for (charCode of data) {
        outputString.push(`  ${charCode.char},    ${(charCode.frequency * 100).toFixed(2)}% `);
    }
}

/**
 * Generate Huffman Codes for characters
 *
 * @param {Array} data
 */
function generateHCodes(data) {
    let tree = [];      //sequential container (list/array/vector) named tree of the type TreeNode
    let alphabet = [];      //sequential container named alphabet of type SymbolInfo
    let forest = new classes.PriorityQueue((x, y) => y - x);    //priority queue of data structures that represent the trees themselves

    // generate tree, alphabet, and forest arrays from char data
    for (let i = 0; i < data.length; i++) {

        tree[i] = new classes.TreeNode();           //tree

        let symbolInfo = new classes.SymbolInfo();  //alphabet
        symbolInfo.symbol = data[i].char;
        symbolInfo.frequency = data[i].count;
        symbolInfo.leaf = i;
        alphabet[i] = symbolInfo;

        let forestRoot = new classes.ForestRoots(); //forest
        forestRoot.weight = data[i].count;
        forestRoot.root = i;
        forest.enqueue(forestRoot);

    }

    // fill up forest priority queue
    let i = tree.length;
    while (forest.length > 1) {
        let least = forest.dequeue();
        let second = forest.dequeue();

        let newNode = new classes.TreeNode();
        newNode.leftchild = least.root;
        newNode.rightchild = second.root;

        tree[least.root].parent = i;
        tree[second.root].parent = i;
        tree[i] = newNode;

        let newRoot = new classes.ForestRoots();
        newRoot.weight = least.weight + second.weight;
        newRoot.root = i++;
        forest.enqueue(newRoot);
    }

    // generate Huffman Codes
    var codes = {};
    for (let i = 0; i < alphabet.length; i++) {
        let code = [];
        let j = i;
        while (j != tree.length - 1) {
            let currentIndex = j;
            if (tree[j].parent)     // if there is a parent
                j = tree[j].parent; // move up the tree
            if (tree[j].leftchild == currentIndex) {    //if this is a left left child
                code.unshift(0);                        //add 0 to code
            }
            else {                                      //if this is a right child
                code.unshift(1);                        //add 1 to code
            }
        }
        codes[alphabet[i].symbol] = code.join('');
    }

    outputString.push('\n');
    outputString.push('Symbol Huffman Codes');
    for (let key in codes) {
        outputString.push(`  ${key},    ${codes[key]}`);
    }

    // calculate the length of the coded message in terms of number of bits
    let totalBits = 0;
    let keyLengths = [];

    for (let key in codes) {
        keyLengths.push(codes[key].length)
    }

    for (let k = 0; k < keyLengths.length; k++) {
        totalBits = totalBits + (counts[k] * keyLengths[k]);
    }

    outputString.push('\n');
    outputString.push(`Total bits: ${totalBits}`);
}
