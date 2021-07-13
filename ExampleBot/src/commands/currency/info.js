const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    // Command Start's here
    let result = await cs.info(message.author.id, message.guild.id);
    const embed = new Discord.MessageEmbed()
        .setDescription('Info about ' + message.author.tag);
        let unUsed = '';
        let cantBeUsed = '';
        for (const [key, value] of result.info) {
            if (value.used) unUsed += `- ${key}\n`;
            else cantBeUsed += `- ${key} ( ${value.timeLeft} )\n`;
        }
        embed.addField('Commands That you can use:', unUsed || 'None');
        embed.addField('Commands That you can\'t use:', cantBeUsed || 'None');
    message.channel.send(embed)
    // Commands Stop's here.
}

exports.help = {
    name: "info",
    description: "A way to info to shop",
    example: "info",
    usage: "info"
};

exports.conf = {
    aliases: ['i'],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}