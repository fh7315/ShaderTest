const {ccclass, property, menu, requireComponent, disallowMultiple, executeInEditMode} = cc._decorator;

/**
 * 取色板
 */
@ccclass
@menu('UI/ColorSpectrum')
@requireComponent(cc.Sprite)
@disallowMultiple()
@executeInEditMode()
export default class ColorSpectrum extends cc.Component {

    private _mtl:cc.Material = null;

    onLoad() {
        if(CC_EDITOR) {
            cc.resources.load('ShaderTex/splash', cc.SpriteFrame, (err, sp:cc.SpriteFrame)=>{
                if(!err && sp) {
                    this.node.getComponent(cc.Sprite).spriteFrame = sp;
                }
            })
            cc.resources.load('Shader/ColorSpectrum', cc.Material, (err, mat:cc.Material)=>{
                if(!err && mat) {
                    mat.define('USE_TEXTURE', true, 0);
                    this.node.getComponent(cc.Sprite).setMaterial(0, mat);
                    this.initMat();
                }
            })
        }
        else {
            this.initMat();
        }
    }

    initMat() {
        this._mtl = this.node.getComponent(cc.Sprite).getMaterial(0);
        this._mtl.define('USE_TEXTURE', true, 0);
        this.node.getComponent(cc.Sprite).setMaterial(0, this._mtl);
        this.use();
    }

    use() {
        
    }
}
