export var extractCluster: (arg0: any) => ClusterMetadata[];
/**
 * 集群元数据
 */
export type ClusterMetadata = {
    /**
     * 工作进程命名
     */
    name?: ClusterName;
    /**
     * 工作进程环境变量
     */
    env?: ClusterEnv;
};
/**
 * 定义集群函数
 * @see {@link module:lib/engine~EngineModule} 引擎模块
 * @see {@link module:plugins/utils~ClusterMetadata} 集群元数据
 * @param {EngineModule} target 目标引擎模块对象
 * @param {...ClusterMetadata} metadatas 集群元数据
 */
export function defineCluster(target: any, ...metadatas: ClusterMetadata[]): any;
/**
 * 替换集群元数据
 * @param {EngineModule} target 目标引擎模块
 * @param {...ClusterMetadata} metadatas 集群元数据
 * @return {EngineModule} 目标引擎模块
 */
export function replaceCluster(target: any, ...metadatas: ClusterMetadata[]): any;
import { ClusterName } from "../lib/cluster";
import { ClusterEnv } from "../lib/cluster";
