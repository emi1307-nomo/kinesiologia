# COKE Córdoba · plan de la web

Consultorio REAL de kinesiología y fisioterapia de la **Lic. Mariana V. Chacon (MP 3785)**, Blvr. Chacabuco 843 PB
(espacio Dermamedic), Nueva Córdoba. Objetivo de la página: que quien llega con un dolor entienda en segundos si lo
tratan, confíe y pida turno por WhatsApp.

Regla de oro: **nada inventado**. Cada tratamiento, dato y opinión sale de una fuente pública (ver abajo). Lo que no
está confirmado no se afirma: se manda a consultar por WhatsApp.

Ver en la compu: `node servidor.mjs` → http://localhost:8088 (config "coke" en el launch.json de la sesión).
Página estática: `index.html` + `css/coke.css` + `js/coke.js`. Lo que dice cada zona del cuerpo está en `ZONAS`
dentro de `js/coke.js`. Tiene `noindex` hasta que la aprueben.

## Relevamiento (21/11/2026)
- **Google Maps:** 5,0 ★ con 92 opiniones (90 de 5 ★). Lunes a viernes de 10 a 20 h, sábado y domingo cerrado.
  Tel. 0351 363-3597, WhatsApp +54 9 351 363-3597. Entrada, espacio y baño accesibles para silla de ruedas.
  Temas que más se repiten en las opiniones: fractura (4), cervicalgia, esguinces, precio, onda, "genia", trabajo (2 c/u).
  Opiniones citadas en la página (con nombre de pila e inicial): Denysse M. ("me atiendo con Mariana hace más de
  15 años"), Agustín G. (LCA; "te deja elegir según tus horarios", "te recuerda del turno por wpp"), Carla A.
  (lesión crónica), y dos sin nombre a la vista (cúbito y radio; "muy cálida y dedicada").
- **Instagram @coke.cordoba.consultorios:** 107 publicaciones, 826 seguidores, rubro Salud/belleza. Lema
  "COKE Córdoba te cuida". Reels propios: menisco, hernia discal, "¿Dónde te duele la rodilla?", "Conocé el origen de
  tu dolor" (ciática), vendaje para esguince de tobillo, cómo se produce un esguince, elongación para ciático y
  piramidal, elongación cervical. Flyers 2024: "Consultorios privados · Kinesiología y Fisioterapia · Estética
  Corporal y Facial". Tiene página de Facebook "COKE Consultorios Córdoba".
- **Doctoralia** (perfil viejo, opiniones de 2016-2017): especialidades fisioterapia, drenaje linfático,
  fisioterapia y kinesiología deportiva; trata ciática, neuralgia del trigémino, lesiones nerviosas del miembro
  superior, tendinitis, desgarro muscular; atiende adultos; figuraba OSDE Binario. Sin reserva online.
- **Marca:** logo de 4 cuadrados en damero (C O / K E), turquesa #0F6A76 medido del flyer; en el avatar de Instagram,
  sobre agua #78C0D4. El logo de la página está redibujado en SVG (pedirles el original).

## El gancho para presentarla
En sus flyers de 2024 dice **www.cokecordoba.com.ar**, pero ese dominio hoy **no existe** (no resuelve): quien lo
escribe no encuentra nada. Su "sitio web" en Google Maps es el link de WhatsApp. Con esta página, la dirección
de los flyers vuelve a servir (hay que ver en NIC Argentina si el dominio está libre o a nombre de quién quedó).

## La página
- **¿Dónde te duele?** (portada): un maniquí articulado de perfil, como los de dibujo. Se elige la zona en el cuerpo o
  en los botones; la articulación hace su movimiento y un **goniómetro** (el instrumento con el que se mide el rango
  de movimiento) marca los grados. La ficha dice qué tratan en esa zona, una opinión real y "Pedir turno por la
  rodilla" con el mensaje ya escrito. Al aparecer, el muñeco saluda levantando el brazo una vez.
- **Opiniones:** la de "hace más de 15 años" en grande + tres más.
- **Pedí tu turno:** los tres pasos reales (WhatsApp, recordatorio, sesión a horario y completa) y un armador de
  mensaje: zona, qué pasó, días, horario y nombre → abre WhatsApp con todo escrito. No envía nada solo.
- **Qué tratamos**, **Preguntas frecuentes** (sin afirmar obras sociales ni precios), **Dónde** (abierto/cerrado con
  la hora de Córdoba, mapa, cómo llegar, accesibilidad).
- Movimiento reducido: el muñeco no se mueve y el goniómetro muestra el rango quieto.

## Para preguntarle a Mariana
1. ¿Con qué obras sociales y prepagas trabaja hoy? ¿Qué piden (orden médica, autorización)?
2. ¿Cuánto dura una sesión? ¿Quiere mostrar precios particulares?
3. ¿Cómo se escribe su apellido: Chacon o Chacón? ¿Qué significa COKE?
4. ¿Sigue haciendo estética corporal y facial y drenaje linfático? ¿Hace punción seca, acupuntura u otras técnicas
   que quiera mostrar? (en Instagram hay un reel que podría ser acupuntura, sin confirmar)
5. ¿Atiende a domicilio? ¿Hay otros profesionales en COKE ("consultorios", "COKE se expandió")?
6. Fotos: de ella y del consultorio (hoy la página no usa ninguna foto). ¿El logo original en buena calidad?
7. ¿Le sirve el armador de mensajes o prefiere que el botón abra WhatsApp vacío?
8. ¿Quién tiene el dominio cokecordoba.com.ar?

## Pendiente
- Fotos reales (con su permiso) y logo original.
- Fuentes propias (hoy se cargan de Google Fonts) e imagen para compartir por WhatsApp.
- Publicar la demo (Vercel o GitHub Pages) con `noindex`.
