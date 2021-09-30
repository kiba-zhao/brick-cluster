/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module
 */
const assert = require('assert');
const { isArray, isString } = require('lodash');
const {
  createEngine, Engine, Provider, InstallPlugin, defineReady, ReadyPlugin, setup,
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
 * @param {string[]} workerArgs 集群工作进程参数
 * @param {Provider} [provider] 依赖提供器实例
 * @return {Promise<Engine>} 主引擎
 */
async function createMasterEngine(workerArgs, provider = new Provider()) {

  debug('createMasterEngine %s', provider);

  assert(
    isArray(workerArgs) && workerArgs.every(isString),
    `[${MODULE_KEY}] createMasterEngine Error: wrong workerArgs`
  );

  assert(
    provider instanceof Provider,
    `[${MODULE_KEY}] createMasterEngine Error: wrong provider`
  );
  const masterEngine = await createWorkerEngine(provider);
  provider.define(Cluster, [], () => new Cluster(workerArgs));
  await masterEngine.mount(ClusterPlugin, { deps: [{ id: Cluster }] });

  /** @type {Engine[]} **/
  const [ runtimeEngine ] = await provider.require({ id: Engine });
  const clusterModule = defineReady({}, { id: Cluster, method: 'start' });
  await runtimeEngine.install(clusterModule);

  return masterEngine;
}

exports.createMasterEngine = createMasterEngine;

/**
 * 创建工作引擎
 * @async
 * @param {Provider} [provider] 依赖提供器实例
 * @return {Promise<Engine>} 工作引擎
 */
async function createWorkerEngine(provider = new Provider()) {

  debug('createWorkerEngine %s', provider);

  assert(
    provider instanceof Provider,
    `[${MODULE_KEY}] createWorkerEngine Error: wrong provider`
  );

  await createEngine(provider, { install: false });

  const workerEngine = new Engine(provider);
  provider.define(InstallPlugin, [], () => new InstallPlugin(workerEngine));
  await workerEngine.mount(ModulePlugin, { deps: [{ id: InstallPlugin }, { id: Engine }] });

  return workerEngine;
}

exports.createWorkerEngine = createWorkerEngine;

/**
 * 集群安装
 * @async
 * @param {Provider} provider 提供器
 * @param {Engine} engine 引擎
 * @param {EngineModule} modules 引擎模块
 */
async function clusterSetup(provider, engine, modules) {

  debug('clusterSetup %s %s %s', provider, engine, modules);

  await setup(engine, modules, { ready: false });

  /** @type {Engine[]} **/
  const [ runtimeEngine ] = await provider.require({ id: Engine });
  await runtimeEngine.mount(ReadyPlugin, { deps: [{ id: Provider }] });
}

exports.clusterSetup = clusterSetup;
