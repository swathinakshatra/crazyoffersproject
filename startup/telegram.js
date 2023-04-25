const axios=require('axios');

sendMessage = async (chatID, messaggio, token) => {
  try {
    var url =
      "https://api.telegram.org/" + token + "/sendMessage?chat_id=" + chatID;
    url = url + "&text=" + encodeURI(messaggio);
    console.log(url);
    const result=await axios(url);
    console.log("reply",result);
  } catch (err) {
    console.log("result", err);
  }

}
module.exports = {
  alert_Developers: async (message) => {
    var token = "bot6010071341:AAEd-N2iQPEvwZChJNTmkhnrz5U_cJnh6lM";
    var array = Array("5472567970");
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      await sendMessage(array[i], message, token);
      console.log(array[i],message,token);
    }
  },
  
}

