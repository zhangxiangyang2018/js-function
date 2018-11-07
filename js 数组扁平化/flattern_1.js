//实现思路：循环数组，如果数据中还有数组的话，递归调用flatten扁平函数（利用for循环扁平），用concat连接，最终返回result;
var meta = [1,2,[3,4,[5]],6,[7,[8,9,[10,11,[12]]]]];
function flatten(arr){
    var result = [];
    for(var i=0,len=arr.length;i<len;i++)  {
        if(Array.isArray(arr[i])){
            result =  result.concat(flatten(arr[i]))
        }else{
            result.push(arr[i])
        }
    }
    return result;
}
console.log('递归处理的结果：',flatten(meta))