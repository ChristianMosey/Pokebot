const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../queue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pauses the current song'),
	async execute(interaction, client) {
		let queue = getQueue();
		if (!interaction.member.voice.channel){
			await interaction.reply({ content: "Must be in a a voice channel",ephemeral: true});
			return;
		}
		if (!getQueue() || !queue.playing){
			await interaction.reply("There is no music playing");
		}
		if (queue.paused){
			await interaction.reply(`The song is already paused use **/unpause**`);
		}
		queue.setPaused(true);
		await interaction.reply("Paused");
	},
};