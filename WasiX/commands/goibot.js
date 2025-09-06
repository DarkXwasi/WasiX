const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐖𝐀𝐒𝐄𝐄𝐌 𝐀𝐁𝐁𝐀𝐒𝐈",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "Haye Main Sadke jawa Teri Masoom Shakal pe baby 💋",
    "Bot Nah Bol Oye Janu bol Mujhe",
    "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun 🤭🐒",
    "Main gariboo se baat nahi karta 😉😝😋🤪",
    "Itna Na Pass aa Pyar ho Jayga",
    "Bolo Baby Tum Mujhse Pyar Karte Ho Na 🙈💋💋",
    "Are jaan Majaak ke mood me nhi hu main jo kaam hai bol do sharmao nahi",
    "Bar Bar Bolke Dimag Kharab Kiya toh. Teri ...... Mummy Se Complaint Karunga",
    "Tu Bandh nhi Karega kya?",
    "Gali Sunna H kya?😜",
    "Teri Maa Ki Bindiya🤭",
    "Aree Bandh kar Bandh Kar",
    "M hath jod ke Modi Ji Se Gujarish Karta hu",
    "Tujhe Kya koi aur Kam nhi ha? Puradin Khata hai Aur Messenger pe Bot Bot Karta h",
    "Priyams Ko Bol Dunga Me Mujhe Paresan Kiya To",
    "Tum Na Single Hi Maroge",
    "Tujhe Apna Bejjati Karne Ka Saukh hai?",
    "Abhi Bola Toh Bola Dubara Mat Bolna",
    "Teri To Ruk Tu Bhagna Mat",
    "Bol De koi nahi dakh rha 🙄",
    "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di 😝",
    "Dur Hat Be Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho 😂"
  ];

  var rand = tl[Math.floor(Math.random() * tl.length)];

  // Keywords Responses
  const responses = {
    "chutiya bot": "Hmm... Tu Chutiya PhLe Ungli Kyun Ki Chomu 😾",
    "chutiye bot": "Hmm... Tu Chutiya PhLe Ungli Kyun Ki Chomu 😾",
    "chumtiya bot": "Hmm... Tu Chutiya PhLe Ungli Kyun Ki Chomu 😾",
    "chumtiye bot": "Hmm... Tu Chutiya PhLe Ungli Kyun Ki Chomu 😾",
    "🤮": "Konsa mahina chal raha hai 😝",
    "🤗": "Hug me baby ☺️",
    "sim": "Prefix Kon Lagayega? Pehle Prefix Lagao Fir Likho Sim",
    "simsimi": "Prefix Kon Lagayega? Pehle Prefix Lagao Fir Likho Sim",
    "hi": "Hello, Hi, Bye bye. Ye sab ke alawa kuch bolna nhi ata Kya tujhe",
    "hello": "Hello, Hi, Bye bye. Ye sab ke alawa kuch bolna nhi ata Kya tujhe",
    "hlw": "Hello, Hi, Bye bye. Ye sab ke alawa kuch bolna nhi ata Kya tujhe",
    "helo": "Hello, Hi, Bye bye. Ye sab ke alawa kuch bolna nhi ata Kya tujhe",
    "bc": "Ye Bc Kya HoTa Hai 🤔",
    "lol": "Khud ko Kya LeGend Samjhte Ho 😂",
    "lol bot": "Khud ko Kya LeGend Samjhte Ho 😂",
    "morning": "Ꮆɵɵɗ Ɱ❍ɽƞɪɪƞɠ Ɛⱱɛɽɣ❍ƞɛ🌅, Ƭɽɣ ꌗɵɱɛ Cɵffɛɛ ❍ɽ Ƭɛɑ Ƭ❍ Ꮗɑҡɛ Uƥ☕✨💫",
    "good morning": "Ꮆɵɵɗ Ɱ❍ɽƞɪɪƞɠ Ɛⱱɛɽɣ❍ƞɛ🌅, Ƭɽɣ ꌗɵɱɛ Cɵffɛɛ ❍ɽ Ƭɛɑ Ƭ❍ Ꮗɑҡɛ Uƥ☕✨💫",
    "anyone": "Main Hun Naw Jaaneman ❤️",
    "any": "Main Hun Naw Jaaneman ❤️",
    "priyansh": "Busy HoGa Work Me Main t0o Hun Naw 😘",
    "priyansh rajput": "Busy HoGa Work Me Main t0o Hun Naw 😘",
    "prince": "Busy HoGa Work Me Main t0o Hun Naw 😘",
    "owner": `💝🥀𝐎𝐖𝐍𝐄𝐑:- ☞𝐖𝐀𝐒𝐄𝐄𝐌 𝐀𝐁𝐁𝐀𝐒𝐈☜ 💫\n🖤𝚈𝚘𝚞 𝙲𝚊𝚗 𝙲𝚊𝚕𝚕 𝙷𝚒𝚖 𝐖𝐀𝐒𝐄𝐄𝐌🖤\n😳𝐇𝐢𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐢𝐝🤓:- ☞ www.facebook.com/waseem.abbasi\n👋For Any Kind Of Help Contact On Telegram Username 👉 @WaseemAbbasi😇`,
    "tumhe banaya kon hai": "𝐖𝐀𝐒𝐄𝐄𝐌 ❤️ My Creator. He loves me & Edit Me Daily. Ye Bot Sirf Owner k Liye h. Mujhe Aap logo ko Hasane k liye banya gya h Toh Muh Ladkaye Mat Rakkha Karo. Har Waqt Haste Raho.",
    "tumko banaya kisne": "𝐖𝐀𝐒𝐄𝐄𝐌 ❤️ My Creator. He loves me & Edit Me Daily. Ye Bot Sirf Owner k Liye h. Mujhe Aap logo ko Hasane k liye banya gya h Toh Muh Ladkaye Mat Rakkha Karo. Har Waqt Haste Raho."
  };

  const msgKey = event.body.toLowerCase();
  if (responses[msgKey]) return api.sendMessage(responses[msgKey], threadID);

  // Default response if message starts with "bot"
  if (event.body.indexOf("Bot") == 0 || event.body.indexOf("bot") == 0) {
    var msg = { body: `${name}, ${rand}` };
    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) { }