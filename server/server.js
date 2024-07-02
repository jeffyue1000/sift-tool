const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const dbConnect = require("./helpers/dbConnect");

const app = express();
app.use(cors());
app.use(express.json());
dbConnect(); //connect to MongoDB

const ResumeRoutes = require("./routes/ResumeRoutes");
const SessionRoutes = require("./routes/SessionRoutes");

app.use("/resumes", ResumeRoutes);
app.use("/sessions", SessionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
