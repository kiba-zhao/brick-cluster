#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-cluster.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { PACKAGE_NAME } = require('../lib/constants');
const { createMasterEngine, createWorkerEngine } = require('../lib');
const { setup, Engine, Provider, ReadyPlugin } = require('brick-engine');

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
  /** @type {Engine[]} **/
  const [ runtimeEngine ] = await provider.require({ id: Engine });
  await runtimeEngine.mount(ReadyPlugin, { deps: [{ id: Provider }] });

}

main(process.argv.length > 2 ? process.argv.slice(2) : [ process.cwd() ]).catch(e => console.error(e));
