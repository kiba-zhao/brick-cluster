/**
 * @fileOverview 助理线程模块
 * @name agent.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

console.log('simple:agent');

const { definePlugin } = require('brick-engine');
const { defineCluster } = require('../../../..');

class Agent {
  constructor() {
    console.log('simple:agent:new');
  }
  match() {
    return false;
  }
}

exports.Agent = Agent;
definePlugin(Agent, {});
defineCluster(Agent, { name: 'TEST_SIMPLE_AGENT' });
