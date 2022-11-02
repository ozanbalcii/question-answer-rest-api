const express  = require('express'); 
const dotenv = require('dotenv');
const connectDatabase= require('./helpers/database/connectDatabase'); 
const routers = require('./routers');
const customErrorHandler = require('./middleware/errors/customErrorHandler');
const path = require('path'); 

 dotenv.config({ 
    path : "./config/env/config.env"
 });

connectDatabase();

const app = express();
app.use(express.json());  

const PORT = process.env.PORT; 

app.use(customErrorHandler); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.listen(PORT,() =>{
 
console.log('App Started on ${PORT} : ${process.env.NODE_ENV}'); 
});
