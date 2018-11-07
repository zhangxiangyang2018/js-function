// 需要扁平化数组
var meta = [1,2,[3,4,[5]],6,[7,[8,9,[10,11,[12]]]]];
var result  = [];

function  fillArray(array,result) { 
     var count =  array.length;
     var i = 0;
     for(;i<count;i++) {
         var  temp =array[i];
         if(Array.isArray(temp)) {
             fillArray(temp,result);

         }else{
              result.push(array[i])
         }
     }
}
fillArray(meta,result)
console.log('递归处理的结果：',result)