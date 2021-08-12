/**
 * @fileOverview 插件工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const {
  createDefineFunction, createExtractFunction, createReplaceFunction,
} = require('brick-engine');

const CLUSTER_SCOPE = Symbol('CLUSTER_SCOPE');

exports.defineCluster = createDefineFunction('defineCluster', { scope: CLUSTER_SCOPE });

exports.extractCluster = createExtractFunction('extractCluster', { scope: CLUSTER_SCOPE });

exports.replaceCluster = createReplaceFunction('replaceCluster', { scope: CLUSTER_SCOPE });
