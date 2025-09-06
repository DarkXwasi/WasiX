module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐖𝐀𝐒𝐈𝐌 𝐀𝐁𝐁𝐀𝐒𝐒𝐈",
  description: "Bot will reply when admin or bot is tagged",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = async function({ api, event }) {
  const adminID = "100091680625364"; // Aapka real UID
  const senderID = event.senderID;

  // Ignore messages sent by admin itself
  if (senderID === adminID) return;

  // Check if admin is mentioned
  if (event.mentions && Object.keys(event.mentions).includes(adminID)) {
    const replies = [
      "Wo Busy H, mujhe Bolo Kya Bolna H?",
      "Kya Hua Boss ko q Bula Rhe Ho?",
      "Wo Shayad Busy hoga",
      "Wasi Toh Chala gaya"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(randomReply, event.threadID, event.messageID);
  }
};

module.exports.run = async function({ api, event }) {
  // Ye command manually trigger hone par kuch reply nahi karegi
};