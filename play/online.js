import {escapeText as e,coloredLabel} from './color-text.js';
import {ROLES} from './game.js';
import {tokenName} from './token-art.js';

export function createOnlineClient({onRoom,onError=()=>{},onStatus=()=>{},fetcher=(...args)=>fetch(...args),setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let roomId=null,revision=0,timer=null,generation=0,busy=false;
 async function request(path,body){
  const controller=new AbortController(),timeout=setTimer(()=>controller.abort(),12000);
  try{
   const r=await fetcher(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal});
   let data;try{data=await r.json();}catch{throw new Error('接続を確認できません。ページを再読み込みしてログインしてください。');}
   if(!r.ok){const error=new Error(data.error||'卓を更新できませんでした。');error.status=r.status;error.signIn=data.signIn;throw error;}
   return data;
  }finally{clearTimer(timeout);}
 }
 function accept(room,g){if(g!==generation||room.id!==roomId||room.revision<revision)return;revision=room.revision;onStatus('connected');onRoom(room);}
 function schedule(g,delay=1500){clearTimer(timer);if(g===generation&&roomId)timer=setTimer(()=>sync(g),delay);}
 async function sync(g=generation){
  if(g!==generation||!roomId)return;
  if(busy){schedule(g);return;}
  try{accept(await request('/api/rooms/'+roomId,{type:'sync'}),g);schedule(g);}
  catch(error){if(g!==generation)return;onStatus('disconnected');onError(error,false);schedule(g,4000);}
 }
 return {
  async connect(id){this.disconnect();roomId=id;const g=generation;onStatus('connecting');try{accept(await request('/api/rooms/'+id),g);schedule(g);}catch(error){if(g===generation){onStatus('disconnected');onError(error,true);schedule(g,4000);}throw error;}},
  async create(input){this.disconnect();const g=generation;onStatus('connecting');const room=await request('/api/rooms',input);if(g!==generation)return;roomId=room.id;accept(room,g);schedule(g);return room;},
  async command(type,values={}){
   if(!roomId||busy)throw new Error('接続または前の操作の完了をお待ちください。');
   busy=true;const g=generation,id=roomId;
   const command={...values,type,revision,actionId:crypto.randomUUID()};
   try{accept(await request('/api/rooms/'+id,command),g);}
   catch(error){if(g===generation){if(!error.status)onStatus('disconnected');onError(error,true);try{accept(await request('/api/rooms/'+id),g);}catch{onStatus('disconnected');}}throw error;}
   finally{if(g===generation){busy=false;schedule(g);}}
  },
  retry(){return sync();},
  disconnect(){generation++;clearTimer(timer);roomId=null;revision=0;busy=false;},
 };
}
const rounds=(value,id)=>`<label class="online-field">ゲームの長さ<select id="${id}">${[8,10,12].map(n=>`<option value="${n}" ${value===n?'selected':''}>${n}ラウンド${n===10?'（標準）':''} · 2041–${2040+n}年</option>`).join('')}</select></label>`;
export function renderOnlineSetup({maxRounds=10,recent=[],name=''}={}){
 return `<div class="intro online-setup"><button class="text-btn" data-action="mode" data-id="solo">← シングルプレイへ</button><div class="eyebrow">PLAY AT THE SAME TABLE</div><h1>ひとつの卓で、<br>未来を選ぼう。</h1><p class="online-lead">招待URLで集まり、同じ盤面を見ながらプレイ。<br>空けておく席と、CPUに任せる席を選べます。</p><section class="online-create"><div><h2>マルチプレイの卓をつくる</h2><p>あなたがホストです。ロールはゲーム開始時にランダムで配られます。</p></div><label class="online-field">あなたの表示名<input id="online-name" maxlength="24" autocomplete="nickname" value="${e(name)}" placeholder="ほかの参加者に表示する名前"></label><div class="online-seat-config">${[1,2,3].map(i=>`<label class="online-field"><span>席 ${i+1}</span><select id="online-seat-${i}"><option value="human">人間を招待</option><option value="cpu">CPUに任せる</option></select></label>`).join('')}</div>${rounds(maxRounds,'online-rounds')}<button class="primary" data-action="online-create">卓をつくって招待する →</button><p class="microcopy">参加にはログインが必要です。限定共有中は、招待する方にもアプリへのアクセス許可が必要です。</p></section>${recent.length?`<section class="online-recent"><h2>このブラウザで開いた卓</h2>${recent.map(r=>`<button class="outline" data-action="online-open" data-id="${e(r.id)}">${e(r.name||'参加した卓')} <span>再接続 →</span></button>`).join('')}</section>`:''}<p class="online-footnote">ひとりで遊ぶ場合はシングルプレイへ。進行中のシングルプレイとチュートリアルは別々に保持されます。</p></div>`;
}
export function roomInviteURL(id,origin=location.origin){return origin+'/?room='+encodeURIComponent(id);}
export function renderLobby(room,{name='',invite='',busy=false}={}){
 const complete=room.seats.every(s=>s.kind==='cpu'||s.occupied);
 return `<div class="intro online-lobby"><div class="online-heading"><div><div class="eyebrow">YOUR QUANTUM TABLE</div><h1>${room.seat<0?'招待された卓に参加':'プレイヤーを待っています'}</h1></div><button class="outline small" data-action="online-home">ホームへ</button></div><p class="online-lead">ホスト：${e(room.seats[0].name)} · ${room.maxRounds}ラウンド<br>${room.phase==='lobby'?'人間の席が埋まったら、ホストがゲームを開始します。':'この卓はすでに開始しているため、新たな参加はできません。'}</p><div class="online-invite"><label for="invite-url">参加用URL</label><div><input id="invite-url" readonly value="${e(invite)}"><button class="outline" data-action="online-copy">コピー</button></div><small>このURLを参加者に共有してください。限定共有中はアプリのアクセス許可も必要です。</small></div>${room.seat<0&&room.phase==='lobby'?`<label class="online-field">あなたの表示名<input id="online-join-name" maxlength="24" value="${e(name)}" autocomplete="nickname" placeholder="名前を入力して席を選んでください"></label>`:''}<div class="lobby-seats">${room.seats.map(s=>`<article class="lobby-seat ${s.isYou?'is-you':''}"><span>SEAT ${s.index+1}${s.index===0?' · HOST':''}</span><div class="lobby-avatar">${s.kind==='cpu'?'◇':s.occupied?'●':'＋'}</div><h2>${s.kind==='cpu'?'CPU':s.occupied?e(s.name):'参加待ち'}${s.isYou?' <small>あなた</small>':''}</h2>${room.isHost&&s.index>0&&!s.occupied&&room.phase==='lobby'?`<label class="sr-only" for="lobby-kind-${s.index}">席${s.index+1}の参加方法</label><select id="lobby-kind-${s.index}" data-online-seat="${s.index}" ${busy?'disabled':''}><option value="human" ${s.kind==='human'?'selected':''}>人間を招待</option><option value="cpu" ${s.kind==='cpu'?'selected':''}>CPUに任せる</option></select>`:`<p>${s.kind==='cpu'?'自動でプレイ':s.occupied?'参加しています':'URLから参加できます'}</p>`}${room.seat<0&&room.phase==='lobby'&&s.kind==='human'&&!s.occupied?`<button class="primary" data-action="online-join" data-id="${s.index}" ${busy?'disabled':''}>この席に参加 →</button>`:''}</article>`).join('')}</div><div class="online-lobby-actions">${room.isHost&&room.phase==='lobby'?`${rounds(room.maxRounds,'lobby-rounds')}<button class="primary" data-action="online-start" ${busy||!complete?'disabled':''}>${complete?'ロールを配ってゲーム開始 →':'参加者がそろうのを待っています'}</button>`:room.seat>0&&room.phase==='lobby'?'<p>ホストの開始操作を待っています。</p><button class="text-btn" data-action="online-leave">席を離れる</button>':''}</div></div>`;
}
export function renderOnlineBar(room,{status='connected',busy=false}={}){
 const names=room.game?.playerNames||{},t=room.pendingTrade;
 return `<div class="online-game-bar"><div><span class="online-indicator ${status==='connected'?'':'offline'}"></span><strong>マルチプレイ</strong><span>${busy?'操作を送信中…':status==='connected'?'卓と同期中':status==='connecting'?'接続中…':'接続が途切れています · 再接続中'}</span></div><div><button class="text-btn" data-action="online-copy">招待URLをコピー</button><button class="text-btn" data-action="online-retry">再接続</button><button class="text-btn" data-action="online-home">ホームへ</button></div></div>${t?`<section class="online-trade"><strong>${e(names[t.fromRole])} → ${e(names[t.toRole])} の交換提案</strong><p>${e(names[t.fromRole])} が ${coloredLabel(t.from,tokenName(t.from)+' 1個')} を渡し、${coloredLabel(t.to,tokenName(t.to)+' 1個')} を受け取ります。</p>${room.role===t.toRole?`<button class="primary" data-action="online-accept" ${busy?'disabled':''}>交換に同意する</button><button class="outline" data-action="online-decline" ${busy?'disabled':''}>見送る</button>`:room.role===t.fromRole?`<span>相手の返答を待っています。</span><button class="outline" data-action="online-cancel-trade" ${busy?'disabled':''}>提案を取り消す</button>`:'<span>交渉の結果を待っています。</span>'}<small>90秒以内に返答がない場合、提案は取り消されます。</small></section>`:''}`;
}
