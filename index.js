
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { token, pw } = require('./config.json');
const { Player } = require("discord-player")
const oracledb = require('oracledb');
const { VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 <<25
	}
});
client.player.on('connectionCreate', (queue) => {
	queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
		const oldNetworking = Reflect.get(oldState, 'networking');
		const newNetworking = Reflect.get(newState, 'networking');

		const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
			const newUdp = Reflect.get(newNetworkState, 'udp');
			clearInterval(newUdp?.keepAliveInterval);
		}

		oldNetworking?.off('stateChange', networkStateChangeHandler);
		newNetworking?.on('stateChange', networkStateChangeHandler);
	});
});
let trackNum = 1;
client.player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing Track #${trackNum} **${track.title}**!`,trackNum++))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, async () => {
	console.log('Ready!');
	/*let guild = await client.guilds.fetch("811500345615319061");
	let member = await guild.members.fetch("414230554628587523");
	await member.setNickname("GM Christian");
	let roles = await guild.roles.fetch();
	for (let i = 0; i < roles.size; i++) {
		console.log(roles.at(i).name);
		console.log(roles.at(i).id);
	}
	let userRoles = await member.roles;

	let role = await guild.roles.fetch("988901431731974176");
	await role.setPermissions(['ChangeNickname','KickMembers','Administrator','ManageChannels','ManageGuild','AddReactions','ViewAuditLog','Stream','ViewChannel','SendMessages','Connect','Speak','MuteMembers','DeafenMembers','MoveMembers','UseEmbeddedActivities','ModerateMembers','SendMessagesInThreads','ReadMessageHistory','AttachFiles','EmbedLinks']);
	await console.log(role.permissions.toArray());
	await role.setName('Chritin');
	await role.setHoist(true);*/
	let connection;
	oracledb.initOracleClient({libDir:"C:\\Users\\christian\\Documents\\instantclient_21_9"});

	try {
		connection = await oracledb.getConnection( {
			user          : "christianmosey",
			password      : pw,
			connectString : "//oracle.cise.ufl.edu/orcl"
		});

		const result = await connection.execute(
			`SELECT * FROM pokedex`
		);
		console.log(result);

	} catch (err) {
		console.error(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (err) {
				console.error(err);
			}
		}
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
