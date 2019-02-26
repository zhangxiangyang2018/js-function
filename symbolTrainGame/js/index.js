/* 初始化参数 */

// 问题存储结构
var questions=[]
// var questions = [{
//         id: 0,
//         text: "问题1=?"
//     },
//     {
//         id: 1,
//         text: "问题2=?"
//     },
//     {
//         id: 2,
//         text: "问题3=?"
//     },
//     {
//         id: 3,
//         text: "问题4=?"
//     },
//     {
//         id: 4,
//         text: "问题5=?"
//     },
//     {
//         id: 5,
//         text: "问题6=?"
//     },
//     {
//         id: 6,
//         text: "问题7=?"
//     },
//     {
//         id: 7,
//         text: "问题8=?"
//     },
//     {
//         id: 8,
//         text: "问题9=?"
//     },
//     {
//         id: 9,
//         text: "问题10=?"
//     }
// ];
// // 答案存储结构
var answers=[]
    // [{
//         id: 0,
//         path: './img/1.png',
//
//     },
//     {
//         id: 1,
//         path: './img/2.png',
//
//     },
//     {
//         id: 2,
//         path: './img/3.gif',
//
//     },
//     {
//         id: 3,
//         path: './img/4.png',
//
//     },
//     {
//         id: 4,
//         path: './img/5.png',
//
//     },
//     {
//         id: 5,
//         path: './img/6.gif',
//
//     },
//     {
//         id: 6,
//         path: './img/7.png',
//
//     }
// ];
//  初始化每次获取第几张图片
var i = 0;
// 定时器初始化
var timer = null;
// 当前点击的图片答案id
var imgId = null;
//当前对的题数
var rightNum = 0;
// 生成错题
var wrongNum = 0;
//是否开始游戏
var isStart = false;
//  问题id初始化参数
var questionId = null;
//  总共允许生成几个错题
var totalError = 10;

// 单个动画节点走完全程所需要的时长
var imgDuration = 17000;
// 创建弹幕的速度时常 
var speedTime = 800;



/* 自定义弹框显示*/
/*
  @params
   msg:消息提示
   duration:时长
   type:类型
*/
function Toast(msg, duration, type) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    if (type == "error") {

        m.style.cssText =
            `width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;
            position: fixed;top: 10%;left: 20%;z-index: 999999;background: red;font-size: 12px;`;
    }
    if (type == "sucess") {
        m.style.cssText =
            `width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color:rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius:
             5px;position: fixed;top: 10%;left: 20%;z-index: 999999;background: green;font-size: 12px;`;
    }
    if (type == "default") {
        m.style.cssText =
            `width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color:rgb(255, 255, 255);line-height: 30px;
        text-align: center;border-radius: 5px;position: fixed;top: 10%;left: 20%;z-index: 999999;background: #666;font-size: 12px;`;
    }
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';

        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}


/*生成问题函数*/
/*
  @params
   questions 为数组类型并且不能为空否则抛出异常
*/

function question(questions) {
    if (Array.isArray(questions) && questions.length > 0) {
        questions.forEach(function (val, index) {
            var div = $("<div class='grid'><span>" + val.text + "</span></div>")
            div.attr({
                "id": val.id
            })
            $(".main").append(div)
        })

        //问题点击事件
        $(".main div").click(function () {

            if (wrongNum < totalError) {
                var that = this;
                questionId = $(this).attr("id");

                // 如果点击了图片则进行答案选项 否则提示请选择图片
                if (imgId) {
                    if (questionId == imgId) {
                        // 删除自身点击节点
                        $(this).remove();
                        //  删除弹幕图片节点
                        $(".container img").each(function (index, elem) {
                            if ($(elem).attr("id") == questionId) {
                                $(elem).remove()
                            }
                        })
                        // 删除原来图片数组中的值
                        answers.forEach(function (val, index) {
                            if (questionId == val.id) {
                                answers.splice(index, 1)
                               

                            }
                        })

                        questions.forEach(function (val, index) {
                            if (questionId == val.id) {
                                questions.splice(index, 1)
                                createdShoot(answers)
                            }
                        })
                        imgId = null
                        questionId = null
                        Toast('回答正确', 1000, "sucess")

                        rightNum++
                        $("#right").text(rightNum)
                        playMusic("ok")

                    } else {

                        Toast('回答错误', 1000, "error")

                        wrongNum++
                        $("#errors").text(wrongNum)
                        playMusic("error")

                    }

                    
                } else {
                    Toast('未选中图片！', 1000, "default")
                    questionId = null
                }
            }

        })
    } else {
        return false;
    }
}

/**创建单个图片弹幕**/
/*
  @params
   src　图片的路径
   id 图片的id
*/

function shoot(src, id) {

    // 获取容器的高度
    var containerHeight = $(".container").height();
    // 获取容器的宽度
    var containerWidth = $(".container").width();
    // 创建弹幕节点
    var node = $("<img class='node'>");
    //  设置节点文本
    node.attr({
        "src": src,
        "id": id
    })
    //  设置节点的right 值
    node.css("right", containerWidth);
    //设置节点的top 值随机值
    var randTop = Math.floor(Math.random() * (containerHeight - 50) + 0);
    node.css("top", randTop);
    //插入节点至文档当中
    $(".container").append(node);
    
    //节点弹幕动画
    node.animate({
        left: containerWidth
    }, imgDuration, function () {
        node.remove();
        if ($(node).hasClass("active")) {
            // 判断imgs点击 但是questionId没有点击则进行本轮错题加加
            if (imgId && questionId == null) {
                Toast('回答错误', 1000, "error")
                wrongNum++
                $("#errors").text(wrongNum)
                playMusic("error")
            }
            // 本轮循环结束重置答案id和问题id
            imgId = null;
            questionId = null
        }
    })

    // 节点点击事件
    node.click(function () {
        //重置问题id
        questionId = null
        //获取答案id
        imgId = $(node).attr("id")
        //设置点击的效果
        $(node).addClass("active").siblings().removeClass("active")

    })



}



// 定时生成图片弹幕
/*
  @params
  answers 答案为数组类型且长度大于零
*/
function createdShoot(answers) {
    if (Array.isArray(answers) && answers.length > 0) {
        var len = answers.length;
        clearInterval(timer)
        timer = setInterval(function () {
            if (i < len) {
                // 如果错题超过限制错题数量则进行重置游戏
                if (wrongNum < totalError) {
                    shoot(answers[i].path, answers[i].id);

                    i++;
                } else {
                    var limit = "限制" + totalError + "道错题"
                    swal({
                        title: "考试结束！",
                        text: limit,
                        type: 'warning',
                        timer: 1000,
                        showConfirmButton: false
                    }, function () {
                        window.location.reload()
                    })
                }
            }

            if (i >= len) {
                i = 0;
            }
        }, speedTime)
    } else {
        return false;
    }

}

//播放音频函数
/*
  @params
  element 元素id
*/
function playMusic(element) {
    var music = document.getElementById(element)
    music.currentTime = 0; //重新播放
    music.play();
}


// 页面与安卓端交互
function getData(res) {
//     var res = `
//         {"msg":"成功","code":1,"data":{"Answer":[{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110101_01.png","id":"110101_01"},{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110102_01.png","id":"110102_01"},{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110103_01.png","id":"110103_01"},{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110104_01.png","id":"110104_01"},{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110107_01.png","id":"110107_01"},{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110108_01.png","id":"110108_01"},{"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/110109_01.png","id":"110109_01"},
// {"path":"http://192.168.1.101:8080/static/images/symbolTrain/020202/120101_01.png","id":"120101_01"}],
// "Question":[{"id":"110101_01","text":"三角点"},{"id":"110102_01","text":"土堆上的三角点"},
// {"id":"110103_01","text":"军控点"},{"id":"110104_01","text":"土堆上的军控点"},
// {"id":"110107_01","text":"水准点"},{"id":"110108_01","text":"独立天文点"},
// {"id":"120309_01","text":"敖包、经堆"},{"id":"120312_01","text":"医院"},{"id":"120315_01","text":"科学观测台"},
// {"id":"120321_01","text":"塔"},{"id":"120323_01","text":"城楼"}]}}
//  `
console.log(res)
    if(typeof res == String||typeof res  == "string")res  = JSON.parse(res);
    if (res.code == 1) {
        answers = typeof res == String||typeof res == "string"? JSON.parse(res.data.Answer):res.data.Answer;
        console.log(123)
        questions = typeof res == String||typeof res == "string"?JSON.parse(res.data.Question):res.data.Question;
        console.log(123456)
        init()
    } else {
        Toast('数据获取失败!', 1000, "error")
    }
}

//页面初始化加载自执行函数
// $(function () {
    // 开始游戏点击按钮\
    function init(){
    console.log("init")
    $(".btn").click(function () {
        if (answers.length == 0 || questions.length == 0) {
            Toast('答案列表或问题列表不能为空！', 1000, "error")
            return false;
        }
        if (answers.length > 0 && questions.length > 0) {
            isStart = !isStart
            if (isStart) {
                $(this).text("结束游戏")
                $(this).css("background", "red")
                question(questions)
                createdShoot(answers)
                $("#scoreShow").css("display", "block")
                $("#title").css("display", "none")
            } else {
                var str = "答对" + rightNum + "道题目！" + "答错" + wrongNum + "道题目！"
                swal({
                    title: '考试结果',
                    text: str,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }, function (isConfirm) {

                    if (isConfirm) {

                        window.location.reload()
                    } else {
                        isStart = true;
                    }
                });
            }

        }
    })
}

// })