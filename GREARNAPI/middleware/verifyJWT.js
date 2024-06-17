import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token) return res.status(401).json({ message: "Not Authenticated!" });

	jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(201).json({ message: "Forbidden" });
		req.user = decoded.email;
		req.roles = decoded.roles;
		next();
	});
};

export default verifyJWT;
