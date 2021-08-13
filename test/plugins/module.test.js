/**
 * @fileOverview 模块插件测试代码
 * @name module.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ModulePlugin, MODULE_KEY } = require('../../plugins/module');
const { CLUSTER_NAME } = require('../../lib/constants');
const { defineCluster } = require('../../plugins/utils');
const { Provider, Engine, InstallPlugin } = require('brick-engine');
const faker = require('faker');

describe('plugins/module', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-cluster:plugins:ModulePlugin');
  });

  describe('ModulePlugin', () => {

    /** @type {Engine}**/
    let engine;
    /** @type {InstallPlugin} **/
    let installPlugin;

    beforeEach(() => {
      engine = new Engine(new Provider());
      installPlugin = new InstallPlugin(engine);
    });

    describe('use', () => {

      let engineInstallFn;
      let installPluginMatchFn;
      let installPluginUseFn;

      beforeEach(() => {
        engineInstallFn = jest.spyOn(engine, 'install');
        installPluginMatchFn = jest.spyOn(installPlugin, 'match');
        installPluginUseFn = jest.spyOn(installPlugin, 'use');
      });

      describe('mater module', () => {

        let target;
        let opts;
        let plugin;

        beforeEach(() => {
          target = {};
          opts = {};
          plugin = new ModulePlugin(installPlugin, engine);
        });

        it('simple', async () => {

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, opts);


        });

        it('define cluster on target', async () => {

          const _opts = {};
          const clusterMetadata = JSON.parse(faker.datatype.json());
          delete clusterMetadata.name;
          defineCluster(target, clusterMetadata);
          defineCluster(_opts, clusterMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, _opts);
        });

        it('define cluster on opts', async () => {

          const clusterMetadata = JSON.parse(faker.datatype.json());
          delete clusterMetadata.name;
          defineCluster(opts, clusterMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, opts);

        });

        it('define cluster on target and opts', async () => {

          const _opts = {};
          const targetMetadata = JSON.parse(faker.datatype.json());
          const optsMetadata = JSON.parse(faker.datatype.json());
          delete targetMetadata.name;
          delete optsMetadata.name;
          defineCluster(target, targetMetadata);
          defineCluster(opts, optsMetadata);
          defineCluster(_opts, targetMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, _opts);
        });

      });

      describe('mater module on worker', () => {

        let target;
        let opts;
        let plugin;
        let workerName;

        beforeEach(() => {
          target = {};
          opts = {};
          workerName = Symbol('WORKER_NAME');
          plugin = new ModulePlugin(installPlugin, engine, { [CLUSTER_NAME]: workerName });
        });

        it('simple', async () => {

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, opts);


        });

        it('define cluster on target', async () => {

          const _opts = {};
          const clusterMetadata = JSON.parse(faker.datatype.json());
          delete clusterMetadata.name;
          defineCluster(target, clusterMetadata);
          defineCluster(_opts, clusterMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, _opts);
        });

        it('define cluster on opts', async () => {

          const clusterMetadata = JSON.parse(faker.datatype.json());
          delete clusterMetadata.name;
          defineCluster(opts, clusterMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, opts);

        });

        it('define cluster on target and opts', async () => {

          const _opts = {};
          const targetMetadata = JSON.parse(faker.datatype.json());
          const optsMetadata = JSON.parse(faker.datatype.json());
          delete targetMetadata.name;
          delete optsMetadata.name;
          defineCluster(target, targetMetadata);
          defineCluster(opts, optsMetadata);
          defineCluster(_opts, targetMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).not.toBeCalled();
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, _opts);
        });

      });


      describe('worker module', () => {

        let target;
        let opts;
        let plugin;
        let workerName;

        beforeEach(() => {
          target = {};
          opts = {};
          workerName = faker.random.word();
          plugin = new ModulePlugin(installPlugin, engine, { [CLUSTER_NAME]: workerName });
        });

        it('define cluster on target', async () => {

          const _opts = {};
          const clusterMetadata = JSON.parse(faker.datatype.json());
          clusterMetadata.name = workerName;
          defineCluster(target, clusterMetadata);
          defineCluster(_opts, clusterMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, _opts);
        });

        it('define cluster on opts', async () => {

          const clusterMetadata = JSON.parse(faker.datatype.json());
          clusterMetadata.name = workerName;
          defineCluster(opts, clusterMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, opts);

        });

        it('define cluster on target and opts', async () => {

          const _opts = {};
          const targetMetadata = JSON.parse(faker.datatype.json());
          const optsMetadata = JSON.parse(faker.datatype.json());
          targetMetadata.name = workerName;
          optsMetadata.name = workerName;
          defineCluster(target, targetMetadata);
          defineCluster(opts, optsMetadata);
          defineCluster(_opts, targetMetadata);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).not.toBeCalled();

          engineInstallFn.mockReset();
          installPluginMatchFn.mockReset();
          installPluginUseFn.mockReset();
          installPluginMatchFn.mockReturnValueOnce(true);

          await plugin.use(target, opts);
          expect(engineInstallFn).toBeCalledTimes(1);
          expect(engineInstallFn).toBeCalledWith(target, _opts);
          expect(installPluginMatchFn).toBeCalledTimes(1);
          expect(installPluginMatchFn).toBeCalledWith(target, _opts);
          expect(installPluginUseFn).toBeCalledTimes(1);
          expect(installPluginUseFn).toBeCalledWith(target, _opts);
        });

      });

    });

  });

});
