(() => {
  'use strict';
  const lessons = window.ANFX_LESSONS;
  const storageKey = 'anfx-lab-reading-v1';
  const $ = selector => document.querySelector(selector);
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let completed = new Set();
  let storageAvailable = true;
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(saved)) completed = new Set(saved.filter(id => lessons.some(l => l.id === id && l.kind !== 'planned'))); } catch { storageAvailable = false; }
  let current;
  let toastTimer;
  function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
  function status(lesson) {
    if (completed.has(lesson.id)) return '<span class="badge done">Concluída</span>';
    if (lesson.kind === 'planned') return '<span class="badge next">A seguir</span>';
    if (lesson.kind === 'guide') return '<span class="badge guide">Guia</span>';
    return '<span class="badge">Disponível</span>';
  }
  function renderNav() {
    const query = $('#search').value.trim().toLocaleLowerCase('pt-BR');
    let group = '';
    const visible = lessons.filter(l => `${l.title} ${l.category} ${l.intro} ${l.body.replace(/<[^>]*>/g,' ')}`.toLocaleLowerCase('pt-BR').includes(query));
    $('#lesson-nav').innerHTML = visible.map(l => {
      const heading = l.group !== group ? `<div class="nav-group">${escape(l.group)}</div>` : '';
      group = l.group;
      return `${heading}<a href="#${l.id}" class="lesson-link ${l.id === current?.id ? 'active' : ''}" ${l.id === current?.id ? 'aria-current="page"' : ''}><span class="lesson-number">${l.number}</span><span class="lesson-name">${escape(l.title)}</span>${status(l)}</a>`;
    }).join('');
    $('#no-results').hidden = visible.length > 0;
    $('#lesson-count').textContent = `${visible.length} ${visible.length === 1 ? 'ITEM' : 'ITENS'}`;
    const available = lessons.filter(l => l.kind !== 'planned');
    $('#progress').max = available.length;
    $('#progress').value = completed.size;
    $('#progress-label').textContent = `${completed.size}/${available.length}`;
  }
  const art = `<svg class="hero-art" viewBox="0 0 360 270" role="img" aria-label="Ilustração de um núcleo bancário conectado a módulos independentes"><defs><pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#46533b" opacity=".55"/></pattern><linearGradient id="tile" x2="1" y2="1"><stop stop-color="#344a27"/><stop offset="1" stop-color="#1a2519"/></linearGradient></defs><rect width="360" height="270" fill="url(#dots)"/><g fill="none" stroke="#6f8956" stroke-width="1.2"><path d="m180 125-95-55m95 55 95-55m-95 55v90m-95-145v88l95 57 95-57V70"/><path d="m85 158 95-55 95 55" stroke-dasharray="4 5"/></g><g fill="#c6f681"><circle cx="132" cy="97" r="3"/><circle cx="227" cy="97" r="3"/><circle cx="180" cy="175" r="3"/></g><g stroke="#61784d"><path d="m180 82 51 29v55l-51 30-51-30v-55z" fill="url(#tile)"/><path d="m129 111 51 30 51-30m-51 30v55" fill="none"/><path d="m85 42 31 18v35l-31 18-31-18V60z" fill="#23311d"/><path d="m275 42 31 18v35l-31 18-31-18V60z" fill="#23311d"/><path d="m180 193 25 15v28l-25 15-25-15v-28z" fill="#23311d"/></g><text x="180" y="124" text-anchor="middle" fill="#d9f5b9" font-size="16" font-family="system-ui" font-weight="700">ANFX</text><text x="85" y="82" text-anchor="middle" fill="#b2c99e" font-size="10" font-family="system-ui">01</text><text x="275" y="82" text-anchor="middle" fill="#b2c99e" font-size="10" font-family="system-ui">02</text><text x="180" y="227" text-anchor="middle" fill="#b2c99e" font-size="10" font-family="system-ui">03</text><text x="180" y="25" text-anchor="middle" fill="#859b73" letter-spacing="2" font-size="8" font-family="system-ui">FRONTEIRAS QUE FAZEM SENTIDO</text></svg>`;
  function architecture() { return `<div class="diagram"><div class="diagram-header"><span>MAPA DE ARQUITETURA</span><div class="segmented" role="group" aria-label="Comparar arquiteturas"><button data-architecture="legacy" aria-pressed="false">ANFX Legacy</button><button data-architecture="target" aria-pressed="true">Visão proposta</button></div></div><div id="architecture-view"></div><div class="legend"><span><i></i>Ilustração conceitual</span><span>Não representa serviços já publicados</span></div></div>`; }
  function updateArchitecture(mode) {
    const view = $('#architecture-view'); if (!view) return;
    document.querySelectorAll('[data-architecture]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.architecture === mode)));
    if (mode === 'legacy') view.innerHTML = `<div class="architecture"><div class="diagram-node client">Canais do banco</div><div class="connector"></div><div class="legacy-boundary"><div class="boundary-label">ANFX LEGACY · UMA APLICAÇÃO</div><div class="node-row"><div class="diagram-node">Clientes e Contas</div><div class="diagram-node">Pagamentos</div><div class="diagram-node">Seguros e Investimentos</div></div></div><div class="connector"></div><div class="diagram-node db">PostgreSQL compartilhado<small>Consultas e alterações atravessam módulos</small></div></div><p class="diagram-caption">Cenário simulado: uma publicação para todas as áreas. Uma transação local pode abranger dados compartilhados, mas mudanças e acessos diretos cruzam responsabilidades.</p>`;
    else view.innerHTML = `<div class="architecture"><div class="diagram-node client">Canais do banco</div><div class="connector"></div><div class="node-row six"><div class="diagram-node">Clientes<small>Identificação</small></div><div class="diagram-node">Contas<small>Ciclo de vida</small></div><div class="diagram-node">Movimentação<small>Reservas e lançamentos</small></div><div class="diagram-node">Pagamentos<small>Execução e estado</small></div><div class="diagram-node">Seguros<small>Propostas e apólices</small></div><div class="diagram-node">Investimentos<small>Aplicação e resgate</small></div></div><div class="connector"></div><div class="diagram-node db">Dados sob responsabilidade de cada contexto<small>Contratos explícitos · Fronteiras ainda serão validadas</small></div></div><p class="diagram-caption">Visão inicial de responsabilidades. Não exige seis serviços: vamos validar os limites e as garantias de consistência durante a implementação. A faixa de dados representa propriedade por contexto, não um banco compartilhado.</p>`;
  }
  function files(lesson) { return `<p class="section-copy">Raiz: <code>aula_guiada_microservicos/aula_guiada_mcroservicos_net_ia/</code>. Copie o caminho relativo ou consulte o arquivo pelo servidor local.</p><div class="file-list">${(lesson.files || []).map(([label,path]) => `<div class="file-row"><span class="file-info"><strong>${escape(label)}</strong><code>${escape(path)}</code></span>${['localhost','127.0.0.1','[::1]'].includes(location.hostname) ? `<a class="copy" href="/codigo/${path.split('/').map(encodeURIComponent).join('/')}" target="_blank" rel="noopener" aria-label="Ver código: ${escape(label)}">Ver código ↗</a>` : ''}<button class="copy" data-copy="${escape(path)}" aria-label="Copiar caminho: ${escape(label)}">Copiar</button></div>`).join('')}</div>`; }
  function render() {
    const id = location.hash.slice(1) || 'boas-vindas';
    current = lessons.find(l => l.id === id) || lessons[0];
    if (id !== current.id) history.replaceState(null, '', `#${current.id}`);
    document.title = `${current.title} — ANFX Lab`;
    $('#breadcrumb').textContent = current.category;
    let body = current.body.replace('{{architecture}}', architecture).replace('{{files}}', () => files(current));
    const next = lessons[lessons.indexOf(current) + 1];
    $('#lesson-content').innerHTML = `<section class="hero"><div><p class="eyebrow">${current.kind === 'guide' ? 'GUIA DO LABORATÓRIO' : `AULA ${current.number} · ${escape(current.category.toUpperCase())}`}</p><h1>${current.heading}</h1><p class="intro">${escape(current.intro)}</p>${current.id === 'boas-vindas' ? '<div class="hero-actions"><a class="primary" href="#legado">Começar a jornada <span>↗</span></a><a class="secondary" href="#estrutura">Explorar o código <span>→</span></a></div>' : ''}<div class="lesson-meta"><span>◷ ${escape(current.duration)}${current.kind === 'planned' ? '' : ' de leitura'}</span><span>◇ ${current.kind === 'planned' ? 'Planejamento' : 'Conteúdo disponível'}</span><span>Português · .NET</span></div></div>${art}</section>${body}${current.quiz ? `<section class="quiz"><span class="quiz-label">PAUSA PARA CONFERIR</span><h3>${escape(current.quiz.question)}</h3><div class="quiz-options">${current.quiz.options.map((o,i) => `<button class="quiz-option" data-answer="${i}">${String.fromCharCode(65+i)}. &nbsp;${escape(o)}</button>`).join('')}</div><p class="quiz-result" role="status" aria-live="polite" hidden></p></section>` : ''}<div class="lesson-end"><div>${current.kind !== 'planned' ? `<button id="complete-lesson" class="${completed.has(current.id) ? 'secondary' : 'primary'}" aria-pressed="${completed.has(current.id)}">${completed.has(current.id) ? '✓ Leitura concluída · desfazer' : 'Marcar leitura como concluída'}</button><small>O status acompanha sua leitura, não a implementação.</small>` : '<span class="pill">Implementação pendente</span>'}</div>${next ? `<a href="#${next.id}" class="secondary">${next.kind === 'planned' ? 'Ver planejamento' : 'Próxima aula'} <span>→</span></a>` : '<a href="#boas-vindas" class="secondary">Voltar ao início ↑</a>'}</div>`;
    renderNav(); updateArchitecture('target');
    $('#sidebar').classList.remove('open'); $('#menu-button').setAttribute('aria-expanded','false');
  }
  $('#search').addEventListener('input', renderNav);
  $('#menu-button').addEventListener('click', () => { const open = $('#sidebar').classList.toggle('open'); $('#menu-button').setAttribute('aria-expanded',String(open)); });
  $('#reset-progress').addEventListener('click', () => { completed.clear(); saveProgress(); render(); toast('Progresso de leitura reiniciado.'); });
  function saveProgress() { try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch { storageAvailable = false; } }
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {event.preventDefault(); $('#sidebar').classList.add('open'); $('#menu-button').setAttribute('aria-expanded','true'); $('#search').focus();}
    if (event.key === 'Escape') {$('#search').value='';renderNav();$('#sidebar').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');if(document.activeElement === $('#search')) $('#menu-button').focus();}
  });
  document.addEventListener('click', async event => {
    if (event.target.closest('.skip')) { event.preventDefault(); $('#lesson-content').focus(); return; }
    const architectureButton = event.target.closest('[data-architecture]'); if (architectureButton) updateArchitecture(architectureButton.dataset.architecture);
    const answer = event.target.closest('[data-answer]');
    if (answer && current.quiz) {
      const correct = Number(answer.dataset.answer) === current.quiz.correct;
      document.querySelectorAll('[data-answer]').forEach(b => {b.classList.remove('correct','incorrect');b.setAttribute('aria-pressed',String(b===answer));});
      answer.classList.add(correct ? 'correct' : 'incorrect');
      $('.quiz-result').hidden = false;
      $('.quiz-result').textContent = `${correct ? 'Isso mesmo. ' : 'Vamos revisar. '}${current.quiz.explanation}`;
    }
    if (event.target.closest('#complete-lesson')) { if (completed.has(current.id)) completed.delete(current.id); else completed.add(current.id);saveProgress();const position = scrollY;render();window.scrollTo(0,position);$('#complete-lesson').focus({preventScroll:true});toast(storageAvailable ? 'Progresso atualizado neste navegador.' : 'Armazenamento indisponível. Progresso mantido apenas nesta página.'); }
    const copy = event.target.closest('[data-copy]');
    if (copy) {try {await navigator.clipboard.writeText(copy.dataset.copy);toast('Caminho copiado.');} catch {const area=document.createElement('textarea');area.value=copy.dataset.copy;document.body.append(area);area.select();const copied=document.execCommand('copy');area.remove();toast(copied ? 'Caminho copiado.' : 'Selecione e copie o caminho exibido ao lado.');}}
    if (!event.target.closest('#sidebar') && !event.target.closest('#menu-button')) {$('#sidebar').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');}
  });
  window.addEventListener('hashchange', () => {render();window.scrollTo(0,0);$('#lesson-content').focus({preventScroll:true});});
  render();
})();
