import {colorText,coloredLabel} from './color-text.js';
import {developmentStatus,cardById,ROLES,sharedPlayers} from './game.js';
import {tokenName} from './token-art.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const surchargeSources=(s,i)=>s.players.filter(p=>p.role!==i&&p.effects.surcharge);
const surchargeAttribution=(s,i)=>surchargeSources(s,i).map(p=>ROLES[p.role].ja).join('・')+' の達成報酬';

export function renderSurchargeNotice(s){
 const extra=surchargeSources(s,s.turn).length;if(!extra)return '';
 return `<aside class="surcharge-notice" aria-label="開発コストの増加"><strong>持続可能な量子技術<span>開発コスト ＋${extra}</span></strong><p>${esc(surchargeAttribution(s,s.turn))}により、現在の手番（${esc(ROLES[s.turn].ja)}）は、すべてのアセットの開発コストが${extra}個増えています。</p><small>カード上の「基本 → 現在」が、いま必要なコストです。</small></aside>`;
}

export function developmentView(s,id,{busy=false}={}){
 const plan=developmentStatus(s,s.turn,id),cpu=s.mode==='solo'&&s.turn!==s.human;
 const reason=cpu?ROLES[s.turn].ja+' の手番です。':busy?'演出の終了を待っています。':plan.reason;
 return {...plan,ready:plan.ready&&!cpu&&!busy,reason};
}

export function renderDevelopmentStatus(s,id,options={}){
 const c=cardById(id);if(!c)return '';
 const plan=developmentView(s,id,options),shared=sharedPlayers(s,s.turn).length>1;
 const cost=plan.surcharge?`<div class="surcharge-breakdown"><strong>基本 ${plan.baseCost}＋追加 ${plan.surcharge} → 必要 ${plan.cost}個</strong><span>「持続可能な量子技術」の効果</span><small>${esc(surchargeAttribution(s,s.turn))}</small></div>`:`<p>必要 ${plan.cost}個</p>`;
 const available=tokenName(c.cat)+' '+plan.tokens[c.cat]+' ＋ 量子タレント '+plan.tokens.wild+' ＝ '+(plan.tokens[c.cat]+plan.tokens.wild)+'個';
 const payment=plan.shortage?'':`<p>支払予定：${colorText(tokenName(c.cat))} ${plan.regular} ＋ ${colorText('量子タレント')} ${plan.wild}</p>`;
 return `<div class="development-status" role="status"><strong>支払い：${esc(ROLES[s.turn].ja)}${shared?'（共同研究の共有分を含む）':''}</strong>${cost}<p>使用可能：${colorText(available)}</p>${payment}${plan.reason?`<p class="restriction-note">${colorText(plan.reason)}</p>`:''}</div>`;
}
