const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const oracledb = require('oracledb');
const { pw } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription('nickname a pokemon in your party')
		.addStringOption(option =>
			option.setName('rosterpos')
				.setDescription('which position in the roster')
				.setRequired(true)
				.addChoices(
				{name: "1", value: "0" },
					{name: "2", value: "1"},
					{name: "3", value: "2"},
					{name: "4", value: "3"},
					{name: "5", value: "4"},
					{name: "6", value: "5"},
				))
		.addStringOption(option2 =>
			option2.setName('nickname')
				.setDescription("nickname")
				.setRequired(true),
		),
	async execute(interaction, client) {
		let connection;
		let userID = interaction.member.id;
		try {
			connection = await oracledb.getConnection( {
				user          : "christianmosey",
				password      : pw,
				connectString : "//oracle.cise.ufl.edu/orcl"
			});
			let nickname = interaction.options.getString("nickname");
			let rosterNum = interaction.options.getString("rosterpos");
			await connection.execute(
				`UPDATE
					pokemon
				SET
					name = '${nickname}'
				WHERE
					userID = ${userID} AND rosternum = ${rosterNum}`
			);
			await interaction.reply('Name Changed!');

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