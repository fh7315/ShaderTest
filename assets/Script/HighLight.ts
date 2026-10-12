const {ccclass, property, menu, requireComponent, disallowMultiple, executeInEditMode, playOnFocus} = cc._decorator;

/**
 * 边缘走光
 */
@ccclass
@menu('UI/HighLight')
@requireComponent(cc.Sprite)
@disallowMultiple()
@executeInEditMode()
@playOnFocus()
export default class EdgeLight extends cc.Component {

    @property(cc.Color) light_color:cc.Color = cc.color(255, 255, 255, 255);
    @property() light_width = 10;

    private _mtl:cc.Material = null;

    onLoad() {
        if(this.node.getComponent(cc.Sprite).getMaterial(0).name != 'HighLight') {
            let url = 'Shader/HighLight';
            cc.resources.load(url, cc.Material, (err, mat:cc.Material)=>{
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
        this.useTexturePack();
        this.use();
    }

    useTexturePack() {
        if(!this._mtl) return;
        this._mtl.setProperty('i_resolution', [this.node.width, this.node.height]);
        let frame = this.getComponent(cc.Sprite).spriteFrame as any;
        let l = frame.uv[0];
        let r = frame.uv[6];
        let b = frame.uv[3];
        let t = frame.uv[5];
        let u_uvOffset = new cc.Vec4(l, t, r, b);
        let u_uvRotated = frame.isRotated() ? 1.0 : 0.0;
        this._mtl.setProperty('i_uvOffset', u_uvOffset);
        this._mtl.setProperty('i_uvRotated', u_uvRotated);
    }

    use() {
        if(!this._mtl) return;
        this._mtl.setProperty('i_color', this.light_color);
        this._mtl.setProperty('i_width', this.light_width/this.node.height);
    }

    update() {
        if(!this._mtl) return;
        this.useTexturePack();
        this.use();
    }
}