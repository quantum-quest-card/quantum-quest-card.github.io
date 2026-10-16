import {CARDS,CATEGORIES,ROLES,cardById,catById,emptyTokens} from './game-data.js';
import {EVENT_CARDS,MISSIONS,effectById} from './event-data.js';
const COLORS=CATEGORIES.map(c=>c.id),TOKENS=[...COLORS,'wild'];
const who=i=>ROLES[i].ja;
const tokenName=k=>k==='wild'?'万能':catById(k).short;
const balance=p=>Object.values(p.tokens).reduce((a,b)=>a+b,0);
function random(s){let x=s.seed;x^=x<<13;x^=x>>>17;x^=x<<5;s.seed=x>>>0;return s.seed/4294967296;}
function log(s,text,type='info',meta={}){s.log.unshift({text,type,year:s.year,round:s.round,turn:s.turn,...meta});}
export const yearForRound=round=>2040+round;
export function normalizeCalendar(s){for(const n of [s.notice,...s.queue].filter(Boolean))if(n.cardId==='mission_yellow_2'&&n.type==='choice'&&n.choiceType==='transfer-tokens')n.actor=n.to;s.year=yearForRound(s.round);for(const entry of [...s.log,...s.events])if(Number.isInteger(entry.round))entry.year=yearForRound(entry.round);return s;}
export const playerNumber=(s,role)=>(s.playerOrder||[0,1,2,3]).indexOf(role)+1;
function tokenSnapshot(s){return s.players.map(p=>({...p.tokens}));}
function logTokenChanges(s,before,type,cardId){for(const p of s.players){const changes=TOKENS.map(k=>({k,n:p.tokens[k]-before[p.role][k]})).filter(x=>x.n);if(changes.length)log(s,who(p.role)+'：'+changes.map(({k,n})=>tokenName(k)+' '+(n>0?'+':'')+n).join(' / '),type,{actor:p.role,cardId});}}

export function ownedBy(s,id){return s.players.findIndex(p=>p.assets.includes(id));}
export function dominated(p,cat){const cards=CARDS.filter(c=>c.cat===cat);return cards.length>0&&cards.every(c=>p.assets.includes(c.id));}
function drawMission(s,i){const p=s.players[i];if(!p.missionDeck.length){p.mission=null;p.missionStatus='done';return;}const at=Math.floor(random(s)*p.missionDeck.length);p.mission=p.missionDeck.splice(at,1)[0];p.missionStatus='active';p.missionSince=s.serial;log(s,who(i)+' が新しいミッション「'+effectById(p.mission).title+'」を引いた','mission',{actor:i,cardId:p.mission});}
export function createGame({mode='solo',human,maxRounds=10,seed=Date.now()}={}){
 const players=ROLES.map(r=>({role:r.id,tokens:emptyTokens(),assets:r.initial?[r.initial]:[],mission:null,missionStatus:'active',missionSince:0,missionDeck:MISSIONS.filter(m=>m.color===r.cat).map(m=>m.id),completedMissions:[],acquisitions:[],trades:[],effects:{ftqcDouble:false,gdpr:false,surcharge:false,cheapDouble:false,bonusStart:0,bonusUntil:0,blockedUntil:0,buildLockedTurn:-1},aiTradedTurn:-1}));players[3].tokens.wild=3;
 const s={version:3,mode,human,maxRounds,seed:seed>>>0||12345,players,turn:3,turnNo:0,serial:0,round:1,year:2041,phase:'roll',dice:null,rollNumber:0,log:[],events:[],notice:null,queue:[],roundPending:false,annualBudgetPending:false,sharing:[],decks:{news:{draw:EVENT_CARDS.filter(c=>c.group==='news').map(c=>c.id),discard:[]},historic:{draw:EVENT_CARDS.filter(c=>c.group==='historic').map(c=>c.id),discard:[]}},notes:['','',''],endedReason:null};
 for(let i=0;i<4;i++)drawMission(s,i);
 s.playerOrder=[0,1,2,3];
 if(human===undefined){for(let i=3;i>0;i--){const j=Math.floor(random(s)*(i+1));[s.playerOrder[i],s.playerOrder[j]]=[s.playerOrder[j],s.playerOrder[i]];}s.human=s.playerOrder[0];}
 else{s.playerOrder=[human,...s.playerOrder.filter(i=>i!==human)];}
 log(s,mode==='solo'?'あなたのロールは '+who(s.human)+'。ほかの3勢力はCPUが担当します。':s.playerOrder.map((i,n)=>'プレイヤー'+(n+1)+'：'+who(i)).join(' ／ '),'setup',{actor:mode==='solo'?s.human:null});
 log(s,'2041年の旅が始まりました。復活の不死鳥からプレイします。','year');return s;
}
export function sharedPlayers(s,i){const group=new Set([i]);let changed=true;while(changed){changed=false;for(const link of s.sharing){if(link.until<s.round)continue;if(group.has(link.a)&&!group.has(link.b)){group.add(link.b);changed=true;}if(group.has(link.b)&&!group.has(link.a)){group.add(link.a);changed=true;}}}return [i,...[...group].filter(j=>j!==i).sort()];}
export function availableTokens(s,i){const sum=emptyTokens();for(const j of sharedPlayers(s,i))for(const k of TOKENS)sum[k]+=s.players[j].tokens[k];return sum;}
function spend(s,i,k,n){for(const j of sharedPlayers(s,i)){const p=s.players[j],take=Math.min(n,p.tokens[k]);p.tokens[k]-=take;n-=take;if(!n)break;}return n===0;}
function gain(s,i,k,n,{multiply=true}={}){const e=s.players[i].effects,m=multiply&&e.bonusStart>0&&s.round>=e.bonusStart&&s.round<=e.bonusUntil?2:1;s.players[i].tokens[k]+=n*m;return n*m;}
function lose(s,i,k,n){const take=Math.min(s.players[i].tokens[k],n);s.players[i].tokens[k]-=take;return take;}
function transfer(s,from,to,k,n){const take=lose(s,from,k,n);s.players[to].tokens[k]+=take;return take;}
export function developmentCost(s,i,id){return cardById(id).cost+s.players.filter(p=>p.role!==i&&p.effects.surcharge).length;}
export function buildRestriction(s,i){const p=s.players[i];if(p.effects.blockedUntil>=s.round)return '不平等なアクセス：'+yearForRound(p.effects.blockedUntil)+'年の終了まで開発不可';if(p.effects.buildLockedTurn===s.turnNo)return 'リープフロッグ達成：この手番の追加開発はできません';return '';}
// One payment plan drives eligibility, explanations, and the actual debit.
export function developmentStatus(s,i,id){
 const c=cardById(id);
 if(!c||!s.players[i])return {ready:false,reason:'カードを選んでください。'};
 const cost=developmentCost(s,i,id),tokens=availableTokens(s,i),regular=Math.min(tokens[c.cat],cost),wild=cost-regular,shortage=Math.max(0,wild-tokens.wild),owner=ownedBy(s,id);
 let reason='';
 if(s.phase==='finished')reason='ゲームは終了しています。';
 else if(owner>=0)reason=who(owner)+' が所有しています。';
 else if(i!==s.turn)reason=who(i)+' の手番ではありません。';
 else if(s.notice||s.queue.length)reason='カードの効果・報酬の処理を完了してください。';
 else if(s.roundPending)reason='Historic Day・年次予算を処理しています。';
 else if(s.phase!=='action')reason='サイコロを振ると開発できます。';
 else if(buildRestriction(s,i))reason=buildRestriction(s,i);
 else if(shortage)reason='同色の人材または量子タレントがあと '+shortage+' 個必要です。';
 return {ready:!reason,reason,cost,baseCost:c.cost,surcharge:cost-c.cost,tokens,regular,wild,shortage,owner};
}
export function canBuild(s,i,id){return developmentStatus(s,i,id).ready;}

function acquire(s,i,id,kind,paid=0){const p=s.players[i],c=cardById(id);p.assets.push(id);p.acquisitions.push({id,cat:c.cat,cost:c.cost,round:s.round,serial:++s.serial,kind,paid,turnNo:s.turnNo});log(s,who(i)+' が「'+c.name+'」を'+(kind==='build'?'開発':'獲得'),kind==='build'?'build':'event',{actor:i,assetId:id});if(dominated(p,c.cat))log(s,who(i)+' が '+catById(c.cat).name+' を独占。カテゴリ収入が2倍。','event',{actor:i});}
function drop(s,i,id){const p=s.players[i],at=p.assets.indexOf(id);if(at<0)return false;p.assets.splice(at,1);log(s,who(i)+' は「'+cardById(id).name+'」を手放した（開発プールへ戻る）','event',{actor:i,assetId:id});return true;}
function eventNotice(s,id,actor,type='event',extra={}){const c=effectById(id);return {type,cardId:id,title:c.title,text:c.text,label:c.label,src:c.src,actor,...extra};}
function choice(s,type,actor,cardId,extra={}){s.queue.push(eventNotice(s,cardId,actor,'choice',{choiceType:type,...extra}));}
function info(s,id,actor,text){s.queue.push(eventNotice(s,id,actor,'info',{result:text}));}
function recordEvent(s,id,actor){const c=effectById(id);s.events.push({cardId:id,title:c.title,text:c.text,label:c.label,year:s.year,round:s.round,actor});log(s,(c.group==='historic'?'全体':who(actor))+'：'+c.title,'event',{actor:c.group==='historic'?null:actor,cardId:id});}
function drawEvent(s,group){const d=s.decks[group];if(!d.draw.length){d.draw=d.discard.splice(0);log(s,(group==='news'?'7カード':'Historic Day')+'の捨て札を混ぜ直しました','event');}const id=d.draw.splice(Math.floor(random(s)*d.draw.length),1)[0];d.discard.push(id);return id;}

// Apply exactly once; all follow-up decisions are serializable queue entries.
export function applyEvent(s,id,actor=s.turn){
 if(s.notice||s.queue.length||s.phase==='finished')return false;const c=effectById(id);if(!c||c.group==='mission')return false;
 recordEvent(s,id,actor);info(s,id,actor,c.ruleNote||(c.group==='historic'?'全プレイヤーを対象に処理します。':'効果の対象は、特記された場合を除き '+who(actor)+' です。'));
 const p=s.players[actor],before=tokenSnapshot(s);
 switch(id){
  case 'bn_brain_drain':if(p.assets.length>=3){const to=(actor+1)%4;for(const k of COLORS)transfer(s,actor,to,k,p.tokens[k]);log(s,who(actor)+' から左隣の '+who(to)+' へ通常トークンを全て移しました','event');}break;
  case 'bn_budget_cut':for(const k of COLORS)p.tokens[k]=0;break;
  case 'bn_data_breach':if(!p.assets.some(x=>['pqc','qkd'].includes(x)))for(const k of COLORS)p.tokens[k]=0;break;
  case 'bn_patent_dispute':if(COLORS.some(k=>dominated(p,k)))choice(s,'lose-asset',actor,id,{onlyDominated:true});break;
  case 'bn_unequal_access':p.effects.blockedUntil=Math.max(p.effects.blockedUntil,s.round+1);break;
  case 'gn_collaborative_research':choice(s,'share',actor,id);break;
  case 'gn_funding_grant':s.players.forEach(q=>gain(s,q.role,ROLES[q.role].cat,1));break;
  case 'gn_quantum_breakthrough':gain(s,actor,'blue',2);break;
  case 'gn_synergetic_effect':if(p.assets.length&&s.players.some(q=>q.role!==actor&&q.assets.length>p.assets.length))choice(s,'swap-player',actor,id);break;
  case 'gn_talent_recruitment':choice(s,'gain-tokens',actor,id,{count:2});break;
  case 'hd_2041_quantum_NLP':s.players.forEach(q=>gain(s,q.role,'blue',1));break;
  case 'hd_2042_quantum_development_council':s.players.forEach(q=>gain(s,q.role,'green',1));break;
  case 'hd_2043_quantum_winter':s.players.forEach(q=>lose(s,q.role,ROLES[q.role].cat,2));break;
  case 'hd_2044_quantum_satellite_network':for(const i of [3,0,1,2])choice(s,'swap-market',i,id,{optional:true});break;
  case 'hd_2045_quantum_communication_failure':s.players.forEach(q=>lose(s,q.role,'red',1));break;
  case 'hd_2046_quantum_ai_singularity':s.players.forEach(q=>gain(s,q.role,'wild',1));break;
  case 'hd_2047_quantum_cryptoasset_crisis':for(const q of s.players)if(q.assets.length>=2&&!q.assets.includes('blockchain'))choice(s,'lose-asset',q.role,id,{minimum:1});break;
  case 'hd_2048_quantum_clinical_diagnosis':s.players.forEach(q=>gain(s,q.role,'yellow',2+(q.assets.some(x=>['drug','biomarker'].includes(x))?1:0)));break;
  case 'hd_2049_qday':for(const q of s.players)if(q.assets.length>1&&!q.assets.some(x=>['pqc','qkd'].includes(x)))choice(s,'lose-asset',q.role,id,{minimum:1});break;
  case 'hd_2050_pnp_solved':{const owner=ownedBy(s,'ftqc');if(owner>=0)drop(s,owner,'ftqc');break;}
  default:return false;
 }
 logTokenChanges(s,before,'event',id);settle(s);return true;
}
export function income(s,total){const messages=[];for(const p of s.players){const sum=emptyTokens();for(const id of p.assets){const c=cardById(id);if(!c.dice.includes(total))continue;const multiplier=(dominated(p,c.cat)?2:1)*(p.effects.ftqcDouble&&id==='ftqc'?2:1)*(p.effects.cheapDouble&&c.cost===2?2:1);for(const [k,n] of Object.entries(c.yields))sum[k]+=gain(s,p.role,k,n*multiplier);}if(Object.values(sum).some(Boolean))messages.push(who(p.role)+'：'+TOKENS.filter(k=>sum[k]).map(k=>tokenName(k)+' +'+sum[k]).join(' / '));}return messages;}
export function roll(s){if(s.phase!=='roll'||s.notice||s.queue.length||s.roundPending)return false;s.dice=[1+Math.floor(random(s)*6),1+Math.floor(random(s)*6)];s.rollNumber++;s.phase='action';const total=s.dice[0]+s.dice[1];log(s,who(s.turn)+' が '+s.dice.join(' + ')+' = '+total+' を出した','dice',{actor:s.turn});if(total===7)applyEvent(s,drawEvent(s,'news'),s.turn);else{const gains=income(s,total);log(s,gains.length?gains.join(' ／ '):'該当するアセットなし。今回は人材の獲得なし。','income');settle(s);}return true;}
export function build(s,id){const i=s.turn,plan=developmentStatus(s,i,id);if(!plan.ready)return false;const c=cardById(id);spend(s,i,c.cat,plan.regular);spend(s,i,'wild',plan.wild);acquire(s,i,id,'build',plan.cost);for(const p of s.players)if(p.role!==i&&p.effects.gdpr)gain(s,p.role,'green',1);settle(s);return true;}
export function exchange(s,from,to){if(s.phase!=='action'||s.notice||s.queue.length||s.roundPending||from===to||!COLORS.includes(from)||!COLORS.includes(to)||availableTokens(s,s.turn)[from]<2)return false;spend(s,s.turn,from,2);s.players[s.turn].tokens[to]++;log(s,who(s.turn)+' が '+tokenName(from)+' 2個を '+tokenName(to)+' 1個に交換','trade',{actor:s.turn});settle(s);return true;}
export function trade(s,other,from,to){const i=s.turn;if(s.phase!=='action'||s.notice||s.queue.length||s.roundPending||other===i||!s.players[other]||from===to||!COLORS.includes(from)||!COLORS.includes(to)||availableTokens(s,i)[from]<1||availableTokens(s,other)[to]<1)return false;spend(s,i,from,1);spend(s,other,to,1);s.players[i].tokens[to]++;s.players[other].tokens[from]++;s.serial++;for(const [a,b] of [[i,other],[other,i]])s.players[a].trades.push({partner:b,serial:s.serial,round:s.round});log(s,who(i)+' と '+who(other)+' が人材を交換','trade',{actor:i});settle(s);return true;}

function temporalPair(s,p,type){const history=p.acquisitions.filter(x=>x.serial>p.missionSince);for(const b of history.slice().reverse()){if(type==='red'&&(b.cat!=='red'||b.cost<3))continue;if(type==='yellow'&&b.kind!=='build')continue;const a=history.find(a=>a.round===b.round-1&&(type==='red'?a.cat==='yellow':a.kind==='build'&&a.cat!==b.cat));if(a)return b;}return null;}
export function missionProgress(s,i){const p=s.players[i],m=p.mission;if(!m)return p.missionStatus==='reward'?'報酬の処理中':'3枚のミッションを達成';const cats=new Set(p.assets.map(id=>cardById(id).cat));switch(m){case 'mission_blue_1':return p.assets.includes('ftqc')?'FTQCを保有':'FTQCを獲得';case 'mission_blue_2':return '保有カテゴリ '+cats.size+' / 3';case 'mission_blue_3':return 'セキュリティ '+p.assets.filter(id=>cardById(id).cat==='red').length+' / 2';case 'mission_red_1':return p.assets.includes('network')?'量子インターネットを保有':'量子インターネットを獲得';case 'mission_red_2':return '医療を獲得 → 翌ラウンドにコスト3以上のセキュリティを獲得';case 'mission_red_3':return p.assets.includes('standard')?'量子標準を保有':'量子標準を獲得';case 'mission_green_1':return p.assets.includes('pqc')?'PQCを保有':'PQCを獲得';case 'mission_green_2':return '緑 '+p.tokens.green+' / 5 · 他色・万能 '+(balance(p)-p.tokens.green);case 'mission_green_3':return '量子人権委員 '+(p.assets.includes('rights')?'✓':'—')+' · 量子創薬 '+(p.assets.includes('drug')?'✓':'—');case 'mission_yellow_1':return '2ラウンド連続で異なるカテゴリを開発';case 'mission_yellow_2':return 'プレイヤー間の交換を成立させる';case 'mission_yellow_3':return 'コスト2のアセット '+p.assets.filter(id=>cardById(id).cost===2).length+' / 2';default:return '';}}
function missionMet(s,p){const a=p.assets;switch(p.mission){case 'mission_blue_1':return a.includes('ftqc');case 'mission_blue_2':return new Set(a.map(id=>cardById(id).cat)).size>=3;case 'mission_blue_3':return a.filter(id=>cardById(id).cat==='red').length>=2;case 'mission_red_1':return a.includes('network');case 'mission_red_2':return !!temporalPair(s,p,'red');case 'mission_red_3':return a.includes('standard');case 'mission_green_1':return a.includes('pqc');case 'mission_green_2':return p.tokens.green>=5&&TOKENS.filter(k=>k!=='green').every(k=>p.tokens[k]===0);case 'mission_green_3':return a.includes('rights')&&a.includes('drug');case 'mission_yellow_1':return !!temporalPair(s,p,'yellow');case 'mission_yellow_2':return p.trades.some(t=>t.serial>p.missionSince);case 'mission_yellow_3':return a.filter(id=>cardById(id).cost===2).length>=2;default:return false;}}
function completeMission(s,i){const p=s.players[i],id=p.mission,c=effectById(id),before=tokenSnapshot(s);p.missionStatus='reward';p.completedMissions.push(id);log(s,who(i)+' がミッション「'+c.title+'」を達成','mission',{actor:i,cardId:id});info(s,id,i,'ミッション達成！ '+c.reward);switch(id){case 'mission_blue_1':p.effects.ftqcDouble=true;break;case 'mission_blue_2':choice(s,'free-blue',i,id);break;case 'mission_blue_3':case 'mission_red_1':gain(s,i,'red',3);break;case 'mission_red_2':p.effects.bonusStart=s.round+1;p.effects.bonusUntil=s.round+3;break;case 'mission_red_3':gain(s,i,'wild',3);break;case 'mission_green_1':p.effects.gdpr=true;break;case 'mission_green_2':p.effects.surcharge=true;break;case 'mission_green_3':for(const q of s.players)if(q.role!==i&&!q.assets.some(id=>cardById(id).cat==='green')&&COLORS.some(k=>q.tokens[k]>0))choice(s,'transfer-tokens',i,id,{from:q.role,to:i,count:2});break;case 'mission_yellow_1':{const last=temporalPair(s,p,'yellow');gain(s,i,last.cat,last.paid,{multiply:false});p.effects.buildLockedTurn=s.turnNo;break;}case 'mission_yellow_2':{const t=p.trades.find(t=>t.serial>p.missionSince);choice(s,'transfer-tokens',i,id,{from:t.partner,to:i,count:2});break;}case 'mission_yellow_3':p.effects.cheapDouble=true;break;}logTokenChanges(s,before,'mission',id);s.queue.push({type:'next-mission',actor:i});}
function scanMissions(s){if(s.phase==='finished'||s.notice||s.queue.length)return false;let found=false;for(const p of s.players)if(p.missionStatus==='active'&&missionMet(s,p)){completeMission(s,p.role);found=true;}return found;}
function settle(s){
 if(s.notice||s.phase==='finished')return;
 while(true){
  if(s.queue.length){const n=s.queue.shift();if(n.type==='next-mission'){drawMission(s,n.actor);continue;}s.notice=n;return;}
  if(scanMissions(s))continue;
  // Old v3 saves have no pending-budget flag: their budget was already paid.
  // Clear before scanning budget-triggered missions so reloads cannot pay twice.
  if(s.roundPending&&s.annualBudgetPending){
   s.annualBudgetPending=false;
   const before=tokenSnapshot(s);
   s.players.forEach(p=>gain(s,p.role,ROLES[p.role].cat,1));
   log(s,'年次予算：各ロールと同色の人材を獲得（基本1個、報酬による倍増を適用）。','income');
   logTokenChanges(s,before,'income');
   continue;
  }
  if(checkEnd(s))return;
  if(s.roundPending){s.roundPending=false;if(s.round>=s.maxRounds){s.phase='finished';s.endedReason=s.maxRounds+'ラウンドの試遊が終了しました。';return;}s.round++;s.year=yearForRound(s.round);log(s,s.year+'年が始まりました。','year');s.turn=3;s.turnNo++;s.phase='roll';s.dice=null;s.sharing=s.sharing.filter(x=>x.until>=s.round);}
  return;
 }
}
export function checkMissions(s){const before=s.players.reduce((n,p)=>n+p.completedMissions.length,0);settle(s);return s.players.reduce((n,p)=>n+p.completedMissions.length,0)>before;}
function tokenCombinations(available,count){const list=[];function visit(start,items){if(items.length===count){const tokens=emptyTokens();items.forEach(k=>tokens[k]++);list.push(tokens);return;}for(let a=start;a<TOKENS.length;a++){const k=TOKENS[a];if(items.filter(x=>x===k).length<available[k])visit(a,[...items,k]);}}visit(0,[]);return list;}
export function getChoices(s,n=s.notice){if(!n||n.type!=='choice')return [];const p=s.players[n.actor],out=[],add=(data,label,score=0)=>out.push({id:String(out.length),data,label,score});
 switch(n.choiceType){
  case 'share':for(const q of s.players)if(q.role!==n.actor)add({other:q.role},who(q.role)+' と2ラウンド共有',balance(q));break;
  case 'lose-asset':for(const id of p.assets)if(p.assets.length>Math.max(n.minimum||0,n.cardId==='hd_2047_quantum_cryptoasset_crisis'?1:0)&&(!n.onlyDominated||dominated(p,cardById(id).cat)))add({give:id},cardById(id).name+' を手放す',-cardById(id).cost);break;
  case 'swap-player':for(const q of s.players)if(q.role!==n.actor&&q.assets.length>p.assets.length)for(const give of p.assets)for(const get of q.assets)add({other:q.role,give,get},cardById(give).name+' ⇄ '+who(q.role)+' の '+cardById(get).name,cardById(get).cost-cardById(give).cost);break;
  case 'swap-market':for(const give of p.assets)for(const c of CARDS)if(ownedBy(s,c.id)<0&&c.cost<=cardById(give).cost)add({give,get:c.id},cardById(give).name+' → '+c.name,c.cost-cardById(give).cost+(c.cat===ROLES[n.actor].cat?1:0));break;
  case 'free-blue':for(const c of CARDS)if(c.cat==='blue'&&c.id!=='ftqc'&&ownedBy(s,c.id)<0)add({get:c.id},c.name+' を獲得',c.cost);break;
  case 'gain-tokens':case 'transfer-tokens':{
   const transferMode=n.choiceType==='transfer-tokens';
   // Freely chosen personnel excludes Quantum Talent, including another player's tokens.
   const available={...emptyTokens(),...Object.fromEntries(COLORS.map(k=>[k,transferMode?s.players[n.from].tokens[k]:n.count]))};
   const count=transferMode?Math.min(n.count,COLORS.reduce((sum,k)=>sum+available[k],0)):n.count;
   for(const tokens of tokenCombinations(available,count))add({tokens},COLORS.filter(k=>tokens[k]).map(k=>tokenName(k)+' ×'+tokens[k]).join(' / ')||'渡せるトークンなし',tokens[ROLES[n.actor].cat]);
   break;
  }
 }
 if(n.optional||!out.length)add({skip:true},out.length?'交換せずに続ける':'対象なし・続ける',-100);return out;
}
export function resolveChoice(s,optionId){const n=s.notice;if(!n||n.type!=='choice')return false;const o=getChoices(s,n).find(o=>o.id===String(optionId));if(!o)return false;const d=o.data,i=n.actor,before=tokenSnapshot(s);
 if(!d.skip)switch(n.choiceType){case 'share':s.sharing.push({a:i,b:d.other,until:s.round+1});break;case 'lose-asset':drop(s,i,d.give);break;case 'swap-player':drop(s,i,d.give);drop(s,d.other,d.get);acquire(s,i,d.get,'exchange');acquire(s,d.other,d.give,'exchange');break;case 'swap-market':drop(s,i,d.give);acquire(s,i,d.get,'exchange');break;case 'free-blue':acquire(s,i,d.get,'reward');break;case 'gain-tokens':for(const k of TOKENS)if(d.tokens[k])gain(s,i,k,d.tokens[k]);break;case 'transfer-tokens':for(const k of TOKENS)if(d.tokens[k])transfer(s,n.from,n.to,k,d.tokens[k]);break;}
 log(s,who(i)+' の選択：'+o.label,'event',{actor:i,cardId:n.cardId});logTokenChanges(s,before,n.label==='MISSION'?'mission':'event',n.cardId);s.notice=null;settle(s);return true;
}
export function autoResolveChoice(s){const opts=getChoices(s).sort((a,b)=>b.score-a.score);return opts.length?resolveChoice(s,opts[0].id):false;}
export function acknowledge(s){if(!s.notice||s.notice.type==='choice')return false;s.notice=null;settle(s);return true;}
export function triggerAnnual(s){if(s.notice||s.queue.length||s.phase==='finished')return false;return applyEvent(s,drawEvent(s,'historic'),s.turn);}
export function endTurn(s){if(s.phase!=='action'||s.notice||s.queue.length||s.roundPending)return false;if(checkEnd(s))return true;const next=(s.turn+1)%4;if(next===3){s.roundPending=true;s.annualBudgetPending=true;triggerAnnual(s);}else{s.turn=next;s.turnNo++;s.phase='roll';s.dice=null;settle(s);}return true;}
export function checkEnd(s){if(s.notice||s.queue.length)return false;if(s.players.some(p=>p.assets.length>=11)){s.phase='finished';s.endedReason='1つの勢力が11アセットを獲得しました。';return true;}if(s.players.reduce((n,p)=>n+p.assets.length,0)===CARDS.length){s.phase='finished';s.endedReason=CARDS.length+'のアセットがすべて開発されました。';return true;}return false;}
export function finish(s){if(s.notice||s.queue.length)return false;s.phase='finished';s.endedReason='ここまでのプレイを振り返ります。';return true;}
export function ranking(s){return [...s.players].sort((a,b)=>{const n=b.assets.length-a.assets.length;if(n)return n;const aa=a.assets.map(id=>cardById(id).cost).sort((x,y)=>y-x),bb=b.assets.map(id=>cardById(id).cost).sort((x,y)=>y-x);for(let i=0;i<aa.length;i++)if(aa[i]!==bb[i])return bb[i]-aa[i];return a.role-b.role;});}
export function aiAction(s,{canTradeWith=()=>true}={}){
 if(s.phase!=='action'||s.notice||s.queue.length||s.roundPending)return false;const i=s.turn,p=s.players[i];
 if(!buildRestriction(s,i)){
  const wanted={mission_blue_1:'ftqc',mission_red_1:'network',mission_red_3:'standard',mission_green_1:'pqc'}[p.mission];
  const available=CARDS.filter(c=>ownedBy(s,c.id)<0).sort((a,b)=>((a.id===wanted?-8:0)+(a.cat===ROLES[i].cat?-3:0)+a.cost)-((b.id===wanted?-8:0)+(b.cat===ROLES[i].cat?-3:0)+b.cost));
  const affordable=available.find(c=>canBuild(s,i,c.id));if(affordable)return build(s,affordable.id);
  for(const c of available){const t=availableTokens(s,i),deficit=developmentCost(s,i,c.id)-t[c.cat]-t.wild,donors=COLORS.filter(k=>k!==c.cat);if(deficit<=0||donors.reduce((n,k)=>n+Math.floor(t[k]/2),0)<deficit)continue;let left=deficit;for(const k of donors)while(left&&availableTokens(s,i)[k]>=2){if(!exchange(s,k,c.cat))return false;left--;if(s.notice)return true;}return build(s,c.id);}
 }
 if(p.aiTradedTurn!==s.turnNo){p.aiTradedTurn=s.turnNo;for(const q of s.players)if(q.role!==i&&canTradeWith(q.role))for(const from of COLORS)for(const to of COLORS)if(from!==to&&from===ROLES[q.role].cat&&to===ROLES[i].cat&&availableTokens(s,i)[from]>=2&&availableTokens(s,q.role)[to]>=2)return trade(s,q.role,from,to);}
 return false;
}
export function validState(s){try{
 if(!s||s.version!==3||!['solo','table'].includes(s.mode)||!Number.isInteger(s.human)||s.human<0||s.human>3||!Number.isInteger(s.turn)||s.turn<0||s.turn>3||!['roll','action','finished'].includes(s.phase)||![8,10,12].includes(s.maxRounds)||!Number.isInteger(s.round)||s.round<1||s.round>s.maxRounds||!Number.isFinite(s.seed)||!Number.isInteger(s.serial)||!Number.isInteger(s.turnNo)||!Array.isArray(s.players)||s.players.length!==4)return false;
 if(s.playerOrder!==undefined&&(!Array.isArray(s.playerOrder)||s.playerOrder.length!==4||new Set(s.playerOrder).size!==4||!s.playerOrder.every(i=>Number.isInteger(i)&&i>=0&&i<4)))return false;
 if(s.annualBudgetPending!==undefined&&(typeof s.annualBudgetPending!=='boolean'||s.annualBudgetPending&&!s.roundPending))return false;
 const all=s.players.flatMap(p=>p.assets);if(new Set(all).size!==all.length)return false;
 for(const [i,p] of s.players.entries()){if(p.role!==i||!TOKENS.every(k=>Number.isInteger(p.tokens[k])&&p.tokens[k]>=0)||!Array.isArray(p.assets)||!p.assets.every(id=>cardById(id))||!Array.isArray(p.completedMissions)||!Array.isArray(p.missionDeck)||!Array.isArray(p.acquisitions)||!Array.isArray(p.trades)||!p.effects||!['active','reward','done'].includes(p.missionStatus))return false;const ids=[...p.missionDeck,...p.completedMissions,...(p.missionStatus==='active'&&p.mission?[p.mission]:[])];if(new Set(ids).size!==ids.length||!ids.every(id=>MISSIONS.some(m=>m.id===id&&m.color===ROLES[i].cat)))return false;}
 if(!Array.isArray(s.queue)||!Array.isArray(s.sharing)||!Array.isArray(s.log)||!Array.isArray(s.events)||!Array.isArray(s.notes)||s.notes.length!==3||!s.notes.every(n=>typeof n==='string'))return false;
 if(!s.sharing.every(x=>[x.a,x.b].every(i=>Number.isInteger(i)&&i>=0&&i<4)&&x.a!==x.b&&Number.isInteger(x.until)))return false;
 for(const group of ['news','historic']){const d=s.decks[group],ids=[...d.draw,...d.discard];if(ids.length!==10||new Set(ids).size!==10||!ids.every(id=>EVENT_CARDS.some(c=>c.id===id&&c.group===group)))return false;}
 for(const n of [s.notice,...s.queue].filter(Boolean)){if(!['info','choice','next-mission'].includes(n.type)||!Number.isInteger(n.actor)||n.actor<0||n.actor>3)return false;if(n.type!=='next-mission'&&!effectById(n.cardId))return false;}
 return true;
 }catch{return false;}}
