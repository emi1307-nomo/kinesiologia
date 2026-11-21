/* COKE Córdoba · el cuerpo articulado, el armador de turnos y el horario.
   Todo lo que dice cada zona sale de lo que publica el consultorio (Instagram, Google, Doctoralia):
   no se agregan tratamientos que no figuren ahí. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = 'https://wa.me/5493513633597';

  /* ---------- las zonas ----------
     grupo: la pieza que se mueve · piv: la articulación · hacia: hacia dónde apunta la pieza en reposo
     max: cuántos grados se mueve (negativo = hacia adelante/arriba) · rango: lo que muestra la ficha */
  const ZONAS = {
    cara: {
      nombre: 'Cara y mandíbula', por: 'por la cara', dato: 'La mandíbula también es una articulación',
      trata: ['Parálisis facial periférica', 'Neuralgia del trigémino', 'Tensión en la mandíbula (ATM)', 'Estética facial'],
      cita: ['La predisposición y el trato personalizado.', 'Paciente con parálisis facial, en Doctoralia'],
      mover: { cabeza: [8, 'ida'] },
    },
    cuello: {
      nombre: 'Cuello', por: 'por el cuello', dato: 'Flexión del cuello: hasta 45°',
      trata: ['Cervicalgia: dolor y rigidez de cuello', 'Ejercicios de elongación cervical'],
      cita: ['Su buena atención personalizada.', 'Paciente con cervicalgia, en Doctoralia'],
      gonio: { grupo: 'cabeza', piv: [168, 118], hacia: [176, 60], r: 48 }, mover: { cabeza: [45] },
    },
    hombro: {
      nombre: 'Hombro y brazo', por: 'por el hombro', dato: 'Elevación del brazo: hasta 180°',
      trata: ['Tendinitis', 'Desgarros musculares', 'Lesiones de los nervios del brazo'],
      cita: ['Mariana me ayudó con una lesión crónica y logró una diferencia enorme.', 'Carla A., en Google'],
      gonio: { grupo: 'brazo', piv: [165, 140], hacia: [172, 226], r: 52 }, mover: { brazo: [-165], antebrazo: [-12] },
    },
    columna: {
      nombre: 'Espalda y columna', por: 'por la espalda', dato: 'Flexión del tronco: hasta 80°',
      trata: ['Hernia de disco', 'Ciática: dolor que baja por la pierna', 'Dolor lumbar y problemas de columna'],
      cita: ['El dolor ciático puede tener diferentes causas según la zona afectada. Conocé el origen de tu dolor.', 'COKE Córdoba, en Instagram'],
      gonio: { grupo: 'tronco', piv: [162, 240], hacia: [168, 118], r: 56 }, mover: { tronco: [70], brazo: [-66], brazo2: [-66] },
    },
    codo: {
      nombre: 'Codo y muñeca', por: 'por el codo o la muñeca', dato: 'Flexión del codo: hasta 145°',
      trata: ['Rehabilitación de fracturas, como la de cúbito y radio', 'Tendinitis', 'Lesiones de los nervios del brazo'],
      cita: ['Me fracturé cúbito y radio, hace un mes que estoy en rehabilitación y son increíbles los logros.', 'Paciente, en Google'],
      gonio: { grupo: 'antebrazo', piv: [172, 226], hacia: [182, 304], r: 44 }, mover: { antebrazo: [-140], mano: [-30] },
    },
    cadera: {
      nombre: 'Cadera y muslo', por: 'por la cadera', dato: 'Flexión de la cadera: hasta 120°',
      trata: ['Ciático y piramidal: ejercicios de elongación', 'Desgarros musculares', 'Lesiones deportivas'],
      cita: ['Respeta el horario de los turnos, sesiones completas, buen precio.', 'Opinión destacada en Google'],
      gonio: { grupo: 'muslo', piv: [162, 286], hacia: [164, 392], r: 56 }, mover: { muslo: [-112], pierna: [100] },
    },
    rodilla: {
      nombre: 'Rodilla', por: 'por la rodilla', dato: 'Flexión de la rodilla: hasta 135°',
      trata: ['Menisco', 'Rotura de ligamento cruzado (LCA)', 'Recuperación después de una artroscopia', 'Lesiones de cartílago'],
      cita: ['Tuve un mes de recuperación por rotura de LCA y mejoré muchísimo.', 'Agustín G., en Google'],
      gonio: { grupo: 'pierna', piv: [164, 392], hacia: [160, 496], r: 52 }, mover: { pierna: [132] },
    },
    tobillo: {
      nombre: 'Tobillo y pie', por: 'por el tobillo', dato: 'Tobillo: 20° hacia arriba, 50° hacia abajo',
      trata: ['Esguinces', 'Vendaje para esguince de tobillo', 'Tendinitis', 'Rehabilitación de fracturas'],
      cita: ['Excelente profesional, muy cálida y dedicada. Con Mariana me sentí muy cómoda en todo momento y noté grandes mejoras.', 'Paciente, en Google'],
      gonio: { grupo: 'pie', piv: [160, 496], hacia: [204, 516], r: 40 }, mover: { pie: [45, 'ida', -20] },
    },
  };
  // pivotes de cada pieza del cuerpo (en el dibujo de 340 × 560)
  // brazo2 es el brazo de atrás; el tronco son dos grupos (el de adelante y el que lleva ese brazo, que va detrás de las piernas)
  const PIVOTE = { tronco: [162, 240], cabeza: [168, 118], brazo: [165, 140], brazo2: [165, 140], antebrazo: [172, 226], mano: [182, 304], muslo: [162, 286], pierna: [164, 392], pie: [160, 496] };
  const pieza = Object.fromEntries(Object.keys(PIVOTE).map((k) => [k, $$(`[data-pieza="${k}"]`)]));
  const girar = (k, a) => { const [x, y] = PIVOTE[k]; const t = Math.abs(a) < 0.05 ? '' : `rotate(${a.toFixed(2)} ${x} ${y})`; pieza[k].forEach((e) => e.setAttribute('transform', t)); };

  const cuerpo = $('.cuerpo');
  const gonio = $('.gonio', cuerpo), G = Object.fromEntries($$('[data-g]', gonio).map((e) => [e.dataset.g, e]));
  const rad = (g) => (g * Math.PI) / 180;
  const punto = (c, r, g) => [c[0] + r * Math.cos(rad(g)), c[1] + r * Math.sin(rad(g))];
  function arco(c, r, a0, a1) {
    const [x0, y0] = punto(c, r, a0), [x1, y1] = punto(c, r, a1), d = a1 - a0;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${Math.abs(d) > 180 ? 1 : 0} ${d > 0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  // dibuja el goniómetro: brazo fijo en la posición de reposo, brazo móvil donde está ahora, arco y grados
  function medir(z, angulo, total) {
    // (en un <g> de SVG no existe la propiedad .hidden: hay que tocar el atributo)
    const g = z.gonio; if (!g) { gonio.setAttribute('hidden', ''); return; }
    const base = (Math.atan2(g.hacia[1] - g.piv[1], g.hacia[0] - g.piv[0]) * 180) / Math.PI;
    const largo = g.r + 26, ahora = base + angulo;
    const [fx, fy] = punto(g.piv, largo, base), [mx, my] = punto(g.piv, largo, ahora);
    G.fijo.setAttribute('x1', g.piv[0]); G.fijo.setAttribute('y1', g.piv[1]); G.fijo.setAttribute('x2', fx.toFixed(1)); G.fijo.setAttribute('y2', fy.toFixed(1));
    G.movil.setAttribute('x1', g.piv[0]); G.movil.setAttribute('y1', g.piv[1]); G.movil.setAttribute('x2', mx.toFixed(1)); G.movil.setAttribute('y2', my.toFixed(1));
    G.arco.setAttribute('d', Math.abs(angulo) > 0.5 ? arco(g.piv, g.r, base, ahora) : '');
    G.total.setAttribute('d', total ? arco(g.piv, g.r, base, base + total) : '');
    const medio = base + (Math.abs(angulo) > 0.5 ? angulo : total || 0) / 2;
    let [ex, ey] = punto(g.piv, g.r + 30, medio);
    ex = Math.min(312, Math.max(28, ex)); ey = Math.min(545, Math.max(18, ey));
    G.etiqueta.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)})`);
    $('text', G.etiqueta).textContent = Math.round(Math.abs(angulo > 0.5 || angulo < -0.5 ? angulo : total || 0)) + '°';
    gonio.removeAttribute('hidden');
  }

  // movimiento: dos idas y vueltas suaves de cada pieza; "ida" = va hacia los dos lados
  let anim = 0;
  function mover(z) {
    cancelAnimationFrame(anim);
    Object.keys(PIVOTE).forEach((k) => girar(k, 0));
    const partes = Object.entries(z.mover || {});
    const principal = z.gonio ? z.gonio.grupo : null;
    const total = principal ? (z.mover[principal] || [0])[0] : 0;
    if (quieto) { medir(z, 0, total); return; }
    const DUR = 2600; let t0 = 0;
    const paso = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / DUR);
      let angPrincipal = 0;
      for (const [k, [a, modo, b]] of partes) {
        let v;
        if (modo === 'ida') { const s = Math.sin(2 * Math.PI * 2 * p); v = s >= 0 ? a * s : (b != null ? -b : a) * s; }
        else v = a * (1 - Math.cos(2 * Math.PI * 2 * p)) / 2;
        girar(k, v);
        if (k === principal) angPrincipal = v;
      }
      medir(z, angPrincipal, p >= 1 ? total : 0);
      if (p < 1) anim = requestAnimationFrame(paso);
    };
    anim = requestAnimationFrame(paso);
  }

  /* ---------- la ficha de cada zona ---------- */
  const ficha = $('[data-ficha]');
  const F = { dato: $('.ficha-dato', ficha), titulo: $('.ficha-titulo', ficha), intro: $('.ficha-intro', ficha), lista: $('.ficha-lista', ficha),
    cita: $('.ficha-cita', ficha), btn: $('[data-ficha-btn]', ficha) };
  let elegida = null;
  const mensajeZona = (z) => `Hola Mariana, quería pedir un turno de kinesiología ${z.por}.`;
  function elegir(id, desdeCuerpo) {
    const z = ZONAS[id]; if (!z) return;
    elegida = id;
    $$('.zona').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zona === id)));
    $$('.punto', cuerpo).forEach((p) => p.classList.toggle('activo', p.dataset.zona === id));
    cuerpo.classList.add('elegido');
    F.dato.textContent = z.dato;
    F.titulo.textContent = z.nombre;
    F.intro.textContent = 'Lo que trabajamos:';
    F.lista.innerHTML = ''; z.trata.forEach((t) => { const li = document.createElement('li'); li.textContent = t; F.lista.appendChild(li); });
    F.lista.hidden = false;
    if (z.cita) { $('p', F.cita).textContent = '“' + z.cita[0] + '”'; $('cite', F.cita).textContent = z.cita[1]; F.cita.hidden = false; } else F.cita.hidden = true;
    $('span', F.btn).textContent = 'Pedir turno ' + z.por;
    F.btn.href = WA + '?text=' + encodeURIComponent(mensajeZona(z));
    ficha.classList.remove('cambia'); void ficha.offsetWidth; ficha.classList.add('cambia');
    mover(z);
    // el armador de turnos arranca con la misma zona
    const r = $(`.armador input[name="zona"][value="${id}"]`); if (r) { r.checked = true; armar(); }
    // si se tocó el dibujo en el celular y la ficha quedó abajo, se acerca
    if (desdeCuerpo) { const b = ficha.getBoundingClientRect(); if (b.top > innerHeight - 120) ficha.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'nearest' }); }
  }
  $$('.zona').forEach((b) => b.addEventListener('click', () => elegir(b.dataset.zona)));
  $$('.punto', cuerpo).forEach((p) => p.addEventListener('click', () => elegir(p.dataset.zona, true)));

  // un saludo al aparecer: levanta el brazo una vez, para que se note que el muñeco se mueve.
  // Si la persona ya eligió una zona, no saluda.
  function saludar() {
    if (quieto || elegida) return;
    const DUR = 2200; let t0 = 0;
    const paso = (t) => {
      if (elegida) return;
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / DUR), sube = Math.sin(Math.PI * p);
      girar('brazo', -150 * sube * sube);
      girar('antebrazo', -25 * sube + 18 * Math.sin(2 * Math.PI * 3 * p) * sube);
      if (p < 1) anim = requestAnimationFrame(paso); else { girar('brazo', 0); girar('antebrazo', 0); }
    };
    anim = requestAnimationFrame(paso);
  }
  /* ---------- pantalla de carga y entrada ----------
     Dura algo más de un segundo: el logo se da vuelta, la aguja del goniómetro recorre su escala y se desvanece.
     Después el muñeco se arma de los pies a la cabeza, se marcan los puntos y recién ahí saluda. */
  const raiz = document.documentElement, carga = $('.carga');
  let terminoEntrada; const entrada = new Promise((r) => (terminoEntrada = r));
  function prepararEntrada() {
    // retraso de cada pieza según su altura: primero los pies, al final la cabeza
    const piezas = $$('.pieza, .art, .sombra', cuerpo);
    const ys = piezas.map((e) => { const b = e.getBBox(); return b.y + b.height / 2; });
    const alto = Math.max(...ys), bajo = Math.min(...ys);
    piezas.forEach((e, i) => e.style.setProperty('--d', ((0.55 * (alto - ys[i])) / (alto - bajo)).toFixed(3) + 's'));
    $$('.punto', cuerpo).map((p) => [p, p.transform.baseVal.consolidate().matrix.f]).sort((a, b) => b[1] - a[1])
      .forEach(([p], i) => p.style.setProperty('--d', (0.6 + i * 0.06).toFixed(2) + 's'));
    $$('.zona').forEach((b, i) => b.style.setProperty('--i', i));
  }
  if (carga && raiz.classList.contains('con-carga')) {
    const salir = () => {
      if (!raiz.classList.contains('con-carga')) { terminoEntrada(); return; } // ya la sacó el seguro de los 5 segundos
      prepararEntrada();
      carga.classList.add('sale');
      setTimeout(() => raiz.classList.add('entra'), 150);
      setTimeout(() => { raiz.classList.remove('con-carga'); carga.remove(); }, 650);
      setTimeout(() => { raiz.classList.remove('entra'); terminoEntrada(); }, 1800);
    };
    const avance = $('.avance', carga), aguja = $('.aguja', carga);
    const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
    // las letras del logo, con su tipografía: si tarda, arranca igual
    Promise.race([document.fonts.load('400 38px "Young Serif"'), esperar(450)]).then(() => {
      carga.classList.add('arranca');
      const DUR = 900, ANTES = 150; let t0 = 0;
      const paso = (t) => {
        if (!t0) t0 = t;
        const p = Math.min(1, Math.max(0, (t - t0 - ANTES) / DUR)), e = 1 - Math.pow(1 - p, 3);
        avance.setAttribute('stroke-dashoffset', (100 - 100 * e).toFixed(2));
        aguja.setAttribute('transform', `rotate(${(180 * e).toFixed(1)} 70 70)`);
        if (p < 1) requestAnimationFrame(paso);
        else Promise.race([document.fonts.ready, esperar(1500)]).then(() => setTimeout(salir, 120));
      };
      requestAnimationFrame(paso);
    });
  } else terminoEntrada();

  if ('IntersectionObserver' in window) {
    const ojo = new IntersectionObserver((es) => { if (es[0].isIntersecting) { ojo.disconnect(); entrada.then(() => setTimeout(saludar, 400)); } }, { threshold: 0.6 });
    ojo.observe(cuerpo);
  }

  /* ---------- armador del mensaje de WhatsApp ---------- */
  const armador = $('[data-armador]'), burbuja = $('[data-mensaje]'), btnArmador = $('[data-armador-btn]');
  const lista = (xs) => (xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' o ' + xs[xs.length - 1]);
  function armar() {
    const d = new FormData(armador);
    const nombre = (d.get('nombre') || '').trim().replace(/\s+/g, ' ');
    const zona = d.get('zona'), motivo = d.get('motivo'), franja = d.get('franja'), dias = d.getAll('dias');
    let m = 'Hola Mariana' + (nombre ? ', soy ' + nombre : '') + '. Quería pedir un turno de kinesiología';
    if (zona && ZONAS[zona]) m += ' ' + ZONAS[zona].por;
    m += '.';
    if (motivo) m += ' ' + motivo.charAt(0).toUpperCase() + motivo.slice(1) + '.';
    if (dias.length || franja) {
      m += ' Puedo' + (dias.length ? ' el ' + lista(dias) : '') + (franja ? ' ' + franja : '') + '.';
    }
    m += ' ¡Gracias!';
    burbuja.textContent = m;
    btnArmador.href = WA + '?text=' + encodeURIComponent(m);
  }
  armador.addEventListener('input', armar);
  armador.addEventListener('change', armar);
  armador.addEventListener('submit', (e) => e.preventDefault());
  armar();

  /* ---------- abierto o cerrado, con la hora de Córdoba ---------- */
  const estado = $('[data-estado]');
  function pintarEstado() {
    const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Cordoba' }));
    const dia = ahora.getDay(), h = ahora.getHours() + ahora.getMinutes() / 60, habil = dia >= 1 && dia <= 5;
    let t;
    if (habil && h >= 10 && h < 20) t = 'Abierto ahora · hasta las 20 h';
    else if (habil && h < 10) t = 'Cerrado · abre hoy a las 10 h';
    else if (dia >= 1 && dia <= 4) t = 'Cerrado · abre mañana a las 10 h';
    else t = 'Cerrado · abre el lunes a las 10 h';
    estado.textContent = t;
  }
  pintarEstado(); setInterval(pintarEstado, 60000);

  /* ---------- cabecera con línea al bajar y barra fija del celular ---------- */
  const cab = $('.cabecera'), barra = $('[data-barra]');
  if ('IntersectionObserver' in window) {
    // la barra aparece recién cuando ya pasó el botón de la ficha (para no repetir el mismo botón en pantalla)
    // y se esconde mientras se ve el armador de turnos
    const mapa = $('.mapa'), turnos = $('#turnos');
    let mapaVisible = true, pasoFicha = false, turnosVisible = false;
    const actualizar = () => {
      cab.classList.toggle('bajo', !mapaVisible);
      barra.hidden = false;
      barra.classList.toggle('fuera', !pasoFicha || turnosVisible);
    };
    new IntersectionObserver((es) => { mapaVisible = es[0].isIntersecting; actualizar(); }, { rootMargin: '-30% 0px 0px 0px' }).observe(mapa);
    new IntersectionObserver((es) => { const e = es[0]; pasoFicha = !e.isIntersecting && e.boundingClientRect.top < 0; actualizar(); }).observe(F.btn);
    new IntersectionObserver((es) => { turnosVisible = es[0].isIntersecting; actualizar(); }).observe(turnos);
  }

  // con el mensaje de la zona elegida, cualquier botón de WhatsApp de la página ya lleva el texto
  $$('[data-wa]').forEach((a) => a.addEventListener('click', () => {
    if (a.hasAttribute('data-ficha-btn') || a.hasAttribute('data-armador-btn')) return;
    a.href = WA + '?text=' + encodeURIComponent(elegida ? mensajeZona(ZONAS[elegida]) : 'Hola Mariana, quería pedir un turno de kinesiología.');
  }));
})();
