var express = require("express");
var router = express.Router();

let model = {
    rating: {
        max: Number,
        average: Number,
        stars: String,
        min: Number
    },
    genres: [
        String
    ],
    title: String,
    casts: [{
            alt: String,
            avatars: {
                small: String,
                large: String,
                medium: String
            },
            name: String,
            id: String
        },

    ],
    collect_count: Number,
    original_title: String,
    subtype: String,
    directors: [{
        alt: String,
        avatars: {
            small: String,
            large: String,
            medium: String
        },
        name: String,
        id: String
    }],
    year: String,
    images: {
        small: String,
        large: String,
        medium: String
    },
    alt: String,
    id: String
}

function findAll(res) {
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/mydb", {
        useNewUrlParser: true
    });
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        console.log("链接成功");


    });

}



// 查找所有
router.get("/", function (req, res, next) {


    findAll(res);



});


module.exports = router;