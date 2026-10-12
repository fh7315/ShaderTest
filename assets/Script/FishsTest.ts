import FrameAnimation from "./FrameAnimation";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FishsTest extends cc.Component {

    @property(cc.SpriteAtlas) atlas1:cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas) atlas2:cc.SpriteAtlas = null;

    onLoad() {
        let itemPrefab = this.node.getChildByName('item');
        itemPrefab.parent = null;
        // for(let i=0;i<10;i++) {
        //     let item = cc.instantiate(itemPrefab);
        //     item.parent = this.node;
        //     item.setPosition(Math.random()*1000-500, Math.random()*600-300);
        //     let atlas = i%2==0 ? this.atlas1 : this.atlas2;
        //     // let atlas = this.atlas2;
        //     item.getChildByName('fish').getComponent(FrameAnimation).atlas = atlas;
        //     item.getChildByName('shadow').getComponent(FrameAnimation).atlas = atlas;

        //     item.getChildByName('shadow').destroy();
        // }
        let index = 0;
        this.schedule(()=>{
            let item = cc.instantiate(itemPrefab);
            item.parent = this.node;
            item.setPosition(Math.random()*1000-500, Math.random()*600-300);
            // let atlas = index%2==0 ? this.atlas1 : this.atlas2;
            let atlas = this.atlas2;
            item.getChildByName('fish').getComponent(FrameAnimation).atlas = atlas;
            item.getChildByName('shadow').getComponent(FrameAnimation).atlas = atlas;

            item.getChildByName('shadow').destroy();

            index++;
        }, 0.03, 100);
    }
}
