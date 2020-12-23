const  Discord = require("discord.js");
const client = new Discord.Client();
const {
    CommandHandler,
    loadCommands
} = require("@silent-coder/discord-cmd-handler");
const {
    connect
} = require("currency-system");


client.login("PUT TOKEN HERE");

connect("PUT MONGO URL HERE")

let settings = {
    logs: {
        consoleLogEnabled: true,//wether to log if someone ran a command in console.
        consoleLogMessage: "",//what to log when someone ran a command. Leave empty to use default one.
        cmdLogEnabled: false,//wether to send a  message  if someone ran command or no to discord.
        cmdLogChannel: "ChannelID HERE",//channel id
        cmdLogMessage: ""//message to send if someone ran a command to discord. leave empty to use default.
    },
    mentionPrefix: true,// this will make so you can <@Your BOt> <CommandName>
    prefix: "?",//prefix
    owners: ["YOUR DISCORD ID", "YOUR TRUSTED FRIEND Discord ID"],//Owner ID to show hidden catogaries
    path: __dirname + "/commands",// path to commands folder
    logCommands: true //This'll Log the commands it loaded.
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag} Successfully..!!`)
    loadCommands(client, settings)
    //This will load all commands.
});

client.on("message", (message) => {
    CommandHandler(client, message, settings);
    //This'll run commands.
});