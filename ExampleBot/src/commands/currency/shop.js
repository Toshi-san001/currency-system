const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    const embed = new Discord.MessageEmbed()
        .setTitle('**🛒 Shop**')
        .setDescription(`<a:lines:817793005045022741> to buy use \`?buy [put here the number from the shop to buy]\`\n`)
        .addField(`\`1\`Larger Bank - 3,500 <:XCoins:819916372439597068>`, 'It expends your bank space by +3,000')
        .addField(`\`2\`Bank Note - 8,000 <:XCoins:819916372439597068>`, 'It expends your bank space by +5,000 - 10,000')
        .addField(`\`3\`Mysterious Box - 5,000 <:XCoins:819916372439597068>`, 'It will give you randomly 1,000 coins to 7,000 coins')
        .addField(`\`4\`Hunting Rifle - 15,000 <:XCoins:819916372439597068>`, 'Once you buy this rifle you will be able to hunt animals and get money')
        .addField(`\`5\`Fishing Pole - 10,000 <:XCoins:819916372439597068>`, 'Once you buy this fishing pole you will be able to fish and to get money from them')
        .setColor("BLUE")
    message.channel.send(embed);

}

exports.help = {
    name: "shop",
    description: "A way to shop",
    example: "shop",
    usage: "shop"
};

exports.conf = {
    aliases: ['s'],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}