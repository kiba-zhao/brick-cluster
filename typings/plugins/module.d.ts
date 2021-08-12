export const MODULE_KEY: string;
export class ModulePlugin {
    /**
     * 模块处理插件
     * @see {@link module:lib/engine~Engine} 引擎类
     * @class
     * @param {InstallPlugin} installPlugin 安装插件
     * @param {Engine} engine 引擎实例
     * @param {Object} env 环境变量实例
     */
    constructor(installPlugin: InstallPlugin, engine: Engine, env?: any);
    /**
     *使用模块方法
     * @see {@link module:lib/engine~EngineModule} 引擎模块类型
     * @see {@link module:lib/engine~EngineInstallOpts} 引擎模块安装可选参数
     * @param {EngineModule} module 使用的模块
     * @param {EngineInstallOpts} opts 引擎模块安装可选参数
     */
    use(module: any, opts: any): Promise<void>;
    [INSTALL_PLUGIN]: InstallPlugin;
    [ENGINE]: Engine;
    [ENV]: any;
}
declare const INSTALL_PLUGIN: unique symbol;
import { InstallPlugin } from "brick-engine";
declare const ENGINE: unique symbol;
import { Engine } from "brick-engine";
declare const ENV: unique symbol;
export {};
