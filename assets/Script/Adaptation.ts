const { ccclass, property, menu} = cc._decorator;

/**
 * 适配类型
 * - ScaleX|ScaleY 直接按照分辨率与设计分辨率比例进行拉伸
 * - ScaleBg 这个还考虑了本身尺寸，如果尺寸本身是超出canvas的，缩放比例将相对ScaleX|ScaleY的方式减小
 */
export enum AdaptType {
    None = 0,
    ScaleX = 1,         //拉伸宽度
    ScaleY = 1 << 1,    //拉伸高度
    Left = 1 << 2,      //靠左 异型屏+50
    Right = 1 << 3,     //靠右 异型屏+50
    Top = 1 << 4,       //靠上
    Bottom = 1 << 5,    //靠下
    ScaleBg = 1 << 6,   //拉伸宽高铺满全屏，根据图片（节点）尺寸
}

/** 
 * 适用于全屏界面（场景、全屏预制） 
 * - scaleX +sx、scaleY +sy
 * - left -x、right +x
 * - top +y、bottom -y
*/
@ccclass
@menu('UI/Adapation')
export default class Adaptation extends cc.Component {

    private static _params:number[] = null;
    private static get params():number[] {
        if(!this._params) {
            let w = cc.view.getFrameSize().width; //实际宽度
            let h = cc.view.getFrameSize().height; //实际高度
            let ratio = w/h; //实际宽高比
            let desRatio = 1332/740; //设计宽高比
            let isNotch = cc.sys.isNative && ratio>1432/740; //是否异型屏
            let lsLeft = ratio > desRatio && -((ratio-desRatio)*740/2)+(isNotch?50:0); //左侧修正
            let lsRight = ratio > desRatio && ((ratio-desRatio)*740/2)+(isNotch?-50:0); //右侧修正
            let lsTop = ratio < desRatio ? ((1/ratio-1/desRatio)*1332/2) : 0; //顶部修正
            let lsBottom = ratio < desRatio ? -((1/ratio-1/desRatio)*1332/2) : 0; //底部修正
            this._params = [ratio, desRatio, lsLeft, lsRight, lsTop, lsBottom];
        }
        return this._params;
    }

    static dealNode(node:cc.Node, type:AdaptType) {
        let p = this.params;
        let ratio = p[0], desRatio = p[1], lsLeft = p[2], lsRight = p[3], lsTop = p[4], lsBottom = p[5];
        if(!node) {
            return;
        }
        let pos = node.position;
        if(type == AdaptType.None) {
            node.position = pos;
        }
        if(type & AdaptType.ScaleBg) {
            let bgRatio = node.width/node.height;
            node.scale = ratio > desRatio ? (bgRatio >= ratio ? 1 : ratio/bgRatio) : (bgRatio >= ratio ? bgRatio/ratio : 1);
        }
        else {
            if(type & AdaptType.ScaleX) {
                node.scaleX = ratio > desRatio ? ratio/desRatio : desRatio/ratio;
            }
            if(type & AdaptType.ScaleY) {
                node.scaleY = ratio > desRatio ? ratio/desRatio : desRatio/ratio;
            }
        }
        if(type & AdaptType.Left) {
            node.x = pos.x + lsLeft;
        }
        if(type & AdaptType.Right) {
            node.x = pos.x + lsRight;
        }
        if(type & AdaptType.Top) {
            node.y = pos.y + lsTop;
        }
        if(type & AdaptType.Bottom) {
            node.y = pos.y + lsBottom;
        }
    }

    static dealPos(pos:cc.Vec2, type:AdaptType):cc.Vec2 {
        let p = this.params;
        let ratio = p[0], desRatio = p[1], lsLeft = p[2], lsRight = p[3], lsTop = p[4], lsBottom = p[5];
        let newPos = cc.v2(pos.x, pos.y)
        if(type & AdaptType.Left) {
            newPos.x = pos.x + lsLeft;
        }
        if(type & AdaptType.Right) {
            newPos.x = pos.x + lsRight;
        }
        if(type & AdaptType.Top) {
            newPos.y = pos.y + lsTop;
        }
        if(type & AdaptType.Bottom) {
            newPos.y = pos.y + lsBottom;
        }
        return newPos;
    }

    @property({visible:function(){return this.node.getComponent(cc.Canvas) ? true : false}}) sceneName:string = '';

    onLoad() {
        this.refresh();
    }

    refresh() {
        let p = Adaptation.params;
        let ratio = p[0], desRatio = p[1], lsLeft = p[2], lsRight = p[3], lsTop = p[4], lsBottom = p[5];
        let nodeName = this.node.name == 'Canvas' ? this.sceneName : this.node.name;
        let nodeData = Adaptation._nodeDatas[nodeName];
        if(!nodeData) return;
        console.log('ADAPTAION NODE NAME ===' + nodeName);
        if(!this._originalPos) {
            this._originalPos = {};
            for(const key in nodeData) {
                if (Object.prototype.hasOwnProperty.call(nodeData, key)) {
                    const element = nodeData[key];
                    let node = GetChild(this.node, key);
                    if(!node) {
                        cc.warn('Adapatation Node Is Not Found: ' + key);
                        continue;
                    }
                    this._originalPos[key] = node.position;
                }
            }
        }
        for(const key in nodeData) {
            if (Object.prototype.hasOwnProperty.call(nodeData, key)) {
                const element = nodeData[key];
                let node = GetChild(this.node, key);
                if(!node) {
                    continue;
                }
                let pos = this._originalPos[key];
                if(element == AdaptType.None) {
                    node.position = pos;
                }
                if(element & AdaptType.ScaleBg) {
                    let bgRatio = node.width/node.height;
                    node.scale = ratio > desRatio ? (bgRatio >= ratio ? 1 : ratio/bgRatio) : (bgRatio >= ratio ? bgRatio/ratio : 1);
                }
                else {
                    if(element & AdaptType.ScaleX) {
                        node.scaleX = ratio > desRatio ? ratio/desRatio : desRatio/ratio;
                    }
                    if(element & AdaptType.ScaleY) {
                        node.scaleY = ratio > desRatio ? ratio/desRatio : desRatio/ratio;
                    }
                }
                if(element & AdaptType.Left) {
                    node.x = pos.x + lsLeft;
                }
                if(element & AdaptType.Right) {
                    node.x = pos.x + lsRight;
                }
                if(element & AdaptType.Top) {
                    node.y = pos.y + lsTop;
                }
                if(element & AdaptType.Bottom) {
                    node.y = pos.y + lsBottom;
                }
            }
        }
    }

    private _originalPos = null;
    private static _nodeDatas = {
        'Main': {
            'FishBgMask/bg': AdaptType.ScaleX|AdaptType.ScaleY,
            'FishBgMask/bgMask': AdaptType.ScaleX|AdaptType.ScaleY,
        },
    }
}

/**
 * 简化获取子节点，并保存
 * - getChildByName获取节点消耗性能
 * @param rootNode
 * @param url 例：aa/bb/cc
 */
let GetChild = function(rootNode: cc.Node, url: string):cc.Node{
    if(!rootNode['nodeMap']) rootNode['nodeMap'] = {};
    if(rootNode['nodeMap'][url]) {
        return rootNode['nodeMap'][url];
    }
    else {
        let arr = url.split('/');
        let node = rootNode;
        for(let i=0;i<arr.length;i++) {
            let sonNode = node.getChildByName(arr[i]);
            if(sonNode) {
                node = sonNode;
            }
            else {
                node = null;
                break;
            }
        }
        if(node) {
            rootNode['nodeMap'][url] = node; 
        }
        return node;
    }
}
