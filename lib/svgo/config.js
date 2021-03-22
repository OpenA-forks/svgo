'use strict';

const pluginsMap = require('../../plugins/plugins.js');

const pluginsOrder = [
  'removeDoctype',
  'removeXMLProcInst',
  'removeComments',
  'removeMetadata',
  'removeXMLNS',
  'removeEditorsNSData',
  'cleanupAttrs',
  'inlineStyles',
  'minifyStyles',
  'convertStyleToAttrs',
  'cleanupIDs',
  'prefixIds',
  'removeRasterImages',
  'removeUselessDefs',
  'cleanupNumericValues',
  'cleanupListOfValues',
  'convertColors',
  'removeUnknownsAndDefaults',
  'removeNonInheritableGroupAttrs',
  'removeUselessStrokeAndFill',
  'removeViewBox',
  'cleanupEnableBackground',
  'removeHiddenElems',
  'removeEmptyText',
  'convertShapeToPath',
  'convertEllipseToCircle',
  'moveElemsAttrsToGroup',
  'moveGroupAttrsToElems',
  'collapseGroups',
  'convertPathData',
  'convertTransform',
  'removeEmptyAttrs',
  'removeEmptyContainers',
  'mergePaths',
  'removeUnusedNS',
  'sortAttrs',
  'sortDefsChildren',
  'removeTitle',
  'removeDesc',
  'removeDimensions',
  'removeAttrs',
  'removeAttributesBySelector',
  'removeElementsByAttr',
  'addClassesToSVGElement',
  'removeStyleElement',
  'removeScriptElement',
  'addAttributesToSVGElement',
  'removeOffCanvasPaths',
  'reusePaths',
];
const defaultPlugins = pluginsOrder.filter((name) => pluginsMap[name].active);
exports.defaultPlugins = defaultPlugins;

const extendDefaultPlugins = (plugins) => {
  const extendedPlugins = pluginsOrder.map(
    name => Object.assign({ name }, pluginsMap[name])
  );
  for (const plugin of plugins) {
    const resolvedPlugin = resolvePluginConfig(plugin, {});
    const index = pluginsOrder.indexOf(resolvedPlugin.name);
    if (index === -1) {
      extendedPlugins.push(plugin);
    } else {
      extendedPlugins[index] = plugin;
    }
  }
  return extendedPlugins;
};
exports.extendDefaultPlugins = extendDefaultPlugins;

const assignBuiltinPlugin = (name, config) => {

  if (!(name in pluginsMap)) {
    throw new Error(`Unknown builtin plugin "${name}" specified.`);
  }
  const plugin = pluginsMap[name],
          keys = Object.keys(plugin),
          pidx = keys.indexOf('params');

  if (pidx !== -1) {
    config.params = Object.assign({}, plugin.params, config.params);
    keys.splice(1, pidx);
  }
  for (const key of keys) {
    config[key] = plugin[key];
  }
  config.active = true;
};
exports.assignBuiltinPlugin = assignBuiltinPlugin;

const resolvePluginConfig = (plugin, config) => {

  const pluginConfig = {
    active: true,
    params: {}
  };

  if ('floatPrecision' in config) {
    pluginConfig.params.floatPrecision = config.floatPrecision;
  }
  if (typeof plugin === 'string') {
    // resolve builtin plugin specified as string
    assignBuiltinPlugin(plugin, pluginConfig);
  }
  else if (typeof plugin === 'object' && plugin !== null) {

    const { name, params, fn } = plugin;

    if ( !name ) {
      throw new Error(`Plugin name should be specified`);
    }
    if (typeof fn !== 'function') {
      // resolve builtin plugin specified as object without implementation
      assignBuiltinPlugin(name, pluginConfig);
    }
    // resolve custom plugin with implementation
    let keys = Object.keys(plugin);
        keys.splice(1,keys.indexOf('params'));

    for (const key of keys) {
      pluginConfig[key] = plugin[key];
    }
    Object.assign(pluginConfig.params, params);
  } else
    return null;
  return pluginConfig;
};
exports.resolvePluginConfig = resolvePluginConfig;
