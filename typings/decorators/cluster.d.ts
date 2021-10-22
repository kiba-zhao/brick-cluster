/**
 * 集群装饰器工厂
 * @param {...ClusterMetadata} [metadatas] 集群元数据
 * @return {function(EngineModule):void} 集群装饰器
 */
export function Cluster(...metadatas?: ClusterMetadata[]): (arg0: any) => void;
import { ClusterMetadata } from "../plugins/utils";
