const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getQueue } = require('../queue');
const oracledb = require('oracledb');
const { pw } = require('../config.json');
oracledb.autoCommit = true;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('starter')
		.setDescription('pick a starter')
		.addStringOption(option =>
			option.setName('starter')
				.setDescription('Starters to Pick')
				.setRequired(true)
				.addChoices(
					{name: "Bulbasaur", value: "1" },
					{name: "Charmander", value: "4"},
					{name: "Squirtle", value: "7"},
				)),
	async execute(interaction, client) {
		let connection;
		let userID = interaction.member.id;
		try {
			connection = await oracledb.getConnection( {
				user          : "christianmosey",
				password      : pw,
				connectString : "//oracle.cise.ufl.edu/orcl"
			});

			const result1 = await connection.execute(
				`SELECT userID FROM PKUSERS
				WHERE userID = ${userID}`
			);
			console.log(result1);
			if (result1.rows.length == 0){
				interaction.reply("Please register first using /pkregister");
				return;
			}
			const result = await connection.execute(
				`SELECT * FROM pokemon
				WHERE userID = ${userID}`
			);
			console.log(result);
			if (result.rows.length == 0){
				let pdn = interaction.options.getString("starter");
				console.log(pdn)
				let baseStats = await connection.execute(
					`SELECT * from pokedex
					WHERE pokedexnum = ${pdn}`
				)
				console.log(baseStats.rows[0]);
				let hp = Math.floor(10 + 5 + (baseStats.rows[0][6] * 5/50));
				let att = Math.floor(5 + (baseStats.rows[0][7] * 5/50));
				let def = Math.floor(5 + (baseStats.rows[0][8] * 5/50));
				let sAtt = Math.floor(5 + (baseStats.rows[0][9] * 5/50));
				let sDef = Math.floor(5 + (baseStats.rows[0][10] * 5/50));
				let spd = Math.floor(5 + (baseStats.rows[0][11] * 5/50));
				await connection.execute(
					`INSERT INTO pokemon

					(name,pokedexnum,userID,pklevel,HP,att,def,satt,sdef,spd,exp, rosternum, currhp)
					VALUES
					('${baseStats.rows[0][0]}',${pdn},${userID},5,${hp},${att},${def},${sAtt},${sDef},${spd},125, 0, ${hp})`
				);
				await interaction.reply(baseStats.rows[0][0] + ' is now on your team!');
			}
			else{
				await interaction.reply("You've already selected a starter");
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