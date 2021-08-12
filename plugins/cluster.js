/**
 * @fileOverview 多进程处理插件
 * @name cluster.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module
 */
const assert = require('assert');
const { PACKAGE_NAME } = require('../lib/constants');
const { extractCluster } = require('./utils');
const { EngineModule } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { Cluster } = require('../lib/cluster');

const MODULE_KEY = `${PACKAGE_NAME}:plugins:ClusterPlugin`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const CLUSTER = Symbol('CLUSTER');

class ClusterPlugin {

  /**
   * 多进程处理插件
   * @see {@link module:lib/engine~Engine} 引擎类
   * @class
   * @param {Cluster} cluster 集群实例
   */
  constructor(cluster) {

    debug('constructor %s %s', cluster);

    assert(
      cluster instanceof Cluster,
      `[${MODULE_KEY}] constructor Error: wrong cluster`
    );

    this[CLUSTER] = cluster;

  }

  /**
   *检查是否为匹配模块
   * @see {@link module:lib/engine~EngineModule} 引擎模块类型
   * @param {EngineModule} module 检查的模块
   * @return {boolean} true:匹配/false:不匹配
   */
  match(module) {

    debug('match %s', module);

    const clusterQueue = extractCluster(module);
    return clusterQueue.length > 0 && clusterQueue.some(_ => _.name !== undefined);

  }

  /**
   *使用模块方法
   * @see {@link module:lib/engine~EngineModule} 引擎模块类型
   * @param {EngineModule} module 使用的模块
   */
  async use(module) {

    debug('use %s', module);

    /** @type {Cluster} **/
    const cluster = this[CLUSTER];
    const metadataQueue = extractCluster(module);
    for (const { name, env } of metadataQueue) {
      if (name === undefined) {
        continue;
      }
      cluster.defineWorker(name, env);
    }
  }

}

exports.ClusterPlugin = ClusterPlugin;
