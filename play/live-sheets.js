import {colorText,coloredLabel} from './color-text.js';
import {tokenArt,tokenName} from './token-art.js';
import {ROLES,CATEGORIES,cardById,catById,playerNumber,dominated,yearForRound} from './game.js';
import {cardBack} from './card-presentation.js';
import {canViewMission} from './mission-privacy.js';
import {effectLabels} from './effect-ui.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tokenKinds=['blue','red','green','yellow','wild'];
const tokenNames={blue:'青',red:'赤',green:'緑',yellow:'黄',wild:'万能'};
const roleArt=['eagle','dragon','unity','phoenix'];
const color=k=>CATEGORIES.find(c=>c.id===k)?.color||'#b594e5';
const signed=n=>(n>0?'+':'')+n;

// Observe public holdings only; no mission identity enters the live overview.
export function createSheetTracker(){
 let game=null,previous=null,recent={};
 return {observe(s){
  const snapshot=s.players.map(p=>({assets:[...p.assets],tokens:{...p.tokens},completed:p.completedMissions.length,effects:effectLabels(s,p.role)}));
  if(game!==s){game=s;previous=snapshot;recent={};return {};}
  const result={};
  for(const p of s.players){
   const before=previous[p.role],now=snapshot[p.role];
   const added=now.assets.filter(id=>!before.assets.includes(id)),removed=before.assets.filter(id=>!now.assets.includes(id));
   const tokens=Object.fromEntries(tokenKinds.map(k=>[k,now.tokens[k]-before.tokens[k]]).filter(([,n])=>n));
   const pieces=[...added.map(id=>cardById(id).name+' を獲得'),...removed.map(id=>cardById(id).name+' を手放した'),...Object.entries(tokens).map(([k,n])=>tokenNames[k]+' '+signed(n))];
   if(now.completed>before.completed)pieces.push('ミッション達成');
   if(JSON.stringify(now.effects)!==JSON.stringify(before.effects))pieces.push('適用中の効果が変化');
   if(pieces.length)recent[p.role]={text:pieces.join(' · '),year:yearForRound(s.round)};
   result[p.role]={...recent[p.role],fresh:pieces.length>0,added,tokens};
  }
  previous=snapshot;return result;
 }};
}

function miniAsset(s,id,change){
 const c=cardById(id),hit=!!s.dice&&c.dice.includes(s.dice[0]+s.dice[1]);
 return `<button type="button" class="live-asset ${change?.added?.includes(id)?'live-acquired':''} ${hit?'live-producing':''}" data-action="detail" data-id="${c.id}" data-live-asset="${c.id}" title="${esc(c.name)} · クリックで拡大" aria-label="${esc(c.name)}を拡大"><img src="./assets/${c.art}" alt="${esc(c.name)}" draggable="false"></button>`;
}

function miniToken(p,k,change){
 const delta=change?.tokens?.[k]||0,name=tokenName(k);
 return `<span class="game-coin has-token-art ${delta?'live-token-changed':''}" style="--coin:${color(k)}" data-live-token="${k}" aria-label="${name} ${p.tokens[k]}個" title="${name} ${p.tokens[k]}個">${tokenArt(k)}<b>${p.tokens[k]}</b>${delta?`<em class="live-token-delta ${delta<0?'loss':'gain'}" aria-hidden="true">${signed(delta)}</em>`:''}</span>`;
}

function liveSheet(s,p,o){
 const r=ROLES[p.role],change=o.sheetChanges?.[p.role],own=canViewMission(s,p.role),labels=effectLabels(s,p.role),current=s.turn===p.role;
 const mission=`<img src="${cardBack('mission',r.cat)}" alt="ミッションの裏面" draggable="false"><span>${own?'自分のミッション ↗':'ミッションは非公開'}<small>${p.completedMissions.length} / 3 達成</small></span>`;
 return `<article class="live-sheet ${current?'live-current':''} ${change?.fresh?'live-updated':''}" data-live-seat="${p.role}" style="--seat:${color(r.cat)}" aria-label="${r.name}の現在のシート">
 <div class="live-sheet-heading"><span class="live-role-mark" aria-hidden="true">${r.mark}</span><h3>${s.mode==='table'?'P'+playerNumber(s,p.role)+' · ':''}${r.name}<small>${s.mode==='online'?esc(s.playerNames[p.role])+(p.role===s.human?' · あなた':''):s.mode==='solo'&&p.role===s.human?'あなた':r.ja}</small></h3><span class="live-turn-badge">${current?'● 手番中':(s.mode==='online'?s.controllers[p.role]==='cpu':s.mode==='solo'&&p.role!==s.human)?'CPU':'PLAYER'}</span></div>
 <div class="live-sheet-meta"><span>アセット <b>${p.assets.length}</b>枚</span><button class="text-btn" data-action="inspect-seat" data-id="${p.role}" aria-label="${r.name}のシートを詳しく見る" aria-pressed="${o.matSeat===p.role}">${o.matSeat===p.role?'詳細を表示中':'シートを詳しく'} ↗</button></div>
 <div class="player-mat live-mini-mat ${o.canAct&&current?'accepts-card':''}" data-owner="${p.role}"><div class="mat-original" aria-hidden="true"><img src="./assets/sheet_asset.png" alt="" draggable="false"></div><div class="mat-role"><button class="role-paper" data-action="role-card" data-id="${p.role}" aria-label="${r.name}のロールカードを拡大"><img src="./assets/${roleArt[p.role]}.png" alt="${r.name}" draggable="false"></button></div><div class="mat-assets mat-upper"><div class="live-card-track" style="--count:4">${p.assets.slice(0,4).map(id=>miniAsset(s,id,change)).join('')}${Array.from({length:Math.max(0,4-p.assets.length)},()=>'<span class="empty-card-slot" aria-hidden="true"></span>').join('')}</div></div><div class="mat-assets mat-lower"><div class="live-card-track" style="--count:${Math.max(3,p.assets.length-4)}">${p.assets.slice(4).map(id=>miniAsset(s,id,change)).join('')}${p.assets.length<5?'<span class="live-mat-caption">'+(p.assets.length?'アセットをここに並べます':'まだアセットはありません')+'</span>':''}</div></div><div class="mat-token-space" aria-label="${r.name}の人材">${tokenKinds.map(k=>miniToken(p,k,change)).join('')}</div><div class="mat-drop-overlay">ここに置いて開発</div></div>
 <div class="live-sheet-footer">${p.mission?(own?`<button class="live-mission-back" data-action="mission-view" data-id="${p.role}">${mission}</button>`:`<div class="live-mission-back">${mission}</div>`):'<span class="live-missions-done">ミッション全3枚達成</span>'}<span class="live-dominations">${CATEGORIES.filter(c=>dominated(p,c.id)).map(c=>`<button data-action="domination-card" data-id="${c.id}" style="--seat:${c.color}" title="${c.name}を独占">${c.symbol} ×2</button>`).join('')}</span></div>
 ${labels.length?`<ul class="live-effects">${labels.map(l=>`<li>${colorText(l)}</li>`).join('')}</ul>`:''}
 <p class="live-change" title="${esc(change?.text||'')}"><span>${change?.text?change.year+'年 · 直近':'直近の変化'}</span>${change?.text?colorText(change.text):'人材やアセットの増減をここに表示'}</p></article>`;
}

export function renderLiveSheets(s,o={}){
 const announcements=s.players.filter(p=>o.sheetChanges?.[p.role]?.fresh).map(p=>ROLES[p.role].ja+'：'+o.sheetChanges[p.role].text).join('。');
 return `<section class="live-sheets" aria-labelledby="live-sheets-title"><div class="live-sheets-heading"><div><span class="eyebrow">AROUND THE TABLE</span><h2 id="live-sheets-title">全員のシート</h2></div><span class="live-sync"><i aria-hidden="true"></i>プレイに合わせて自動更新</span></div><p class="live-sheets-guide">カードを押すと拡大できます。自分の手番は、上の自分のシートにもドラッグして開発できます。</p><div class="live-sheets-grid">${s.players.map(p=>liveSheet(s,p,o)).join('')}</div><p class="sr-only" role="status" aria-live="polite" aria-atomic="true">${esc(announcements)}</p></section>`;
}
