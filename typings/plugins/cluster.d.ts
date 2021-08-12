export const MODULE_KEY: string;
export class ClusterPlugin {
    /**
     * 多进程处理插件
     * @see {@link module:lib/engine~Engine} 引擎类
     * @class
     * @param {Cluster} cluster 集群实例
     */
    constructor(cluster: Cluster);
    /**
     *检查是否为匹配模块
     * @see {@link module:lib/engine~EngineModule} 引擎模块类型
     * @param {EngineModule} module 检查的模块
     * @return {boolean} true:匹配/false:不匹配
     */
    match(module: any): boolean;
    /**
     *使用模块方法
     * @see {@link module:lib/engine~EngineModule} 引擎模块类型
     * @param {EngineModule} module 使用的模块
     */
    use(module: any): Promise<void>;
    [CLUSTER]: Cluster;
}
declare const CLUSTER: unique symbol;
import { Cluster } from "../lib/cluster";
export {};
