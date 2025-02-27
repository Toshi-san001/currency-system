const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
exports.run = async (client, interaction, args) => {
    //const channel = interaction.options.getChannel('channel');
    // const query = interaction.options.getString('suggestion');
    // console.log(args)
    const channel = args[0].channel;
    const query = args[1].value;
    const embed = new MessageEmbed()
        .setTitle('Suggestion')
        .setDescription(query)
        .setColor('RANDOM')
        .setTimestamp();

    await channel.send({
        embeds: [embed]
    });
    interaction.reply({
        content: 'Suggestion sent!',
        ephemeral: true
    });
}

exports.help = {
    name: "suggest",
    data: {
        name: 'suggest',
        description: "suggest stuff here",
        options: [{
            name: 'channel',
            type: 'CHANNEL',
            description: 'Channel you want to send suggestion in',
            required: true,
        }, {
            name: 'suggestion',
            type: 'STRING',
            description: 'Suggestion itself',
            required: true,
        }]
    }
}