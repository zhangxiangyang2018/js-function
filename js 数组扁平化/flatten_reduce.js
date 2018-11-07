//  reduce 方法
// reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。 
// 能使用reduce原因如下：
// var  flattened = arr.reduce(function(prev,cur){
//     return prev.concat(cur);
// },[])

//实现思路：使用reduce, 当数组中还有数组的话，递归调用flatten扁平函数(利用reduce扁平), 用concat连接，最终返回arr.reduce的返回值;
function flatten(arr){
    return arr.reduce(function(prev, cur){
        return prev.concat(Array.isArray(cur) ? flatten(cur) : cur)
    },[])
}

flatten(arr) 
