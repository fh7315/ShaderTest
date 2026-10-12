const {ccclass, property, disallowMultiple} = cc._decorator;

/**
 * 列表分层渲染
 * - 原理：在脚本节点下添加几个content节点，将所有元素的子节点按照既定的顺序移动至此节点
 * - label和spine也会移动至对应的content节点
 * - 分层渲染后节点树结构将与ui搭建的完全不同
 * - 使用限制较多，请谨慎使用，除非你知道自己在干嘛
 * - 合理组织节点的顺序，才能达到最好的效果
 * - 1、以下内容中：item、列表的子节点，nd、元素节点的子节点
 * - 2、nd只会同步item的active、position
 * - 3、不要使用cc.Node.child以外的api从item获取nd
 * - 4、修改nd的active、position请使用activeSF、posSF、xSF、ySF
 * - 5、谨慎使用nd的action、tween
 * - 6、不要直接使用item的addChild（新增的节点将不会又分层渲染效果）
 * - 7、不要去尝试cc.instance某个节点
 * - 8、不要使用children遍历节点的子节点
 */
@ccclass
@disallowMultiple()
export default class SliceList extends cc.Component {

    public static applyNode(node:cc.Node) {
        if(!node.comp(SliceList)) {
            node.addComponent(SliceList);
        }
    }

    private _contentNode:cc.Node = null;
    private _contentNode_Spine:cc.Node = null;
    private _contentNode_Label:cc.Node = null;
    private _sliceFlagNum:number = 0;

    protected onLoad() {
        this._contentNode = new cc.Node();
        this.node.addChild(this._contentNode, 997, '__SliceListContent');
        this._contentNode_Spine = new cc.Node();
        this.node.addChild(this._contentNode_Spine, 998, '__SliceListContent_Spine');
        this._contentNode_Label = new cc.Node();
        this.node.addChild(this._contentNode_Label, 999, '__SliceListContent_Label');
        //移动节点内容到content
        for(let i=0;i<this.node.children.length-3;i++) {
            this.moveChildrenToContent(this.node.children[i]);
        }
        //content位置监听，同步所有item
        let listenFunc = ()=>{
            for(let i=0;i<this.node.children.length;i++) {
                let nd = this.node.children[i];
                if(nd.__sliceFlag?.self) {
                    this.syncChildrenPosition(nd);
                }
            }
        };
        this._contentNode.on('position-changed', listenFunc);
        this._contentNode_Spine.on('position-changed', listenFunc);
        this._contentNode_Label.on('position-changed', listenFunc);
        //增删元素的监听
        this.node.on('child-added', (item:cc.Node)=>{
            this.moveChildrenToContent(item);
        });
        this.node.on('child-removed', (item:cc.Node)=>{
            let arr = this.checkAllChildren(item);
            arr.forEach(element => {
                element.parent = null;
                element.destroy();
            });
        });
    }

    private get valid():boolean {
        if(!cc.isValid(this) || !cc.isValid(this._contentNode) || !cc.isValid(this._contentNode_Label) || !cc.isValid(this._contentNode_Spine)) {
            cc.warn('SliceList inValid, You must have made some mistakes!');
            return false;
        }
        return true;
    }

    /** 将item子节点移动至content */
    private moveChildrenToContent(item:cc.Node) {
        if(!this.valid) return;
        this._sliceFlagNum ++;
        item.__sliceFlag = {self:this._sliceFlagNum, root:0, isNormal:false};
        let index = 0;
        while(item.children.length) {
            let nd = item.children[0];
            if(nd.comp(cc.Label)) {
                this.moveFunc(nd, item, this._contentNode_Label, 0);
            }
            else if(nd.comp(sp.Skeleton)) {
                this.moveFunc(nd, item, this._contentNode_Spine, 0);
            }
            else {
                index++;
                this.moveFunc(nd, item, this._contentNode, index);
                let funcSon = (node:cc.Node, sonNode:cc.Node)=>{
                    if(sonNode.comp(cc.Label)) {
                        this.moveFunc(sonNode, item, this._contentNode_Label, 0, node);
                        return true;
                    }
                    else if(sonNode.comp(sp.Skeleton)) {
                        this.moveFunc(sonNode, item, this._contentNode_Spine, 0, node);
                        return true;
                    }
                    else {
                        funcNode(sonNode);
                        sonNode.__sliceFlag = {self:0, root:0, isNormal:true};
                        //普通节点（非content子节点）
                        sonNode.on('activeSF_changed', ()=>{
                            this.syncChildrenActive(item);
                        });
                        sonNode.on('posSF_changed', ()=>{
                            this.syncChildrenActive(item);
                        });
                        return false;
                    }
                }
                let funcNode = (node:cc.Node)=>{
                    //如果包含一个特殊组件，则不再往下遍历
                    if(node.comp(cc.Widget) || node.comp(cc.Layout) || node.comp(cc.Mask) || node.comp(cc.RichText)) {
                        return;
                    }
                    //处理子节点
                    for(let i=0;i<node.children.length;i++) {
                        if(funcSon(node, node.children[i])) i--;
                    }
                    //普通节点（content子节点、非content子节点）
                    node.on('child-added', (sonNode:cc.Node)=>{
                        funcSon(node, sonNode);
                    });
                    node.on('child-removed', (sonNode:cc.Node)=>{
                        let parentInvalidFunc = (contentNode:cc.Node)=>{
                            for(let i=0;i<contentNode.children.length;i++) {
                                let nd = contentNode.children[i];
                                if(nd.__sliceFlag.parent && !cc.isValid(nd.__sliceFlag.parent)) {
                                    nd.parent = null;
                                    nd.destroy();
                                    i--;
                                }
                            }
                        };
                        parentInvalidFunc(this._contentNode_Label);
                        parentInvalidFunc(this._contentNode_Spine);
                        let arr = this.checkAllChildren(sonNode);
                        arr.forEach(element => {
                            element.parent = null;
                            element.destroy();
                        });
                    });
                }
                funcNode(nd);
            }
        }
        //元素节点位置和显隐监听
        item.on('position-changed', ()=>{
            this.syncChildrenPosition(item);
        });
        item.on('active-in-hierarchy-changed', ()=>{
            this.syncChildrenActive(item);
        });
    }
    private moveFunc(node:cc.Node, item:cc.Node, contentNode:cc.Node, zIndex:number, parent:cc.Node=null) {
        node.__sliceFlag = {self:0, root:item.__sliceFlag.self, parent:parent, isNormal:false};
        node.activeSF = node.active;
        node.posSF = cc.v2(node.x, node.y);
        node.parent = null;
        contentNode.addChild(node, zIndex);
        this.activeFunc(node, item);
        this.posFunc(node, item);
        //content子节点监听
        if(contentNode.name == '__SliceListContent') {
            node.on('activeSF_changed', ()=>{
                this.activeFunc(node, item);
                this.syncChildrenActive(item);
            });
            node.on('posSF_changed', ()=>{
                this.posFunc(node, item);
                this.syncChildrenPosition(item);
            });
        }
        else {
            node.on('activeSF_changed', ()=>{
                this.activeFunc(node, item);
            });
            node.on('posSF_changed', ()=>{
                this.posFunc(node, item);
            });
        }
    }

    /** 位置同步 */
    private syncChildrenPosition(node:cc.Node) {
        if(!this.valid) return;
        let arr = this.checkAllChildren(node);
        arr.forEach(element=>{
            this.posFunc(element, node);
        });
    }
    private posFunc(nd:cc.Node, item:cc.Node) {
        if(nd.__sliceFlag.parent) {
            nd.setPosition(nd.parent.convertToNodeSpaceAR(nd.__sliceFlag.parent.convertToWorldSpaceAR(nd.posSF)));
        }
        else {
            nd.setPosition(nd.parent.convertToNodeSpaceAR(item.convertToWorldSpaceAR(nd.posSF)));
        }
    }

    /** 显隐同步 */
    private syncChildrenActive(item:cc.Node) {
        if(!this.valid) return;
        let arr = this.checkAllChildren(item);
        arr.forEach(element=>{
            this.activeFunc(element, item);
        });
    }
    private activeFunc(nd:cc.Node, item:cc.Node) {
        if(nd.__sliceFlag.parent) {
            let parent = nd.__sliceFlag.parent;
            let active = nd.activeSF;
            while(!parent.__sliceFlag?.root) {
                active = active && parent.active;
                parent = parent.parent;
            }
            active = active && parent.activeSF;
            nd.active = item.active && active;
        }
        else {
            nd.active = item.active && nd.activeSF;
        }
    }

    /** 递归判断content_label、content_spine子节点是否为某个节点的子节点 */
    private checkAllChildren(node:cc.Node):cc.Node[] {
        let arr = [];
        if(node.__sliceFlag?.self) { //item节点
            let func = (contentNode:cc.Node)=>{
                for(let i=0;i<contentNode.children.length;i++) {
                    let nd = contentNode.children[i];
                    if(nd.__sliceFlag.root == node.__sliceFlag.self) {
                        arr.push(nd);
                    }
                }
            }
            func(this._contentNode);
            func(this._contentNode_Label);
            func(this._contentNode_Spine);
        }
        else if(node.__sliceFlag?.root && node.parent?.name == '__SliceListContent') { //content子节点
            let func = (contentNode:cc.Node)=>{
                for(let i=0;i<contentNode.children.length;i++) {
                    let nd = contentNode.children[i];
                    if(nd.__sliceFlag.root == node.__sliceFlag.root) {
                        arr.push(nd);
                    }
                }
            }
            func(this._contentNode_Label);
            func(this._contentNode_Spine);
        }
        else if(node.__sliceFlag.isNormal) { //content子节点的子节点
            let func = (contentNode:cc.Node)=>{
                for(let i=0;i<contentNode.children.length;i++) {
                    let nd = contentNode.children[i];
                    let parent = nd.__sliceFlag.parent;
                    while(1) {
                        if(!parent || parent.__sliceFlag?.root) {
                            break;
                        }
                        else if(parent.uuid == node.uuid) {
                            arr.push(nd);
                            break;
                        }
                        else {
                            parent = parent.parent;
                        }
                    }
                }
                func(this._contentNode_Label);
                func(this._contentNode_Spine);
            }

        }
        return arr;
    }
}
