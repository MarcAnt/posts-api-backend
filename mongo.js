const mongoose = require('mongoose');
const connectingString = process.env.MONGO_DB_URI;


// Configurando la conexion

mongoose.connect(connectingString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, 
    useCreateIndex: true
}).then(()=> {console.log('Database connected')}).catch(err => console.log(err))


process.on('uncaughtException', ()=> {
    mongoose.connection.disconnect();
});