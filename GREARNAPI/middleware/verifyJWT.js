import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  let token;

  /**
   * Extract token from Authorization header or cookie
   */
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);
  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.email;
    req.roles = decoded.roles;
    next();
  });
};

export default verifyJWT;
