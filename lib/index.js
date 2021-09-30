/**
 * @fileOverview 库目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Cluster } = require('./cluster');
const { createMasterEngine, createWorkerEngine, clusterSetup } = require('./utils');

module.exports = {
  Cluster,
  createMasterEngine, createWorkerEngine,
  clusterSetup,
};
