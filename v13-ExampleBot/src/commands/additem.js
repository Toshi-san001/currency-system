const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    if (message.options.getInteger('price') < 1) return message.channel.send("You can't add an item for less than 1$!");
    let result = await cs.addItem({
        guild: message.guild,
        inventory: {
            name: message.options.getString('name'),
            price: message.options.getInteger('price'),
            description: message.options.getString('description')
        }
    });
    if (result.error) {
        if (result.type == 'No-Inventory-Name') return message.channel.send('There was a error, Please enter item name to removadd.!')
        if (result.type == 'Invalid-Inventory-Price') return message.channel.send('There was a error, invalid price!')
        if (result.type == 'No-Inventory-Price') return message.channel.send('There was a error, You didnt specify price!')
        if (result.type == 'No-Inventory') return message.channel.send('There was a error, No data recieved!')
    } else return message.channel.send('Done! Successfully added `' + message.options.getString('name') + '` to the shop!')



}

exports.help = {
    name: "additem",
    data: {
        name: 'additem',
        description: "A way to additem to shop",
        options: [{
                name: 'name',
                type: 'STRING',
                description: 'Name of Item.',
                required: true,
            }, {
                name: 'price',
                type: 'INTEGER',
                description: 'Price of item',
                required: true,
            },

            {
                name: 'description',
                type: 'STRING',
                description: 'Description of the item. (Can\'t be Changed later.)',
                required: false,
            }
        ]
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}