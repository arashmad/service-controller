const findInArrayOfDicts = (array, option) => {
  for (item of array) {  
    if (item[option.key] === option.val) {
      return item;
    }
  }
}

var sortArrayofDicts = function (property, order) {
  var sortOrder = order === 'asc' ? 1 : -1;
  return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
};

module.exports = {
  findInArrayOfDicts,
  sortArrayofDicts
}