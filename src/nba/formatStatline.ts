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

function formatStatPair(label: string, value: string): string {
	return `**${label}** ${value}`;
}

function buildStatsLines(stat: PlayerGameStatsWithDetails, expanded: boolean): string[] {
	const topRow = [
		formatStatPair('PTS', formatStatValue(stat.points)),
		formatStatPair('AST', formatStatValue(stat.assists)),
		formatStatPair('REB', formatStatValue(stat.rebounds)),
	].join(' · ');

	if (!expanded) {
		return [topRow];
	}

	return [
		topRow,
		[
			formatStatPair('MIN', formatStatValue(stat.minutes)),
			formatStatPair('STL', formatStatValue(stat.steals)),
			formatStatPair('BLK', formatStatValue(stat.blocks)),
		].join(' · '),
		[
			formatStatPair('FG', formatShooting(stat.fg_made, stat.fg_attempted)),
			formatStatPair('3PT', formatShooting(stat.threes_made, stat.threes_attempted)),
			formatStatPair('FT', formatShooting(stat.ft_made, stat.ft_attempted)),
		].join(' · '),
		[
			formatStatPair('TO', formatStatValue(stat.turnovers)),
			formatStatPair('+/-', formatPlusMinus(stat.plus_minus)),
		].join(' · '),
	];
}

function buildDescription(
	stat: PlayerGameStatsWithDetails,
	playerLabel: string,
	scoreTitle: string,
	headline: string | undefined,
	expanded: boolean,
): string {
	const playerLine = `${playerLabel} · ${formatGameDate(stat.game_date)}`;
	const statsBlock = buildStatsLines(stat, expanded).join('\n');
	const lines = headline ? [scoreTitle, playerLine, statsBlock] : [playerLine, statsBlock];
	return lines.join('\n');
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
	const headline = stat.headline?.trim() || undefined;

	const opponentKey = stat.opponent_team_id ?? stat.opponent_team_name ?? '';
	const logoUrl = getTeamLogoUrl(opponentKey);
	const embedColor = stat.is_win ? WIN_COLOR : LOSS_COLOR;

	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle(headline ?? scoreTitle)
		.setDescription(buildDescription(stat, playerLabel, scoreTitle, headline, expanded));

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
