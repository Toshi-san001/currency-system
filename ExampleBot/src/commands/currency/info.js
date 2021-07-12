const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    let result = await cs.info(message.author.id, message.guild.id);
    const embed = new Discord.MessageEmbed()
        .setDescription('Info about ' + message.author.tag)
    let used = '';;
    let notUsed = '';;
    const prefix = '?'
    if (result.info.lastHourly) used += `${prefix}lastHourly\n`;
    else notUsed += `${prefix}lastHourly\n`;
    if (result.info.lastHafly) used += `${prefix}lastHafly\n`;
    else notUsed += `${prefix}lastHafly\n`;
    if (result.info.lastDaily) used += `${prefix}lastDaily\n`;
    else notUsed += `${prefix}lastDaily\n`;
    if (result.info.lastWeekly) used += `${prefix}lastWeekly\n`;
    else notUsed += `${prefix}lastWeekly\n`;
    if (result.info.lastMonthly) used += `${prefix}lastMonthly\n`;
    else notUsed += `${prefix}lastMonthly\n`;
    if (result.info.lastBegged) used += `${prefix}lastBegged\n`;
    else notUsed += `${prefix}lastBegged\n`;
    if (result.info.lastQuaterly) used += `${prefix}lastQuaterly\n`;
    else notUsed += `${prefix}lastQuaterly\n`;

    embed.addField('Commands That you can used:', notUsed)
    embed.addField('Commands That you can\'t use:', used)
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