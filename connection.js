const { joinVoiceChannel } = require('@discordjs/voice');
let currentConnection;

function get(){
	return currentConnection;
}

function connectTo(channel) {
	currentConnection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
}

module.exports = { get, connectTo };
