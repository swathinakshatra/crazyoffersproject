const mongoose = require('mongoose');

module.exports=function(){
    const db = 'mongodb+srv://swathi:swathijune1993@cluster0.soimuvi.mongodb.net/CRAZYOFFERS?retryWrites=true&w=majority'
mongoose.set('strictQuery', true)
mongoose
    .connect(db, { 
        useNewUrlParser: true,
        
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
}