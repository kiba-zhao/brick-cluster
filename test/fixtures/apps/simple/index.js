/**
 * @fileOverview 示例目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { defineModule, defineApplication } = require('brick-engine');
const { Master } = require('./master');
const { Agent } = require('./agent');
const { Worker } = require('./worker');

const app = {};
defineApplication(exports, app);

defineModule(app, Master);
defineModule(app, Agent);
defineModule(app, Worker);
