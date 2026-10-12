!CC_EDITOR && (function () {
    cc.Node.prototype.child = function(path: string){
        if(!this.nodeMap) this.nodeMap = {};
        if(cc.isValid(this.nodeMap[path])) {
            return this.nodeMap[path];
        }
        else {
            /*let arr = path.split('/');
            let node = this;
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
                this.nodeMap[path] = node;
            }
            return node;*/
            let arr = path.split('/');
            let node = this;
            //分层渲染相关处理
            if(this.__sliceFlag?.self) { //分层渲染item节点
                node = this.getChildByName(arr[0]);
                let funcNode = (contentNode: cc.Node)=>{
                    for(let i=0; i<contentNode.children.length; i++) {
                        let sonNode = contentNode.children[i];
                        if(sonNode.__sliceFlag?.root == this.__sliceFlag.self && !sonNode.__sliceFlag?.parent && sonNode.name == arr[0]) {
                            node = sonNode;
                            break;
                        }
                    }
                }
                if(!node && this.parent.getChildByName('__SliceListContent')) funcNode(this.parent.getChildByName('__SliceListContent'));
                if(!node && this.parent.getChildByName('__SliceListContent_Spine')) funcNode(this.parent.getChildByName('__SliceListContent_Spine'));
                if(!node && this.parent.getChildByName('__SliceListContent_Label')) funcNode(this.parent.getChildByName('__SliceListContent_Label'));
                if(node && arr.length > 1) {
                    arr.shift();
                    node = node.child(arr.join('/'));
                }
            }
            else if(this.__sliceFlag?.root) { //分层渲染分层的节点
                node = this.getChildByName(arr[0]);
                let funcNode = (contentNode: cc.Node)=>{
                    for(let i=0; i<contentNode.children.length; i++) {
                        let sonNode = contentNode.children[i];
                        if(sonNode.__sliceFlag?.root == this.__sliceFlag.root && sonNode.__sliceFlag?.parent?.uuid == this.uuid && sonNode.name == arr[0]) {
                            node = sonNode;
                            break;
                        }
                    }
                }
                if(!node && this.parent.getChildByName('__SliceListContent_Spine')) funcNode(this.parent.getChildByName('__SliceListContent_Spine'));
                if(!node && this.parent.getChildByName('__SliceListContent_Label')) funcNode(this.parent.getChildByName('__SliceListContent_Label'));
                if(node && arr.length > 1) {
                    arr.shift();
                    node = node.child(arr.join('/'));
                }
            }
            else if(this.__sliceFlag?.isNormal) { //分层渲染分层的节点的子节点
                node = this.getChildByName(arr[0]);
                let funcNode = (contentNode: cc.Node)=>{
                    for(let i=0; i<contentNode.children.length; i++) {
                        let sonNode = contentNode.children[i];
                        if(sonNode.__sliceFlag?.parent?.uuid == this.uuid && sonNode.name == arr[0]) {
                            node = sonNode;
                            break;
                        }
                    }
                }
                if(!node && this.parent.getChildByName('__SliceListContent_Spine')) funcNode(this.parent.getChildByName('__SliceListContent_Spine'));
                if(!node && this.parent.getChildByName('__SliceListContent_Label')) funcNode(this.parent.getChildByName('__SliceListContent_Label'));
                if(node && arr.length > 1) {
                    arr.shift();
                    node = node.child(arr.join('/'));
                }
            }
            else {
                for(let i=0; node && i<arr.length; i++) {
                    node = node.getChildByName(arr[i]);
                }
            }
            if(node) {
                this.nodeMap[path] = node;
            }
            return node;
        }
    }
    cc.Node.prototype.comp = function(type: any){
        return this.getComponent(type);
    }
    //分层渲染相关属性
    Object.defineProperty(cc.Node.prototype, 'activeSF', {
        get: function(){
            return this._activeSF || false;
        },
        set: function(value){
            if(this._activeSF !== value) {
                this._activeSF = value;
                this.emit('activeSF_changed');
            }
        },
    });
    Object.defineProperty(cc.Node.prototype, 'posSF', {
        get: function(){
            return this._posSF || cc.v2();
        },
        set: function(value){
            if(!this._posSF || this._posSF.x !== value.x || this._posSF.y !== value.y) {
                this._posSF = value;
                this.emit('posSF_changed');
            }
        },
    });
    Object.defineProperty(cc.Node.prototype, 'xSF', {
        get: function(){
            return this._posSF?.x || 0;
        },
        set: function(value){
            if(!this._posSF) this._posSF = cc.v2();
            if(this._posSF.x !== value) {
                this._posSF.x = value;
                this.emit('posSF_changed');
            }
        },
    });
    Object.defineProperty(cc.Node.prototype, 'ySF', {
        get: function(){
            return this._posSF?.y || 0;
        },
        set: function(value){
            if(!this._posSF) this._posSF = cc.v2();
            if(this._posSF.y !== value) {
                this._posSF.y = value;
                this.emit('posSF_changed');
            }
        },
    });
    //场景
    Object.defineProperty(cc.Node.prototype, 'Canvas', { get() { return this.comp(cc.Canvas); }, })
    Object.defineProperty(cc.Node.prototype, 'Camera', { get() { return this.comp(cc.Camera); }, })
    //渲染
    Object.defineProperty(cc.Node.prototype, 'Mask', { get() { return this.comp(cc.Mask); }, })
    Object.defineProperty(cc.Node.prototype, 'Graphics', { get() { return this.comp(cc.Graphics); }, })
    Object.defineProperty(cc.Node.prototype, 'Sprite', { get() { return this.comp(cc.Sprite); }, })
    Object.defineProperty(cc.Node.prototype, 'Label', { get() { return this.comp(cc.Label); }, })
    Object.defineProperty(cc.Node.prototype, 'LabelOutline', { get() { return this.comp(cc.LabelOutline); }, })
    Object.defineProperty(cc.Node.prototype, 'LabelShadow', { get() { return this.comp(cc.LabelShadow); }, })
    Object.defineProperty(cc.Node.prototype, 'RichText', { get() { return this.comp(cc.RichText); }, })
    Object.defineProperty(cc.Node.prototype, 'MotionStreak', { get() { return this.comp(cc.MotionStreak); }, })
    Object.defineProperty(cc.Node.prototype, 'ParticleSystem', { get() { return this.comp(cc.ParticleSystem); }, })
    Object.defineProperty(cc.Node.prototype, 'WebView', { get() { return this.comp(cc.WebView); }, })
    //动画
    Object.defineProperty(cc.Node.prototype, 'Animation', { get() { return this.comp(cc.Animation); }, })
    Object.defineProperty(cc.Node.prototype, 'Spine', { get() { return this.comp(sp.Skeleton); }, })
    Object.defineProperty(cc.Node.prototype, 'DragonBones', { get() { return this.comp(dragonBones.ArmatureDisplay); }, })
    //ui
    Object.defineProperty(cc.Node.prototype, 'Button', { get() { return this.comp(cc.Button); }, })
    Object.defineProperty(cc.Node.prototype, 'EditBox', { get() { return this.comp(cc.EditBox); }, })
    Object.defineProperty(cc.Node.prototype, 'ScrollView', { get() { return this.comp(cc.ScrollView); }, })
    Object.defineProperty(cc.Node.prototype, 'Scrollbar', { get() { return this.comp(cc.Scrollbar); }, })
    Object.defineProperty(cc.Node.prototype, 'PageView', { get() { return this.comp(cc.PageView); }, })
    Object.defineProperty(cc.Node.prototype, 'PageViewIndicator', { get() { return this.comp(cc.PageViewIndicator); }, })
    Object.defineProperty(cc.Node.prototype, 'Layout', { get() { return this.comp(cc.Layout); }, })
    Object.defineProperty(cc.Node.prototype, 'Widget', { get() { return this.comp(cc.Widget); }, })
    Object.defineProperty(cc.Node.prototype, 'ProgressBar', { get() { return this.comp(cc.ProgressBar); }, })
    Object.defineProperty(cc.Node.prototype, 'Toggle', { get() { return this.comp(cc.Toggle); }, })
    Object.defineProperty(cc.Node.prototype, 'ToggleContainer', { get() { return this.comp(cc.ToggleContainer); }, })
    Object.defineProperty(cc.Node.prototype, 'ToggleGroup', { get() { return this.comp(cc.ToggleGroup); }, })
})();
