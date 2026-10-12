const {ccclass, property} = cc._decorator;

@ccclass
export default class SpinesTest extends cc.Component {

    start () {
        let itemPrefab = this.node.getChildByName('item');
        itemPrefab.parent = null;
        for(let i=0;i<2;i++) {
            let item = cc.instantiate(itemPrefab);
            item.parent = this.node;
            item.setPosition(Math.random()*1000-500, Math.random()*600-300);
        }
    }
}
