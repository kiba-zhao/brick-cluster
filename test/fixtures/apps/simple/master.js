/**
 * @fileOverview 主线程模块
 * @name master.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

console.log('simple:master');

const { definePlugin } = require('brick-engine');

class Master {
  constructor() {
    console.log('simple:master:new');
  }
  match() {
    return false;
  }
}

exports.Master = Master;
definePlugin(Master, {});
