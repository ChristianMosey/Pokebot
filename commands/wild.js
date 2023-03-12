const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getQueue } = require('../queue');
const oracledb = require('oracledb');
const { pw } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wild')
		.setDescription('Search for a wild pokemon!'),
	async execute(interaction, client) {
		if (interaction.channelId === "1082384454359711824"){
			let userID = interaction.member.id;
			let connection;
			try {
				connection = await oracledb.getConnection( {
					user          : "christianmosey",
					password      : pw,
					connectString : "//oracle.cise.ufl.edu/orcl"
				});
				let pkRand = getRandomArbitrary(0,2);
				let pkDexNum;
				let lvl;
				if (pkRand === 0){
					pkDexNum = 16;
					lvl = getRandomArbitrary(2,6);
				}
				else if (pkRand === 1){
					pkDexNum = 19;
					lvl = getRandomArbitrary(2,5);
				}

				const result = await connection.execute(
					`SELECT * FROM POKEDEX
					WHERE pokedexnum = ${pkDexNum}`
				);
				console.log(result);

				const row = new ActionRowBuilder()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('select')
							.setPlaceholder('Nothing selected')
							.addOptions(
								{
									label: 'Fight',
									description: 'Fight',
									value: 'Fight',
								},
								{
									label: 'Bag',
									description: 'Access Items and Poke balls',
									value: 'Bag',
								},
								{
									label: 'Pokemon',
									description: 'Change your current Pokemon',
									value: 'Pokemon',
								},
								{
									label: 'Run',
									description: 'Try to run away from the battle',
									value: 'Run',
								}
							),
					);

				await interaction.reply({embeds: [handleSpawn(pkDexNum,lvl,result)], components: [row]})
			} catch (err) {
				console.error(err);
				await interaction.reply("Error occurred");
			} finally {
				if (connection) {
					try {
						await connection.close();
					} catch (err) {
						console.error(err);
					}
				}
			}
		}
	},
};

function handleSpawn(pkDexNum, lvl, result){
	let hp = Math.floor(10 + lvl + (result.rows[0][6] * lvl/50));
	let att = Math.floor(5 + (result.rows[0][7] * lvl/50));
	let def = Math.floor(5 + (result.rows[0][8] * lvl/50));
	let sAtt = Math.floor(5 + (result.rows[0][9] * lvl/50));
	let sDef = Math.floor(5 + (result.rows[0][10] * lvl/50));
	let spd = Math.floor(5 + (result.rows[0][11] * lvl/50));
	let pkName = result.rows[0][0];
	let pkLevel = lvl;
	let maxHP = hp;
	let currHP = hp;
	let pkExp = Math.pow(lvl,3);
	let spriteURL = result.rows[0][2];
	let exp2Next = Math.pow(pkLevel + 1,3) - pkExp;
	let embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`A wild ${pkName} appeared!`)
		.setDescription(`
							Level: ${pkLevel}
							HP: ${currHP}/${maxHP}
							`)
		.setThumbnail(spriteURL);
	return embed;
}

function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}