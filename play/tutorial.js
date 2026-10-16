import {createGame,roll,endTurn,resolveChoice,getChoices,CARDS} from './game.js';
import {colorText,escapeText} from './color-text.js';

export {renderTutorialGuide} from './tutorial-guide.js';
import {renderTutorialIllustration} from './tutorial-guide.js';

export const tutorialLessons=[
 {id:'overview',intro:true,title:'人材を集めて、量子の未来をつくる',text:'Quantum Questは、4つの勢力が量子技術の開発を競うゲームです。計算・セキュリティ・社会のルール・医療。どの分野を伸ばすかを選びながら、アセットを増やしていきます。',tip:'量子の専門知識は不要です。まずは4つの説明を読み、その後、実際の盤面で練習しましょう。'},
 {id:'welcome',intro:true,title:'あなたの役割と、最初の持ち物',text:'1人が1つの勢力を担当します。その役割を示すのが「ロールカード」です。最初の持ち物が違うので、4人はそれぞれ異なる出発点から開発を始めます。'},
 {id:'assets',intro:true,title:'アセットは「支払うもの」と「得るもの」を読む',text:'アセットは、量子技術や、それを支える制度を表すカードです。「開発する」とは、人材トークンを払って、共通の開発プールから自分のシートへカードを移すことです。'},
 {id:'cards',intro:true,title:'5種類のカードが、それぞれの場面で登場',text:'ずっと手元に置くカードもあれば、特定のタイミングで引くカードもあります。すべての効果を暗記する必要はありません。まずは「いつ使う、何のカードか」を押さえましょう。',tip:'ここからは実際に操作します。分からなくなったら、いつでも「カード・用語を確認」で読み返せます。'},
 {id:'roll',title:'まず振る。収入は全員がチェック',text:'手番とは、1人が行動する番のことです。最初にサイコロを2個振り、全員のアセットの「ダイス」と合計を比べます。出目が合うカードの持ち主が、人材を受け取ります。',instruction:'「サイコロを振る」を押しましょう。今回は合計8。青のイーグル・アイの持ち物に注目してください。',result:'イーグル・アイが量子エンジニア1個と量子官僚1個を獲得。あなたはまだアセットがないため、収入はありません。',takeaway:'自分の番に振っても、自分だけが人材をもらえるわけではありません。アセットを持つことが、収入につながります。'},
 {id:'build',title:'人材を払って、最初のアセットを開発',text:'手番では、サイコロの後にアセットを開発できます。今回はコスト2の「量子ドット」を手に入れ、次に収入を得られる状態をつくります。',instruction:'「量子ドットを選ぶ」→ カード詳細の「開発してシートへ」を押してください。黄色の人材の代わりに、量子タレント2個を払います。',tip:'通常プレイでは必要な人材があれば続けて開発できます。開発を見送って、人材を次の手番まで貯めてもかまいません。',result:'量子ドットが自分のシートに載りました。量子タレントは3個から1個に減りました。',takeaway:'開発コストを払うのは、手に入れるときの1回だけです。その後は、該当する出目のたびに収入が生まれます。'},
 {id:'income',title:'他の人の手番でも、自分に収入',text:'アセットの効果は、手に入れた後のサイコロから働きます。次の人が振るサイコロで、さきほど開発した量子ドットを使ってみましょう。',instruction:'「次の人の手番を見る」を押してください。イーグル・アイが合計2を出します。あなたの量子タレントの数に注目しましょう。',result:'量子ドットから量子タレント2個を獲得。所持数は1個から3個になりました。',takeaway:'誰の手番でも、自分のカードに書かれた合計なら収入があります。増えた人材は、次の開発に使えます。'},
 {id:'historic',title:'1年の終わりに、社会全体の出来事',text:'4人が1回ずつ行動すると、1ラウンド＝1年です。その終わりに「Historic Day」を1枚引きます。今回は全員に、アセットを交換できる機会が訪れます。',instruction:'「残りの手番を進める」を押しましょう。「量子衛星ネットワーク」の効果を読み、量子ドットを赤の量子鍵配送ネットワーク（QKD）と交換してください。',tip:'選択中は「盤面を見て考える」で持ち物を確認できます。今回は練習のため交換しますが、このイベントでは交換しない選択もできます。',result:'量子ドットをQKDと交換。その後、黄色の年次予算を1個受け取り、2042年になりました。',takeaway:'順番は「Historic Day → 年次予算 → 次の年」。交換や喪失は、今後の収入を得られる出目や人材の色も変えます。'},
 {id:'news',title:'合計7は、よい知らせ・悪い知らせ',text:'サイコロの合計が7なら「7カード」を引きます。今回はGood Newsの「天才の登場！」。任意の人材を2個得られます。Bad Newsで人材やアセットを失うこともあります。',instruction:'サイコロを振り、カードを確認したら、量子官僚1個と量子医師1個の組み合わせを選んでください。',tip:'7カードは原則として引いた人が対象です。任意の人材は青・赤・緑・黄から選び、量子タレントは選べません。',result:'量子官僚1個と量子医師1個を獲得。年次予算の分と合わせ、量子医師は2個になりました。',takeaway:'次に緑のアセットを開発したいので、緑の人材を選びました。黄色2個は、この後の交換に使います。'},
 {id:'exchange',title:'足りない色は、交換で用意する',text:'次に開発する「量子人権委員」には、緑の人材が2個必要です。今は緑が1個。余っている黄色2個を、人材プールで緑1個に交換してそろえましょう。',instruction:'交換を開き、「渡す人材＝量子医師」「受け取る人材＝量子官僚」にして交換してください。',tip:'人材プールでは同色2個を別色1個に交換します。量子タレントは使えません。他のプレイヤーとの交渉は別の仕組みで、相手の承認が必要です。',result:'量子医師2個を払い、量子官僚1個を獲得。緑の人材が2個そろいました。',takeaway:'人材の合計数は減りますが、欲しいアセットを開発できる色に変えられます。量子タレントを温存する方法にもなります。'},
 {id:'mission',title:'秘密の課題を達成すると、報酬',text:'ミッションは自分だけが読む課題カードです。今回は「コスト2のアセットを2枚持つ」が課題。すでにQKDを持っているので、量子人権委員を開発すると達成できます。',instruction:'「量子人権委員を選ぶ」→「開発してシートへ」を押しましょう。先ほどそろえた緑の人材2個を使います。',tip:'ミッションの内容は他の人には見えません。達成すると報酬を受け取り、自分のロールと同色の次の1枚を引きます。',result:'ミッション達成！ 以後、コスト2のアセットから得る人材が2倍になります。次のミッションも配られました。',takeaway:'ミッションは開発方針の手がかりになります。カードを増やすだけでなく、課題と報酬も見ながら選んでみましょう。'},
 {id:'reflection',title:'選んだ未来を、話してみよう',text:'練習では、人材を集め、開発し、出来事に対応し、ミッションを達成しました。通常プレイでは、どのアセットを開発するかを自分で決めます。最後はアセット数を比べ、選択の理由や社会への影響を振り返ります。',tip:'このメモは練習中だけのものです。通常プレイでは振り返りのメモを保存できます。'}
];

function fixedRollSeed(total){
 for(let seed=1;seed<100000;seed++){
  let x=seed;const next=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;x>>>=0;return 1+Math.floor(x/4294967296*6);};
  if(next()+next()===total)return seed;
 }throw new Error('Tutorial dice seed missing');
}
const seeds=Object.fromEntries([2,4,7,8].map(total=>[total,fixedRollSeed(total)]));
function chooseDeck(s,group,id){const deck=s.decks[group],all=[...deck.draw,...deck.discard];deck.draw=[id];deck.discard=all.filter(x=>x!==id);}
export function createTutorial(){
 const game=createGame({mode:'solo',human:3,seed:8701});
 const p=game.players[3];p.mission='mission_yellow_3';p.missionDeck=['mission_yellow_1','mission_yellow_2'];
 // Keep the initial deal log consistent with the explicit practice mission.
 game.log=game.log.filter(l=>l.type!=='mission');
 return {game,step:0,done:true,started:false,selectedId:null,reflection:'',tradeBaseline:0};
}
export const tutorialLesson=t=>tutorialLessons[t.step];
export function nextTutorial(t){
 if(!t.done||t.step>=tutorialLessons.length-1)return false;
 t.step++;t.done=false;t.started=false;t.selectedId=null;
 const id=tutorialLesson(t).id,s=t.game;
 if(id==='roll')s.seed=seeds[8];
 if(id==='historic')chooseDeck(s,'historic','hd_2044_quantum_satellite_network');
 if(id==='news'){s.seed=seeds[7];chooseDeck(s,'news','gn_talent_recruitment');}
 if(id==='exchange')t.tradeBaseline=s.log.filter(l=>l.type==='trade').length;
 if(tutorialLesson(t).intro||id==='reflection')t.done=true;
 return true;
}
export function previousTutorial(t){
 if(!tutorialLesson(t).intro||t.step===0)return false;
 t.step--;t.done=true;t.started=false;return true;
}
export function performTutorialScene(t){
 if(t.started||t.done||t.game.notice)return false;
 const s=t.game,id=tutorialLesson(t).id;
 if(id==='income'){endTurn(s);s.seed=seeds[2];roll(s);t.started=true;t.done=true;return true;}
 if(id==='historic'){
  // Finish the remaining two turns using the ordinary turn, dice, and annual rules.
  endTurn(s);s.seed=seeds[4];roll(s);endTurn(s);s.seed=seeds[4];roll(s);endTurn(s);t.started=true;return true;
 }return false;
}
export function updateTutorial(t){
 const s=t.game,id=tutorialLesson(t).id;
 // The other three players decline the optional satellite exchange in this lesson.
 while(id==='historic'&&s.notice?.type==='choice'&&s.notice.actor!==3){
  const skip=getChoices(s).find(o=>o.data.skip);if(!skip)break;resolveChoice(s,skip.id);
 }
 if(id==='roll'&&s.rollNumber===1&&s.phase==='action'&&!s.notice)t.done=true;
 if(id==='build'&&s.players[3].assets.includes('dot'))t.done=true;
 if(id==='historic'&&s.round===2&&!s.notice)t.done=true;
 if(id==='news'&&s.events.some(e=>e.cardId==='gn_talent_recruitment')&&!s.notice)t.done=true;
 if(id==='exchange'&&s.log.filter(l=>l.type==='trade').length>t.tradeBaseline)t.done=true;
 if(id==='mission'&&s.players[3].completedMissions.includes('mission_yellow_3')&&!s.notice)t.done=true;
}
export function tutorialAllows(t,action,id,choice){
 const lesson=tutorialLesson(t).id;
 if(action==='roll')return !t.done&&['roll','news'].includes(lesson);
 if(action==='build')return !t.done&&id===(lesson==='build'?'dot':lesson==='mission'?'rights':null);
 if(['exchange','do-exchange'].includes(action))return !t.done&&lesson==='exchange';
 if(action==='resolve-event'){
  const d=getChoices(t.game).find(o=>o.id===String(choice))?.data;
  if(lesson==='historic')return d?.give==='dot'&&d?.get==='qkd';
  if(lesson==='news')return d?.tokens?.green===1&&d?.tokens?.yellow===1;
  return true;
 }
 return !['new','confirm-new','end','negotiate','offer-trade','accept-trade','finish','confirm-finish'].includes(action);
}
export function tutorialHint(t){const l=tutorialLesson(t);return colorText(l.instruction||l.text);}
export function renderTutorialCoach(t){
 const l=tutorialLesson(t),last=t.step===tutorialLessons.length-1;
 let action='';
 if(!t.done){
  if(['roll','news'].includes(l.id)&&!t.game.notice)action='<button class="primary" data-action="roll">サイコロを振る</button>';
  if(['build','mission'].includes(l.id)){const card=CARDS.find(c=>c.id===(l.id==='build'?'dot':'rights'));action='<button class="primary" data-action="select-card" data-id="'+card.id+'">'+escapeText(card.name)+'を選ぶ →</button>';}
  if(['income','historic'].includes(l.id)&&!t.started)action='<button class="primary" data-action="tutorial-scene">'+(l.id==='income'?'次の人の手番を見る':'残りの手番を進める')+'</button>';
  if(l.id==='exchange')action='<button class="primary" data-action="exchange">人材プールの交換を開く</button>';
 }
 if(t.done&&!last)action='<button class="primary" data-action="tutorial-next">'+(l.id==='cards'?'盤面で練習をはじめる':l.intro?'次の説明へ':'次のレッスンへ')+' →</button>';
 if(last)action='<button class="primary" data-action="tutorial-exit">ホームで通常プレイを選ぶ →</button><button class="outline" data-action="tutorial-restart">もう一度練習する</button>';
 const chapter=l.intro?'ゲームを知る':last?'振り返る':'操作してみる';
 const brief=l.intro?'<p class="lesson-board-intro">下には練習用の盤面があります。今は持ち物を眺めるだけで大丈夫です。</p>':'';
 return `<section class="tutorial-coach ${l.intro?'tutorial-introduction':''}" aria-labelledby="tutorial-title"><div class="tutorial-coach-top"><span>${chapter} · ${t.step+1} / ${tutorialLessons.length}</span><button class="text-btn" data-action="tutorial-exit">練習を終了</button></div><progress value="${t.step+(t.done?1:0)}" max="${tutorialLessons.length}" aria-label="レッスンの進捗"></progress><h2 id="tutorial-title">${colorText(l.title)}</h2><p class="tutorial-explanation">${colorText(l.text)}</p>${renderTutorialIllustration(l.id)}${!t.done&&l.instruction?`<div class="tutorial-instruction"><strong>やってみよう</strong><p>${tutorialHint(t)}</p></div>`:''}${l.tip?`<p class="tutorial-tip">${colorText(l.tip)}</p>`:''}${t.done&&l.result?`<div class="tutorial-result" role="status"><strong>何が起きた？</strong><p>${colorText(l.result)}</p>${l.takeaway?`<p class="tutorial-takeaway">${colorText(l.takeaway)}</p>`:''}</div>`:''}${last?`<label for="tutorial-note">競争・協力・人材の配分で、気になったことは？<textarea id="tutorial-note" placeholder="例：どんな分野を優先したい？ その恩恵は誰に届くだろう？">${escapeText(t.reflection)}</textarea></label>`:''}<div class="tutorial-coach-actions">${l.intro&&t.step>0?'<button class="outline" data-action="tutorial-prev">← 前の説明へ</button>':''}${action}<button class="text-btn" data-action="tutorial-guide">カード・用語を確認 ↗</button></div>${brief}</section>`;
}
