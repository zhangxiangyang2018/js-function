// 实现思路：数组适用toString()方法后变成以逗号分割的字符串，然后map遍历数组把每一项再变回整数并返回map后的结果。
var arr = [1, [2, 3, [4]]];

function flatten(arr){
    return arr.toString().split(',').map(function(item){
         return parseInt(item);
     })
}    

flatten(arr)   // [1,2,3,4]
console.log('递归处理的结果：',flatten(arr))