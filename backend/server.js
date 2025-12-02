const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/connectDB')
//config dotenv file
dotenv.config();

//databse call
connectDB();

// rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req,res) => {
    res.send("<h1>Hello from server</h1>")
});

app.use('/api/users', require('./routes/userRoutes'))

const PORT = process.env.PORT || 8000;

//listen server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


