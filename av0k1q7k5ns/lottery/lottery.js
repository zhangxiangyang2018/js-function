let animation= require('animation.js');


Page({
  data: {
    rotate:0,//角度
    last_roate:0,//最后停的位置
    status:0,//0没开始,1加速中,2匀速中,3减速中，4完成
    linear_animation:null,//匀速运动animation
    price_data:[{
      level:1,
      level_str:'一等奖',
      min:0,
      max:45
    },{
      level:2,
      level_str: '二等奖',
      min:315,
      max:360,
    }, {
      level: 3,
       level_str: '三等奖',
      min: 270,
      max: 315,
    }, {
      level: 4,
      level_str: '四等奖',
      min: 225,
      max: 270,
    }, {
      level: 5,
      level_str: '五等奖',
      min: 180,
      max: 225,
    }, {
      level: 6,
      level_str: '六等奖',
      min: 135,
      max: 180,
    }, {
      level: 7,
      level_str: '七等奖',
      min: 90,
      max: 135,
    }, {
      level: 8,
      level_str: '八等奖',
      min: 45,
      max: 90,
    }]
  },
  onLoad: function () {
   
  },
  rotate:function(){
  
    console.log('rotate');
    if(this.data.status!=0&&this.data.status!=4)//状态不对
      return false;

    this.setData({
      status:1
    });
    
    let linear_move=()=>{
      this.setData({
        status: 2
      });
      this.linear_animation = new animation.animation(this.data.last_roate, this.data.last_roate+360, 600, 'Linear', (value) => {
        this.setData({
          rotate: value,
        });
        if (value == this.data.last_roate+360) {
          if (this.data.status==2) 
            linear_move();
        }
      });
      
    }

    let init_animation = new animation.animation(this.data.last_roate, this.data.last_roate+360, 1000, 'easeIn', (value) => {
    
      this.setData({
        rotate: value,
      });
      if (value == this.data.last_roate+360){
        linear_move();
      }
    });

    var random_time=1000*Math.random();
    setTimeout(()=>{
      var price_data = this.data.price_data[Math.random() * this.data.price_data.length>>0];
      console.log(price_data)
      this.stop(price_data);
    }, 2500 + random_time);

    
  },
 
  stop: function (price_data){
    this.linear_animation.clear();//停止匀速旋转

    
    let self=this;

    let rotate_finish = price_data.min +10+ ((25*Math.random())>>0)+360;//最后的度数
    let rotate_begin = (this.data.rotate + this.data.last_roate)%360;

    if (rotate_finish - rotate_begin<360){//保证转的角度足够大。
      rotate_finish+=360;
    }

    let rotate_time = (rotate_finish - rotate_begin) / 360 * 1200;

    console.log(rotate_begin, rotate_finish);

    this.setData({//设置最后停止的位置
      last_roate: rotate_finish,
      status: 3
    });
    let step_animation = new animation.animation(rotate_begin, rotate_finish, rotate_time, 'easeOut', (value) => {
      this.setData({
        rotate: value,
      });
      if (rotate_finish==value){
        this.setData({
          status: 4
        });
        wx.showModal({
          title: '中奖提示',
          content: '恭喜中了' + price_data.level_str
        })
      }
    });

  }
  
})
