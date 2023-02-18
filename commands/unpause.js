const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../queue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('unpauses the current song'),
	async execute(interaction, client) {
		let queue = getQueue();
		if (!interaction.member.voice.channel){
			await interaction.reply({ content: "Must be in a a voice channel",ephemeral: true});
			return;
		}
		if (!getQueue()){
			await interaction.reply("There is no music in the queue");
			return;
		}
		else if (!queue.playing){
			queue.play();
		}
		queue.setPaused(false);
		await interaction.reply({content: "Unpaused", ephemeral: true});
	},
};