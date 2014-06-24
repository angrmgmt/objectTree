/*
 * Gets all properties and methods of an object and writes them to a file with
 * the format type - name : value.  This includes all properties and methods
 * assigned after construction, not just those found by for...in.
 */

var fs = require('fs');

fs.writeFile('object.log', '');

var currentName = '',
    previousNames = [],
    names = [],
    types = [],
    values = [];

/*
 * obj - the object to tree out
 * level - the starting level (when calling initially always set to 0)
 * position - used to track the current spot in the file (when calling
 * initially this should be set to 0)
 * Change 'Root.' to whatever the name of the object is
 */
var objectTree = function (obj, level, position) {
    var tempNames = Object.getOwnPropertyNames(obj),
        i;
    for (i = 0; i < tempNames.length; i += 1) {
        if (level === 0) {
            currentName = 'Root.' + tempNames[i];
        } else {
            currentName = previousNames[level - 1] + '.' + tempNames[i];
        }
        if (!obj[tempNames[i]]) {
            names[position] = currentName;
            types[position] = 'null';
            values[position] = 'null';
        } else if (typeof obj[tempNames[i]] === 'object' && Object.getOwnPropertyNames(obj[tempNames[i]]).length > 0) {
            if (Object.prototype.toString.call(obj[tempNames[i]]) === '[object Array]') {
                names[position] = currentName;
                types[position] = 'Array';
                values[position] = obj[tempNames[i]];
            } else {
                previousNames[level] = currentName;
                objectTree(obj[tempNames[i]], level + 1, position);
            }
        } else {
            names[position] = currentName;
            types[position] = typeof obj[tempNames[i]];
            values[position] = obj[tempNames[i]];
        }
        fs.appendFileSync('object.log', types[position] + ' - ' + names[position] + ' : ' + values[position] + '\n');
        position += 1;
    }
    if (level === 0) {
        console.log('Done!');
    }
};