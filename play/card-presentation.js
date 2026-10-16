const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cardBack(group,color){return './assets/backs/'+(group==='mission'?'mission-'+color:['news','historic'].includes(group)?group:'general')+'.png';}
export function renderFlippableCard({src,title,group,color,portrait=false,reveal=false}){
 return `<button type="button" class="turnable-card ${portrait?'portrait':'landscape'} ${group==='domination'?'domination-card-flip':''} ${reveal?'reveal-card':''}" data-action="flip-card" aria-label="${esc(title)}。裏面を見る" aria-pressed="false" title="クリックでカードを裏返す"><span class="turnable-inner"><img class="turnable-front" src="${src}" alt="${esc(title)}" draggable="false"><img class="turnable-back" src="${cardBack(group,color)}" alt="" aria-hidden="true" draggable="false"></span></button>`;
}
