const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
const Discord = require("discord.js");
exports.run = async (client, message, args) => {
    // Slots code Start here:
    /* SPIN ANIMATION*/
    const slotemoji = ":money_mouth:"; // You can even use animated emojis!
    /* ITEMS (SLOTS) */
    let items = ['💵', '💍', '💯'];
    /* RANDOM */
    let $ = items[Math.floor(items.length * Math.random())];
    let $$ = items[Math.floor(items.length * Math.random())];
    let $$$ = items[Math.floor(items.length * Math.random())];
    /* EMBEDS */

    const play = new Discord.MessageEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + slotemoji + "  " + slotemoji + "  " + slotemoji + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")

    const $1 = new Discord.MessageEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + $ + "  " + slotemoji + "  " + slotemoji + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")

    const $2 = new Discord.MessageEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + $ + "  " + $$ + "  " + slotemoji + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")


    const $3 = new Discord.MessageEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + $ + "  " + $$ + "  " + $$$ + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")

    /* SPIN THE SLOTS */

    spinner = await message.channel.send(play)
    setTimeout(() => {
        spinner.edit($1);
    }, 600);
    setTimeout(() => {
        spinner.edit($2);
    }, 1200);
    setTimeout(() => {
        spinner.edit($3);
    }, 1800);

    /* DEDUCT RESULTS */
    if ($$ !== $ && $$ !== $$$) {
        setTimeout(async () => {
            const money = 5000;
            let result = await cs.removeMoney({
                user: message.author,
                guild: message.guild, // { id: null }
                amount: money,
            });
            message.channel.send(`Shit, ${message.author.tag} you lost $${money}! You now have $${result.rawData.wallet} in your wallet!`);
        }, 3000);

    } else if ($ === $$ && $ === $$$) {
        setTimeout(async () => {
            const money = 10000;
            let result = await cs.addMoney({
                user: message.author,
                guild: message.guild, // { id: null }
                amount: money,
            });
            message.channel.send(`Congrats, ${message.author.tag} you won $${money}! You now have $${result.rawData.wallet} in your wallet!`);
        }, 3000);

    } else {
        message.channel.send("2 slots are equal... You were close but you lost! You won nothing!")
    }
    // SLots code ends here: //
    // Code by: https://github.com/ZariZaryab/SlotsMachine-DiscordJS
}


exports.help = {
    name: "slot",
    description: "SLOTS Game",
    example: "slot",
    usage: "slot"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}