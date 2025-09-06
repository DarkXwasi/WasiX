module.exports = {
  name: "help",
  description: "Lists all commands",
  execute: async (event, api, commands) => {
    const commandList = commands.map(cmd => `• ${cmd.name}: ${cmd.description}`).join("\n");
    
    try {
      await api.sendMessage(`Here are all my commands:\n${commandList}`, event.threadID);
    } catch (err) {
      console.error("Error sending help:", err);
    }
  },
};