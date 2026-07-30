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
.meta/<sistema>/<Juego>.<variante>.case.png        # carátula
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

### Ficheros de una misma release

Un DAT lista **una entrada por fichero**, no por release. Una misma release
aparece repetida cuando se reparte en varios ficheros: los discos de un juego
Redump (`(Disc 1)`, `(Disc 2)`…) y también los cartuchos partidos en varios
chips, que repiten el nombre completo sin ningún tag que los distinga.

Las entradas de una misma release se identifican por su **nombre completo sin
el tag de disco** y se fusionan en una sola variante con varios ficheros.
Derivarlo del nombre crudo, y no de los campos ya parseados, es lo que evita
fusionar dos releases distintas que solo difieren en un tag no reconocido.

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
por tanto **por variante**, no por juego, y ya la resuelve entrada a entrada
`scripts/dat-to-json.mjs`. Compartir el saneado sigue siendo útil porque
garantiza que ningún nombre de carátula introduce caracteres que el sistema de
ficheros no acepte.

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

**Activación de wizard por carpeta**: un único fichero `.meta/wizard.json`
guarda (entre otras posibles cosas) el listado de carpetas activadas como
wizard. Las carpetas de sistema son wizard por defecto; cualquier otra
carpeta (incluidas colecciones) puede activarse explícitamente ahí si se
quiere navegarla agrupada.

## Principios de diseño a mantener

- Dataset canónico = fuente de verdad de agrupación; no se reescribe on
  the fly al navegar, se consulta.
- El manager nunca toca lo que hay dentro de una carpeta de colección.
- Toda decisión de comportamiento por carpeta (wizard sí/no) es explícita
  y persistida (`wizard.json`), no inferida por heurística.

## Pendiente de definir

- Carátulas: matching contra `libretro-thumbnails` por nombre canónico
  (resuelto a nivel de nombre por `normalizeGameName`, falta detallar el
  flujo de descarga y almacenamiento en `.meta`).
- Estrategia de carga de datasets en IndexedDB: hoy se cargan todos al
  arrancar; con la lista completa de sistemas conviene cargarlos por sistema
  bajo demanda.
- Reorganización de una biblioteca existente hacia la estructura canónica:
  es la única operación destructiva sobre ficheros del usuario, necesita
  previsualización y registro de operaciones para deshacer.
