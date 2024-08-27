const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./helpers/dbConnect");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(
    cors({
        origin: "https://sift-tool.com",
        credentials: true, //allow cookies
    })
);
app.use(express.json());
app.use(cookieParser());

dbConnect();

const ResumeRoutes = require("./routes/ResumeRoutes");
const SessionRoutes = require("./routes/SessionRoutes");

app.use("/resumes", ResumeRoutes);
app.use("/sessions", SessionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
