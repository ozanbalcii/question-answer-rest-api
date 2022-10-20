const mongoose = require('mongoose'); 


const connectDatabase = () => {  
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,  })     
    .then( () => {     
        console.log("mongodb connection successful");    
    })
    .catch(err=>{   
        console.log(err);
    });
};
module.exports = connectDatabase; 