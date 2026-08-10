import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        console.log("========== AUTH DEBUG ==========");
        console.log("Cookies:", req.cookies);

        const token = req.cookies.token;

        if (!token) {
            console.log("NO TOKEN FOUND");

            return res.status(401).json({
                message: "user not authenticated",
                success: false,
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        console.log("Decoded JWT:", decode);
        console.log("User ID from token:", decode.userId);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        req.id = decode.userId;

        console.log("req.id set to:", req.id);
        console.log("================================");

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error);

        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
};

export default isAuthenticated;