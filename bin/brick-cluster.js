#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-cluster.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { PACKAGE_NAME } = require('../lib/constants');
const { Cluster, createMasterEngine, createWorkerEngine } = require('../lib');
const { setup, Provider } = require('brick-engine');

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
  await setup(engine, ...apps);

  if (!isWorker) {
    /** @type {Cluster[]} **/
    const [ cluster ] = await provider.require({ id: Cluster });
    cluster.start();
  }

}

main(process.argv.length > 2 ? process.argv.slice(2) : [ process.cwd() ]).catch(e => console.error(e));
