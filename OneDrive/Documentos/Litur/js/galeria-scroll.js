/* ==========================================================================
   galeria-scroll.js — FOTOS DE FUNDO QUE TROCAM CONFORME A ROLAGEM
   Cada seção da página tem uma foto real da Litur (definida em config.js,
   na lista "fundo"). Ao rolar:
   1) a seção que está no MEIO da tela decide qual foto aparece;
   2) a troca é um "fade" (uma foto some enquanto a outra aparece);
   3) enquanto você rola DENTRO da seção, a foto faz um zoom lento
      (efeito "Ken Burns"): rolou para baixo, aproxima; para cima, afasta.
   Atrás da foto nítida fica a mesma foto desfocada, preenchendo a tela.
   ========================================================================== */

(function () { // Função isolada: as variáveis não vazam para os outros arquivos
  const palco = document.getElementById('palco'); // Camada fixa de fundo (no index.html)
  const lista = (window.LITUR && LITUR.fundo) || []; // Lista de fotos vinda do config.js (ou vazia, se faltar)
  const secoes = [...document.querySelectorAll('main section[id]')]; // Todas as seções que têm id
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches; // A pessoa pediu menos movimento?

  // --- 1) CRIA OS "SLIDES" ------------------------------------------------------
  const slides = {}; // Guarda cada slide pelo nome do arquivo (assim a mesma foto não é criada duas vezes)
  const fotoDaSecao = {}; // Guarda qual slide pertence a cada seção (id da seção → slide)
  lista.forEach(f => { // Para cada foto do config...
    if (!slides[f.arquivo]) { // ...se esse arquivo ainda não virou slide:
      const slide = document.createElement('div'); // Cria o contêiner do slide
      slide.className = 'slide'; // Classe usada pelo CSS (começa invisível)
      slide.innerHTML = // Duas imagens: o fundo borrado e a foto nítida
        `<img class="slide-fundo" src="${f.arquivo}" alt="" decoding="async">` + // Fundo desfocado (alt vazio: é decorativo)
        `<img class="slide-foto" src="${f.arquivo}" alt="${f.alt}" decoding="async">`; // Foto principal, nítida
      palco.appendChild(slide); // Coloca o slide dentro do palco
      slides[f.arquivo] = slide; // Registra o slide
    } // Fim do if
    fotoDaSecao[f.secao] = slides[f.arquivo]; // Liga a seção ao slide
  }); // Fim da criação

  // --- 2) DESCOBRE A SEÇÃO ATUAL E O PROGRESSO DENTRO DELA ------------------------
  function progressoDaPagina() { // Quanto da página inteira já foi rolado (0 a 1) — usado pela barra de "estrada"
    const maximo = document.documentElement.scrollHeight - innerHeight; // Altura rolável
    return maximo > 0 ? Math.min(1, Math.max(0, scrollY / maximo)) : 0; // Limita entre 0 e 1
  } // Fim de progressoDaPagina

  let ativo = null; // Slide que está visível agora
  let ultimaSecao = secoes[0]; // Última seção que tinha foto (se a seção atual não tiver, mantém a anterior)

  function atualizar() { // Roda a cada rolagem (no máximo uma vez por quadro de tela)
    const meio = innerHeight / 2; // Linha imaginária no meio da tela
    const atual = secoes.find(s => { const r = s.getBoundingClientRect(); return r.top <= meio && r.bottom > meio; }) || ultimaSecao; // Seção que cruza o meio da tela
    if (fotoDaSecao[atual.id]) ultimaSecao = atual; // Só troca de referência se essa seção tiver foto
    const slide = fotoDaSecao[ultimaSecao.id]; // Slide que deveria aparecer
    if (slide && slide !== ativo) { // Mudou de foto?
      if (ativo) ativo.classList.remove('ativo'); // Esconde a anterior (o CSS faz o fade-out)
      slide.classList.add('ativo'); // Mostra a nova (fade-in)
      ativo = slide; // Atualiza a referência
    } // Fim do if
    if (ativo && !reduzir) { // Zoom ligado ao scroll (desligado em "reduzir movimento")
      const r = ultimaSecao.getBoundingClientRect(); // Posição da seção na tela
      const local = Math.min(1, Math.max(0, (meio - r.top) / r.height)); // 0 = seção acabou de chegar ao meio; 1 = está saindo
      ativo.style.setProperty('--p', local.toFixed(3)); // Entrega o valor ao CSS, que calcula o zoom
    } // Fim do if
  } // Fim de atualizar

  let agendado = false; // Evita calcular mais de uma vez por quadro
  function aoRolar() { // Chamado a cada evento de scroll/resize
    if (agendado) return; // Já tem cálculo marcado: ignora
    agendado = true; // Marca
    requestAnimationFrame(() => { atualizar(); agendado = false; }); // Calcula no próximo quadro da tela e libera
  } // Fim de aoRolar
  addEventListener('scroll', aoRolar, { passive: true }); // Ouve a rolagem (passive = não atrapalha a fluidez)
  addEventListener('resize', aoRolar); // Ouve o redimensionamento da janela
  atualizar(); // Mostra a foto certa logo ao abrir (mesmo se a página abrir no meio, ex.: link #frota)

  window.LiturFundo = { progresso: progressoDaPagina }; // Expõe o progresso para o app.js (barra de estrada)
})(); // Executa imediatamente
