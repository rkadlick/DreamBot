import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type APIEmbed,
	type ActionRowBuilder as ActionRowBuilderType,
} from 'discord.js';
import { getTeamAbbreviation, getTeamLogoUrl } from '../data/teams.js';
import type { PlayerGameStatsWithDetails } from '../types/index.js';

const WIN_COLOR = 0x57F287;
const LOSS_COLOR = 0xED4245;
const ZWSP = '\u200b';

export const NBA_STATS_BUTTON_PREFIX = 'nba_stats';

function formatStatValue(value?: number): string {
	return value !== undefined ? String(value) : '—';
}

function formatShooting(made?: number, attempted?: number): string {
	if (made === undefined || attempted === undefined) {
		return '—';
	}
	return `${made}-${attempted}`;
}

function formatPlusMinus(value?: number): string {
	if (value === undefined) {
		return '—';
	}
	return value > 0 ? `+${value}` : String(value);
}

function formatGameDate(dateStr: string): string {
	const parts = dateStr.split('-');
	if (parts.length !== 3) {
		return dateStr;
	}
	const [year, month, day] = parts;
	return `${month}/${day}/${year.slice(-2)}`;
}

function formatScore(playerScore: number, opponentScore: number): string {
	const [high, low] = [playerScore, opponentScore].sort((a, b) => b - a);
	return `${high}-${low}`;
}

function statField(label: string, value: string, rowEnd = false) {
	const displayValue = rowEnd ? `${value}\n${ZWSP}` : value;
	return { name: label, value: displayValue, inline: true as const };
}

function statFieldSpacer() {
	return { name: ZWSP, value: ZWSP, inline: true as const };
}

function buildBadges(stat: PlayerGameStatsWithDetails): string[] {
	const badges: string[] = [];
	if (stat.is_playoff_game) badges.push('Playoff');
	if (stat.is_cup_game) badges.push('Cup');
	if (stat.is_overtime) badges.push('OT');
	if (stat.is_key_game) badges.push('Key Game');
	if (stat.is_simulated) badges.push('Simulated');
	return badges;
}

function buildStatFields(stat: PlayerGameStatsWithDetails, expanded: boolean) {
	const topRow = [
		statField('PTS', formatStatValue(stat.points)),
		statField('AST', formatStatValue(stat.assists)),
		statField('REB', formatStatValue(stat.rebounds), true),
	];

	if (!expanded) {
		return topRow;
	}

	return [
		...topRow,
		statField('MIN', formatStatValue(stat.minutes)),
		statField('STL', formatStatValue(stat.steals)),
		statField('BLK', formatStatValue(stat.blocks), true),
		statField('FG', formatShooting(stat.fg_made, stat.fg_attempted)),
		statField('3PT', formatShooting(stat.threes_made, stat.threes_attempted)),
		statField('FT', formatShooting(stat.ft_made, stat.ft_attempted), true),
		statField('TO', formatStatValue(stat.turnovers)),
		statFieldSpacer(),
		statField('+/-', formatPlusMinus(stat.plus_minus)),
	];
}

export function formatStatlineEmbed(
	stat: PlayerGameStatsWithDetails,
	playerLabel: string,
	expanded = false,
): EmbedBuilder {
	const opponentAbbr = stat.opponent_team?.abbreviation
		?? getTeamAbbreviation(stat.opponent_team_id ?? stat.opponent_team_name ?? '');
	const location = stat.is_home ? 'vs' : '@';
	const result = stat.is_win ? 'W' : 'L';
	const score = formatScore(stat.player_score, stat.opponent_score);
	const scoreTitle = `${result} ${score} ${location} ${opponentAbbr}`;
	const headline = stat.headline?.trim();
	const playerLine = `${playerLabel} · ${formatGameDate(stat.game_date)}`;

	const opponentKey = stat.opponent_team_id ?? stat.opponent_team_name ?? '';
	const logoUrl = getTeamLogoUrl(opponentKey);
	const embedColor = stat.is_win ? WIN_COLOR : LOSS_COLOR;

	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle(headline || scoreTitle)
		.setDescription(headline ? `${scoreTitle}\n${playerLine}` : playerLine)
		.addFields(...buildStatFields(stat, expanded));

	if (logoUrl) {
		embed.setThumbnail(logoUrl);
	}

	const badges = buildBadges(stat);
	if (badges.length > 0) {
		embed.setFooter({ text: badges.join(' · ') });
	}

	return embed;
}

function buildToggleButton(statId: string, expanded: boolean): ButtonBuilder {
	return new ButtonBuilder()
		.setCustomId(`${NBA_STATS_BUTTON_PREFIX}:${expanded ? 'collapse' : 'expand'}:${statId}`)
		.setLabel(expanded ? 'Less stats' : 'More stats')
		.setStyle(ButtonStyle.Secondary);
}

export function buildStatlinePayload(
	stat: PlayerGameStatsWithDetails,
	playerLabel: string,
	expanded = false,
): { embeds: APIEmbed[]; components: ActionRowBuilderType<ButtonBuilder>[] } {
	const embed = formatStatlineEmbed(stat, playerLabel, expanded);
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		buildToggleButton(stat.id, expanded),
	);

	return {
		embeds: [embed.toJSON()],
		components: [row],
	};
}

export function parseNbaStatsButtonId(customId: string): { action: 'expand' | 'collapse'; statId: string } | null {
	if (!customId.startsWith(`${NBA_STATS_BUTTON_PREFIX}:`)) {
		return null;
	}

	const [, action, statId] = customId.split(':');
	if ((action !== 'expand' && action !== 'collapse') || !statId) {
		return null;
	}

	return { action, statId };
}
