const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    let result = await cs.info(message.author.id, message.guild.id);
    const embed = new Discord.MessageEmbed()
        .setDescription('Info about ' + message.author.tag)
    let unUsed = '';;
    let cantBeUsed = '';;
    const prefix = '?'
    if (result.info.lastHourly.used) unUsed += `${prefix}hourly\n`;
    else cantBeUsed += `${prefix}hourly ( ${result.info.lastHourly.timeLeft} )\n`;
    if (result.info.lastHafly.used) unUsed += `${prefix}hafly\n`;
    else cantBeUsed += `${prefix}hafly ( ${result.info.lastHafly.timeLeft} )\n`;
    if (result.info.lastDaily.used) unUsed += `${prefix}daily\n`;
    else cantBeUsed += `${prefix}daily ( ${result.info.lastDaily.timeLeft} )\n`;
    if (result.info.lastWeekly.used) unUsed += `${prefix}weekly\n`;
    else cantBeUsed += `${prefix}weekly ( ${result.info.lastWeekly.timeLeft} )\n`;
    if (result.info.lastMonthly.used) unUsed += `${prefix}monthly\n`;
    else cantBeUsed += `${prefix}monthly ( ${result.info.lastMonthly.timeLeft} )\n`;
    if (result.info.lastBegged.used) unUsed += `${prefix}begged\n`;
    else cantBeUsed += `${prefix}beg ( ${result.info.lastBegged.timeLeft} )\n`;
    if (result.info.lastQuaterly.used) unUsed += `${prefix}quaterly\n`;
    else cantBeUsed += `${prefix}quaterly ( ${result.info.lastQuaterly.timeLeft} )\n`;

    embed.addField('Commands That you can use:', unUsed || 'None')
    embed.addField('Commands That you can\'t use:', cantBeUsed || 'None')
    message.channel.send(embed)
}

exports.help = {
    name: "info",
    description: "A way to info to shop",
    example: "info",
    usage: "info"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}