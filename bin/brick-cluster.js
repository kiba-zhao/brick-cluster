#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name brick-cluster.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const { PACKAGE_NAME } = require('../lib/constants');
const { APPLICATION_SCOPE } = require('brick-engine/lib/constants');
const {extract,Engine,Provider,InstallPlugin,MountPlugin,InjectPlugin} = require('brick-engine');
const {Cluster} = require('../lib');
const {ClusterPlugin,ModulePlugin} = require('../plugins');

const MODULE_KEY = `${PACKAGE_NAME}:bin`;
const debug = require('debug')(MODULE_KEY);

const processArgs = process.argv.length > 2 ? process.argv.slice(2) : [ process.cwd() ];

async function main(args) {

  debug('main: %s', args.join(','));

  const appPaths = [];
  let isWorkerMode = false;
  for (let arg of processArgs) {
    if (arg.startsWith('--')) {
      isWorkerMode = true;
      continue;
    }
    appPaths.push(arg);
  }
  const modules = appPaths.map(_ => require(_));
  
  // const engine = await createEngine();
  // const apps = [];
  // for (const m of modules) {
  //   const engineModules = extract(m, { scope: APPLICATION_SCOPE });
  //   for (const engineModule of engineModules) {
  //     const app = engine.install(engineModule);
  //     apps.push(app);
  //   }
  // }
  // await Promise.all(apps);

}

main(processArgs).catch(e => console.error(e));

function createMasterEngine() {
  
}

function createWorkerEngine() {
  
}


