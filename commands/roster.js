const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const oracledb = require('oracledb');
const { pw } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roster')
		.setDescription('See you current pokemon roster'),
	async execute(interaction, client) {
		let connection;
		let userID = interaction.member.id;
		try {
			connection = await oracledb.getConnection( {
				user          : "christianmosey",
				password      : pw,
				connectString : "//oracle.cise.ufl.edu/orcl"
			});

			const result = await connection.execute(
				`SELECT * FROM pokemon
				WHERE userID = ${userID}`
			);
			console.log(result);
			if (result.rows.length == 0){
				await interaction.reply('You have no pokemon in your party!');
			}
			else{
				let embed = [];
				for(let i = 0; i < result.rows.length; i++){
					let rosterPos = result.rows[i][16];
					if (rosterPos != -1) {
						let pkID = result.rows[i][2];

						const result2 = await connection.execute(
							`SELECT sprite from POKEDEX 
							WHERE pokedexnum = ${pkID}
							`
						)
						console.log(result2);
						let pkName = result.rows[i][1];
						let pkLevel = result.rows[i][4];
						let maxHP = result.rows[i][9];
						let currHP = result.rows[i][17];
						let pkExp = result.rows[i][15];
						let spriteURL = result2.rows[0][0];
						let exp2Next = Math.pow(pkLevel + 1,3) - pkExp;
						embed[rosterPos] = new EmbedBuilder()
							.setColor(0x0099FF)
							.setTitle(pkName)
							.setDescription(`
							Level: ${pkLevel}
							HP: ${currHP}/${maxHP}
							EXP to Next: ${exp2Next}
							`)
							.setThumbnail(spriteURL);
					}
				}
				await interaction.reply({embeds: embed});
			}

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
	},
};