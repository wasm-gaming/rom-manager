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

Usar los mismos nombres de sistema que usa MiSTer.

NES, SNES, Game Boy / Color, GBA, N64, Master System, Game Gear,
Mega Drive/Genesis, Mega-CD/Sega CD, 32X, Saturn, PSX,
Neo Geo (AES/MVS/CD), TurboGrafx-16/PC Engine (+CD),
Atari 2600/5200/7800, Atari Lynx, WonderSwan/Color, Pokémon Mini.

(Sistemas de nicho de MiSTer quedan fuera por ahora: ColecoVision,
Intellivision, Vectrex, Odyssey2, Channel F, VC4000, Arcadia 2001,
Astrocade, Gamate, SuperVision, Casio PV-1000, CreatiVision, MyVision,
Super Vision 8000, Adventure Vision, BBC Bridge Companion, AY-3-8500.)

La lista es **cerrada**: quedan también fuera los sistemas post-retro que el
repositorio incluye hoy en `scripts/systems.mjs` y que deben retirarse
(GameCube, Wii, PlayStation 2, PSP, Dreamcast, Commodore 64, Amiga).

## Concepto de agrupación (juego ↔ variantes)

Basado en el patrón validado a partir de `igir` (sin reutilizar su código,
que depende de binarios nativos incompatibles con el navegador):

- **Identificar por hash, no por nombre de fichero** — el nombre local no es
  fiable; el hash contra el DAT sí.
- **"Candidato"**: cada entrada del DAT es una variante candidata a la que
  un fichero local puede o no matchear (catálogo teórico vs. lo que
  realmente tienes en disco).
- **Agrupación por `cloneOf`** cuando el DAT lo trae (DATs "parent-clone" de
  No-Intro/Redump) — más fiable que parsear el título. Si no está
  disponible, fallback a agrupar por título base tras extraer tags de
  región/idioma/revisión/flags del nombre.

Prototipo de esta lógica **pendiente de implementar** en TypeScript puro (sin
dependencias de Node): tipos `DatGame`, `GameVariant`, `GameGroup`,
funciones `parseGameName`, `groupDatGames`, `hashLocalFile` (streaming +
Web Crypto), `matchGroupsWithLocalFiles`. Irá en `src/core/rom-grouping.ts`.

Requisito previo: el generador de datasets (`scripts/dat-to-json.mjs`) **no
conserva hoy `cloneOf`/`romof`**, así que la agrupación parent-clone no es
posible con el formato actual. Hay que emitirlo antes de construir nada
encima.

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

`game.json` existe **solo en sistemas de disco** y es deliberadamente mínimo
(`gameId`, `title`, `system`). Su papel no es guardar datos, sino marcar la
carpeta como juego gestionado para distinguirla de una colección.

### Identidad de variante

La clave de variante se deriva **del dataset, nunca del nombre del fichero
local**. Es el sufijo del fichero en sistemas de cartucho y el nombre de la
subcarpeta en sistemas de disco. Segmentos en orden fijo unidos por `-`:

```
<región>[-<revisión>][-<flag>][-<idioma>][-<crc8>]
```

- **región**: cadena de No-Intro literal (`USA`, `Europe`, `Japan`, `World`);
  multi-región une con `+` (`USA+Europe`).
- **revisión**: `(Rev 1)` → `rev1`, `(Rev A)` → `revA`, `(v1.1)` → `v11`.
- **flag**: `beta`, `beta2`, `proto`, `demo`, `sample`, `unl`, `aftermarket`.
- **idioma**: solo cuando es lo único que distingue dos variantes
  (`Europe-Es`).
- **crc8**: 8 hex del CRC32 de la ROM principal, añadido **solo** si tras lo
  anterior dos variantes del mismo grupo siguen colisionando. Se añade a
  todas las colisionantes, no solo a la segunda, para que el resultado no
  dependa del orden de iteración.

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
thumbnails, de modo que **el nombre de la carpeta del juego coincide con el
nombre del thumbnail**. El matching de carátulas no necesita tabla de
correspondencia aparte.

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
