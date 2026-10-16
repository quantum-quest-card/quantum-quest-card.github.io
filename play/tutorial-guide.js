import {CARDS,CATEGORIES,ROLES,cardById} from './game.js';
import {colorText,coloredLabel,escapeText as esc} from './color-text.js';
import {tokenArt,tokenName} from './token-art.js';

const image=(src,alt,cls='')=>`<img class="${cls}" src="./assets/${src}" alt="${esc(alt)}" loading="lazy">`;
const coin=(color,n)=>`<span class="lesson-coin">${tokenArt(color)}${coloredLabel(color,(color==='wild'?'量子タレント':tokenName(color))+' ×'+n)}</span>`;

export function renderCardKinds(){
 const kinds=[
  ['ロール','開始時に1枚','あなたが担当する勢力です。最初の持ち物と、年次予算・ミッションの色が決まります。','phoenix.png','ロールカード：復活の不死鳥','portrait'],
  ['アセット','人材を払って開発','技術や制度を表すカードです。自分のシートに置き、サイコロの合計が合うたびに人材を得ます。','dot.png','アセットカード：量子ドット','portrait'],
  ['ミッション','自分だけの課題','自分のロールと同色のカードを引きます。課題を達成すると報酬を受け取り、次の1枚を引きます。未達成の内容は他の人には秘密です。','backs/mission-yellow.png','黄色のミッションカードの裏面','landscape'],
  ['7カード','サイコロの合計が7','Good NewsとBad Newsがあります。原則として引いた人に、よいこと・悪いことが起こります。「全員」と書かれた効果は全員が対象です。','backs/news.png','7カードの裏面','landscape'],
  ['Historic Day','全員の手番が終わったら','社会全体の出来事です。毎年ランダムに1枚引き、全員に影響します。各自の持ち物などによって、受ける影響が違うこともあります。','backs/historic.png','Historic Dayの裏面','landscape']
 ];
 return `<div class="lesson-card-kinds">${kinds.map(([name,when,text,src,alt,shape])=>`<article class="lesson-kind"><div class="lesson-kind-art ${shape}">${image(src,alt)}</div><div><small>${esc(when)}</small><h3>${esc(name)}</h3><p>${colorText(text)}</p></div></article>`).join('')}</div><details class="lesson-more"><summary>もう1種類：独占カード</summary><p>同じカテゴリのアセットを6枚すべて集めると、そのカテゴリを独占します。該当アセットからの収入が2倍になります。独占カードは、その効果を示す目印です。</p></details>`;
}

export function renderTurnGuide(){
 return `<div class="lesson-turn-guide"><h3>1人の手番では</h3><ol class="lesson-cycle"><li><b>1. サイコロを振る</b><span>全員のアセットを確認して収入。合計7なら7カード。</span></li><li><b>2. 開発・交換をする</b><span>人材を使ってアセットを開発。人材が足りなければ交換も。</span></li><li><b>3. 手番を渡す</b><span>開発しないで終えてもOK。使わなかった人材は持ち越します。</span></li></ol><p class="lesson-year">4人が1回ずつ行動すると1年（1ラウンド）。<br><strong>Historic Dayの効果 → 年次予算 → 次の年</strong>の順に進みます。</p></div>`;
}

function renderCategories(){
 const meanings={blue:'計算や通信を進める',red:'情報や社会を守る',green:'制度やルールを整える',yellow:'医療や健康に役立てる'};
 return `<div class="lesson-categories">${CATEGORIES.map(c=>`<div style="--lesson-color:${c.color}">${tokenArt(c.id)}<div><b>${coloredLabel(c.id,c.name)}</b><small>${esc(meanings[c.id])}</small><span>${coloredLabel(c.id,tokenName(c.id))}</span></div></div>`).join('')}</div>`;
}

export function renderAssetGuide(){
 const c=cardById('dot');
 return `<div class="lesson-asset"><figure>${image(c.art,c.name+'：上にコスト、下に出目と収入')}<figcaption>これから開発する「量子ドット」</figcaption></figure><div><dl class="lesson-card-reading"><div><dt><span>1</span>上の「コスト」＝開発時に払う人材</dt><dd>${coin(c.cat,c.cost)}<p>カードを手に入れるときに1回だけ払います。足りない分は量子タレントで補えます。</p></dd></div><div><dt><span>2</span>下の「ダイス」＝収入が出る合計</dt><dd><b class="lesson-dice">${c.dice.join('・')}</b><p>サイコロ2個の合計です。自分以外の人が振ったときも働きます。</p></dd></div><div><dt><span>3</span>その右の丸＝得られる人材</dt><dd>${Object.entries(c.yields).map(([k,n])=>coin(k,n)).join('')}<p>このカードは、開発には黄色を払い、収入では紫を得ます。コストと収入の色は別々に読みましょう。</p></dd></div></dl></div></div>${renderCategories()}<p class="tutorial-tip">4つの分野を「カテゴリ」と呼びます。自分のロールの色に限らず、どの色のアセットも開発できます。</p>`;
}

export function renderTutorialIllustration(id){
 if(id==='overview')return `<ol class="lesson-cycle lesson-economy"><li>${tokenArt('yellow')}<b>人材を集める</b><span>トークンは、開発を担う人材です。</span></li><li>${image('dot.png','量子ドットのアセットカード')}<b>アセットを開発</b><span>人材を払って、技術や制度のカードを手に入れます。</span></li><li>${image('sheet_asset.png','アセットを載せる自分のシート')}<b>収入を次の開発へ</b><span>持っているアセットが新たな人材をもたらします。</span></li></ol><div class="lesson-two-goals"><p><b>ゲームで目指すこと</b>終了時にアセットを最も多く持つこと。標準は2041〜2050年の10ラウンドです。</p><p><b>遊んだあとに考えること</b>競争や協力で、どんな社会ができたでしょうか。勝敗とともに、技術の恩恵やリスクを話し合います。</p></div><p class="tutorial-tip">誰かが11枚獲得するか、全${CARDS.length}枚が開発された場合は早く終了します。同数なら高コストのアセットの保有状況で順位を決めます。</p>`;
 if(id==='welcome')return `<div class="lesson-role"><figure>${image('phoenix.png','今回あなたが担当する復活の不死鳥のロールカード')}<figcaption>今回のあなたのロール</figcaption></figure><div><h3>${coloredLabel('yellow','復活の不死鳥')}からスタート</h3><p>シートは自分の持ち物を置く場所です。最初のアセットは0枚。代わりに量子タレントを3個持っています。</p><div class="lesson-starting-tokens">${coin('wild',3)}</div><p>紫の量子タレントは、開発するときにどの色の人材にも使えます。最初のカードを選ぶための、自由な人材です。</p><p>ほかの3勢力は、青・赤・緑のアセットを1枚ずつ持って始めます。画面上部では全員のシートと持ち物を見比べられます。</p><small>通常プレイではロールをランダムに配ります。この練習では役割・出目・出来事を固定し、順に体験します。</small></div></div>`;
 if(id==='assets')return renderAssetGuide();
 if(id==='cards')return renderCardKinds();
 if(id==='roll')return `<details class="lesson-more"><summary>手番と1年の流れを確認する</summary>${renderTurnGuide()}</details>`;
 if(id==='reflection')return `<div class="lesson-two-goals"><p><b>次は自分の判断で</b>人材を貯める？ 安いアセットを先に増やす？ ミッションを目指す？ ロールや出来事に合わせて試してみましょう。</p><p><b>問いは1つでなくてよい</b>開発が偏った分野は？ 競争と協力は誰の助けになった？ 人材や恩恵は公平に行き渡ったでしょうか。</p></div>`;
 return '';
}

export function renderTutorialGuide(){
 return `<div class="tutorial-guide"><p class="modal-copy">人材を使って、技術や制度を表すアセットを開発するゲームです。終了時のアセット数を競い、遊んだあとは、その社会について考えます。</p><details open><summary>カードの種類と、登場するタイミング</summary>${renderCardKinds()}</details><details><summary>アセットの読み方・4色の人材</summary>${renderAssetGuide()}</details><details><summary>手番・1年・ゲーム終了</summary>${renderTurnGuide()}<p>標準10ラウンド（2041〜2050年）。誰かが11アセットを獲得するか、全${CARDS.length}枚が開発されても終了します。最後はアセット数、同数なら高コストの保有状況を比べます。</p></details><details><summary>よく出てくる言葉</summary><dl><dt>開発プール</dt><dd>まだ誰も持っていないアセットが並ぶ共通の場所。同じアセットを複数の人で所有することはできません。</dd><dt>人材プール</dt><dd>人材を受け取ったり支払ったりする共通の場所。同色2個を別色1個に交換できます。量子タレントはこの交換に使えません。</dd><dt>年次予算</dt><dd>Historic Dayの処理後に、各自のロールと同色の人材を1個ずつ受け取ります。</dd><dt>任意の人材</dt><dd>青・赤・緑・黄から選びます。量子タレントは、獲得が明記されている効果で得られます。</dd><dt>交渉</dt><dd>他のプレイヤーと人材を交換する相談です。このデジタル版では1対1の交換を提案し、相手の承認で成立します。</dd></dl></details><p class="tutorial-tip">これは説明用の見本です。ここでカードを見ても、練習中の持ち物や手番は変わりません。</p></div>`;
}
