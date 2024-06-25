const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const ResumeRoutes = require("./routes/ResumeRoutes");

app.use("/resumes", ResumeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
