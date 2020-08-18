import { aNode } from "./Node";
export type GridCfgData = {
	/**行 */
	numCols,
	/**列 */
	numRows,
	/**开始位置 */
	beginPos: { x, y, z },
	/**间隔偏移 */
	offsetPos: { x, y, z }
}
/**
 * 网格类
 * @author chenkai
 * @since 2020/8/7
 */
export class Grid {
	public get cfgData(): GridCfgData { return this._cfgData };
	public get nodes(): Array<aNode[]> { return this._nodes };
	private _startNode: aNode;    //起点
	private _endNode: aNode;      //终点
	private _nodes: Array<any>;  //Node数组
	private _numCols: number;    //网格行列
	private _numRows: number;
	public constructor(cfg: GridCfgData) {
		this._cfgData = cfg;
		this._numCols = cfg.numCols;
		this._numRows = cfg.numRows;
		this._nodes = [];
		for (let i: number = 0; i < cfg.numCols; i++) {
			this._nodes[i] = [];
			for (let j: number = 0; j < cfg.numRows; j++) {
				let specificPos = this.getSpecificPos(i, j);
				this._nodes[i][j] = new aNode(i, j, specificPos);
			}
		}
	}

	public getNode(x: number, y: number): aNode {
		return this._nodes[x][y];
	}

	public setEndNode(x: number, y: number) {
		this._endNode = this._nodes[x][y];
	}

	public setStartNode(x: number, y: number) {
		this._startNode = this._nodes[x][y];
	}

	public setWalkable(x: number, y: number, value: boolean) {
		this._nodes[x][y].walkable = value;
	}

	public get endNode() {
		return this._endNode;
	}

	public get numCols() {
		return this._numCols;
	}

	public get numRows() {
		return this._numRows;
	}
	/**配置数据 */
	private _cfgData: GridCfgData;
	public get startNode() {
		return this._startNode;
	}
	/**获得具体位置 */
	private getSpecificPos(cols, rows) {
		let cfg = this.cfgData;
		let specificPos = { x: cfg.beginPos.x + cols * cfg.offsetPos.x, y: cfg.beginPos.y, z: cfg.beginPos.z - rows * cfg.offsetPos.z }
		return specificPos;
	}
}
