const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad () {
        let skl = this.node.getComponent(sp.Skeleton);
        console.log(skl.setBlendFunc);
    }
}
