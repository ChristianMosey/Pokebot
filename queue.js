const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
let queue;
let trackNum = 1;
function getQueue(){
	return queue;
}

async function createQueue(interaction, client) {
	if (interaction.member.voice.channel) {
		queue = await client.player.createQueue(interaction.guild, {
			ytdlOptions: {
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			metadata: {
				channel: interaction.channel
			}
		});
	}
}

async function addSong(interaction, client){
	let play = false;
	if(getQueue().destroyed){
		await createQueue(interaction, client);
		play = true;
	}
	let request = interaction.options.getString('song');
	const track = await client.player.search(request, {
		requestedBy: interaction.user,
		searchEngine: QueryType.AUTO,
	}).then(x => x.tracks[0]);
	if (!track) {
		return;
	}
	try {
		if (!queue.connection || queue.connection.channel != interaction.member.voice.channel) {
			queue.playing = false;
			queue.connect(interaction.member.voice.channel);
		}
	} catch (error) {
		console.error(error);
		await queue.destroy();
		return "Join a voice channel";
	}

	await queue.addTrack(track);

	const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`${track.title}`)
		.setURL(track.url)
		.setDescription("Requested By " + track.requestedBy.username)
		.addFields(
			{ name: 'Author', value: track.author }
		)
		.setImage(track.thumbnail)
		.setFooter({ text: "Track Number: " + (trackNum).toString() });

	//await interaction.channel.send({ embeds: [exampleEmbed] });
	trackNum++;
	return (exampleEmbed);
}

module.exports = {getQueue, createQueue, addSong}

