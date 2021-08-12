/**
 * @fileOverview 集群插件测试代码
 * @name cluster.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ClusterPlugin, MODULE_KEY } = require('../../plugins/cluster');
const { Cluster } = require('../../lib/cluster');
const { replaceCluster } = require('../../plugins/utils');
const faker = require('faker');

describe('plugins/cluster', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-cluster:plugins:ClusterPlugin');
  });

  describe('ClusterPlugin', () => {

    let clusterDefineWorkerFn;

    /** @type {ClusterPlugin} **/
    let plugin;

    beforeEach(() => {
      const cluster = new Cluster([ faker.system.filePath() ]);
      clusterDefineWorkerFn = jest.spyOn(cluster, 'defineWorker');
      plugin = new ClusterPlugin(cluster);
    });

    describe('match', () => {

      it('simple', () => {

        const target = {};
        expect(plugin.match(target, {})).toBeFalsy();
        expect(clusterDefineWorkerFn).not.toBeCalled();

        replaceCluster(target, {});
        expect(plugin.match(target, {})).toBeFalsy();
        expect(clusterDefineWorkerFn).not.toBeCalled();

        const name = faker.datatype.string();
        replaceCluster(target, { name });
        expect(plugin.match(target, {})).toBeTruthy();
        expect(clusterDefineWorkerFn).not.toBeCalled();

      });

    });

    describe('use', () => {

      it('simple', async () => {

        const target = {};
        const metadataQueue = [];
        for (let i = 0; i < faker.datatype.number(10); i++) {
          metadataQueue.push({ name: faker.datatype.uuid(), env: JSON.parse(faker.datatype.json()) });
        }
        metadataQueue.push({});
        replaceCluster(target, ...metadataQueue);

        await plugin.use(target, {});
        expect(clusterDefineWorkerFn).toBeCalledTimes(metadataQueue.length - 1);
        for (let i = 0; i < metadataQueue.length - 1; i++) {
          expect(clusterDefineWorkerFn.mock.calls[i]).toEqual([ metadataQueue[i].name, metadataQueue[i].env ]);
        }

      });

    });

  });

});
