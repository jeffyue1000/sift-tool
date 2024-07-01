const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const ResumeRoutes = require("./routes/ResumeRoutes");
const SessionRoutes = require("./routes/SessionRoutes");

app.use("/resumes", ResumeRoutes);
app.use("/sessions", SessionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
