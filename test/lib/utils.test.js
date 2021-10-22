/**
 * @fileOverview 工具类测试
 * @name utils.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Provider, Engine, InstallPlugin, MountPlugin, InjectPlugin } = require('brick-engine');
const { ModulePlugin, ClusterPlugin } = require('../../plugins');
const { ClusterManager } = require('../../lib');
const { MODULE_KEY, createWorkerEngine, createMasterEngine } = require('../../lib/utils');
const faker = require('faker');

describe('lib/utils', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-cluster:lib:utils');
  });

  describe('createWorkerEngine', () => {

    it('simple', async () => {

      const provider = new Provider();
      const defineSpy = jest.spyOn(provider, 'define');

      const engine = await createWorkerEngine(provider);
      const [ pEngine ] = await provider.require({ id: Engine });

      expect(engine).not.toBe(pEngine);
      expect(defineSpy).toBeCalledTimes(6);
      expect(defineSpy.mock.calls[0]).toEqual([ Provider, [], expect.anything() ]);
      expect(defineSpy.mock.calls[0][2]()).toBe(provider);
      expect(defineSpy.mock.calls[1]).toEqual([ Engine, [{ id: Provider }], Engine ]);
      expect(defineSpy.mock.calls[2]).toEqual([ MountPlugin, [{ id: Engine }], MountPlugin ]);
      expect(defineSpy.mock.calls[3]).toEqual([ InjectPlugin, [{ id: Provider }], InjectPlugin ]);
      expect(defineSpy.mock.calls[4]).toEqual([ InstallPlugin, [], expect.anything() ]);
      expect(defineSpy.mock.calls[4][2]()).toBeInstanceOf(InstallPlugin);
      expect(defineSpy.mock.calls[5]).toEqual([ ModulePlugin, [{ id: InstallPlugin }, { id: Engine }], ModulePlugin ]);
    });

  });

  describe('createMasterEngine', () => {

    it('simple', async () => {

      const provider = new Provider();
      const defineSpy = jest.spyOn(provider, 'define');
      const appPath = faker.system.filePath();

      const engine = await createMasterEngine([ appPath ], provider);
      const [ pEngine ] = await provider.require({ id: Engine });

      expect(engine).not.toBe(pEngine);
      expect(defineSpy).toBeCalledTimes(8);
      expect(defineSpy.mock.calls[0]).toEqual([ Provider, [], expect.anything() ]);
      expect(defineSpy.mock.calls[0][2]()).toBe(provider);
      expect(defineSpy.mock.calls[1]).toEqual([ Engine, [{ id: Provider }], Engine ]);
      expect(defineSpy.mock.calls[2]).toEqual([ MountPlugin, [{ id: Engine }], MountPlugin ]);
      expect(defineSpy.mock.calls[3]).toEqual([ InjectPlugin, [{ id: Provider }], InjectPlugin ]);
      expect(defineSpy.mock.calls[4]).toEqual([ InstallPlugin, [], expect.anything() ]);
      expect(defineSpy.mock.calls[4][2]()).toBeInstanceOf(InstallPlugin);
      expect(defineSpy.mock.calls[5]).toEqual([ ModulePlugin, [{ id: InstallPlugin }, { id: Engine }], ModulePlugin ]);
      expect(defineSpy.mock.calls[6]).toEqual([ ClusterManager, [], expect.anything() ]);
      expect(defineSpy.mock.calls[6][2]()).toBeInstanceOf(ClusterManager);
      expect(defineSpy.mock.calls[7]).toEqual([ ClusterPlugin, [{ id: ClusterManager }], ClusterPlugin ]);

    });

  });

});
