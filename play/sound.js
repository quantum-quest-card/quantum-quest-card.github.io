// Original, short synthesized effects. No audio downloads or game-state mutation.
export const SOUND_KEY='quantum-quest-sound-v1';
export const SOUND_NAMES={flip:'カードをめくる',good:'Good News',bad:'Bad News',mission:'ミッション達成',build:'アセット開発',dice:'サイコロ',income:'人材の獲得',exchange:'交換',year:'新しい年',event:'Historic Day',finish:'ゲーム終了'};
const tone=(freq,at,duration,gain=.11,type='sine',endFreq=freq)=>({kind:'tone',freq,endFreq,at,duration,gain,type});
const noise=(at,duration,gain=.13,freq=1600)=>({kind:'noise',at,duration,gain,freq});
export const SOUND_SCORES={
 flip:[noise(0,.095,.2,1900),noise(.075,.09,.12,950),tone(180,.13,.055,.06,'triangle',95)],
 good:[tone(523.25,0,.23),tone(659.25,.12,.25),tone(783.99,.24,.36,.09)],
 bad:[tone(261.63,0,.27,.12,'triangle',246.94),tone(196,.15,.34,.11,'triangle',174.61)],
 mission:[tone(523.25,0,.25),tone(659.25,.1,.25),tone(783.99,.2,.27),tone(1046.5,.34,.55,.1),tone(659.25,.34,.5,.06)],
 build:[noise(0,.045,.15,600),tone(150,0,.09,.13,'triangle',80),tone(659.25,.09,.22,.075)],
 dice:[noise(0,.04,.22,750),noise(.075,.035,.18,1100),noise(.15,.04,.2,650),noise(.24,.045,.15,950),tone(210,.32,.06,.08,'triangle',130)],
 income:[tone(880,0,.14,.07),tone(1174.66,.075,.19,.055)],
 exchange:[tone(420,0,.12,.09,'triangle'),tone(560,.1,.16,.075,'triangle')],
 year:[tone(392,0,.35,.09),tone(523.25,.16,.4,.08),tone(783.99,.16,.4,.04)],
 event:[tone(392,0,.35,.07),tone(587.33,.1,.38,.06)],
 finish:[tone(392,0,.32,.08),tone(523.25,.15,.38,.08),tone(659.25,.3,.5,.07),tone(783.99,.3,.5,.06)]
};
export function soundPreferences(storage){try{const s=JSON.parse(storage?.getItem(SOUND_KEY));return {enabled:typeof s?.enabled==='boolean'?s.enabled:true,volume:typeof s?.volume==='number'&&Number.isFinite(s.volume)?Math.max(0,Math.min(1,s.volume)):.45};}catch{return {enabled:true,volume:.45};}}
export function createSoundPlayer({storage,AudioContextClass,isHidden=()=>false}={}){
 let prefs=soundPreferences(storage),context=null,master=null,activated=false,ready=null,epoch=0,current=null,failed=false;
 const available=typeof AudioContextClass==='function';
 const persist=()=>{try{storage?.setItem(SOUND_KEY,JSON.stringify(prefs));}catch{}};
 const setGain=()=>{if(master&&context){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(prefs.enabled?prefs.volume:0,context.currentTime,.015);}};
 function stop(){epoch++;if(!current||!context)return;const group=current;current=null;const now=context.currentTime;try{group.bus.gain.cancelScheduledValues(now);group.bus.gain.setTargetAtTime(0,now,.006);}catch{}for(const source of group.sources)try{source.stop(now+.025);}catch{}}
 function unlock(){
  activated=true;if(!available||isHidden()||!prefs.enabled||prefs.volume===0)return Promise.resolve(false);
  try{
   if(!context||context.state==='closed'){context=new AudioContextClass();master=context.createGain();master.gain.value=prefs.volume;master.connect(context.destination);}
   if(context.state==='running'){failed=false;return Promise.resolve(true);}
   if(!ready)ready=Promise.resolve(context.resume()).then(()=>{failed=context.state!=='running';return !failed;}).catch(()=>{failed=true;return false;}).finally(()=>{ready=null;});
   return ready;
  }catch{failed=true;return Promise.resolve(false);}
 }
 function voice(spec,start,bus,group){
  let source,filter=null;const envelope=context.createGain();
  if(spec.kind==='noise'){
   const buffer=context.createBuffer(1,Math.max(1,Math.ceil(spec.duration*context.sampleRate)),context.sampleRate),data=buffer.getChannelData(0);let seed=1234567,previous=0;
   for(let i=0;i<data.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;previous=previous*.35+((seed>>>0)/2147483648-1)*.65;data[i]=previous;}
   source=context.createBufferSource();source.buffer=buffer;filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=spec.freq;filter.Q.value=.65;source.connect(filter);filter.connect(envelope);
  }else{source=context.createOscillator();source.type=spec.type;source.frequency.setValueAtTime(spec.freq,start);source.frequency.exponentialRampToValueAtTime(spec.endFreq,start+spec.duration);source.connect(envelope);}
  envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(spec.gain,start+.008);envelope.gain.exponentialRampToValueAtTime(.0001,start+spec.duration);envelope.gain.setValueAtTime(0,start+spec.duration+.006);envelope.connect(bus);
  group.sources.add(source);source.onended=()=>{source.disconnect();filter?.disconnect();envelope.disconnect();group.sources.delete(source);if(!group.sources.size){bus.disconnect();if(current===group)current=null;}};
  source.start(start);source.stop(start+spec.duration+.012);
 }
 async function play(...kinds){
  if(!activated||!available||!prefs.enabled||prefs.volume===0||isHidden())return false;
  const sequence=kinds.flat().filter(k=>Object.hasOwn(SOUND_SCORES,k)).slice(0,3);if(!sequence.length)return false;
  stop();const ticket=epoch;if(!await unlock()||ticket!==epoch||!prefs.enabled||prefs.volume===0||isHidden())return false;
  try{setGain();const bus=context.createGain();bus.gain.value=1;bus.connect(master);const group={bus,sources:new Set()};current=group;let at=context.currentTime+.015;
   for(const kind of sequence){const score=SOUND_SCORES[kind];for(const spec of score)voice(spec,at+spec.at,bus,group);at+=Math.max(...score.map(n=>n.at+n.duration))+.035;}
   return true;
  }catch{failed=true;stop();return false;}
 }
 return {unlock,play,stop,get settings(){return {...prefs};},get available(){return available;},get failed(){return failed;},setEnabled(value){prefs.enabled=!!value;persist();if(!prefs.enabled)stop();setGain();},setVolume(value){const n=Number(value);if(!Number.isFinite(n))return;prefs.volume=Math.max(0,Math.min(1,n));persist();if(!prefs.volume)stop();setGain();}};
}
