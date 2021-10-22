/**
 * @fileOverview 库目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ClusterManager } = require('./clusterManager');
const { createMasterEngine, createWorkerEngine, clusterSetup } = require('./utils');

module.exports = {
  ClusterManager,
  createMasterEngine, createWorkerEngine,
  clusterSetup,
};
