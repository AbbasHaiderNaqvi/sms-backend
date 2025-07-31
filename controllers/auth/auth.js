import jwt from "jsonwebtoken"

const generateAccessToken = (user)=>{
    const Token = jwt.sign({username: user.username}, "abcd", {expiresIn:"15min"})
    return Token;
};

const generateRefreshToken = (user) =>{
    const Token = jwt.sign({username: user.username}, "cdef", {expiresIn:"7d"})
    return Token
}

export {
    generateAccessToken,generateRefreshToken
}