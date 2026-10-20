import { translate } from './translate.js';

let language = 'fr';
try { if (localStorage.getItem('bastions-language') === 'en') language = 'en'; } catch { /* Storage is optional. */ }
export const getLanguage = () => language;
export function setLanguage(value) {
  language = value === 'en' ? 'en' : 'fr';
  try { localStorage.setItem('bastions-language', language); } catch { /* Keep the selection in memory. */ }
}
export const t = source => translate(source, language);
export function tr(strings, ...values) {
  return strings.reduce((out, part, i) => out + t(part) + (i < values.length ? values[i] : ''), '');
}
export function localizeState(source) {
  if (!source || language === 'fr') return source;
  return {
    ...source,
    question: source.question ? { ...source.question, ...source.question.en, category: t(source.question.category) } : null,
    teams: source.teams.map(team => ({ ...team, name: team.bot ? 'The Watchers' : team.name })),
    colors: source.colors.map(color => ({ ...color, name: color.id === 'gold' ? 'Gold' : t(color.name) })),
    items: source.items.map(item => ({ ...item, name: t(item.name), description: t(item.description) })),
    events: source.events.map(event => ({ ...event, message: event.messageEn ?? event.message }))
  };
}

// Static header, footer and dialogs retain their nodes and event handlers when switching.
const staticText = [], staticAttributes = [];
export function registerStaticTranslations() {
  for (const root of document.querySelectorAll('header, footer, dialog, noscript, title')) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.trim()) staticText.push([node, node.textContent]);
    }
    for (const node of [root, ...root.querySelectorAll('*')]) {
      for (const attribute of ['aria-label', 'title', 'alt']) if (node.hasAttribute(attribute)) staticAttributes.push([node, attribute, node.getAttribute(attribute)]);
    }
  }
  const description = document.querySelector('meta[name="description"]');
  if (description) staticAttributes.push([description, 'content', description.content]);
}
export function updateStaticTranslations() {
  for (const [node, source] of staticText) node.textContent = t(source);
  for (const [node, attribute, source] of staticAttributes) node.setAttribute(attribute, t(source));
  document.documentElement.lang = language;
  const button = document.getElementById('language-button');
  button.setAttribute('aria-label', language === 'fr' ? 'Switch to English' : 'Passer en français');
  button.title = button.getAttribute('aria-label');
  button.querySelectorAll('[lang]').forEach(node => node.classList.toggle('active', node.lang === language));
}
