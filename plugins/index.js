/**
 * @fileOverview 插件目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ClusterPlugin } = require('./cluster');
exports.ClusterPlugin = ClusterPlugin;

const { ModulePlugin } = require('./module');
exports.ModulePlugin = ModulePlugin;

const { defineCluster, extractCluster, replaceCluster } = require('./utils');
exports.defineCluster = defineCluster;
exports.extractCluster = extractCluster;
exports.replaceCluster = replaceCluster;
