import express from "express";
import {v4 as uuid} from "uuid";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

// Changed the post array from a constant to a let so that it is able to change, so when deleting from the array and filtering it you can
// Change the array and update it.
let postArr = [];

app.get("/", (req, res) => {
    res.render("view_blogs.ejs");
});

app.post("/submit", (req, res) =>{
    const uniqueID = uuid();
    const newPost = {
        ID: uniqueID,
        title: req.body.title,
        author: req.body.author,
        content: req.body.text
    };

    if(!postArr.includes(newPost.ID)){
        postArr.push(newPost);    
    }

    // Adding the redirect method to change the url as without it, it would stay on the submit url and each time you refreshed
    // it would resubmit the data and create a new post with a new unique ID.
    res.redirect("/posts");
});

app.get("/posts", (req, res) => {
    res.render("view_blogs.ejs", {posts: postArr});
});

/* The post ID gets extracted from the URL and set with the req.params.postID and then set in the get in the :postID section of the get.
The .find section the section in the {} is what it is looking for, the arrow states what it will be saved as and the postID is what it is
checking against. */
app.get("/blog/:postID", (req, res) => {
    const postID = req.params.postID;

    const post = postArr.find(post => post.ID === postID);
    if(post){
        res.render("blog_post.ejs", {post: post});
    } else{
        res.status(404).send("Error 404 Post not found.");
    }
});

app.get("/blog/:postID/edit", (req, res) =>{
    const postID = req.params.postID;
    console.log(postID);
    const post = postArr.find(post => post.ID === postID);

    res.render("edit.ejs", {postinfo: post});
});

app.post("/blog/:postID/edited", (req, res) => {
    const editPostId = req.params.postID;   
    console.log(editPostId);

    const updatedPost = {
        ID: editPostId,
        title: req.body.title,
        author: req.body.author,
        content: req.body.text
    }

    const postToEditPos = postArr.findIndex(updatedPost => updatedPost.ID === editPostId);
    if(postToEditPos !== -1){
        postArr[postToEditPos] = updatedPost;
    }

    res.redirect("/posts");
});

app.delete("/blog/:postID/Delete", (req, res) => {
    const postID = req.params.postID;
    postArr = postArr.filter(post => post.ID !== postID);
    res.redirect("/posts");
})

app.get("/compose", (req,res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`The Server is running on ${port}`);
});