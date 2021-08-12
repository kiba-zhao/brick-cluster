/**
 * @fileOverview 命令行测试代码
 * @name brick-cluster.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const coffee = require('coffee');
const { CLUSTER_NAME } = require('../../lib/constants');
const { ChildProcess } = require('child_process'); // eslint-disable-line no-unused-vars

describe('bin/brick-cluster', () => {

  const brickClusterBin = require.resolve('../../bin/brick-cluster.js');
  const cwd = path.join(__dirname, '..', 'fixtures', 'apps', 'simple');

  it('start master', () => {
    return coffee.fork(brickClusterBin, [], { cwd })
      .expect('stdout', 'simple:master\nsimple:agent\nsimple:worker\nsimple:master:new\n')
      .expect('code', 0)
      .end();
  });

  it('start agent', () => {

    return coffee.fork(brickClusterBin, [ '--worker', cwd ], { cwd, env: { ...process.env, [CLUSTER_NAME]: 'TEST_SIMPLE_AGENT' } })
      .expect('stdout', 'simple:master\nsimple:agent\nsimple:worker\nsimple:agent:new\n')
      .expect('code', 0)
      .end();
  });

  it('start worker', () => {

    return coffee.fork(brickClusterBin, [ '--worker', cwd ], { cwd, env: { ...process.env, [CLUSTER_NAME]: 'TEST_SIMPLE_WORKER' } })
      .expect('stdout', 'simple:master\nsimple:agent\nsimple:worker\nsimple:worker:new\n')
      .expect('code', 0)
      .end();
  });

  it('start cluster', async () => {
    jest.useFakeTimers();
    const cf = coffee.fork(brickClusterBin, [], { cwd, env: { ...process.env, TEST_SIMPLE_AGENT: 1, TEST_SIMPLE_WORKER: 1 } })
      .expect('stdout', /master\:new/)
      .expect('stdout', /agent\:new/)
      .expect('stdout', /worker\:new/)
      .expect('code', 0);
    jest.runAllTicks();
    jest.useRealTimers();
    /** @type {ChildProcess} **/
    const proc = cf.proc;
    setTimeout(() => { proc.emit('close', 0); }, 1000);
    jest.clearAllTimers();
    await cf.end();
    proc.kill();
  });
});
