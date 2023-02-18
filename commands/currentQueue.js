const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../queue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Returns Current Queue'),
	async execute(interaction, client) {
		let connection = getQueue();
		let returnStr = "";
		let tracks = getQueue().tracks;
		if (tracks.length === 0){
			interaction.reply({content: "No songs in queue", ephemeral: true});
			return;
		}
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`Music Queue`)
			.setDescription("Current songs in queue")
			.setThumbnail(tracks[0].thumbnail)
		for (let i = 0; i < tracks.length; i++) {
			exampleEmbed.addFields({
				name: tracks[i].title + " by " + tracks[i].author,
				value: "Requested by " + tracks[i].requestedBy.username
			});
		}
		interaction.reply({ embeds: [exampleEmbed] });
	}
}