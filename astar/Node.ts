/**
 * aNode 节点
 * 
 */
export class aNode {
	/**特定位置 */
	public specificPos: { x, y, z };
	public x: number;    //列
	public y: number;    //行
	public f: number;    //代价 f = g+h
	public g: number;    //起点到当前点代价
	public h: number;    //当前点到终点估计代价
	public walkable: boolean = true;
	public parent: aNode;
	public costMultiplier: number = 1.0;
	public constructor(x: number, y: number, localPos: { x, y, z }) {
		this.x = x;
		this.y = y;
		this.specificPos = localPos;
	}
}
