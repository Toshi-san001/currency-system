const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let user = message.author
    let thing = args[0]
    if (!thing) return message.channel.send('err')
    if (isNaN(thing)) return message.channel.send('err')
    if (thing > 5) message.channel.send('**This item isn\'t on the shop!**')
    cs.buy(message, {
        user: message.author,
        guild: message.guild,
        item: '1'
    }).then(console.log)
   


}

exports.help = {
    name: "buy",
    description: "A way to buy",
    example: "buy",
    usage: "buy"
};

exports.conf = {
    aliases: ['b'],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}