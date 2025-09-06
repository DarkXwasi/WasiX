const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "owner",
  version: "3.3.0",
  hasPermssion: 0,
  credits: "Waseem Abbasi",
  description: "Show bot owner's info with pic, auto-react & real voice",
  commandCategory: "info",
  usages: "owner",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event.body) return;
  const msg = event.body.toLowerCase();

  const triggers = ["owner", "admin", "creator"];

  if (triggers.includes(msg)) {
    try {
      // Profile Pic URL
      const imgUrl = "https://i.postimg.cc/PrhLcqXf/IMG-20250804-212011.jpg"; 
      const imgPath = __dirname + "/cache/owner.jpg";
      
      // Real Voice MP3 (Apna Owner.mp3 "modules/commands/cache" me rakho)
      const audioPath = __dirname + "/cache/owner.mp3";

      // Download Pic
      if (imgUrl) {
        const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));
      }

      // Auto React ❤️🔥
      api.setMessageReaction("❤️🔥", event.messageID, (err) => {}, true);

      // Fancy Info
      const info = `
╔════════════════════╗
        👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑
╚════════════════════╝

🌟 𝗡𝗮𝗺𝗲 : 𝗪𝗮𝘀𝗲𝗲𝗺 𝗔𝗯𝗯𝗮𝘀𝗶  
⚡ 𝗥𝗼𝗹𝗲 : 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 • 𝗢𝘄𝗻𝗲𝗿  
🌍 𝗙𝗿𝗼𝗺 : 𝗣𝗮𝗸𝗶𝘀𝘁𝗮𝗻  
💻 𝗦𝗽𝗲𝗰𝗶𝗮𝗹 : 𝗕𝗼𝘁 𝗠𝗮𝗱𝗲 𝘄𝗶𝘁𝗵 ❤️ & 🔥  

━━━━━━━━━━━━━━━━━━━
💬 "Code is my power,  
   Creativity is my weapon!" ⚔️
━━━━━━━━━━━━━━━━━━━
`;

      return api.sendMessage(
        {
          body: info,
          attachment: [
            fs.existsSync(imgPath) ? fs.createReadStream(imgPath) : null,
            fs.existsSync(audioPath) ? fs.createReadStream(audioPath) : null
          ].filter(Boolean)
        },
        event.threadID,
        () => { 
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); 
        },
        event.messageID
      );

    } catch (e) {
      console.log(e);
      return api.sendMessage("⚠️ Error: Owner info show nahi ho payi!", event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function(){};