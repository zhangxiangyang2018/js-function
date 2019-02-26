var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var twoSchema = new Schema({
    
       
       id:Number,
       name:String,
    
});

var two = mongoose.model('two',twoSchema,"two");

module.exports = two;