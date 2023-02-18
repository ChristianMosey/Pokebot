const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../queue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnects bot form Voice Channel'),
	async execute(interaction, client) {
		let connection = getQueue();
		if(typeof connection !== 'undefined') {
			await connection.destroy();
			await interaction.reply('Bot Disconnected');
		}
		else{
			await interaction.reply('No current connections');
		}
	},
};