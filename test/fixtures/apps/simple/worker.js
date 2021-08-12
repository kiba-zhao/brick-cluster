/**
 * @fileOverview worker模块
 * @name worker.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

console.log('simple:worker');

const { definePlugin } = require('brick-engine');
const { defineCluster } = require('../../../..');

class Worker {
  constructor() {
    console.log('simple:worker:new');
  }
  match() {
    return false;
  }
}

exports.Worker = Worker;
definePlugin(Worker, {});
defineCluster(Worker, { name: 'TEST_SIMPLE_WORKER' });
