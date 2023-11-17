const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (data)
{
    return _createToken(data);
}

function _createToken(data){
    let ret = {};
    try {
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'});
      ret = {accessToken: accessToken};
    }
    catch(e){
      ret = {error: e.message};
    }
    return ret;
}

exports.isExpired = function(token){
   let isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, 
     (err, verifiedJwt) => {
        if(err)
            return true;
        else
            return false;
   });
   return isError;
}

exports.refresh = function(token){
  let ud = jwt.decode(token, {complete: true});
  return _createToken(ud);
}