/**
 * @fileOverview 模块处理插件
 * @name module.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


/**
 * @module
 */
const assert = require('assert');
const { PACKAGE_NAME, CLUSTER_NAME } = require('../lib/constants');
const { extractCluster, replaceCluster } = require('./utils');
const { EngineModule } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { Engine, copyMetadata } = require('brick-engine');
const { InstallPlugin } = require('brick-engine');

const MODULE_KEY = `${PACKAGE_NAME}:plugins:ModulePlugin`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const INSTALL_PLUGIN = Symbol('INSTALL_PLUGIN');
const ENGINE = Symbol('ENGINE');
const ENV = Symbol('ENV');

class ModulePlugin {

  /**
   * 模块处理插件
   * @see {@link module:lib/engine~Engine} 引擎类
   * @class
   * @param {InstallPlugin} installPlugin 安装插件
   * @param {Engine} engine 引擎实例
   * @param {Object} env 环境变量实例
   */
  constructor(installPlugin, engine, env = process.env) {

    debug('constructor %s %s', installPlugin, engine, env);

    assert(
      installPlugin instanceof InstallPlugin,
      `[${MODULE_KEY}] constructor Error: wrong installPlugin`
    );

    assert(
      engine instanceof Engine,
      `[${MODULE_KEY}] constructor Error: wrong engine`
    );

    assert(
      env,
      `[${MODULE_KEY}] constructor Error: wrong env`
    );

    this[INSTALL_PLUGIN] = installPlugin;
    this[ENGINE] = engine;
    this[ENV] = env;

  }

  /**
   *使用模块方法
   * @see {@link module:lib/engine~EngineModule} 引擎模块类型
   * @see {@link module:lib/engine~EngineInstallOpts} 引擎模块安装可选参数
   * @param {EngineModule} module 使用的模块
   * @param {EngineInstallOpts} opts 引擎模块安装可选参数
   */
  async use(module, opts) {
    debug('use %s %s', module, opts);

    const promises = [];

    let clusterQueue = extractCluster(module);

    let _opts;
    if (clusterQueue.length <= 0) {
      clusterQueue = extractCluster(opts);
      _opts = opts;
    } else {
      _opts = { ...opts };
      copyMetadata(_opts, opts);
      replaceCluster(_opts, ...clusterQueue);
    }

    const env = this[ENV];
    const isClusterModule = clusterQueue.length > 0 ? clusterQueue.some(_ => _.name === env[CLUSTER_NAME]) : env[CLUSTER_NAME] === undefined;
    if (isClusterModule) {
      const engine = this[ENGINE];
      promises.push(engine.install(module, _opts));
    }

    const installPlugin = this[INSTALL_PLUGIN];
    if (installPlugin.match(module, _opts)) {
      promises.push(installPlugin.use(module, _opts));
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }

  }

}

exports.ModulePlugin = ModulePlugin;
