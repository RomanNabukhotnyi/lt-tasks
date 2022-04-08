const jwt=require("jsonwebtoken");
const {accessSecret} = require("./config");
module.exports=function(req, res, next){
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorised"});
    }
    try {
        const decodeData = jwt.verify(token, accessSecret);
        req.user = decodeData;
    } catch (error) {
        return res.status(401).json({message:"The token is not valid"});
    }
    next();
};