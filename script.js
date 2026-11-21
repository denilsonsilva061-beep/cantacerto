const songs = [
 {id:"demo-es",title:"Prática em espanhol",artist:"Exercício original",lang:"es",langName:"Espanhol",emoji:"🌺",cover:"pink",video:"",lyrics:"Hola, ¿cómo estás?\\nHoy vamos a cantar\\nLa música nos hace soñar\\nCanta conmigo una vez más"},
 {id:"demo-pt",title:"Prática em português",artist:"Exercício original",lang:"pt",langName:"Português",emoji:"🌞",cover:"blue",video:"",lyrics:"Hoje eu vou cantar\\nDeixo a música me levar\\nCada palavra vou tentar\\nE uma nova nota alcançar"},
 {id:"demo-en",title:"Practice in English",artist:"Original exercise",lang:"en",langName:"Inglês",emoji:"🌈",cover:"",video:"",lyrics:"Hello, how are you?\\nLet's sing a song today\\nListen to the melody\\nAnd let the music play"}
];
const $ = id => document.getElementById(id);
let currentSong=null, recognition=null, recognizedWords=[], expectedWords=[], isListening=false;
const langCodes={pt:"pt-BR",es:"es-ES",en:"en-US"};
function renderSongs(){
 const q=$("searchInput").value.toLowerCase(), l=$("languageFilter").value;
 const filtered=songs.filter(s=>(l==="all"||s.lang===l)&&(`${s.title} ${s.artist}`).toLowerCase().includes(q));
 $("songGrid").innerHTML=filtered.length?filtered.map(s=>`<article class="song-card"><div class="cover ${s.cover}">${s.emoji}</div><div class="song-info"><strong>${escapeHtml(s.title)}</strong><small>${escapeHtml(s.artist)}</small><div class="song-tags"><span>${s.langName}</span><span>Treino</span></div></div><button class="play-song" data-song="${s.id}" aria-label="Selecionar ${escapeHtml(s.title)}">▶</button></article>`).join(""):`<div class="empty-state">Nenhuma música encontrada. Você pode adicionar um vídeo do YouTube acima.</div>`;
 document.querySelectorAll("[data-song]").forEach(b=>b.addEventListener("click",()=>selectSong(songs.find(s=>s.id===b.dataset.song))));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function extractYouTubeId(url){try{const u=new URL(url);if(u.hostname.includes("youtu.be"))return u.pathname.slice(1);if(u.hostname.includes("youtube.com"))return u.searchParams.get("v")||u.pathname.split("/").filter(Boolean).pop();}catch(e){}return null;}
function selectSong(song,videoId=null){
 stopRecognition();currentSong={...song,videoId:videoId||song.video};expectedWords=tokenize(song.lyrics);recognizedWords=[];
 $("practiceTitle").textContent=song.title;$("practiceSubtitle").textContent=`${song.artist} • ${song.langName}`;
 $("songLanguage").textContent=song.langName;$("playerStatus").textContent=currentSong.videoId?"Vídeo carregado":"Exercício de letra — adicione um vídeo para ouvir";
 $("videoFrame").innerHTML=currentSong.videoId?`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(currentSong.videoId)}?enablejsapi=1&rel=0" title="Player do YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`:`<div class="video-placeholder"><span>▶</span><strong>Exercício de demonstração</strong><small>Cole um link do YouTube para carregar o vídeo.</small></div>`;
 renderLyrics();updateMetrics();$("scoreResult").hidden=true;$("practice").classList.add("visible");$("practice").scrollIntoView({behavior:"smooth"});
}
function tokenize(text){return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[¿¡?!.,;:]/g,"").split(/\s+/).filter(Boolean);}
function renderLyrics(){
 const words=currentSong.lyrics.split(/(\s+)/);let index=0;
 $("lyricsBox").innerHTML=words.map(w=>{if(!w.trim())return w.replace(/\n/g,"<br>");const safe=escapeHtml(w);const i=index++;return `<span class="lyric-word" data-index="${i}">${safe}</span>`;}).join("");
}
function updateMetrics(){
 const total=recognizedWords.length, correct=recognizedWords.filter(w=>w.correct).length;
 $("wordCount").textContent=total;$("accuracy").textContent=total?Math.round(correct/total*100)+"%":"—";
 $("pitchStatus").textContent="Não avaliada";$("transcript").textContent=recognizedWords.length?recognizedWords.map(w=>w.word).join(" "):"O que o navegador reconhecer aparecerá aqui.";
}
function compareTranscript(text){
 const incoming=tokenize(text);if(!incoming.length)return;
 const start=recognizedWords.length;
 incoming.forEach((word,i)=>{const expected=expectedWords[start+i]||"";const correct=expected===word;recognizedWords.push({word,expected,correct});});
 const spans=[...$("lyricsBox").querySelectorAll(".lyric-word")];
 incoming.forEach((word,i)=>{const span=spans[start+i];if(span)span.classList.add(expectedWords[start+i]===word?"correct":"wrong");});
 updateMetrics();$("finishButton").disabled=false;
}
function startRecognition(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){$("micStatus").textContent="Reconhecimento não disponível neste navegador";$("transcript").textContent="Tente abrir no Chrome atualizado. O reconhecimento de voz varia conforme o navegador e o aparelho.";return;}
 recognition=new SR();recognition.lang=langCodes[currentSong.lang]||"pt-BR";recognition.continuous=true;recognition.interimResults=false;
 recognition.onstart=()=>{isListening=true;$("micStatus").textContent="Estou ouvindo você cantar";$("micDot").classList.add("active");$("micButton").classList.add("listening");$("micButton").innerHTML="■ Parar de cantar";};
 recognition.onresult=e=>{let text="";for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)text+=e.results[i][0].transcript+" ";if(text)compareTranscript(text);};
 recognition.onerror=e=>{$("micStatus").textContent=e.error==="not-allowed"?"Permissão do microfone negada":"Falha no reconhecimento: "+e.error;stopRecognition();};
 recognition.onend=()=>{if(isListening){try{recognition.start();}catch(e){}}};
 try{recognition.start();}catch(e){$("micStatus").textContent="Não foi possível iniciar o microfone.";}
}
function stopRecognition(){isListening=false;if(recognition){recognition.onend=null;try{recognition.stop();}catch(e){}recognition=null;}$("micDot").classList.remove("active");$("micButton").classList.remove("listening");$("micButton").innerHTML="🎙️ Começar a cantar";if(currentSong)$("micStatus").textContent="Microfone desligado";}
$("micButton").addEventListener("click",()=>{if(!currentSong){alert("Escolha uma música primeiro.");return;}if(isListening)stopRecognition();else startRecognition();});
$("finishButton").addEventListener("click",()=>{
 stopRecognition();const correct=recognizedWords.filter(w=>w.correct).length;const wrong=recognizedWords.length-correct;
 const score=recognizedWords.length?Math.round(correct/Math.max(expectedWords.length,recognizedWords.length)*100):0;
 $("finalScore").textContent=Math.min(100,score);$("correctWords").textContent=correct;$("wrongWords").textContent=wrong;$("totalWords").textContent=recognizedWords.length;
 $("resultMessage").textContent=score>=90?"Excelente! Você mandou muito bem!":score>=70?"Muito bom! Continue praticando.":score>=40?"Bom começo! Tente mais uma vez.":"Não desanime: cada tentativa ajuda a melhorar.";
 $("scoreResult").hidden=false;$("scoreResult").scrollIntoView({behavior:"smooth"});
});
$("tryAgain").addEventListener("click",()=>{if(currentSong)selectSong(currentSong,currentSong.videoId);});
$("backCatalog").addEventListener("click",()=>$("catalogo").scrollIntoView({behavior:"smooth"}));
$("searchInput").addEventListener("input",renderSongs);$("languageFilter").addEventListener("change",renderSongs);
$("loadYoutube").addEventListener("click",()=>{
 const id=extractYouTubeId($("youtubeUrl").value.trim());if(!id){alert("Cole um link válido de vídeo do YouTube.");return;}
 const custom={id:"youtube-"+id,title:"Vídeo do YouTube",artist:"Vídeo adicionado por você",lang:"pt",langName:"Português",emoji:"▶️",cover:"pink",video:id,lyrics:"Adicione sua própria letra autorizada aqui para usar a comparação de palavras."};
 selectSong(custom,id);
});
$("modeSelect").addEventListener("change",e=>{if(e.target.value==="instrumental")alert("Para usar o modo instrumental, selecione no YouTube uma versão instrumental autorizada e cole o link dela.");});
renderSongs();
