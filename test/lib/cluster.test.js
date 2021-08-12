/**
 * @fileOverview 集群类测试代码
 * @name cluster.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Cluster, MODULE_KEY } = require('../../lib/cluster');
const os = require('os');
const faker = require('faker');

describe('lib/cluster', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-cluster:lib:Cluster');
  });

  describe('Cluster', () => {

    /** @type {Object} **/
    let processEnv;
    /** @type {Cluster} **/
    let cluster;

    beforeEach(() => {
      processEnv = JSON.parse(faker.datatype.json());
      cluster = new Cluster([ faker.system.filePath() ], processEnv);
    });

    describe('defineWorker', () => {

      it('simple', () => {

        const name = faker.datatype.string();
        const env = JSON.parse(faker.datatype.json());

        cluster.defineWorker(name, env);
        cluster.defineWorker(name, env);

      });

    });

    describe('wokersCountMap', () => {

      it('simple', () => {

        const name = faker.datatype.string();
        const env = JSON.parse(faker.datatype.json());
        cluster.defineWorker(name, env);

        expect(cluster.workersCountMap.size).toBe(0);

        processEnv[name] = faker.datatype.string();
        expect(cluster.workersCountMap.size).toBe(0);

        processEnv[name] = -1 * faker.datatype.number();
        expect(cluster.workersCountMap.get(name)).toBe(os.cpus().length - 1);

        const count = faker.datatype.number();
        processEnv[name] = count;
        expect(cluster.workersCountMap.get(name)).toBe(count);
      });

    });

  });

});
