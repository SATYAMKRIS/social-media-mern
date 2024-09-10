import expressJwt from 'express-jwt';
import express  from "express";
import mongoose from "mongoose";
import cors from 'cors'; // backend and password are run on the different port then to avoid cors error
import {readdirSync} from 'fs';
import dotenv from 'dotenv';



dotenv.config();




const app = express();

const secret = process.env.JWT_SECRET;



//Database
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("database connected"))
.catch((err) => console.log("DB connection error =>",err));

// middlewares
app.use(expressJwt({ secret: secret, algorithms: ['HS256'] }).unless({ path: ['/api/auth/login'] }));
app.use(express.json({ limit: "5mb" }));// it will help to recive the data from client side to server in json format
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: ["http://localhost:3000"],
}));

// autoload Routes
readdirSync('./routes').map((r) => app.use('/api',require(`./routes/${r}`)));

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      console.log(err); // log the error object
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  });

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
//Listen
const port = process.env.PORT || 8000;
app.listen(port, console.log(`Server is running at port ${port}`));