import { Grid, GridCfgData } from "./Grid";
import { Vec3 } from "cc";
import { aNode } from "./Node";
import { AStar } from "./AStar";

/**
 * A星寻路管理器
 * @author dabaicai
 * @since 2020/8/7
 */
export class AStarMgr {
    private static _ins: AStarMgr;
    public static get ins(): AStarMgr {
        if (!this._ins) { this._ins = new AStarMgr(); }
        return this._ins;
    }
    constructor() {
        this.init();
    }
    /**获得节点 */
    public getNode(x, y): aNode {
        return this._grid.getNode(x, y)
    }
    /**根据3d 坐标查询在什么位置 这里可优化*/
    public findGridNode(pos: Vec3): aNode {
        // 横排最近的list
        let latelyList: aNode[];
        // 最近的格子
        let lately: aNode;
        // 最大距离
        let maxdis = 10000000;
        // 找最近的横排
        for (let i = 0; i < this._grid.nodes.length; i++) {
            let node = this._grid.nodes[i][0].specificPos;
            let dis = this.getDistance(node[`${this._v2Str[0]}`], node[`${this._v2Str[1]}`], pos[`${this._v2Str[0]}`], pos[`${this._v2Str[1]}`]);
            if (dis < maxdis) {
                maxdis = dis;
                latelyList = this._grid.nodes[i];
            }
        }
        // 找最近的竖排
        if (latelyList) {
            maxdis = 10000000;
            for (let i = 0; i < latelyList.length; i++) {
                let node = latelyList[i].specificPos;
                let dis = this.getDistance(node[`${this._v2Str[0]}`], node[`${this._v2Str[1]}`], pos[`${this._v2Str[0]}`], pos[`${this._v2Str[1]}`]);
                if (dis < maxdis) {
                    maxdis = dis;
                    lately = latelyList[i];
                }
            }
        }
        return lately
    }
    /**查找路径 */
    public findPath(start, end) {
        // 设置开始的节点
        this._grid.setStartNode(start.x, start.y);
        // 设置结束的节点
        this._grid.setEndNode(end.x, end.y);
        if (this._aStar.findPath(this._grid)) {
            this._path = this._aStar.path;
            return this._path;
        }
        return null;
    }
    /**设置是否可以行走 */
    public setWalkable(pos: Vec3, value) {
        let node = this.findGridNode(pos);
        this._grid.setWalkable(node.x, node.y, value);
    }
    /**测试铺满 */
    public testSpreadOut() {
        this._grid.nodes.forEach(v => {
            v.forEach(v => {
                //把要测试的3d模型 设置到指定位置
                // v.specificPos.x, v.specificPos.y, v.specificPos.z
            })
        })
    }
    /**测试不可行走的格子 */
    public testNoWalk() {
        this._grid.nodes.forEach(v => {
            v.forEach(v => {
                if (!v.walkable) {
                    //把要测试的3d模型 设置到指定位置
                    // v.specificPos.x, v.specificPos.y, v.specificPos.z
                }
            })
        })
    }
    /**获得距离 */
    public getDistance(p1X: number, p1Y: number, p2X: number, p2Y: number): number {
        var disX: number = p2X - p1X;
        var disY: number = p2Y - p1Y;
        var disQ: number = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    }
    private init() {
        let cfgData: GridCfgData = { numCols: 11, numRows: 20, beginPos: { x: -8, y: 4.2, z: -15 }, offsetPos: { x: 1.6, y: 0, z: -1.6 } }
        this._grid = new Grid(cfgData);
        this._aStar = new AStar();
    }
    private _grid: Grid;
    private _path: Array<any>;
    private _aStar: AStar;
    /**这里不是3d的寻路 只是用的3d的2个纬度的坐标 然后实现a* */
    private _v2Str = [`x`, `z`];
}
window[`AStarMgr`] = AStarMgr;