import {coloredLabel,colorText} from './color-text.js';
export const TOKEN_ART={
 blue:{src:'./assets/tokens/blue.png',name:'量子エンジニア',en:'QUANTUM ENGINEER',use:'量子コンピュータの開発に使う人材'},
 red:{src:'./assets/tokens/red.png',name:'量子セキュリティ専門家',en:'QUANTUM SECURITY EXPERT',use:'量子セキュリティの開発に使う人材'},
 green:{src:'./assets/tokens/green.png',name:'量子官僚',en:'QUANTUM BUREAUCRAT',use:'量子ガバナンスの開発に使う人材'},
 yellow:{src:'./assets/tokens/yellow.png',name:'量子医師',en:'QUANTUM DOCTOR',use:'量子医療の開発に使う人材'},
 wild:{src:'./assets/tokens/wild.png',name:'万能トークン',en:'QUANTUM TALENT',use:'開発に必要な、どの色の人材にも使えます'}
};

// Decorative images sit inside a labelled token/count or beside a text label.
export function tokenArt(k){const t=TOKEN_ART[k];return t?`<img class="token-art" src="${t.src}" data-token-art="${k}" alt="" aria-hidden="true" draggable="false">`:'';}
export function tokenName(k){return TOKEN_ART[k]?.name||'人材';}
export function renderTokenGuide(){return `<p class="modal-copy">各色の人材を集め、同じ色のアセットを開発します。紫の万能トークンは、どの色にも使えます。</p><div class="token-guide-grid">${Object.entries(TOKEN_ART).map(([k,t])=>`<div class="token-guide-item">${tokenArt(k)}<h3>${coloredLabel(k,t.name)}</h3><small>${t.en}</small><p>${colorText(t.use)}</p></div>`).join('')}</div>`;}
