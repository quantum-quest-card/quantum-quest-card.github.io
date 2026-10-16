import {colorText,coloredLabel} from './color-text.js';
import {visibleLogEntry} from './mission-privacy.js';
import {ROLES,CATEGORIES,cardById,effectById,yearForRound} from './game.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kinds={year:['新しい年','◷'],setup:['ロール','✧'],dice:['サイコロ','⚄'],income:['人材','＋'],build:['開発','◇'],event:['イベント','✦'],mission:['ミッション','✓'],trade:['交換','⇄'],info:['記録','·']};
export const logFilters=[['all','すべて'],['event','イベント'],['build','開発'],['mission','ミッション'],['income','人材・交換']];
export function filteredLog(s,filter='all'){return s.log.filter(l=>filter==='all'||(filter==='income'?['income','trade'].includes(l.type):l.type===filter)).map(l=>visibleLogEntry(s,l));}
export function renderLogEntries(s,filter='all'){
 const entries=filteredLog(s,filter);let lastYear=null;
 return entries.map(l=>{
  const year=Number.isInteger(l.round)?yearForRound(l.round):l.year;
  const heading=year!==lastYear?`<li class="activity-year"><time>${year}年</time><span>ROUND ${l.round||'—'}</span></li>`:'';lastYear=year;
  const [label,mark]=kinds[l.type]||kinds.info,c=effectById(l.cardId),asset=cardById(l.assetId),role=Number.isInteger(l.actor)?ROLES[l.actor]:null,clr=CATEGORIES.find(c=>c.id===role?.cat)?.color;
  const picture=c?`<button class="activity-card" data-action="event-reference" data-id="${c.id}" aria-label="${esc(c.title)}のカードを見る"><img src="${c.src}" alt="" loading="lazy"></button>`:asset?`<button class="activity-card asset-thumb" data-action="detail" data-id="${asset.id}" aria-label="${esc(asset.name)}のカードを見る"><img src="./assets/${asset.art}" alt="" loading="lazy"></button>`:'';
  return heading+`<li class="activity-entry activity-${Object.hasOwn(kinds,l.type)?l.type:'info'}"><span class="activity-mark" aria-hidden="true">${mark}</span><div class="activity-copy"><span class="activity-kind">${c?.group==='historic'?'HISTORIC DAY':c?.group==='news'?'7カード':label}${role?`<i style="background:${clr}"></i><span>${esc(role.name)}</span>`:''}</span><p>${colorText(l.text)}</p></div>${picture}</li>`;
 }).join('')||'<li class="activity-empty">この種類の記録はまだありません。</li>';
}
export function renderActivityLog(s,filter='all'){
 return `<section class="activity-panel" aria-labelledby="activity-title"><div class="activity-heading"><div><span class="eyebrow">THE STORY SO FAR</span><h2 id="activity-title">この世界に起きたこと</h2></div><button class="text-btn" data-action="review-log">全記録 ↗</button></div><div class="activity-filters" aria-label="ログの絞り込み">${logFilters.map(([id,title])=>`<button type="button" data-action="log-filter" data-id="${id}" aria-pressed="${id===filter}" class="${id===filter?'active':''}">${title}</button>`).join('')}</div><div class="activity-caption"><span>新しい出来事から表示 · ${filteredLog(s,filter).length}件</span><button class="text-btn" data-action="log-latest">最新へ ↑</button></div><div class="activity-scroll" tabindex="0" aria-label="プレイの記録。スクロールして過去の出来事を確認"><ol class="activity-list">${renderLogEntries(s,filter)}</ol></div></section>`;
}
