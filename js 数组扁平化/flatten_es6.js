//  可以使用es6 展开运算符的原因如下：

 var arr = [1, [2, 3, [4]]];
// console.log(...arr)

// 实现思路：利用arr.some判断当数组中还有数组的话，递归调用flatten扁平函数(利用es6展开运算符扁平), 用concat连接，最终返回arr;
function flatten(arr){
    while(arr.some(item => Array.isArray(item))){
        arr = [].concat(...arr);
    }
   
  }
  
  flatten(arr) 
  
// flatten(arr)  
  
  console.log("递归结果是:"+flatten(arr) )