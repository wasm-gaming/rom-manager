# Gestor de catálogo de ROMs — resumen de diseño

Herramienta cliente (sin backend), pensada para gestionar una colección de
ROMs retro agrupándolas por juego con sus distintas variantes (región,
revisión, idioma), con metadata y carátulas asociadas.

## Objetivo

- El corazón del proyecto es el **dataset**: un catálogo de juegos con sus
  variantes, generado por matching de hash contra DATs (No-Intro / Redump).
- Target: **juegos retro**. El catálogo es prácticamente estático (los DATs
  de sistemas retro ya están maduros) → no hace falta arquitectura pensada
  para regeneración total del dataset, se puede crecer de forma incremental.
- Acceso a ficheros vía **File System Access API** (sin subir nada a un
  backend). Soporte real solo en navegadores Chromium.

## Sistemas objetivo (cerrado, bloque "mainstream" de MiSTer FPGA)

El identificador de sistema es el nombre de carpeta que MiSTer usa bajo
`/games`, tomado literalmente de `MiSTer-devel/Distribution_MiSTer`. El
casing es inconsistente en el propio MiSTer (`Atari2600` pero `ATARI5200`,
`NEOGEO` pero `NeoGeo-CD`) y se reproduce tal cual a propósito: tiene que
coincidir con lo que hay en la SD del usuario.

| Sistema (MiSTer) | Medio | DAT (libretro-database/metadat) |
|---|---|---|
| `NES` | cartucho | `no-intro/Nintendo - Nintendo Entertainment System.dat` |
| `SNES` | cartucho | `no-intro/Nintendo - Super Nintendo Entertainment System.dat` |
| `GAMEBOY` | cartucho | `no-intro/Nintendo - Game Boy.dat` |
| `GBC` | cartucho | `no-intro/Nintendo - Game Boy Color.dat` |
| `GBA` | cartucho | `no-intro/Nintendo - Game Boy Advance.dat` |
| `N64` | cartucho | `no-intro/Nintendo - Nintendo 64.dat` |
| `PokemonMini` | cartucho | `no-intro/Nintendo - Pokemon Mini.dat` |
| `SMS` | cartucho | `no-intro/Sega - Master System - Mark III.dat` |
| `GameGear` | cartucho | `no-intro/Sega - Game Gear.dat` |
| `MegaDrive` | cartucho | `no-intro/Sega - Mega Drive - Genesis.dat` |
| `MegaCD` | disco | `redump/Sega - Mega-CD - Sega CD.dat` |
| `S32X` | cartucho | `no-intro/Sega - 32X.dat` |
| `Saturn` | disco | `redump/Sega - Saturn.dat` |
| `PSX` | disco | `redump/Sony - PlayStation.dat` |
| `TGFX16` | cartucho | `no-intro/NEC - PC Engine - TurboGrafx 16.dat` |
| `TGFX16-CD` | disco | `redump/NEC - PC Engine CD - TurboGrafx-CD.dat` |
| `NeoGeo-CD` | disco | `redump/SNK - Neo Geo CD.dat` |
| `Atari2600` | cartucho | `no-intro/Atari - 2600.dat` |
| `ATARI5200` | cartucho | `no-intro/Atari - 5200.dat` |
| `ATARI7800` | cartucho | `no-intro/Atari - 7800.dat` |
| `AtariLynx` | cartucho | `no-intro/Atari - Lynx.dat` |
| `WonderSwan` | cartucho | `no-intro/Bandai - WonderSwan.dat` |
| `WonderSwanColor` | cartucho | `no-intro/Bandai - WonderSwan Color.dat` |

**Neo Geo AES/MVS (`NEOGEO`) queda fuera.** No existe DAT de No-Intro ni de
Redump para el cartucho: MiSTer identifica esos juegos por nombre de romset
Darksoft (`games/NEOGEO/romsets.xml` en Distribution_MiSTer), un catálogo
que aporta título, editor y año pero **ningún checksum**. Soportarlo exigiría
una vía de identificación por nombre, en contra del principio "identificar
por hash". Se pospone como funcionalidad aparte.

(Sistemas de nicho de MiSTer quedan fuera por ahora: ColecoVision,
Intellivision, Vectrex, Odyssey2, Channel F, VC4000, Arcadia 2001,
Astrocade, Gamate, SuperVision, Casio PV-1000, CreatiVision, MyVision,
Super Vision 8000, Adventure Vision, BBC Bridge Companion, AY-3-8500.)

La lista es **cerrada**: quedan también fuera los sistemas post-retro que el
repositorio incluía en `scripts/systems.mjs` y que se han retirado
(GameCube, Wii, PlayStation 2, PSP, Dreamcast, Commodore 64, Amiga).

## Concepto de agrupación (juego ↔ variantes)

Basado en el patrón validado a partir de `igir` (sin reutilizar su código,
que depende de binarios nativos incompatibles con el navegador):

- **Identificar por hash, no por nombre de fichero** — el nombre local no es
  fiable; el hash contra el DAT sí.
- **"Candidato"**: cada entrada del DAT es una variante candidata a la que
  un fichero local puede o no matchear (catálogo teórico vs. lo que
  realmente tienes en disco).
- **Agrupación por título base**, extrayendo los tags de
  región/idioma/revisión/flags del nombre del DAT. La clave de grupo es el
  resultado de `normalizeGameName`, que por tanto es el eje de todo el
  sistema: agrupa, nombra la carpeta y resuelve la carátula.

  El diseño original preveía agrupar por `cloneOf` (DATs "parent-clone" de
  No-Intro/Redump), que sería más fiable que parsear el título. **No es
  viable**: se ha verificado que ningún DAT de `libretro-database` incluye
  `cloneof` ni `romof`, y los DATs parent-clone de No-Intro solo se obtienen
  manualmente desde DAT-o-MATIC, lo que rompería la descarga automatizada.
  La nomenclatura de No-Intro es lo bastante regular
  (`Título (Región) (Rev 1)`) como para que el título base sea fiable dentro
  de un mismo sistema.

Pendiente de implementar en TypeScript puro (sin dependencias de Node):
tipos `DatGame`, `GameVariant`, `GameGroup`, funciones `parseGameName`,
`groupDatGames` en `src/core/rom-grouping.ts`; `matchGroupsWithLocalFiles` en
`src/core/rom-matching.ts`. El hashing por streaming vive en
`ChecksumService.streamCRC32()`, porque necesita el acceso a ficheros.

## Estructura de carpetas

La estructura depende del **medio del sistema**, que es una propiedad fija
declarada en la tabla de sistemas (`media: 'cartridge' | 'disc'`).

Sistemas de cartucho — un fichero por variante, plano:

```
<sistema>/<Juego>.<variante>.<ext>
<sistema>/<colección>/...                          # carpetas planas, ver abajo
```

Sistemas de disco (PSX, Saturn, Mega-CD, PC Engine CD, Neo Geo CD) — carpeta
por juego y subcarpeta por variante, porque una release puede constar de
varios ficheros (discos, `bin`+`cue`):

```
<sistema>/<Juego>/game.json                        # marca de juego gestionado
<sistema>/<Juego>/<variante>/<ficheros de la release>
```

En ambos casos, la metadata vive fuera de las carpetas de ROMs:

```
.meta/<sistema>/<Juego>.json                       # metadata editable
.meta/<sistema>/<Juego>.<región>.case.png          # carátula de una región
.meta/<sistema>/<Juego>.case.png                   # carátula del juego
.meta/<sistema>/<Juego>[.<región>].<tipo>.<ext>    # cualquier otra imagen
.meta/<sistema>/scan.json                          # caché de hashes
.meta/wizard.json
```

Ejemplo:

```
Nintendo - SNES/Super Mario World.USA.sfc
Nintendo - SNES/Super Mario World.Japan-rev1.sfc

Sony - PlayStation/Final Fantasy VII/game.json
Sony - PlayStation/Final Fantasy VII/USA/Final Fantasy VII (USA) (Disc 1).bin
Sony - PlayStation/Final Fantasy VII/USA/Final Fantasy VII (USA) (Disc 1).cue
```

`scan.json` guarda, por ruta relativa, `size` + `mtime` + `crc32`. Es una
**caché de escaneo**: sin ella habría que rehashear gigabytes en cada
apertura de la carpeta. Un único fichero por sistema en lugar de uno por
juego, para que el arranque sea una sola lectura. Se puede borrar sin pérdida
de información: se reconstruye rehasheando.

El matching exige que coincidan **CRC32 y tamaño**, no solo el CRC. Un CRC32
son 32 bits y un sistema tiene decenas de miles de entradas, de modo que la
colisión es probable y no teórica; el tamaño ya lo conoce el escaneo, así que
comprobarlo es gratis. Se ha verificado que las 51 216 entradas de los 23
datasets traen `size` y que ningún CRC se repite con dos tamaños distintos.

`game.json` existe **solo en sistemas de disco** y es deliberadamente mínimo
(`gameId`, `title`, `system`). Su papel no es guardar datos, sino marcar la
carpeta como juego gestionado para distinguirla de una colección.

### Identidad de variante

La clave de variante se deriva **del dataset, nunca del nombre del fichero
local**. Es el sufijo del fichero en sistemas de cartucho y el nombre de la
subcarpeta en sistemas de disco. Segmentos en orden fijo unidos por `-`:

```
<región>[-<revisión>][-<flag>][-<idioma>][-<extra>][-<crc8>]
```

- **región**: cadena de No-Intro literal (`USA`, `Europe`, `Japan`, `World`);
  multi-región une con `+` (`USA+Europe`).
- **revisión**: `(Rev 1)` → `rev1`, `(Rev A)` → `revA`, `(v1.1)` → `v11`.
- **flag**: `beta`, `beta2`, `proto`, `demo`, `sample`, `unl`, `aftermarket`.
- **idioma**: solo cuando es lo único que distingue dos variantes
  (`Europe-Es`).
- **extra**: tag que el parser no interpreta, reducido a minúsculas sin
  separadores (`(Virtual Console)` → `virtualconsole`). El vocabulario real es
  abierto —unos 2000 tags distintos en los 23 datasets—, así que enumerarlo no
  es viable; se añade solo cuando es lo que distingue dos variantes.
- **crc8**: 8 hex del CRC32 de la ROM principal, añadido **solo** si tras lo
  anterior dos variantes del mismo grupo siguen colisionando. Se añade a
  todas las colisionantes, no solo a la segunda, para que el resultado no
  dependa del orden de iteración.

Cada segmento opcional se añade únicamente en el grupo donde la clave más
corta es ambigua, de modo que el caso común queda legible (`USA`, `Japan-rev1`).
Sobre los 51 216 juegos de los 23 datasets esto produce 41 540 variantes sin
ninguna necesitar el sufijo `crc8`.

### Regiones y sistema de vídeo

El DAT nombra decenas de regiones (`Europe`, `USA`, `Japan`, pero también
`Brazil`, `Scandinavia`, `Hong Kong`) y la aplicación razona en **tres**: EU, US
y JP. La traducción vive en un único sitio, `src/core/rom-regions.ts`, porque la
usan a la vez el navegador y el build de datasets.

`World` no es una cuarta región: una release mundial va a las tres a la vez, y
eso es justo lo que hace útil un orden de preferencia. Sobre las 55 158 entradas
de los 23 DATs, **8 700 son `World`** y solo 26 no se pueden situar en ninguna
región; esas se quedan sin ella, porque adivinarla sería peor que no decirla.

El **sistema de vídeo** es el de la propia release y no el de la emisión del
país, porque lo que importa de una ROM es si es una build de 50 Hz o de 60:
`Hong Kong` es NTSC —país PAL cuyas consolas iban NTSC-J—, `Brazil` es NTSC
—PAL-M son 60 Hz— y `Argentina` es PAL —PAL-N son 50— pese a estar en el
mercado americano.

Cada variante declara por tanto las regiones a las que va y los estándares a los
que corre. Una release multi-región conserva **los dos** cuando cruza un mercado
de 50 Hz y otro de 60: `(USA, Europe)` es una entrada en el DAT pero dos builds
en la práctica, y decir solo uno sería falso.

### Ficheros de una misma release

Un DAT lista **una entrada por fichero**, no por release. Una misma release
aparece repetida cuando se reparte en varios ficheros: los discos de un juego
Redump (`(Disc 1)`, `(Disc 2)`…) y también los cartuchos partidos en varios
chips, que repiten el nombre completo sin ningún tag que los distinga.

Las entradas de una misma release se identifican por su **nombre completo sin
el tag de disco** y se fusionan en una sola variante con varios ficheros.
Derivarlo del nombre crudo, y no de los campos ya parseados, es lo que evita
fusionar dos releases distintas que solo difieren en un tag no reconocido.

Esto tiene un límite conocido: el nombre del DAT **no siempre es único**. Hay
protos y homebrew donde dos releases comparten el nombre del `<game>` y solo
se distinguen por la fecha del `<rom>` (`RealSports Basketball (USA) (Proto)`
con ficheros `(1982-11-05)` y `(1983-10-31)`). Esas releases se fusionan en
una variante que acaba teniendo dos ficheros con la misma extensión. Sobre los
23 datasets son **93 casos de ~51 000 entradas**. No se corrige en la
agrupación: se detecta al organizar, donde se manifiesta como dos ficheros
reclamando el mismo nombre, y ahí no se toca ninguno de los dos.

### Normalización de nombres

Una única función pura `normalizeGameName(datName)`, compartida por el path
del ROM, el path de `.meta` y el matching de carátulas:

1. Eliminar todos los grupos de tags finales `(...)` y `[...]`.
2. Conservar la forma de No-Intro tal cual (`Legend of Zelda, The`); no se
   reordenan artículos.
3. Normalizar a Unicode **NFC** (evita el desajuste NFD de macOS frente a NFC
   de Windows al comparar paths).
4. Sustituir por `_` exactamente el conjunto que sanea libretro (el mismo
   que aplica `toThumbnailName` en `scripts/dat-to-json.mjs`):
   ``& * / : ` < > ? \ | "``.
5. Recortar puntos y espacios finales; colapsar espacios repetidos.
6. Nombres reservados de Windows (`CON`, `AUX`, `COM1`…) → prefijo `_`.
7. Truncar a 120 caracteres por componente en frontera de palabra; si hubo
   truncado, añadir `-<crc8>`.

El paso 4 usa a propósito el mismo saneado que aplica libretro al publicar
thumbnails, pero **el nombre de la carpeta del juego no coincide con el del
thumbnail**: libretro nombra las carátulas con el nombre completo del DAT
(`Final Fantasy VII (Europe) (Disc 1).png`), tags incluidos. La carátula es
por tanto **de una release**, no de un juego, y ya la resuelve entrada a entrada
`scripts/dat-to-json.mjs`; como la release es lo que lleva región, de ahí sale
una carátula por región (ver «Carátulas»). Compartir el saneado sigue siendo útil porque
garantiza que ningún nombre de carátula introduce caracteres que el sistema de
ficheros no acepte.

### Organización canónica

Llevar los ficheros a la estructura de arriba es la única operación que mueve
las ROMs del usuario, así que se parte en dos: un **plan**, que no toca nada, y
su **aplicación**, que no ocurre sin que el plan se haya mostrado.

El plan solo alcanza a los ficheros que el dataset reconoce por CRC32 y tamaño.
Lo que no reconoce se queda donde está, y eso es lo que impide que el gestor
reordene una colección que no entiende. El destino se deriva **siempre del
dataset**: el nombre canónico, la clave de variante y también la extensión, de
modo que un `.gen` cuya entrada dice `.md` acaba llamándose `.md`.

El plan es deliberadamente cobarde. Todo caso cuyo resultado dependería del
orden en que se ejecutan las operaciones, o que sobrescribiría algo, se informa
como conflicto en lugar de resolverse adivinando:

- **dos ficheros reclaman el mismo nombre** — el caso de los DAT con nombres
  repetidos descrito arriba;
- **el destino ya está ocupado** por un fichero que no se va a mover;
- **ciclo**, ficheros que se reclaman el sitio entre sí.

Los movimientos que sí se emiten van **ordenados**, de forma que ninguno pisa a
un fichero que todavía tiene que moverse. Un destino ocupado por algo que se va
a mover antes no es un conflicto, es una cuestión de orden.

Aplicar un plan además:

- escribe el registro en `.meta/undo/<id>.json` **antes** del primer
  movimiento, no después del último, porque una ejecución que se corta a medias
  es justo el caso en que deshacer importa;
- arrastra la metadata (`.meta/<sistema>/<Juego>.json`) detrás de su ROM, que
  de otro modo quedaría huérfana al cambiar la ruta que la indexa;
- borra `scan.json`, cuyas rutas acaban de dejar de ser ciertas;
- escribe los `game.json` que falten, sin tocar los que ya existan.

Deshacer recorre el registro al revés y **comprueba cada paso antes de darlo**,
de modo que una ejecución interrumpida, o una carpeta que el usuario ya ha
tocado a mano, revierte lo que todavía puede en vez de fallar entera.

Sobre datos reales, organizar los 23 sistemas completos son ~51 000
movimientos, 236 conflictos (0,46 %, todos por nombre duplicado en el DAT) y
ningún carácter no admitido por exFAT. La ruta más larga generada mide 256
caracteres, holgada en Linux pero cerca del `MAX_PATH` de Windows: es una
limitación aceptada, ya que el destino es la SD de un MiSTer.

## Carátulas

Las carátulas son las de `libretro-thumbnails`. Se publican con el **nombre
completo del DAT**, tags incluidos, así que una carátula pertenece a una release
y no a un juego: `Sonic (Japan)` y `Sonic (USA)` no llevan la misma. Y como la
release es lo que lleva región, lo que un juego guarda es **una carátula por
región**: EU, US y JP.

Dos capas, resueltas ambas en el build (`scripts/dat-to-json.mjs`):

- **por release**: emparejamiento exacto de nombre, entrada a entrada. Es el
  campo `cover` de cada entrada del dataset.
- **por juego y región**: unión por título base (`normalizeGameName`), en el mapa
  `covers` del dataset. Solo lleva lo que el emparejamiento exacto no alcanzó
  —una carátula publicada de una revisión que este DAT no lista, o la caja
  europea de un juego que el DAT solo lista como `(World)`—, y solo para las
  regiones a las que el DAT sí manda el juego. La clave `*` es el último recurso,
  para un título del que no se pudo situar ninguna carátula en ninguna región:
  porque sus entradas no traen región, o porque los únicos nombres publicados son
  de regiones a las que el DAT no lo manda. Sin ella, los juegos cuyo nombre
  publicado no lleva tag de región —un cuarto de ellos— perderían la carátula que
  hoy tienen.

**Qué carátula le toca a una región.** Una release habla por una región cuando va
*solo* a ella; una que va a varias apenas la sustituye. Esa distinción es lo que
ordena las candidatas, de mejor a peor:

1. carátula de una release de esa región sola, retail antes que beta o prototipo;
2. carátula que el mapa por juego trae para esa región —publicada bajo un nombre
   que sí la nombra, aunque sea de una release que el DAT no lista;
3. carátula de una release que va a esa región entre otras, típicamente `(World)`.

Sin esa escala, un juego como Sonic 2 de Mega Drive —cuyas quince releases son
todas `(World)`— enseñaría con preferencia EU la carátula de la release mundial,
que en `libretro-thumbnails` es el escaneo de la caja japonesa, mientras la caja
europea está publicada como `Sonic The Hedgehog 2 (Europe)` y no la alcanzaba
nadie. La elección no depende del orden de iteración.

Sobre los 23 sistemas: **19 895 de 26 548 juegos con carátula (74,9 %)**, la
misma cobertura que antes de repartirla por regiones. De ellos, 14 858 tienen
carátula de una sola región, 3 823 de dos, 1 148 de las tres y 66 solo del juego;
en **3 999** juegos las regiones no llevan la misma imagen, que son los juegos
donde el orden de preferencia cambia lo que se ve. El mapa por juego son 1 216
títulos y 1 302 URLs, unos 221 KB repartidos entre los 23 sistemas, y ninguna de
sus entradas es inalcanzable.

**Qué carátula se enseña.** Primero, entre las regiones a las que van los
ficheros que el usuario tiene, la primera del orden de preferencia: es la caja
que tienen, y enseñar la de otra región sería una pequeña mentira. Si ninguna de
esas tiene carátula, se recorre el orden completo. Y si ninguna región tiene, la
del juego; y si tampoco, el placeholder. Para una release mundial —un solo
fichero que va a las tres regiones— el orden es lo único que decide, y por eso
existe.

**Al abrir un fichero suelto** —una versión concreta, desde el panel del juego— la
carátula que se enseña es la del juego pero elegida entre las regiones de *esa*
release, no entre las del juego entero: abrir el dump japonés de un juego que
también se tiene en Europa enseña la caja japonesa. Un fichero que no pertenece a
ningún juego —modo plano, un dump que el dataset no reconoce— no tiene carátula
que enseñar y no se le inventa un hueco.

**Una release mundial tiene las tres regiones**, no una carátula sin región: va a
las tres, así que las tres tienen la suya y el orden puede elegir. Lo que no se
afirma es más de lo que se sabe: **cuando todas las regiones de un juego resuelven
a la misma imagen**, debajo se dice que es la caja *del juego* y no la de la
región que el orden eligió, porque un único escaneo para las tres no es la caja
europea por que la preferencia empiece por EU. Con una sola región sí se dice: un
juego publicado solo en Japón tiene carátula *de Japón*.

**Las imágenes se leen del repositorio, no de `thumbnails.libretro.com`.** Ese
origen sirve las mismas imágenes pero **sin cabecera
`Access-Control-Allow-Origin`**, de modo que el navegador puede mostrarlas y no
leer sus bytes; guardar una copia en `.meta/` exige leerlos. La URL es
`raw.githubusercontent.com/libretro-thumbnails/<Repo>/HEAD/Named_Boxarts/<nombre>.png`,
verificado en los 23 repositorios. `HEAD` sustituye al nombre de rama porque los
repositorios no coinciden en él.

Guardar la copia: `<Juego>.<región>.case.png` cuando la carátula es de una
región, `<Juego>.case.png` cuando es la del juego. La extensión sale de la URL y
nunca de la respuesta, así que el nombre de una carátula ya guardada se conoce sin
descargarla. Es el mismo nombre que toma una carátula puesta a mano, de modo que
en una biblioteca organizada sustituye a la publicada.

Sobre los 23 sistemas eso son 26 017 ficheros posibles —24 714 descargas, porque
dos regiones que comparten imagen la bajan una vez—, todos con nombre distinto
dentro de su sistema, ninguno con caracteres que exFAT no acepte y el más largo
de 130 caracteres.

### Imágenes puestas a mano

Una imagen se puede añadir arrastrándola al panel de detalles del juego, y al
soltarla se pregunta lo único que no está en los bytes: **de qué es** (carátula,
fondo, pantalla de título, captura, logo) y **de qué región** (EU, US, JP, o todas
las regiones). Esas dos respuestas son el nombre del fichero,
`<Juego>[.<región>].<tipo>.<ext>`, y el nombre es todo el mecanismo: una carátula
soltada para EU se lee después como la carátula de EU.

Leerlas es por tanto lo mismo que leer una copia descargada, y eso las mete en la
elección en vez de dejarlas solo servirla: **una imagen añadida a mano hace que su
región sea una opción**, incluso para un juego del que el catálogo no publica
ninguna carátula. Lo que una región tiene que ofrecer se mira en este orden: la
imagen guardada para ella, la guardada para todo el juego, y la publicada. Las dos
locales van antes porque alguien las puso a propósito, y la del juego sirve a
cualquier región —que es lo que hace que una carátula añadida «para todas las
regiones» se vea en un juego del que el catálogo ya trae tres.

Un `.meta/<sistema>` se lista una vez por sistema y carpeta abierta, que es lo que
hace asequible preguntarlo para cada juego que se mira.

**Navegar es lo que puebla `.meta/`**: al abrir un juego se muestra la copia
local si existe y la remota si no, y en ese caso se baja una copia en segundo
plano. No hay paso de descarga masiva y no se bajan miles de imágenes de juegos
que nadie abre. Una descarga bloqueada no es un error: se sigue mostrando la
imagen remota.

**Un juego que está en la biblioteca guarda todas sus regiones**, no solo la que
se está viendo. Es lo que distingue un juego inicializado —alguno de sus ficheros
tiene registro en `.meta/`— de uno que simplemente se ha mirado, y es lo que hace
que cambiar el orden de preferencia más tarde funcione sin red y sin depender de
que el proveedor siga ahí. Ocurre al abrir el juego y justo después de guardar su
metadata, así que sigue siendo la navegación la que puebla `.meta/` y no un paso
de descarga masiva. Cada carátula se baja por separado, así que una
descarga bloqueada no impide guardar las demás. Dos regiones que comparten imagen
se guardan una vez cada una: son ficheros distintos, y que falte uno devolvería
esa región a la red.

## Colecciones

- Ejemplos: colección NeoGeo de Darksoft, lista personal curada.
- Son **agrupaciones curadas**, no variantes del juego — un mismo juego
  puede pertenecer a varias colecciones a la vez.
- **Fuera del alcance del gestor**: son carpetas planas
  (`<sistema>/<colección>/`) que el usuario puebla manualmente. El gestor
  de ROMs **solo manipula (escanea/organiza/matchea) la carpeta base de
  cada sistema**, nunca el contenido de una carpeta de colección.
- Motivo: la SD/USB de MiSTer suele ir en FAT32/exFAT (sin symlinks/hard
  links), así que una colección "navegable desde MiSTer nativo" solo puede
  existir como copia física de ficheros — no tiene sentido que el gestor
  intente mantenerla sincronizada automáticamente.
- El manager, al escanear `<sistema>/` para detectar ROMs nuevos/huérfanos,
  debe **excluir explícitamente las subcarpetas de colección**. La regla
  depende del medio del sistema:
  - **Cartucho**: se gestionan los ficheros de la raíz de `<sistema>/`;
    cualquier subcarpeta es colección y no se toca.
  - **Disco**: las carpetas de juego y las de colección conviven en la raíz,
    así que el discriminante es la presencia de `game.json`.

## Explorador de ficheros

Dos fuentes combinadas en un mismo recorrido real del filesystem:

- **Modo plano**: listado directo vía File System Access API, tal cual —
  incluye colecciones, `.meta`, y cualquier fichero no reconocido.
- **Modo wizard**: mismo recorrido, pero por carpeta:
  - Oculta siempre `.meta`.
  - Para cada fichero, si el dataset lo reconoce (match por hash), lo
    agrupa con sus variantes hermanas dentro de su `GameGroup`.
  - Lo que no reconoce, lo muestra suelto igual que en modo plano.
  - Permite navegar subcarpetas y ver info de archivos/carpetas.

**Un juego es una sola fila, y no se despliega.** Que quince ficheros de Sonic 2
se lean como un juego es justo para lo que sirve agrupar, y una fila que se abre
y vuelve a enseñar los quince ficheros deshace eso. Así que la fila lleva sus
releases como dato, no como hijos, y donde se leen es en el panel de detalles:
todas las que el catálogo conoce, ausentes incluidas, con los ficheros de cada
una y el que falte marcado como tal.

En el árbol, un juego solo se distingue por el color del texto: los recuentos y
el detalle viven en el panel, que es donde hay sitio para leerlos. Allí las
releases presentes son un badge cada una —qué tienes se lee mejor que cuántas— y
las ausentes van plegadas, porque el catálogo puede listar quince frente a la
única que hay en disco. Cada versión lleva además las regiones a las que va y los
estándares a los que corre, que es lo que dice si una ROM sirve para tu televisor
y de qué caja es.

**Orden de preferencia de región.** En el panel de preferencias (⚙ en la cabecera),
las seis permutaciones de EU, US y JP; EU/US/JP por defecto. Cambiarlo no vuelve a
agrupar ni a rehashear nada: la fila de juego lleva las carátulas de todas sus
regiones como dato, no la que toca enseñar, y lo que hay en `.meta` ya está
listado, así que el panel simplemente elige otra. Debajo de la carátula se dice de
qué región es, porque con seis órdenes posibles la imagen sola no lo aclara.

**El panel de detalles acepta ficheros arrastrados**, y qué hace con ellos depende
de lo que haya seleccionado, no del fichero:

- **un juego**: las imágenes van a su metadata, preguntando tipo y región (ver
  «Imágenes puestas a mano»); lo demás se copia a la carpeta donde están sus ROMs.
- **una carpeta**: todo se añade tal cual, imágenes incluidas.
- **cualquier otra cosa** —un ROM suelto, varios ficheros, nada—: no hay dónde
  ponerlo, y se dice que no hay acciones disponibles en vez de adivinar.

Nada se escribe antes de confirmarlo: soltar un fichero es fácil de hacer sin
querer y difícil de deshacer. Un arrastre interno del propio árbol no cuenta como
drop aquí; mover un ROM al panel no significa nada.

La fila actúa sobre **todos** los ficheros del juego: seleccionarla los
selecciona, y arrastrar o borrar los mueve o los borra juntos. Como el árbol ya
no lista los ficheros de un juego, el panel de detalles es también la única vía
hasta uno: los presentes son botones que lo abren, con vuelta al juego.

**Activación de wizard por carpeta**: un único fichero `.meta/wizard.json`
guarda (entre otras posibles cosas) el listado de carpetas activadas como
wizard. Las carpetas de sistema son wizard por defecto; cualquier otra
carpeta (incluidas colecciones) puede activarse explícitamente ahí si se
quiere navegarla agrupada. El fichero guarda **solo las excepciones**: una
carpeta devuelta a su valor por defecto se borra de él, para que no queden
entradas obsoletas de sistemas renombrados.

El mismo fichero guarda el **orden de preferencia de región** (`regionOrder`),
que pertenece a la biblioteca y no al navegador: la preferencia es sobre la
colección que alguien tiene en una tarjeta, y viaja con ella. Como el fichero es
editable a mano, un orden que no sea una permutación de las tres regiones cae al
valor por defecto en vez de dejar al navegador sin forma de elegir.

**Qué juegos aparecen en modo wizard.** El explorador enseña el disco, no el
catálogo: solo se lista un juego si tiene **al menos un fichero presente**.
Enseñar los 26 548 juegos del dataset enterraría los veinte que el usuario
tiene. Dentro de un juego, en cambio, se listan **todas** sus variantes,
incluidas las ausentes — ver qué hermanas existen es la razón de agrupar. Lo
mismo con los ficheros de una variante parcial: el disco que falta se lista
para que se vea que falta. De un fichero ausente se enseña su **CRC32** donde el
presente enseña su tamaño: no está en disco, así que el nombre —que se lo pone el
dataset— no lo identifica y el checksum sí.

**Carpetas absorbidas.** Una carpeta cuyos ficheros han acabado todos dentro
de un juego desaparece del listado: su contenido ya está en pantalla un nivel
más arriba y mejor organizado. Eso es lo que convierte un juego de disco —una
carpeta por variante, varios ficheros cada una— en una sola fila, mientras que
una colección, en la que el escáner nunca entró, sigue intacta y navegable.
Las dos reglas caen de lo mismo: un fichero reconocido *reclama* su carpeta.

**El sistema se deduce del primer segmento de la ruta**, que es la estructura
que MiSTer impone en la SD. Consecuencia: agrupar requiere abrir la raíz que
contiene las carpetas de sistema; si se abre directamente `MegaDrive/`, no hay
forma de saber de qué sistema se trata y el explorador se queda en modo plano.

## Principios de diseño a mantener

- Dataset canónico = fuente de verdad de agrupación; no se reescribe on
  the fly al navegar, se consulta.
- El manager nunca toca lo que hay dentro de una carpeta de colección.
- Toda decisión de comportamiento por carpeta (wizard sí/no) es explícita
  y persistida (`wizard.json`), no inferida por heurística.

## Pendiente de definir

- Metadata editable por juego: hoy el registro `.json` se indexa por la ruta del
  fichero, así que en la estructura canónica de cartucho acaba siendo por
  variante (`<Juego>.<variante>.json`) y no por juego, que es lo que dice este
  documento.
- Neo Geo AES/MVS: identificación por nombre de romset, sin checksums (ver
  arriba).
