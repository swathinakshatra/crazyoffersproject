const login=require('../models/login');
function generateUniqueId(callback) {
  let id = Math.floor(Math.random() * 1000000); 
  login.ID.findOne({ id: id }, function(err, result) {
    if (result) {
    
      return generateUniqueId(callback);
    } else {
      
      return id;
    }
  });
}
module.exports=generateUniqueId;