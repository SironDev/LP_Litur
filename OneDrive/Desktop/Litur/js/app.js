/* ==========================================================================
   app.js — MONTA AS SEÇÕES, MENU, FORMULÁRIO E WHATSAPP
   Lê os dados de config.js (window.LITUR) e cria o conteúdo na página.
   ========================================================================== */

(function () { // Função isolada
  const D = window.LITUR; // Atalho para os dados da empresa
  const $ = (sel, raiz = document) => raiz.querySelector(sel); // Atalho: $('#id') = document.querySelector('#id')
  const form = $('#form'); // O formulário de orçamento

  // --- ANALYTICS --------------------------------------------------------------
  // Só envia se o Google Analytics 4 (gtag) estiver instalado E com consentimento. Nenhum ID foi inventado.
  window.liturEvento = function (nome, dados) { // Função global para registrar eventos
    if (typeof window.gtag === 'function') window.gtag('event', nome, dados || {}); // Envia ao GA4 se existir
    else console.debug('[evento]', nome, dados || ''); // Sem GA4: só mostra no console (útil para testar)
  }; // Fim de liturEvento
  document.addEventListener('click', e => { // Um único "ouvinte" para todos os cliques da página
    const alvo = e.target.closest('[data-evento]'); // Procura o elemento clicado (ou um pai) com data-evento
    if (alvo) liturEvento(alvo.dataset.evento); // Se achou, registra o evento com o nome escrito no HTML
  }); // Fim do ouvinte

  // --- LINKS VINDOS DO CONFIG ---------------------------------------------------
  $('#link-google').href = D.google; // Link das avaliações do Google
  $('#link-insta').href = D.instagram; // Link do Instagram
  $('#ano').textContent = new Date().getFullYear(); // Ano atual no rodapé
  if (/^\d{12,13}$/.test(D.whatsapp)) { // Se o número oficial já foi configurado...
    const zap = $('.zap-flutuante'); // ...pega o botão verde flutuante
    zap.href = `https://wa.me/${D.whatsapp}`; // ...e faz ele abrir a conversa direto
    zap.target = '_blank'; zap.rel = 'noopener'; // ...em uma nova aba, com segurança
  } // Sem número: o botão leva ao formulário de orçamento

  // --- SERVIÇOS -------------------------------------------------------------------
  const listaServicos = $('#lista-servicos'); // Onde os serviços entram
  const selTipo = form.elements.tipo; // <select> "Tipo de viagem" do formulário
  D.servicos.forEach((s, i) => { // Para cada serviço do config...
    const item = document.createElement('article'); // Cria um <article>
    item.className = 'servico'; // Classe para o CSS
    item.innerHTML = // Conteúdo do serviço (número, título, texto, benefícios, botão)
      `<span class="servico-num">0${i + 1}</span>` + // Número 01, 02... (estilo placa)
      `<div><h3>${s.titulo}</h3><p>${s.texto}</p>` + // Título e descrição
      `<ul>${s.beneficios.map(b => `<li>${b}</li>`).join('')}</ul></div>` + // Lista de benefícios
      `<a class="btn btn-pequeno btn-vazado" href="#orcamento" data-tipo="${s.tipo}">Orçar ${s.titulo.toLowerCase()}</a>`; // Botão que pré-preenche o formulário
    listaServicos.appendChild(item); // Coloca na página
    selTipo.add(new Option(s.titulo, s.tipo)); // Adiciona a opção no <select> do formulário
  }); // Fim dos serviços
  listaServicos.addEventListener('click', e => { // Clique em algum botão "Orçar"
    const b = e.target.closest('[data-tipo]'); // Botão clicado
    if (!b) return; // Clicou em outro lugar: ignora
    selTipo.value = b.dataset.tipo; // Preenche o "Tipo de viagem" no formulário
    destacar(selTipo); // Pisca o campo para a pessoa perceber
    liturEvento('selecao_tipo_viagem', { tipo: b.dataset.tipo }); // Analytics
  }); // Fim do clique

  // --- FROTA -------------------------------------------------------------------------
  const abas = $('#abas-frota'); // Contêiner das abas
  const selVeiculo = form.elements.veiculo; // <select> "Veículo desejado"
  let veiculoAtual = D.frota[0]; // Veículo selecionado (começa no primeiro)
  D.frota.forEach((v, i) => { // Para cada veículo...
    const aba = document.createElement('button'); // Cria um botão
    aba.className = 'aba'; // Classe CSS
    aba.type = 'button'; // Não envia formulário
    aba.setAttribute('role', 'tab'); // Acessibilidade: é uma aba
    aba.textContent = v.nome; // Texto da aba
    aba.addEventListener('click', () => selecionarVeiculo(i)); // Clique troca o veículo
    abas.appendChild(aba); // Coloca na página
    selVeiculo.add(new Option(v.nome)); // Opção no formulário
  }); // Fim da frota

  function selecionarVeiculo(i) { // Mostra o veículo de índice i
    veiculoAtual = D.frota[i]; // Atualiza o selecionado
    [...abas.children].forEach((a, j) => a.setAttribute('aria-selected', i === j)); // Marca a aba ativa (o CSS usa aria-selected)
    $('#frota-nome').textContent = veiculoAtual.nome; // Nome
    $('#frota-desc').textContent = veiculoAtual.desc; // Descrição
    $('#frota-ficha').innerHTML = Object.entries(veiculoAtual.ficha) // Monta a ficha técnica
      .map(([k, val]) => `<dt>${k}</dt><dd class="${val.startsWith('[') ? 'pendente' : ''}">${val}</dd>`) // Valores "[...]" ganham o estilo de pendente
      .join(''); // Junta tudo em um texto HTML
    window.LiturCarrossel && LiturCarrossel.mostrar(veiculoAtual.fotos, veiculoAtual.nome); // Mostra as fotos do interior deste veículo
    liturEvento('visualizacao_veiculo', { veiculo: veiculoAtual.nome }); // Analytics
  } // Fim de selecionarVeiculo
  selecionarVeiculo(0); // Começa no primeiro veículo

  $('#orcar-veiculo').addEventListener('click', () => { // Botão "Orçar este veículo"
    selVeiculo.value = veiculoAtual.nome; // Leva o veículo para o formulário
    destacar(selVeiculo); // Pisca o campo
    liturEvento('selecao_veiculo', { veiculo: veiculoAtual.nome }); // Analytics
  }); // Fim do clique

  // --- DOCUMENTOS -----------------------------------------------------------------
  $('#lista-docs').innerHTML = D.documentos.map(d => // Cria um cartão para cada documento
    d.arquivo // Se tem arquivo...
      ? `<a class="doc" href="${d.arquivo}" target="_blank" rel="noopener" data-evento="acesso_certificado"><b>${d.sigla}</b><span>${d.nome}</span><small>${d.validade ? 'Válido até ' + d.validade : 'Ver documento ↗'}</small></a>` // ...vira link para abrir
      : `<div class="doc"><b>${d.sigla}</b><span>${d.nome}</span><small class="pendente">[documento a anexar]</small></div>` // ...senão, aparece como pendente
  ).join(''); // Junta tudo

  // --- FAQ ---------------------------------------------------------------------------
  $('#lista-faq').innerHTML = D.faq.map(([p, r]) => // Para cada pergunta/resposta
    `<details><summary>${p}</summary><p class="${r.startsWith('[') ? 'pendente' : ''}">${r}</p></details>` // <details> abre/fecha sozinho, sem JavaScript, e funciona no teclado
  ).join(''); // Junta tudo

  // --- MENU DO CELULAR -----------------------------------------------------------
  const botaoMenu = $('.menu-botao'); // Botão "Menu"
  botaoMenu.addEventListener('click', () => { // Ao clicar...
    const aberto = botaoMenu.getAttribute('aria-expanded') === 'true'; // ...descobre se está aberto
    botaoMenu.setAttribute('aria-expanded', !aberto); // ...inverte (o CSS mostra/esconde a lista)
  }); // Fim do clique
  $('#menu').addEventListener('click', e => { if (e.target.tagName === 'A') botaoMenu.setAttribute('aria-expanded', 'false'); }); // Clicou num link: fecha o menu

  // --- PROGRESSO, ETAPA ATUAL E APARECIMENTO DAS SEÇÕES -----------------------------
  const barra = $('#progresso'), miniOnibus = $('#mini-onibus'); // Barra de estrada e mini ônibus
  const etapas = [...document.querySelectorAll('.etapa')]; // Todas as etapas
  let agendado = false; // Evita recalcular mais de uma vez por quadro
  addEventListener('scroll', () => { // Ao rolar...
    if (agendado) return; // ...se já tem cálculo agendado, ignora
    agendado = true; // ...marca como agendado
    requestAnimationFrame(() => { // ...e calcula no próximo quadro (uma vez só)
      const p = window.LiturFundo ? LiturFundo.progresso() : 0; // Progresso 0..1 da página inteira
      barra.style.transform = `scaleX(${p})`; // Enche a barra (scaleX é mais leve que mudar a largura)
      miniOnibus.style.left = `${p * 100}%`; // Move o mini ônibus
      document.body.classList.toggle('rolou', scrollY > 40); // Classe para o cabeçalho ficar mais sólido
      agendado = false; // Libera o próximo cálculo
    }); // Fim do requestAnimationFrame
  }, { passive: true }); // passive = promete não bloquear o scroll (mais fluido)

  const observador = new IntersectionObserver(entradas => entradas.forEach(e => { // Observa quando cada etapa entra na tela
    if (!e.isIntersecting) return; // Saiu: ignora
    e.target.classList.add('visivel'); // Ativa a animação de entrada (CSS)
    const n = etapas.indexOf(e.target) + 1; // Número da etapa
    $('#etapa-num').textContent = String(n).padStart(2, '0'); // Ex.: "03"
    $('#etapa-nome').textContent = e.target.dataset.nome; // Ex.: "Serviços"
    document.querySelectorAll('#menu a').forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id)); // Destaca o item do menu
    if (e.target.id === 'frota') liturEvento('visualizacao_frota'); // Analytics
  }), { rootMargin: '-45% 0px -45% 0px' }); // Considera "visível" quando a seção cruza o meio da tela
  etapas.forEach(s => observador.observe(s)); // Começa a observar todas

  // --- FORMULÁRIO → WHATSAPP -----------------------------------------------------------
  let comecou = false; // Para registrar "início do preenchimento" uma só vez
  form.addEventListener('input', () => { if (!comecou) { comecou = true; liturEvento('inicio_formulario'); } }); // Primeira digitação

  const telefone = form.elements.whatsapp; // Campo do WhatsApp do cliente
  telefone.addEventListener('input', () => { // Máscara: (75) 9 9999-9999 enquanto digita
    const d = telefone.value.replace(/\D/g, '').slice(0, 11); // Só dígitos, no máximo 11
    telefone.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` // Formato completo
      : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d; // Formatos parciais
  }); // Fim da máscara

  const hoje = new Date().toISOString().slice(0, 10); // Data de hoje no formato AAAA-MM-DD
  form.elements.ida.min = hoje; // Não deixa escolher ida no passado
  form.elements.ida.addEventListener('change', () => { form.elements.volta.min = form.elements.ida.value; }); // Retorno não pode ser antes da ida

  function validar() { // Confere os campos e devolve a lista de erros
    const f = form.elements, erros = []; // Atalho e lista de erros
    form.querySelectorAll('.erro').forEach(el => el.classList.remove('erro')); // Limpa erros antigos
    const marcar = (campo, msg) => { campo.classList.add('erro'); campo.setAttribute('aria-invalid', 'true'); erros.push({ campo, msg }); }; // Marca um campo como errado
    if (f.nome.value.trim().length < 2) marcar(f.nome, 'Informe seu nome.'); // Nome curto demais
    if (f.whatsapp.value.replace(/\D/g, '').length < 10) marcar(f.whatsapp, 'Informe um WhatsApp com DDD.'); // Telefone incompleto
    if (!f.tipo.value) marcar(f.tipo, 'Escolha o tipo de viagem.'); // Tipo não escolhido
    const pax = Number(f.passageiros.value); // Converte passageiros para número
    if (!Number.isInteger(pax) || pax < 1 || pax > 999) marcar(f.passageiros, 'Informe a quantidade de passageiros.'); // Fora da faixa
    if (!f.origem.value.trim()) marcar(f.origem, 'Informe a origem.'); // Origem vazia
    if (!f.destino.value.trim()) marcar(f.destino, 'Informe o destino.'); // Destino vazio
    if (!f.ida.value || f.ida.value < hoje) marcar(f.ida, 'Escolha uma data de ida a partir de hoje.'); // Data inválida
    if (f.volta.value && f.volta.value < f.ida.value) marcar(f.volta, 'O retorno deve ser depois da ida.'); // Retorno antes da ida
    form.querySelectorAll('input,select,textarea').forEach(c => { if (!c.classList.contains('erro')) c.removeAttribute('aria-invalid'); }); // Remove a marcação dos campos certos
    return erros; // Devolve os erros
  } // Fim de validar

  const dataBR = v => v ? v.split('-').reverse().join('/') : '—'; // Converte 2026-12-31 em 31/12/2026

  form.addEventListener('submit', e => { // Ao enviar...
    e.preventDefault(); // ...impede o recarregamento da página
    const status = $('#form-status'); // Área de mensagens
    const erros = validar(); // Valida
    if (erros.length) { // Tem erro?
      status.className = 'status-erro'; // Estilo de erro
      status.textContent = erros[0].msg + (erros.length > 1 ? ` (+${erros.length - 1} campo(s) a revisar)` : ''); // Mostra o primeiro erro
      erros[0].campo.focus(); // Leva o cursor ao primeiro campo errado
      return; // Para aqui
    } // Fim do if
    const f = form.elements; // Atalho
    const linhas = [ // Monta a mensagem, linha por linha
      'Olá! Gostaria de solicitar um orçamento com a Litur Turismo.', '', // Saudação e linha em branco
      `*Nome:* ${f.nome.value.trim()}`, // Nome
      `*WhatsApp:* ${f.whatsapp.value}`, // Telefone
      `*Tipo de viagem:* ${f.tipo.selectedOptions[0].text}`, // Tipo (texto visível da opção)
      `*Veículo:* ${f.veiculo.value || 'A definir'}`, // Veículo
      `*Passageiros:* ${f.passageiros.value}`, // Passageiros
      `*Contratação:* ${f.contratacao.value || '—'}`, // Contratação
      `*Origem:* ${f.origem.value.trim()}`, // Origem
      `*Destino:* ${f.destino.value.trim()}`, // Destino
      `*Ida:* ${dataBR(f.ida.value)} ${f.hora_ida.value ? 'às ' + f.hora_ida.value : ''}`, // Data e hora de ida
      `*Retorno:* ${dataBR(f.volta.value)} ${f.hora_volta.value ? 'às ' + f.hora_volta.value : ''}`, // Data e hora de volta
      `*Observações:* ${f.obs.value.trim() || '—'}`, '', // Observações
      'Aguardo retorno. Obrigado!' // Despedida
    ]; // Fim das linhas
    const mensagem = linhas.join('\n'); // Junta com quebras de linha

    if (!/^\d{12,13}$/.test(D.whatsapp)) { // Número oficial ainda não configurado em config.js
      status.className = 'status-erro'; // Estilo de aviso
      status.textContent = 'Demonstração: o número oficial do WhatsApp ainda não foi configurado (js/config.js). A mensagem foi gerada e aparece no console do navegador.'; // Explica sem fingir que enviou
      console.info('Mensagem que seria enviada:\n\n' + mensagem); // Mostra a mensagem para conferência
      liturEvento('envio_formulario_sem_numero'); // Analytics
      return; // Para aqui
    } // Fim do if

    const janela = window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener'); // Abre o WhatsApp com a mensagem pronta
    liturEvento('generate_lead', { tipo: f.tipo.value, veiculo: f.veiculo.value }); // Analytics: lead gerado
    status.className = janela ? 'status-ok' : 'status-erro'; // Só mostra sucesso se a janela realmente abriu
    status.innerHTML = janela // Mensagem conforme o resultado
      ? 'WhatsApp aberto com seu pedido. É só tocar em <b>Enviar</b> por lá.' // Abriu
      : `O navegador bloqueou a nova janela. <a href="https://wa.me/${D.whatsapp}?text=${encodeURIComponent(mensagem)}" target="_blank" rel="noopener">Toque aqui para abrir o WhatsApp</a>.`; // Bloqueado: oferece link manual
  }); // Fim do submit

  function destacar(campo) { // Pisca um campo do formulário (feedback visual)
    campo.classList.remove('destaque'); // Remove a classe (para reiniciar a animação)
    void campo.offsetWidth; // Truque: força o navegador a "perceber" a remoção
    campo.classList.add('destaque'); // Adiciona de novo: a animação roda
  } // Fim de destacar
})(); // Executa imediatamente
