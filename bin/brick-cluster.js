#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-cluster.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { PACKAGE_NAME } = require('../lib/constants');
const { createMasterEngine, createWorkerEngine, clusterSetup } = require('../lib');
const { Provider } = require('brick-engine');

const MODULE_KEY = `${PACKAGE_NAME}:bin`;
const debug = require('debug')(MODULE_KEY);

async function main(appPaths) {

  debug('main %s', appPaths);

  let isWorker = false;
  const apps = [];
  for (const appPath of appPaths) {
    if (appPath === '--worker' && !isWorker) {
      isWorker = true;
      continue;
    }

    apps.push(require(appPath));
  }

  const provider = new Provider();
  const engine = isWorker ? await createWorkerEngine(provider) : await createMasterEngine(appPaths, provider);

  if (apps.length <= 0) {
    apps.push(process.cwd());
  }
  await clusterSetup(provider, engine, apps);
}

main(process.argv.length > 2 ? process.argv.slice(2) : [ process.cwd() ]).catch(e => console.error(e));
