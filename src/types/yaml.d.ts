/**
 * What `import messages from './en.yaml'` is, to TypeScript.
 *
 * `@rollup/plugin-yaml` hands the parsed document over as the module's default
 * export. A catalogue is nested by area and its leaves are strings, which is
 * exactly what `translate()` walks, so the type says that and no more.
 */
declare module '*.yaml' {
  const messages: import('../core/i18n').Messages;
  export default messages;
}
