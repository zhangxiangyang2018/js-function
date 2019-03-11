let Tween= require('tween.js').Tween;

class animation{
  constructor(from,to,duration,easeing,callback){

    this.from=from;//开始状态
    this.to=to;//结束状态
    this.callback=callback;

    this.start = 0;//开始的步数
    this.step = (duration||300)/16.7;//运行总步数量
    this.fnName = Tween[easeing];
    this.run = true;//正常运行
    this.init();
    
  }

  clear(){//清除
    this.run=false;
  }
  
  init(){
    let requestAnimationFrame = function (fn) {
      return setTimeout(fn, 16.7);
    };
    let move=()=>{
      // 当前的运动位置
      let value = this.fnName(this.start, this.from, this.to - this.from, this.step);

      // 时间递增
      this.start++;
      // 如果还没有运动到位，继续
      if (this.start <= this.step) {
        this.callback(value);
        if(this.run)
          requestAnimationFrame(move);
      } else {
        // 动画结束，这里可以插入回调...
        this.callback(this.to, true);
      }
    }
    move();
  }
  
}

module.exports.animation=animation;