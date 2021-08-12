export const MODULE_KEY: string;
/**
 * 创建主引擎
 * @async
 * @param {Provider} provider 依赖提供器实例
   * @param {string[]} workerArgs 集群工作进程参数
 * @return {Promise<Engine>} 主引擎
 */
export function createMasterEngine(workerArgs: string[], provider?: Provider): Promise<Engine>;
/**
 * 创建工作引擎
 * @async
 * @param {Provider} provider 依赖提供器实例
 * @return {Promise<Engine>} 工作引擎
 */
export function createWorkerEngine(provider?: Provider): Promise<Engine>;
import { Provider } from "brick-engine";
import { Engine } from "brick-engine";
