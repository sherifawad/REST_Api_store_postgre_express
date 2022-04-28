"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPatchString = void 0;
// https://stackoverflow.com/questions/21759852/easier-way-to-update-data-with-node-postgres
var createPatchString = function (tableName, id, cols) {
    // Setup static beginning of query
    var query = ["UPDATE ".concat(tableName)];
    query.push("SET");
    // Create another array storing each set command
    // and assigning a number value for parameterized query
    var set = [];
    Object.keys(cols).forEach(function (key, i) {
        set.push("".concat(key, " = ($").concat(i + 1, ")"));
    });
    query.push(set.join(", "));
    // Add the WHERE statement to look up by id
    query.push("WHERE id = ".concat(id));
    // Return a complete query string
    return query.join(" ");
};
exports.createPatchString = createPatchString;
