var express = require("express");
var router = express.Router();

//  保证数据库模型加载于数据库连接至上保证每次不用实例化模型而报错
var two =require('../database/two')
// var product = require('../database/product');



// 查找所有
router.get("/", function (req, res, next) {

  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/mydb',{ useNewUrlParser: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    //console.log("数据库链接成功")；
    var userOne = new two({id:1,name:"zhang"})
    userOne.save(function(err,data) {
        
    });
  two.find({},function(err,docs) {
    if(err) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
       
        res.status(500).send({
            status : 500,
            message : '获取列表失败',

            
            data : []
        });
    }else{
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        res.status(200).send({
            status : 200,
            data : docs,
            message : '获取列表成功'
        })
    }

})
   


  });



});


module.exports = router;