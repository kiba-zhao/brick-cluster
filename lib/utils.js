/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const {
  Engine, Provider, InstallPlugin, MountPlugin, InjectPlugin,
} = require('brick-engine');
const { ModulePlugin, ClusterPlugin } = require('../plugins');
const { Cluster } = require('./cluster');
const { PACKAGE_NAME } = require('./constants');

const MODULE_KEY = `${PACKAGE_NAME}:lib:utils`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

/**
 * 创建主引擎
 * @async
 * @param {Provider} provider 依赖提供器实例
   * @param {string[]} workerArgs 集群工作进程参数
 * @return {Promise<Engine>} 主引擎
 */
async function createMasterEngine(workerArgs, provider = new Provider()) {

  debug('createMasterEngine %s', provider);

  const masterEngine = await createWorkerEngine(provider);
  provider.define(Cluster, [], () => new Cluster(workerArgs));
  await masterEngine.mount(ClusterPlugin, { deps: [{ id: Cluster }] });

  return masterEngine;
}

exports.createMasterEngine = createMasterEngine;

/**
 * 创建工作引擎
 * @async
 * @param {Provider} provider 依赖提供器实例
 * @return {Promise<Engine>} 工作引擎
 */
async function createWorkerEngine(provider = new Provider()) {

  debug('createWorkerEngine %s', provider);

  provider.define(Provider, [], () => provider);
  provider.define(Engine, [{ id: Provider }], Engine);

  /** @type Engine[] **/
  const [ engine ] = await provider.require({ id: Engine });
  await engine.mount(MountPlugin, { deps: [{ id: Engine }] });
  await engine.mount(InjectPlugin, { deps: [{ id: Provider }] });

  const workerEngine = new Engine(provider);
  provider.define(InstallPlugin, [], () => new InstallPlugin(workerEngine));
  await workerEngine.mount(ModulePlugin, { deps: [{ id: InstallPlugin }, { id: Engine }] });

  return workerEngine;
}

exports.createWorkerEngine = createWorkerEngine;
