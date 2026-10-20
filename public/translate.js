import { messages } from './messages-en.js';

const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const alternatives = Object.keys(messages).sort((a, b) => b.length - a.length).map(key =>
  `${/^\p{L}/u.test(key) ? '(?<![\\p{L}\\p{N}_-])' : ''}${escapePattern(key)}${/\p{L}$/u.test(key) ? '(?![\\p{L}\\p{N}_-])' : ''}`);
const pattern = new RegExp(alternatives.join('|'), 'gu');

// Translate trusted interface fragments only, never interpolated player names or input.
export function translate(source, language = 'en') {
  if (language !== 'en' || typeof source !== 'string') return source;
  return source.replace(pattern, match => messages[match]);
}
export function translated(value) { return { fr: value, en: translate(value) }; }
export function bilingual(strings, ...values) {
  const format = language => strings.reduce((out, part, i) => out + translate(part, language) + (i < values.length ? (values[i]?.[language] ?? values[i]) : ''), '');
  return { fr: format('fr'), en: format('en') };
}
