import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS } from '../src/questions.mjs';
import { ENGLISH_QUESTIONS } from '../src/questions-en.mjs';
import { GameService } from '../src/game.mjs';
import { bilingual, translate } from '../public/translate.js';

test('all 144 questions have English prompts, four corresponding choices and explanations', () => {
  assert.equal(Object.keys(ENGLISH_QUESTIONS).length, QUESTIONS.length);
  for (const source of QUESTIONS) {
    const english = ENGLISH_QUESTIONS[source.id];
    assert.ok(english.text && english.explanation, `Question ${source.id}`);
    assert.notEqual(english.text, source.text);
    assert.equal(english.options.length, source.options.length);
    assert.equal(new Set(english.options).size, 4);
  }
});
test('both languages keep the same shuffled choices and withhold explanations from spectators', () => {
  const service = new GameService({ now: () => 1_000_000 });
  const a = service.create('Alpha'), b = service.join(a.code, 'Bravo');
  const room = service.room(a.code);
  for (const p of [a,b]) service.action(p.code, p.token, { type: 'ready' });
  service.action(a.code, a.token, { type: 'start' });
  for (const p of [a,b]) service.action(p.code, p.token, { type: 'briefed' });
  for (const source of QUESTIONS) {
    room.deck = [source]; service.newQuestion(room);
    const english = ENGLISH_QUESTIONS[source.id], question = room.question;
    for (let index = 0; index < 4; index++) assert.equal(question.en.options[index], english.options[source.options.indexOf(question.options[index])]);
    assert.equal(question.en.options[question.correct], english.options[source.correct]);
    const hidden = service.watch(a.code).question;
    assert.equal(hidden.correct, undefined); assert.equal(hidden.explanation, undefined);
    assert.equal(hidden.en.correct, undefined); assert.equal(hidden.en.explanation, undefined);
    service.action(a.code, a.token, { type: 'answer', round: room.round, choice: question.correct });
    assert.equal(service.watch(a.code).question.en.explanation, undefined);
    service.action(b.code, b.token, { type: 'answer', round: room.round, choice: question.correct });
    assert.equal(service.watch(a.code).question.en.explanation, english.explanation);
  }
});
test('translation preserves user names and translates event fragments without altering identifiers', () => {
  const name = 'Les règles';
  assert.deepEqual(bilingual`${name} met la bataille en pause.`, { fr: 'Les règles met la bataille en pause.', en: 'Les règles paused the battle.' });
  assert.equal(translate('#question-card .game-hud'), '#question-card .game-hud');
  assert.equal(translate('Vous n’avez pas assez de pièces.'), 'You do not have enough coins.');
  const service = new GameService(); const a = service.create(name);
  assert.equal(service.watch(a.code).events[0].messageEn, 'Les règles opened the camp.');
});
