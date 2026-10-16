export * from './game-data.js';
export * from './game-engine.js';
export * from './event-data.js';

import {CARDS,ROLES,DOMINATION_CARDS} from './game-data.js';
import {EVENT_CARDS,MISSIONS} from './event-data.js';
export const REFERENCE_CARD_COUNT=CARDS.length+ROLES.length+DOMINATION_CARDS.length+EVENT_CARDS.length+MISSIONS.length;
