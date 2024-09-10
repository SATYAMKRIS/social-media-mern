import {expressjwt} from "express-jwt" // to verify token
import Post from "../models/posts";
const expressJwt = require('express-jwt');
const secret = 'c2d84992c96f61806d1dfaf4591546dd0c03688a682c961e04537f247d7ff60eb2baae189c41f67228922ed3e7e4be73199a342587808601a5fc8b087ff12f8'; // Replace this with your actual secret
app.use(expressJwt({ secret: secret, algorithms: ['HS256'] }).unless({ path: ['/api/auth/login'] }));
module.exports = {
  jwtMiddleware: expressJwt({ secret: secret, algorithms: ['HS256'] }).unless({ path: ['/api/auth/login'] })
};


// this verify token if not verify it throw error other wise we are able to access the user id
export const requireSignIn = expressjwt({ 
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

// this verify whether the user is authorised to update/delete the post
export const canEditDeletePost = async (req,res, next) =>{
    try {
        const post = await Post.findById(req.params._id);
        // console.log("POST IN UPDATE DELETE MIDDLEWARE =>", post);
        // console.log("post.postedBy =>", post.postedBy);
        // console.log("req.auth._id",req.auth._id);
        
        if(req.auth._id != post.postedBy){
            return res.status(400).send("Unauthorised");
        }
        else{
            next();
        }
    } catch (error) {
        console.log("error while authorise canDeletePost",error);
    }
}