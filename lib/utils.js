/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const {createDefineFunction,extract} = require('brick-engine');
const {CLUSTER_SCOPE} = require('./constants');

exports.defineCluster = createDefineFunction('defineCluster', { scope: CLUSTER_SCOPE });

function extractCluster(module) {
  return extract(module, { scope: CLUSTER_SCOPE });
}


exports.extractCluster = extractCluster;
