
import dotenv from "dotenv";

dotenv.config();

const { default: connectDB } = await import("./utils/db.js");
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
