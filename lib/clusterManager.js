/**
 * @fileOverview 集群
 * @name clusterManager.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module
 */
const assert = require('assert');
const { PACKAGE_NAME, CLUSTER_NAME } = require('../lib/constants');
const cluster = require('cluster');
const { Worker } = require('cluster'); // eslint-disable-line no-unused-vars
const os = require('os');
const { isArray, isString, isObject } = require('lodash');

const MODULE_KEY = `${PACKAGE_NAME}:lib:ClusterManager`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const CLUSTER_WORKERS = Symbol('CLUSTER_WORKERS');
const CLUSTER_ENVS = Symbol('CLUSTER_ENVS');
const ENV = Symbol('ENV');
/**
 * 集群键值
 * @typedef {string} ClusterKey
 */

/**
 * 集群命名
 * @typedef {string} ClusterName
 */

/**
 * 集群进程环境变量
 * @typedef {Object} ClusterEnv
 */

/**
 * 集群工作进程对象
 * @typedef {Worker} ClusterWorker
 */

class ClusterManager {

  /**
   * @see {@link module:lib/cluster~ClusterName} 集群命名
   * @see {@link module:lib/cluster~ClusterEnv} 集群进程环境变量
   * @private
   * @readonly
   * @type {Map<ClusterName,ClusterEnv>}
   */
  [CLUSTER_ENVS] = new Map();

  /**
   * @see {@link module:lib/cluster~ClusterKey} 集群键值
   * @see {@link module:lib/cluster~ClusterWorker} 集群工作进程对象
   * @private
   * @readonly
   * @type {Map<ClusterKey,ClusterWorker>}
   */
  [CLUSTER_WORKERS] = new Map();

  /**
   * 集群构造函数
   * @class
   * @see {@link module:lib/cluster~ClusterEnv} 集群环境变量
   * @param {string[]} workerArgs 集群工作进程参数
   * @param {ClusterEnv} [env] 集群主进程环境变量
   */
  constructor(workerArgs, env = process.env) {

    debug('constructor %s %s', workerArgs, env);

    assert(
      isArray(workerArgs) && workerArgs.every(isString),
      `[${MODULE_KEY}] constructor Error: wrong workerArgs`
    );

    assert(
      isObject(env),
      `[${MODULE_KEY}] constructor Error: wrong env`
    );

    this[ENV] = env;

    cluster.setupMaster({
      exec: require.resolve('../bin/brick-cluster'),
      args: [ '--worker', ...workerArgs ],
    });

  }

  /**
   * 定义工作进程
   * @see {@link module:lib/cluster~ClusterName} 集群命名
   * @see {@link module:lib/cluster~ClusterEnv} 集群进程环境变量
   * @param {ClusterName} name 子进程命名
   * @param {ClusterEnv} [env] 子进程环境变量
   */
  defineWorker(name, env = {}) {

    debug('addWorker %s %s', name, env);

    assert(
      isString(name),
      `[${MODULE_KEY}] defineWorker Error: wrong name`
    );

    assert(
      isObject(env),
      `[${MODULE_KEY}] defineWorker Error: wrong env`
    );

    const clusterEnvMap = this[CLUSTER_ENVS];
    if (clusterEnvMap.has(name)) {
      const current = clusterEnvMap.get(name);
      clusterEnvMap.set(name, { ...current, ...env });
    } else {
      clusterEnvMap.set(name, env);
    }
  }

  /**
   * 工作进程数量字典
   * @see {@link module:lib/cluster~ClusterName} 集群命名
   * @return {Map<ClusterName,Number>}
   */
  get workersCountMap() {

    const clusterEnvMap = this[CLUSTER_ENVS];
    const env = this[ENV];
    const cpus = os.cpus();
    const map = new Map();

    for (const [ clusterName, clusterEnv ] of clusterEnvMap.entries()) {
      if (env[CLUSTER_NAME] !== undefined && clusterName !== env[CLUSTER_NAME]) {
        continue;
      }
      let workerCount = parseInt(env[clusterName] || clusterEnv[clusterName]);
      if (isNaN(workerCount)) {
        continue;
      }
      if (workerCount < 0) {
        workerCount = Math.max(cpus.length - 1, 1);
      }
      map.set(clusterName, workerCount);
    }

    return map;
  }

  /**
   * 启动所有工作进程
   */
  start() {

    debug('start');

    const workersCountMap = this.workersCountMap;
    for (const [ name, count ] of workersCountMap.entries()) {

      for (let i = 0; i < count; i++) {
        this.startWorker(name, i);
      }
    }

  }

  /**
   * 重启所有工作进程
   */
  restart() {

    debug('restart');

    this.stop();
    this.start();
  }

  /**
   * 停止所有工作进程
   */
  stop() {

    debug('stop');

    const workers = this[CLUSTER_WORKERS];
    for (const worker of workers.values()) {
      worker.disconnect();
    }
    workers.clear();

  }

  /**
   * 启动工作进程
   * @see {@link module:lib/cluster~ClusterName} 集群命名
   * @see {@link module:lib/cluster~ClusterWorker} 集群工作进程
   * @param {ClusterName} name 进程名称
   * @param {Number} index 进程序号
   * @param {ClusterWorker} [oldWorker] 当前工作进程对象
   */
  startWorker(name, index, oldWorker) {

    debug('startWorker %s, %s, %s', name, index, oldWorker);

    const workers = this[CLUSTER_WORKERS];
    const key = `${name}-${index}`;
    if (oldWorker !== undefined && oldWorker !== workers.get(key)) {
      return;
    }

    const self = this;
    const env = this[ENV];
    const clusterEnvMap = this[CLUSTER_ENVS];
    const clusterEnv = clusterEnvMap.get(name);
    const worker = cluster.fork({ ...clusterEnv, ...env, [CLUSTER_NAME]: name });
    workers.set(key, worker);

    worker.on('disconnect', () => {
      if (worker.exitedAfterDisconnect !== true) {
        self.startWorker(name, index, worker);
      }
    });

  }
}

exports.ClusterManager = ClusterManager;
