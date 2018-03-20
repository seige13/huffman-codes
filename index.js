const fs = require('fs');

// Read and process test file
fs.readFile('test.txt', 'utf8', function (error, data) {
    if (error) {
        throw error;
    }

    processString(data);
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

    printFrequency(charCodeArray);
}

/**
 * Prints frequency of char codes
 * 
 * @param {Array} data 
 */
function printFrequency(data) {
    console.log("Symbol Frequency");
    for (charCode of data) {
        console.log(`  ${charCode.char},    ${(charCode.frequency * 100).toFixed(2)}% `);
    }
}

