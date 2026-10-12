const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {
        cc.tween(this.node)
            .by(2, {angle:-360})
            .repeatForever()
            .start();
        //图片检查
        let sf = this.node.parent.comp(cc.Sprite).spriteFrame;
    }

}
