import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token) return res.status(401).json({ message: "Not Authenticated!" });

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ message: "Forbidden" });
		req.user = decoded.UserInfo.username;
		req.roles = decoded.UserInfo.roles;
		next();
	});
};

export default verifyJWT;
