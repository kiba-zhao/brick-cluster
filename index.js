/**
 * @fileOverview 包目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ClusterManager, createMasterEngine, createWorkerEngine, clusterSetup } = require('./lib');
const { ClusterPlugin, ModulePlugin, defineCluster, extractCluster, replaceCluster } = require('./plugins');
const { Cluster } = require('./decorators');

module.exports = {
  ClusterManager, createMasterEngine, createWorkerEngine,
  defineCluster, extractCluster, replaceCluster,
  ClusterPlugin, ModulePlugin,
  clusterSetup,
  Cluster,
};
