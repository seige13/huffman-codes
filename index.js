var fs = require('fs');

fs.readFile('test.txt', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }

    processString(data);
});

/**
 * Counts the character frequency of a string
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
 * Processes the input string to array of sorted character code obejcts 
 * 
 * @param data {String}
 * 
 * @return {array}
 */
function processString(data) {
    data = data.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s\n]+/g, '');

    let text_input = characterCounter(data);
    let charCodeArray = Object
        .keys(text_input)
        .map(i =>
            charCode = {
                'character': i,
                'count': text_input[i],
                'frequency': text_input[i] / data.length
            })
        .sort((a, b) =>
            a.count < b.count ? 1 : -1
        );

    printFrequency(charCodeArray);
}

/**
 * Prints frequency of character codes
 * 
 * @param {Array} data 
 */
function printFrequency(data) {
    console.log("Symbol Frequency");
    for (charCode of data) {
        console.log(`  ${charCode.character},    ${(charCode.frequency * 100).toFixed(2)}% `);
    }
}

