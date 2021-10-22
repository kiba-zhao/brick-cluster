/**
 * @fileOverview 集群类测试代码
 * @name cluster.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { ClusterManager, MODULE_KEY } = require('../../lib/clusterManager');
const os = require('os');
const faker = require('faker');

describe('lib/cluster', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-cluster:lib:ClusterManager');
  });

  describe('ClusterManager', () => {

    /** @type {Object} **/
    let processEnv;
    /** @type {ClusterManager} **/
    let clusterManager;

    beforeEach(() => {
      processEnv = JSON.parse(faker.datatype.json());
      clusterManager = new ClusterManager([ faker.system.filePath() ], processEnv);
    });

    describe('defineWorker', () => {

      it('simple', () => {

        const name = faker.datatype.string();
        const env = JSON.parse(faker.datatype.json());

        clusterManager.defineWorker(name, env);
        clusterManager.defineWorker(name, env);

      });

    });

    describe('wokersCountMap', () => {

      it('simple', () => {

        const name = faker.datatype.string();
        const env = JSON.parse(faker.datatype.json());
        clusterManager.defineWorker(name, env);

        expect(clusterManager.workersCountMap.size).toBe(0);

        processEnv[name] = faker.random.word();
        expect(clusterManager.workersCountMap.size).toBe(0);

        processEnv[name] = -1 * faker.datatype.number();
        expect(clusterManager.workersCountMap.get(name)).toBe(os.cpus().length - 1);

        const count = faker.datatype.number();
        processEnv[name] = count;
        expect(clusterManager.workersCountMap.get(name)).toBe(count);
      });

    });

  });

});
