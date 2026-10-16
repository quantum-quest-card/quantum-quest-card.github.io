import {ROLES,MISSIONS} from './game.js';

// The selected sheet is never the viewer's identity. In pass-and-play mode,
// the device belongs to the player whose turn it is.
export function canViewMission(s,role){
 const viewer=s.mode==='solo'||s.mode==='online'?s.human:s.turn;
 return Number.isInteger(role)&&!!s.players[role]&&role===viewer;
}

// Keep complete records in the save, but project only public information into
// the journal and exports. Title lookup also covers older logs without cardId.
export function visibleLogEntry(s,entry){
 const card=MISSIONS.find(c=>c.id===entry.cardId||[c.title,...(c.legacyTitles||[])].some(title=>entry.text?.includes(title)));
 if(!card)return entry;
 const owner=ROLES.find(r=>r.cat===card.color)?.id;
 if(canViewMission(s,owner)||s.players[owner]?.completedMissions.includes(card.id))return entry;
 const text=entry.text?.includes('を引いた')
  ?`${ROLES[owner]?.ja||'プレイヤー'} が新しいミッションを引いた（内容は非公開）`
  :'ミッションに関する記録（内容は非公開）';
 return {...entry,cardId:null,text};
}
