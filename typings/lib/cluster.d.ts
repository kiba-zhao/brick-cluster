/// <reference types="node" />
/**
 * 集群键值
 */
export type ClusterKey = string;
/**
 * 集群命名
 */
export type ClusterName = string;
/**
 * 集群进程环境变量
 */
export type ClusterEnv = any;
/**
 * 集群工作进程对象
 */
export type ClusterWorker = Worker;
export const MODULE_KEY: string;
/**
 * 集群键值
 * @typedef {string} ClusterKey
 */
/**
 * 集群命名
 * @typedef {string} ClusterName
 */
/**
 * 集群进程环境变量
 * @typedef {Object} ClusterEnv
 */
/**
 * 集群工作进程对象
 * @typedef {Worker} ClusterWorker
 */
export class Cluster {
    /**
     * 集群构造函数
     * @class
     * @see {@link module:lib/cluster~ClusterEnv} 集群环境变量
     * @param {string[]} workerArgs 集群工作进程参数
     * @param {ClusterEnv} [env] 集群主进程环境变量
     */
    constructor(workerArgs: string[], env?: ClusterEnv);
    /**
     * 定义工作进程
     * @see {@link module:lib/cluster~ClusterName} 集群命名
     * @see {@link module:lib/cluster~ClusterEnv} 集群进程环境变量
     * @param {ClusterName} name 子进程命名
     * @param {ClusterEnv} [env] 子进程环境变量
     */
    defineWorker(name: ClusterName, env?: ClusterEnv): void;
    /**
     * 工作进程数量字典
     * @see {@link module:lib/cluster~ClusterName} 集群命名
     * @return {Map<ClusterName,Number>}
     */
    get workersCountMap(): Map<string, number>;
    /**
     * 启动所有工作进程
     */
    start(): void;
    /**
     * 重启所有工作进程
     */
    restart(): void;
    /**
     * 停止所有工作进程
     */
    stop(): void;
    /**
     * 启动工作进程
     * @see {@link module:lib/cluster~ClusterName} 集群命名
     * @see {@link module:lib/cluster~ClusterWorker} 集群工作进程
     * @param {ClusterName} name 进程名称
     * @param {Number} index 进程序号
     * @param {ClusterWorker} [oldWorker] 当前工作进程对象
     */
    startWorker(name: ClusterName, index: number, oldWorker?: ClusterWorker): void;
    /**
     * @see {@link module:lib/cluster~ClusterName} 集群命名
     * @see {@link module:lib/cluster~ClusterEnv} 集群进程环境变量
     * @private
     * @readonly
     * @type {Map<ClusterName,ClusterEnv>}
     */
    private readonly [CLUSTER_ENVS];
    /**
     * @see {@link module:lib/cluster~ClusterKey} 集群键值
     * @see {@link module:lib/cluster~ClusterWorker} 集群工作进程对象
     * @private
     * @readonly
     * @type {Map<ClusterKey,ClusterWorker>}
     */
    private readonly [CLUSTER_WORKERS];
    [ENV]: object;
}
import { Worker } from "cluster";
declare const CLUSTER_ENVS: unique symbol;
declare const CLUSTER_WORKERS: unique symbol;
declare const ENV: unique symbol;
export {};
