import { aNode } from "./Node";
import { Grid } from "./Grid";

/**
 * A星寻路
 * @author chenkai
 * @since 2020/8/7
 */
export class AStar {
	private _open: Array < any > ; //待考察表
	private _closed: Array < any > ; //已考察表
	private _grid: Grid; //网格
	private _endNode: aNode; //终点Node
	private _startNode: aNode; //起点Node
	private _path: Array < any > ; //保存路径
	private _heuristic: Function; //寻路算法
	private _straightCost: number = 1.0; //上下左右走的代价
	private _diagCost: number = Math.SQRT2; //斜着走的代价 

	private _allowDiag: boolean = true; //是否允许斜着走 

	public constructor() {
		//this._heuristic = this.manhattan;  
		//this._heuristic = this.euclidian;
		this._heuristic = this.diagonal;
	}

	//是否允许斜着走
	public allowDiag(allow: boolean): void {
		this._allowDiag = allow;
	}

	//寻路
	public findPath(grid: Grid): boolean {
		this._grid = grid;
		this._open = [];
		this._closed = [];

		this._startNode = this._grid.startNode;
		this._endNode = this._grid.endNode;

		this._startNode.g = 0;
		this._startNode.h = this._heuristic(this._startNode);
		this._startNode.f = this._startNode.g + this._startNode.h;

		return this.search();
	}

	//查找路径
	public search(): boolean {
		var node: aNode = this._startNode;
		while (node != this._endNode) {
			var startX = Math.max(0, node.x - 1);
			var endX = Math.min(this._grid.numCols - 1, node.x + 1);
			var startY = Math.max(0, node.y - 1);
			var endY = Math.min(this._grid.numRows - 1, node.y + 1);

			for (var i = startX; i <= endX; i++) {
				for (var j = startY; j <= endY; j++) {
					//不让斜着走
					if (!this._allowDiag) {
						if (i != node.x && j != node.y) {
							continue;
						}
					}

					var test: aNode = this._grid.getNode(i, j);
					if (test == node ||
						!test.walkable ||
						!this._grid.getNode(node.x, test.y).walkable ||
						!this._grid.getNode(test.x, node.y).walkable) {
						continue;
					}

					var cost: number = this._straightCost;
					if (!((node.x == test.x) || (node.y == test.y))) {
						cost = this._diagCost;
					}
					var g = node.g + cost * test.costMultiplier;
					var h = this._heuristic(test);
					var f = g + h;
					if (this.isOpen(test) || this.isClosed(test)) {
						if (test.f > f) {
							test.f = f;
							test.g = g;
							test.h = h;
							test.parent = node;
						}
					} else {
						test.f = f;
						test.g = g;
						test.h = h;
						test.parent = node;
						this._open.push(test);
					}
				}
			}
			for (var o = 0; o < this._open.length; o++) {}
			this._closed.push(node);
			if (this._open.length == 0) {
				// console.log("AStar >> no path found");
				return false
			}

			let openLen = this._open.length;
			for (let m = 0; m < openLen; m++) {
				for (let n = m + 1; n < openLen; n++) {
					if (this._open[m].f > this._open[n].f) {
						let temp = this._open[m];
						this._open[m] = this._open[n];
						this._open[n] = temp;
					}
				}
			}

			node = this._open.shift() as aNode;
		}
		this.buildPath();
		return true;
	}

	//获取路径
	private buildPath(): void {
		this._path = new Array();
		var node: aNode = this._endNode;
		this._path.push(node);
		while (node != this._startNode) {
			node = node.parent;
			this._path.unshift(node);
		}
	}

	public get path() {
		return this._path;
	}

	//是否待检查
	private isOpen(node: aNode): boolean {
		for (var i = 0; i < this._open.length; i++) {
			if (this._open[i] == node) {
				return true;
			}
		}
		return false;
	}

	//是否已检查
	private isClosed(node: aNode): boolean {
		for (var i = 0; i < this._closed.length; i++) {
			if (this._closed[i] == node) {
				return true;
			}
		}
		return false;
	}

	//曼哈顿算法
	private manhattan(node: aNode) {
		return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
	}

	private euclidian(node: aNode) {
		var dx = node.x - this._endNode.x;
		var dy = node.y - this._endNode.y;
		return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
	}

	private diagonal(node: aNode) {
		var dx = Math.abs(node.x - this._endNode.x);
		var dy = Math.abs(node.y - this._endNode.y);
		var diag = Math.min(dx, dy);
		var straight = dx + dy;
		return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
	}

	public get visited() {
		return this._closed.concat(this._open);
	}
}
