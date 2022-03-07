const bodyParser = require('body-parser');
const express = require('express');
const mongoose=require('mongoose')
const ejs = require('ejs');
const e = require('express');

const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title : String,
    content : String,
});
const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get(function(req,res){
    Article.find({},function (err,foundArticles) {
        if(!err){
            res.send(foundArticles)
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save(function(err){
        if(!err)
            res.send("Succesfully Added a new Article");
        else
        res.send(err);
    });
})

.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err)
            res.send("All articles deleted");
        else
         res.send(err);
    });
});

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
        if(foundArticle)
            res.send(foundArticle);
        else
            res.send(err);
    })
})
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title :req.body.title,content:req.body.content},
        function(err){
            if(!err)
                res.send("Succefully Updated");
            else 
                res.send(err);
        })
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title :req.body.title,content:req.body.content},
        function(err){
            if(!err)
                res.send("Succefully Updated");
            else 
                res.send(err);
        })
})

.delete(function(req,res){
    Article.deleteOne({
        title:req.params.articleTitle
    },function(err){
        if(!err)
            res.send("Successfully Deleted");
        else
            res.send(err);
    })
});


app.listen(3000,function(){
    console.log("Server started");
})

