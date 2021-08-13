/**
 * @fileOverview 插件工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module
 */
const assert = require('assert');
const {
  createDefineFunction, createExtractFunction, createReplaceFunction,
} = require('brick-engine');
const { EngineModule } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { ClusterName, ClusterEnv } = require('../lib/cluster'); // eslint-disable-line no-unused-vars
const { isString, isObject, isArray } = require('lodash');
const { PACKAGE_NAME } = require('../lib/constants');

const MODULE_KEY = `${PACKAGE_NAME}:plugins:utils`;
const debug = require('debug')(MODULE_KEY);

const CLUSTER_SCOPE = Symbol('CLUSTER_SCOPE');

/**
 * 集群元数据
 * @see {@link module:lib/cluster~ClusterName} 集群命名
 * @see {@link module:lib/cluster~ClusterEnv} 集群进程环境变量
 * @typedef {Object} ClusterMetadata
 * @property {ClusterName} [name] 工作进程命名
 * @property {ClusterEnv} [env] 工作进程环境变量
 */

/**
 * 是否为集群元数据函数
 * @param {ClusterMetadata} metadata 集群元数据
 * @return {boolean} true:是/false:否
 */
function isClusterMetadata(metadata) {

  debug('isClusterMetadata %s', metadata);

  if (!isObject(metadata)) {
    return false;
  }
  const { name, env } = metadata;
  if (name !== undefined && !isString(name)) {
    return false;
  }
  return env === undefined || isObject(env);
}

/**
 * @see {@link module:lib/engine~EngineModule} 引擎模块
 * @see {@link module:plugins/utils~ClusterMetadata} 集群元数据
 * @type {function(EngineModule,ClusterMetadata):EngineModule}
 */
const _defineCluster = createDefineFunction('defineCluster', { scope: CLUSTER_SCOPE });

/**
 * 定义集群函数
 * @see {@link module:lib/engine~EngineModule} 引擎模块
 * @see {@link module:plugins/utils~ClusterMetadata} 集群元数据
 * @param {EngineModule} target 目标引擎模块对象
 * @param {...ClusterMetadata} metadatas 集群元数据
 */
function defineCluster(target, ...metadatas) {

  debug('defineCluster %s, %s', target, metadatas);

  assert(
    isArray(metadatas) && metadatas.every(isClusterMetadata),
    `[${MODULE_KEY}] defineCluster Error: wrong metadatas`
  );

  const args = metadatas.length > 0 ? metadatas : [{}];
  return _defineCluster(target, ...args);

}

exports.defineCluster = defineCluster;

/**
 * @see {@link module:lib/engine~EngineModule} 引擎模块
 * @see {@link module:plugins/utils~ClusterMetadata} 集群元数据
 * @type {function(EngineModule):ClusterMetadata[]}
 */
exports.extractCluster = createExtractFunction('extractCluster', { scope: CLUSTER_SCOPE });

/**
 * @see {@link module:lib/engine~EngineModule} 引擎模块
 * @see {@link module:plugins/utils~ClusterMetadata} 集群元数据
 * @type {function(EngineModule,ClusterMetadata):EngineModule}
 */
const _replaceCluster = createReplaceFunction('replaceCluster', { scope: CLUSTER_SCOPE });

/**
 * 替换集群元数据
 * @param {EngineModule} target 目标引擎模块
 * @param {...ClusterMetadata} metadatas 集群元数据
 * @return {EngineModule} 目标引擎模块
 */
function replaceCluster(target, ...metadatas) {

  debug('replaceCluster %s, %s', target, metadatas);

  assert(
    isArray(metadatas) && metadatas.every(isClusterMetadata),
    `[${MODULE_KEY}] replaceCluster Error: wrong metadatas`
  );

  return _replaceCluster(target, ...metadatas);
}

exports.replaceCluster = replaceCluster;
