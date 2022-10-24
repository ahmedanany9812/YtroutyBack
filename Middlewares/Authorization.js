const asyncHandler = require("express-async-handler");
const { verify } = require("jsonwebtoken");

const verifyAccess = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies["Access-token"];
  if (!cookie) {
    return res.status(400).json({
      msg: "NO Cookies provided",
    });
  }
  try {
    const Useraccess = verify(cookie, process.env.ACCESS_TOKEN);
    if (!Useraccess) {
      return res.status(401).json({
        msg: "User Not authenticated",
      });
    }
    req.user = Useraccess;
    next();
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
});

module.exports = verifyAccess;
