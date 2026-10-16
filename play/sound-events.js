const GOOD_HISTORY=new Set(['hd_2041_quantum_NLP','hd_2042_quantum_development_council','hd_2046_quantum_ai_singularity','hd_2048_quantum_clinical_diagnosis']);
const BAD_HISTORY=new Set(['hd_2043_quantum_winter','hd_2045_quantum_communication_failure','hd_2047_quantum_cryptoasset_crisis','hd_2049_qday','hd_2050_pnp_solved']);
export function eventSound(n){if(n.label==='MISSION')return 'mission';if(n.label==='GOOD NEWS'||GOOD_HISTORY.has(n.cardId))return 'good';if(n.label==='BAD NEWS'||BAD_HISTORY.has(n.cardId))return 'bad';return 'event';}
function snapshot(s){return {logCount:s.log.length,round:s.round,rollNumber:s.rollNumber,phase:s.phase,notice:s.notice?`${s.events.length}:${s.notice.type}:${s.notice.cardId}:${s.notice.actor}`:null,players:s.players.map(p=>({assets:p.assets.length,tokens:Object.values(p.tokens).reduce((a,b)=>a+b,0),mission:p.mission}))};}
export function createGameSoundTracker(){let game=null,before=null,rollingNumber=null;
 return {
  reset(s){game=s;before=s?snapshot(s):null;rollingNumber=null;},
  beginRoll(s){rollingNumber=s.rollNumber+1;},
  observe(s){
   if(!s)return [];if(s!==game||!before){this.reset(s);return [];}
   const now=snapshot(s),old=before;before=now;const cues=[],fresh=s.log.slice(0,Math.max(0,now.logCount-old.logCount));
   if(now.rollNumber>old.rollNumber){if(now.rollNumber!==rollingNumber)cues.push('dice');rollingNumber=null;}
   const built=fresh.some(l=>l.type==='build'),traded=fresh.some(l=>l.type==='trade');
   if(built)cues.push('build');
   if(s.notice?.type==='info'&&now.notice!==old.notice){cues.push('flip',eventSound(s.notice));return cues.slice(-3);}
   if(now.phase==='finished'&&old.phase!=='finished')return ['finish'];
   if(now.round>old.round)return ['year'];
   if(now.players.some((p,i)=>p.mission&&p.mission!==old.players[i].mission)){cues.push('flip');return cues.slice(-3);}
   if(!built){
    const assetDelta=now.players.reduce((n,p,i)=>n+p.assets-old.players[i].assets,0),tokenDelta=now.players.reduce((n,p,i)=>n+p.tokens-old.players[i].tokens,0);
    if(traded)cues.push('exchange');else if(assetDelta<0)cues.push('bad');else if(assetDelta>0)cues.push('good');else if(tokenDelta>0)cues.push('income');else if(tokenDelta<0)cues.push('bad');
   }
   return cues.slice(-3);
  }
 };
}
