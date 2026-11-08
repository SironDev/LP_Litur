/* ==========================================================================
   config.js — TODOS OS DADOS DA EMPRESA EM UM SÓ LUGAR
   Para atualizar a página, normalmente você só precisa mexer AQUI.
   Regra do projeto: nada é inventado. O que não foi confirmado fica com
   "[ ]" ou com o campo vazio ('') — e a página mostra isso como pendente.
   ========================================================================== */

window.LITUR = { // Cria um objeto global chamado LITUR (window.X fica acessível em todos os outros arquivos .js)

  // --- CONTATO -------------------------------------------------------------
  whatsapp: '', // Número oficial do WhatsApp comercial: só dígitos, com DDI+DDD. Ex.: '5575999999999'. Vazio = formulário avisa que falta configurar
  instagram: 'https://www.instagram.com/liturturismoltda', // Perfil oficial (o @ aparece pintado no próprio ônibus do vídeo)
  google: 'https://www.google.com/maps/search/Litur+Turismo', // Link das avaliações no Google. Troque pelo link exato do Perfil da Empresa quando tiver
  siteAtual: 'https://www.litur.com.br', // Site atual (endereço visível na lataria do ônibus)

  // --- FOTOS DE FUNDO (trocam conforme a seção que está na tela) -----------
  // secao: id da <section> no index.html em que a foto aparece
  // Fonte: posts do Instagram oficial @liturturismoltda + quadro do vídeo real
  fundo: [ // Lista de fotos; a ordem não importa, o que vale é a "secao". A mesma foto pode aparecer em várias seções
    { secao: 'inicio', arquivo: 'img/fotos/onibus-gold-class.webp', alt: 'Ônibus double decker azul da Litur, linha Gold Class' }, // Abertura: o ônibus inteiro
    { secao: 'empresa', arquivo: 'img/fotos/onibus-dd-2908.webp', alt: 'Ônibus double decker 2908 da Litur estacionado' }, // Empresa: outro veículo da frota
    { secao: 'servicos', arquivo: 'img/fotos/onibus-estrada.webp', alt: 'Ônibus da Litur na estrada' }, // Serviços: o ônibus em viagem (quadro do vídeo)
    { secao: 'frota', arquivo: 'img/fotos/interior-dd-g8.webp', alt: 'Interior do ônibus DD G8 da Litur, poltronas com cinto de segurança' }, // Frota: por dentro
    { secao: 'confianca', arquivo: 'img/fotos/interior-poltronas.webp', alt: 'Corredor e poltronas do ônibus da Litur' }, // Confiança: conforto e segurança
    { secao: 'orcamento', arquivo: 'img/fotos/interior-ld.webp', alt: 'Interior do ônibus LD da Litur com capas de encosto amarelas' }, // Orçamento: convite a embarcar
    { secao: 'faq', arquivo: 'img/fotos/onibus-dd-2908.webp', alt: 'Ônibus double decker 2908 da Litur' }, // Dúvidas
    { secao: 'chegada', arquivo: 'img/fotos/onibus-gold-class.webp', alt: 'Ônibus da Litur Gold Class' } // Chegada: fecha a viagem com o mesmo ônibus da abertura
  ], // Fim das fotos de fundo

  // --- SERVIÇOS (cada item vira uma linha na seção "Serviços") -------------
  servicos: [ // Lista (array) de serviços; a ordem aqui é a ordem na tela
    { tipo: 'Excursão', titulo: 'Excursões', texto: 'Passeios, caravanas, grupos e viagens organizadas.', beneficios: ['Roteiros de curta e longa distância', 'Ideal para grupos e igrejas'] }, // tipo = valor que vai para o formulário
    { tipo: 'Evento', titulo: 'Eventos', texto: 'Casamentos, festas, shows, congressos e eventos em geral.', beneficios: ['Ida e volta organizadas', 'Convidados chegam juntos'] }, // Serviço de eventos
    { tipo: 'Escolar', titulo: 'Escolar', texto: 'Passeios escolares, viagens acadêmicas, formaturas e universidades.', beneficios: ['Viagens pedagógicas', 'Formaturas e congressos'] }, // Serviço escolar
    { tipo: 'Empresarial', titulo: 'Empresarial', texto: 'Fretamento para empresas, equipes, transfers e eventos corporativos.', beneficios: ['Transporte de equipes', 'Transfers e eventos corporativos'] } // Serviço empresarial
  ], // Fim dos serviços

  // --- FROTA (cada item vira uma aba com fotos, descrição e ficha) ----------
  // fotos: lista de fotos do interior que aparecem no carrossel.
  //   Para ANEXAR uma foto: salve o arquivo em img/fotos/ e acrescente { arquivo: 'img/fotos/nome.webp', legenda: '...' }.
  //   Lista vazia [] = o carrossel mostra "fotos ainda não anexadas".
  frota: [ // Lista de veículos
    { nome: 'Double Decker', fotos: [{ arquivo: 'img/fotos/interior-dd-g8.webp', legenda: 'Interior do DD G8 — poltronas com cinto de segurança' }, { arquivo: 'img/fotos/interior-poltronas.webp', legenda: 'Corredor e poltronas [veículo a confirmar]' }, { arquivo: 'img/fotos/onibus-dd-2908.webp', legenda: 'Double decker 2908 — vista externa' }, { arquivo: 'img/fotos/onibus-gold-class.webp', legenda: 'Double decker Gold Class — vista externa' }], desc: 'Ônibus de dois andares (DD G8, segundo post do Instagram oficial). Aparece no vídeo e nas fotos da frota.', ficha: { Capacidade: '[a confirmar]', Categoria: 'Leito Premium / Gold Class (inscrições na lataria)', Equipamentos: 'Internet / Wi-Fi a bordo (adesivo na lataria) · cintos de segurança (fotos internas) · demais: [a confirmar]' } }, // Dados vistos no vídeo e no Instagram + pendências
    { nome: 'Low Driver', fotos: [{ arquivo: 'img/fotos/interior-ld.webp', legenda: 'Interior do ônibus LD — capas de encosto amarelas da Litur' }], desc: 'Ônibus rodoviário de um andar ("nosso ônibus LD", segundo reel do Instagram oficial).', ficha: { Capacidade: '[a confirmar]', Categoria: '[a confirmar]', Equipamentos: '[a confirmar]' } }, // Existência confirmada pelo Instagram; detalhes pendentes
    { nome: 'Micro-ônibus', fotos: [], desc: 'Para grupos menores e trajetos curtos.', ficha: { Capacidade: '[a confirmar]', Categoria: '[a confirmar]', Equipamentos: '[a confirmar]' } } // Categoria citada no site antigo: confirmar
  ], // Fim da frota

  // --- DOCUMENTOS / CERTIFICADOS -------------------------------------------
  // arquivo: caminho de um PDF/imagem na pasta /documentos (ex.: 'documentos/antt.pdf'). Vazio = aparece como "documento a anexar"
  documentos: [ // Lista de documentos
    { sigla: 'ANTT', nome: 'Agência Nacional de Transportes Terrestres', arquivo: '', validade: '' }, // Registro para transporte interestadual
    { sigla: 'Cadastur', nome: 'Cadastro de Prestadores de Serviços Turísticos', arquivo: '', validade: '' }, // Cadastro do Ministério do Turismo
    { sigla: 'AGERBA', nome: 'Agência Estadual de Regulação (BA)', arquivo: '', validade: '' } // Regulação estadual da Bahia
  ], // Fim dos documentos

  // --- PERGUNTAS FREQUENTES ------------------------------------------------
  faq: [ // Lista de pares pergunta/resposta
    ['Como funciona o fretamento?', 'Você informa origem, destino, datas e número de passageiros. A Litur analisa a disponibilidade e envia a proposta pelo WhatsApp.'], // Resposta genérica, sem prometer prazos
    ['O orçamento tem custo?', '[A confirmar com a Litur]'], // Política comercial: não inventamos
    ['Quais veículos estão disponíveis?', 'Veja a seção Frota. A disponibilidade depende da data e do roteiro.'], // Resposta neutra
    ['Vocês fazem viagens interestaduais?', '[A confirmar com a Litur — depende do registro na ANTT]'], // Depende de documento
    ['Que informações preciso para pedir orçamento?', 'Origem, destino, datas, horários, número de passageiros e tipo de viagem — exatamente os campos do formulário.'], // Resposta baseada no formulário
    ['Como consulto a documentação da empresa?', 'Na seção Confiança, onde ficam os documentos e registros da Litur.'] // Aponta para a seção
  ] // Fim do FAQ
}; // Fim do objeto LITUR
