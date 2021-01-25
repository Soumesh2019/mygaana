const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/upload");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", methods: ["POST"] }));

app.use(userRoutes);
app.use(uploadRoutes);

app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));
