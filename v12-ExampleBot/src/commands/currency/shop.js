const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    let result = await cs.getShopItems({
        guild: message.guild
    });
    let inv = result.inventory;
    const embed = new Discord.MessageEmbed()
        .setDescription('Shop!')
    for (let key in inv) {
        embed.addField(`${parseInt(key) + 1} - Price: $${inv[key].price} - **${inv[key].name}:**`, inv[key].description)
    }
    message.channel.send(embed)



}

exports.help = {
    name: "shop",
    description: "A way to see shop",
    example: "shop",
    usage: "shop"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}