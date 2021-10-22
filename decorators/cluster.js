/**
 * @fileOverview 集群装饰器
 * @name cluster.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { defineCluster } = require('../plugins');
const { EngineModule } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { ClusterMetadata } = require('../plugins/utils'); // eslint-disable-line no-unused-vars
const { PACKAGE_NAME } = require('../lib/constants');

const MODULE_KEY = `${PACKAGE_NAME}:decorators:Cluster`;
const debug = require('debug')(MODULE_KEY);

/**
 * 集群装饰器工厂
 * @param {...ClusterMetadata} [metadatas] 集群元数据
 * @return {function(EngineModule):void} 集群装饰器
 */
function Cluster(...metadatas) {

  debug('Cluster %s', metadatas);

  return function(target) {
    defineCluster(target, ...metadatas);
  };

}

exports.Cluster = Cluster;
