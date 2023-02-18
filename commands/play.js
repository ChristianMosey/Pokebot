const { SlashCommandBuilder, opus, Embed } = require('discord.js');
const { QueryType, Player } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { getQueue, createQueue, addSong } = require('../queue')
const { get } = require('../connection');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a song')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('song to play')
				.setRequired(true))
		,
	async execute(interaction, client) {
		//const queue = await client.player.createQueue(interaction.guild);
		let play = false;
		if (!interaction.member.voice.channel){
			await interaction.reply({ content: "Must be in a a voice channel",ephemeral: true});
			return;
		}
		if (!getQueue()) {
			console.log('ran');
			play = true;
			await createQueue(interaction, client);
		}
		if(!getQueue()){
			await interaction.reply({ content: "No queue active, join a voice channel",ephemeral: true});
			return;
		}
		let embed = await addSong(interaction, client);
		console.log(getQueue().playing);
		if (!getQueue().playing){
			getQueue().play();
		}
		if (!embed){
			console.log("embed");
			await interaction.reply("No tracks found");
		}
		else if(typeof embed === 'string' || embed instanceof String){
			console.log("string");
			await interaction.reply({content: embed, ephemeral: true});
		}
		else {
			console.log("Embed");
			await interaction.reply({ embeds: [embed] });
		}
		console.log(getQueue());

	},
};