
exports.getLength = function(list) {
    var length = 0;
    for (var element of list) {
        length++;
    }
    return length;
}