/* ==========================================================================
   carrossel.js — FOTOS DO INTERIOR DO VEÍCULO (passar com setas / dedo)
   As fotos de cada veículo ficam em config.js → frota → fotos.
   Para ANEXAR uma foto nova: coloque o arquivo em img/fotos/ e adicione
   { arquivo: 'img/fotos/nome.webp', legenda: 'texto' } na lista do veículo.

   Como funciona: as fotos ficam lado a lado numa "trilha" que rola na
   horizontal com "scroll-snap" (o CSS faz cada foto encaixar no lugar).
   Isso dá o arrastar com o dedo no celular de graça, sem biblioteca.
   As setas e as miniaturas só mandam a trilha rolar até a foto certa.
   ========================================================================== */

(function () { // Função isolada
  const trilho = document.getElementById('carrossel-trilho'); // Faixa horizontal com as fotos
  const contador = document.getElementById('carrossel-contador'); // Texto "1 / 3"
  const legenda = document.getElementById('carrossel-legenda'); // Legenda da foto atual
  const miniaturas = document.getElementById('carrossel-miniaturas'); // Faixa de miniaturas
  const anterior = document.querySelector('.carrossel-seta.anterior'); // Botão ‹
  const proxima = document.querySelector('.carrossel-seta.proxima'); // Botão ›
  const janela = document.getElementById('ampliar'); // <dialog> que mostra a foto em tela cheia
  const fotoGrande = janela.querySelector('img'); // Imagem dentro da janela
  if (!trilho) return; // Sem carrossel na página: não faz nada

  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches; // Pessoa prefere menos movimento?
  const comportamento = reduzir ? 'auto' : 'smooth'; // Rolagem suave, ou instantânea se "reduzir movimento"
  let fotos = []; // Fotos do veículo atual
  let atual = 0; // Índice da foto que está aparecendo

  // --- MONTA O CARROSSEL PARA UM VEÍCULO --------------------------------------
  function mostrar(lista, nomeVeiculo) { // Chamada pelo app.js ao trocar de aba
    fotos = lista || []; // Guarda as fotos (ou lista vazia)
    atual = 0; // Volta para a primeira
    if (!fotos.length) { // Veículo ainda sem fotos anexadas:
      trilho.innerHTML = `<div class="carrossel-slide carrossel-vazio"><p><b>Fotos do interior do ${nomeVeiculo} ainda não anexadas.</b><br>Adicione em <code>js/config.js</code> → frota → fotos.</p></div>`; // Mostra um espaço reservado honesto
      miniaturas.innerHTML = ''; // Sem miniaturas
      atualizarInterface(); // Atualiza contador e setas
      return; // Para aqui
    } // Fim do if
    trilho.innerHTML = fotos.map((f, i) => // Uma "slide" por foto
      `<div class="carrossel-slide"><img src="${f.arquivo}" alt="${f.legenda}" ${i ? 'loading="lazy"' : ''} decoding="async"></div>` // A 1ª carrega já; as outras só quando chegarem perto
    ).join(''); // Junta tudo
    miniaturas.innerHTML = fotos.map((f, i) => // Uma miniatura por foto
      `<button type="button" aria-label="Ver foto ${i + 1}: ${f.legenda}" data-i="${i}"><img src="${f.arquivo}" alt="" loading="lazy"></button>` // Botão com a imagem pequena
    ).join(''); // Junta tudo
    trilho.scrollLeft = 0; // Garante que começa na primeira foto
    atualizarInterface(); // Atualiza contador, legenda e setas
  } // Fim de mostrar

  // --- IR PARA UMA FOTO --------------------------------------------------------
  function irPara(i) { // Rola a trilha até a foto i
    i = Math.max(0, Math.min(fotos.length - 1, i)); // Não deixa passar do começo nem do fim
    trilho.scrollTo({ left: i * trilho.clientWidth, behavior: comportamento }); // Cada foto tem a largura da trilha
    window.liturEvento && liturEvento('carrossel_foto', { foto: i + 1 }); // Analytics
  } // Fim de irPara

  // --- ATUALIZA CONTADOR, LEGENDA, MINIATURAS E SETAS --------------------------
  function atualizarInterface() { // Chamada sempre que a foto atual muda
    const total = fotos.length; // Quantidade de fotos
    contador.textContent = total ? `${atual + 1} / ${total}` : '0 / 0'; // Ex.: "2 / 3"
    legenda.textContent = total ? fotos[atual].legenda : ''; // Legenda da foto atual
    anterior.disabled = atual <= 0; // Na primeira foto, a seta ‹ fica desativada
    proxima.disabled = atual >= total - 1; // Na última, a seta › fica desativada
    [...miniaturas.children].forEach((b, i) => b.setAttribute('aria-current', i === atual)); // Destaca a miniatura atual (o CSS usa aria-current)
  } // Fim de atualizarInterface

  let agendado = false; // Evita recalcular várias vezes por quadro
  trilho.addEventListener('scroll', () => { // Quando a trilha rola (por seta, miniatura ou dedo)...
    if (agendado) return; // ...se já tem cálculo marcado, ignora
    agendado = true; // ...marca
    requestAnimationFrame(() => { // ...e calcula no próximo quadro
      const i = Math.round(trilho.scrollLeft / trilho.clientWidth); // Qual foto está mais centralizada
      if (i !== atual) { atual = i; atualizarInterface(); } // Mudou? Atualiza a interface
      agendado = false; // Libera
    }); // Fim do requestAnimationFrame
  }, { passive: true }); // passive = não atrapalha a fluidez

  // --- CONTROLES -----------------------------------------------------------------
  anterior.addEventListener('click', () => irPara(atual - 1)); // Seta ‹: foto anterior
  proxima.addEventListener('click', () => irPara(atual + 1)); // Seta ›: próxima foto
  miniaturas.addEventListener('click', e => { // Clique numa miniatura
    const b = e.target.closest('[data-i]'); // Botão clicado
    if (b) irPara(Number(b.dataset.i)); // Vai para a foto correspondente
  }); // Fim do clique
  trilho.addEventListener('keydown', e => { // Teclado (a trilha recebe foco com TAB)
    if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(atual - 1); } // ← foto anterior
    if (e.key === 'ArrowRight') { e.preventDefault(); irPara(atual + 1); } // → próxima foto
  }); // Fim do keydown

  // --- AMPLIAR A FOTO (tela cheia) ---------------------------------------------
  trilho.addEventListener('click', e => { // Clique numa foto do carrossel
    const img = e.target.closest('img'); // Imagem clicada
    if (!img) return; // Clicou fora de uma imagem: ignora
    fotoGrande.src = img.src; fotoGrande.alt = img.alt; // Copia a foto para a janela
    janela.showModal(); // Abre a janela (o <dialog> já trata o ESC e o foco)
  }); // Fim do clique
  janela.addEventListener('click', e => { if (e.target === janela || e.target.closest('button')) janela.close(); }); // Fecha ao clicar fora da foto ou no botão "Fechar"
  addEventListener('resize', () => { trilho.scrollLeft = atual * trilho.clientWidth; }); // Redimensionou: mantém a mesma foto encaixada

  window.LiturCarrossel = { mostrar }; // Deixa "mostrar" disponível para o app.js
})(); // Executa imediatamente
