const {ccclass, property} = cc._decorator;

@ccclass
export default class TestTmp extends cc.Component {

    onLoad() {
        cc.resources.load('10510_a', cc.SpriteFrame, (err, res:cc.SpriteFrame)=>{
            let data = this.readPixelsFromSpriteFrame(res);
            cc.resources.load('10510_a_b', cc.SpriteFrame, (err, res:cc.SpriteFrame)=>{
                let data1 = this.readPixelsFromSpriteFrame(res);
                console.log(data, data1);
                data.forEach((e, i) => {
                    if(data[i] != data1[i]) {
                        console.log(data[i] - data1[i]);
                    }
                });
            });
        });
    }

    /**
     * 从纹理中读取像素信息
     * @param sf 
     */
    readPixelsFromSpriteFrame(sf:cc.SpriteFrame):Uint8Array {
        let node = new cc.Node();
        node.parent = cc.find('Canvas');
        node.x = 20000;
        node.scaleY = -1;
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = sf;
        //camera
        let cameraNode = new cc.Node();
        cameraNode.parent = node;
        let camera = cameraNode.addComponent(cc.Camera);
        camera.depth = 9;
        camera.alignWithScreen = false;
        camera.orthoSize = node.height/2;
        camera.cullingMask = 0xffffffff;
        //renderTexturer
        let rt = new cc.RenderTexture();
        rt.initWithSize(sf.getRect().width, sf.getRect().height);
        camera.targetTexture = rt;
        camera.render();
        let data = rt.readPixels();
        node.destroy();
        return data;
    }
}
