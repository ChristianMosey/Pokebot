const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../queue');
const oracledb = require('oracledb');
const { pw } = require('../config.json');;
oracledb.autoCommit = true;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pkregister')
		.setDescription('register for pokemon'),
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
				`SELECT userID FROM PKUSERS
				WHERE userID = ${userID}`
			);
			console.log(result);
			if (result.rows.length == 0){
				console.log("ran");
				let result2 = await connection.execute(
					`INSERT INTO pkusers
					(userID, gymbadges)
					VALUES
					(${userID},0)`
				)
				console.log(result2);
				await interaction.reply('Registered With Pokebot');
			}
			else{
				await interaction.reply('User already registered');
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