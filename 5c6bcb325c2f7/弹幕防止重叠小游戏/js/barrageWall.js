var barrageWall = {
    container: null, //容器选择器
    barrageLen: null, //弹幕的条数
    lastElem: 0, //弹幕出现的位置
    overlapElem: -1, //如果大于0则表示每条弹幕轨道上都有弹幕未全部出现，需要重叠定位在弹幕轨道上
    barrage: [], //弹幕墙
    barrageOffset: [], //弹幕墙上最后一条弹幕的偏移量
    init: function (option) {
        if (option.container === undefined) {
            console.error("必须指定 container 属性，container为弹幕容器的选择器");
            return false;
        }
        if (option.barrageLen === undefined) {
            console.error("必须指定 barrageLen 属性，barrageLen为弹幕轨道的数");
            return false;
        }
        this.container = option.container;
        this.barrageLen = option.barrageLen;

        for (var i = 0; i < this.barrageLen; i++) { //建立弹幕墙，此处的循环次数为当前页面运行的弹幕行数
            this.barrage[i] = new Array();
        }
    },
    upWall: function (path, id) { //弹幕上墙
        if (!this.barrageLen && this.container) {
            console.error("未检测到container和barrageLen属性，请先初始化弹幕墙并指定container和barrageLen属性");
            return false;
        }

        var containerWidth = $(".container").width();

        this.positionWall(); //从上至下找出每条弹幕轨道上最后一条弹幕移动的位置

        var elem = $('<img/>') //创建元素
            .addClass('list') //添加样式
            .css({
                "top": this.lastElem * 55,
                "left": 0
            }) //定位
            .attr({
                "src": path,
                "id": id
            })
            // .html(txt)//添加内容
            .appendTo(this.container); //追加在父元素后面
        // 节点点击事件
        elem.click(function () {


            imgId = elem.attr("id");
            //重置问题id
            questionId = null
            //设置点击的效果

            elem.addClass("active").siblings().removeClass("active");
        });
        this.barrage[this.lastElem].push(elem); //追加在数组中

        setTimeout(function () { //200ms防止元素动画不执行
            var left = "translateX(" + containerWidth + "px)"
            elem.css("transform", left);
        }, 200);

        setTimeout(function () { //25s后动画执行完毕，从数组和页面中移除
            for (var i = 0; i < this.barrage.length; i++) {
                for (var x = 0; x < this.barrage[i].length; x++) {
                    if (this.barrage[i][x] === elem) {
                        this.barrage[i].splice(x, 1);
                        break;
                    }
                }
            }
            //页面删除元素 
            elem.remove();
            var id = elem.attr("id")

            Toast('回答错误', 1000, "error")
            wrongNum++
            //$("#errors").text(wrongNum)
            this.playMusic("error")

            // 删除 答案的数组元素
            answers.forEach(function (val, index) {
                if (val.id == id) {
                    answers.splice(index, 1);
                }
            });

          // 如果问题的id  和答案的Id相同则删除问题数组内对应的元素
          questions.forEach(function (val, index) {
            //console.log(val)
            if (val.id == elem.attr("id")) {
                questions.splice(index, 1);
            }
        });

            //删除问题按钮从dom 里面一出来
            $(".main .grid").each(function () {
                if ($(this).attr("id") == elem.attr("id")) {
                    $(this).remove();
                }
            });
            // 答案数组中删除此元素
            console.log(answers)
        }.bind(this), 10000);


    },
    positionWall: function () {
        for (var i = 0; i <= this.barrage.length; i++) { //从上至下找出每条弹幕轨道上最后一条弹幕移动的位置
            if (i === this.barrage.length) { //每条弹幕轨道上都有弹幕未全部出现的情况
                this.minOffset(); //弹幕墙上所有的位置都有弹幕且都未出现完毕时，找出他们当中完全最先的那个
            } else { //若有某个最后一条弹幕已经全部出现
                if (this.afterOffset(i)) break; //找到弹幕出现的位置，找到则退出循环
            }
        }
    },
    minOffset: function () { //找出所有弹幕轨道上最后一个弹幕中最先出现的那个（偏移量减去自身宽度）
        var minOffset = 0;
        for (var x = 0; x < this.barrage.length; x++) {
            var elem = this.barrage[x][this.barrage[x].length - 1]; //获取当前弹幕轨道上最后一条弹幕
            var aboveWidth = elem.width(); //获取它的宽度
            var matrix = elem.css('transform'); //获取它的矩阵值
            this.barrageOffset[x] = matrix === "none" ? aboveWidth : parseInt(matrix.split(",")[4]) + aboveWidth; //matrix为none则弹幕translateX为0
            minOffset = this.barrageOffset[x] > this.barrageOffset[minOffset] ? x : minOffset; //找到最先出现的弹幕
        }
        this.lastElem = minOffset;
    },
    afterOffset: function (i) { //找到弹幕出现的位置
        if (this.barrage[i].length === 0) { //为true则表示当前弹幕轨道没有弹幕，则当前弹幕放在改轨道上
            this.lastElem = i;
            this.overlapElem = -1;
            return true;
        } else { //当前弹幕轨道上有弹幕
            var elem = this.barrage[i][this.barrage[i].length - 1]; //获取当前弹幕轨道上最后一条弹幕
            var aboveWidth = elem.width(); //获取它的宽度
            var matrix = elem.css('transform'); //获取它的矩阵值
            if (matrix !== "none") {
                var aboveTransform = parseInt(matrix.split(",")[4]); //取出最后一条弹幕的矩阵值中X轴的偏移量，即translateX
                if (-aboveTransform - aboveWidth > 50) { //50为间隔 为true则表示当前弹幕轨道上最后一条弹幕已经全部出现，则当前弹幕放在改轨道上
                    this.lastElem = i;
                    this.overlapElem = -1;
                    return true;
                }
            }
        }
        return false;
    },
    question: function (questions) {
        var that = this;
        if (Array.isArray(questions) && questions.length > 0) {
            questions.forEach(function (val, index) {
                var div = $(
                    "<div class='grid'><span>" + val.text + "</span></div>"
                );
                div.attr({
                    id: val.id
                });
                $(".main").append(div);
                $(".main div").click(function () {
                    //判断允许生成的错题在总的限制范围内
                   if (wrongNum < totalError) {
                    
                       questionId = $(this).attr("id");
                      // 如果点击了图片则进行答案选项 否则提示请选择图片
                       if (imgId) {
                           if (questionId == imgId) {
                               // 移除问题节点从DOM 中删除
                               $(this).remove();
                               //  删除弹幕图片对应的DoM节点
                               $(".container img").each(function (index, elem) {
                                   if ($(elem).attr("id") == questionId) {
                                       $(elem).remove()
                                   }
                               })
                               // 删除原来图片数组中的对应的对象
                               answers.forEach(function (val, index) {
                                   if (questionId == val.id) {
                                       answers.splice(index, 1)
                                   }
                               })
                               //删除问题图片数组中对应的对象
                               questions.forEach(function (val, index) {
                                   if (questionId == val.id) {
                                       questions.splice(index, 1)
                                      
                                   }
                               })
                               //重新置空答案和问题的内存中保存项
                               imgId = null
                               questionId = null
                               Toast('回答正确', 1000, "sucess")
                           
                               rightNum++
                            //    $("#right").text(rightNum)
                                that.playMusic("ok")

                           } else {
                                // 否则提示回答错误,错题加加
                               Toast('回答错误', 1000, "error") 
                                wrongNum++
                            //    $("#errors").text(wrongNum)
                               that.playMusic("error")
                               }


                       } else {
                           Toast('未选中图片！', 1000, "default")
                           questionId = null
                       }
                   }

               })
            });
        }
    },
    // 播放音乐
    playMusic(element) {
        var music = document.getElementById(element)
        music.currentTime = 0; //重新播放
        music.play();
    }
    // //
}