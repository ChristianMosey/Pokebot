const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../queue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song'),
	async execute(interaction, client) {
		let queue = getQueue();
		if (!interaction.member.voice.channel){
			await interaction.reply({ content: "Must be in a a voice channel",ephemeral: true});
			return;
		}
		if (!getQueue() || !queue.playing){
			await interaction.reply("There is no music playing");
		}
		queue.skip();
		await interaction.reply("Skipped");
	},
};