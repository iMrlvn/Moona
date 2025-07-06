module.exports = function(array, size) {
    const temp = [];
    for (let i = 0; i < array.length; i += size) {
        temp.push(array.slice(i, i + size));
        }
    return temp;
}