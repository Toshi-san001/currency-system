const c = require('../index').client;
module.exports = async inter => {
    if(inter.isCommand()) {
        console.log(`Interaction Created: ${inter.commandName}`);
        let slashCmds = c.SlashCmds.get(inter.commandName)
        if(slashCmds) return slashCmds.run(c, inter)
        else return inter.reply({ephemeral: true, text: `Command not found: ${inter.commandName}`})
    }
}
