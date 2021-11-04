const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    cs.setItems({
        guild: message.guild,
        shop: [{
            name: 'Watch',
            price: 20
        }, {
            name: 'Rolex',
            price: 1230
        }]
    }).then(console.log)



}

exports.help = {
    name: "setitems",
    description: "A way to setItems",
    example: "setItems",
    usage: "setItems"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}