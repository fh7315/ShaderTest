const {ccclass, property, menu, requireComponent, disallowMultiple, executeInEditMode, playOnFocus} = cc._decorator;

enum Lable_SDF_Type {
    None = 0,
    Default = 1,
    Custom = 2,
}
enum Gradient {
    OneColor = 0,
    TwoColor = 1,
    TriColor = 2,
}

/**
 * SDF文字
 */
@ccclass
@menu('UI/LableSDF')
@requireComponent(cc.Label)
@disallowMultiple()
@executeInEditMode()
@playOnFocus()
export default class LableSDF extends cc.Component {

    @property({tooltip:'Node：系统字普通文本\nDefault：默认设置\nCustom：自定义（加粗、描边...）', type:cc.Enum(Lable_SDF_Type)}) 
    set type(v:Lable_SDF_Type) { this._type = v; this._mat = null; this.setFont(); this.refreshMaterial(); };
    get type():Lable_SDF_Type { return this._type; };
    @property() _type:Lable_SDF_Type = Lable_SDF_Type.Default;

    @property({tooltip:'加粗', visible:function(){ return this.type == Lable_SDF_Type.Custom; }, range:[0,1]}) bold:number = 0.5;
    @property({tooltip:'OneColor：单色，使用color1\nTwoColor：渐变色-双色\nTriColor：渐变色-三色', type:cc.Enum(Gradient), 
        visible:function(){ return this.type == Lable_SDF_Type.Custom; }}) gradient = Gradient.OneColor;
    @property({visible:function(){ return this.type == Lable_SDF_Type.Custom; }}) color1:cc.Color = cc.Color.WHITE;
    @property({visible:function(){ return this.type == Lable_SDF_Type.Custom && this.gradient > 0; }}) color2:cc.Color = cc.Color.BLUE;
    @property({visible:function(){ return this.type == Lable_SDF_Type.Custom && this.gradient > 1; }}) color3:cc.Color = cc.Color.WHITE;
    @property({tooltip:'描边', visible:function(){ return this.type == Lable_SDF_Type.Custom; }}) outline:boolean = false;
    @property({tooltip:'描边宽度', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.outline; }, range:[0,1]}) outlineBold:number = 0.6;
    @property({tooltip:'描边颜色', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.outline; }}) outlineColor:cc.Color = cc.Color.RED;
    @property({tooltip:'阴影', visible:function(){ return this.type == Lable_SDF_Type.Custom; }}) shadow:boolean = false;
    @property({tooltip:'阴影偏移', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.shadow; }}) shadowOffset:cc.Vec2 = cc.v2(1, 1);
    @property({tooltip:'阴影颜色', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.shadow; }}) shadowColor:cc.Color = cc.Color.GREEN;
    @property({tooltip:'辉光', visible:function(){ return this.type == Lable_SDF_Type.Custom; }}) bloom:boolean = false;
    @property({tooltip:'辉光动画速度', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.bloom; }}) bloomSpeed:number = 0;
    @property({tooltip:'辉光强度min', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.bloom; }}) bloomDepthMin:number = 1;
    @property({tooltip:'辉光强度max', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.bloom; }}) bloomDepthMax:number = 2;
    @property({tooltip:'辉光颜色', visible:function(){ return this.type == Lable_SDF_Type.Custom && this.bloom; }}) bloomColor:cc.Color = cc.Color.YELLOW;

    private _mat:cc.Material = null;

    onLoad() {
        this.setFont();
        this.refreshMaterial();
    }

    setFont() {
        let label = this.node.getComponent(cc.Label);
        if(this.type == Lable_SDF_Type.None) {
            label.useSystemFont = true;
        }
        else if(label.font?.name != 'Font_SDF') {
            label.useSystemFont = false;
            let url = 'LabelSDF/FontSDF';
            cc.resources.load(url, cc.BitmapFont, (err, font:cc.BitmapFont)=>{
                if(!err && font && cc.isValid(label)) {
                    label.font = font;
                }
            })
        }
    }

    refreshMaterial() {
        this._mat = null;
        let label = this.node.getComponent(cc.Label);
        switch(this.type) {
            case Lable_SDF_Type.None:
                if(label.getMaterial(0)?.name != 'builtin-2d-sprite') {
                    cc.assetManager.getBundle('internal').load('materials/builtin-2d-sprite', cc.Material, (err, mat:cc.Material)=>{
                        if(!err && mat && cc.isValid(label)) {
                            label.setMaterial(0, mat);
                        }
                    })
                }
                break;
            case Lable_SDF_Type.Custom:
                if(label.getMaterial(0)?.name != 'Label_SDF_Custom') {
                    cc.resources.load('LabelSDF/Label_SDF_Custom', cc.Material, (err, mat:cc.Material)=>{
                        if(!err && mat && cc.isValid(label)) {
                            label.setMaterial(0, mat);
                            this.initMat();
                        }
                    })
                }
                else {
                    this.initMat();
                }
                break;
            default:
                if(label.getMaterial(0)?.name != 'Label_SDF_Default') {
                    cc.resources.load('LabelSDF/Label_SDF_Default', cc.Material, (err, mat:cc.Material)=>{
                        if(!err && mat && cc.isValid(label)) {
                            label.setMaterial(0, mat);
                        }
                    })
                }
                break;
        }
    }

    initMat() {
        let label = this.node.getComponent(cc.Label);
        this._mat = label?.getMaterial(0);
        if(!label || !this._mat) return;
        this._mat.define('USE_TEXTURE', true, 0);
        label.setMaterial(0, this._mat);
        this.use();
    }

    use() {
        if(this.type == Lable_SDF_Type.Custom && this._mat) {
            let color1 = [this.color1.r/255, this.color1.g/255, this.color1.b/255, this.color1.a/255];
            let color2 = [this.color2.r/255, this.color2.g/255, this.color2.b/255, this.color2.a/255];
            let color3 = [this.color3.r/255, this.color3.g/255, this.color3.b/255, this.color3.a/255];
            let color_outline = [this.outlineColor.r/255, this.outlineColor.g/255, this.outlineColor.b/255, this.outlineColor.a/255];
            let color_shadow = [this.shadowColor.r/255, this.shadowColor.g/255, this.shadowColor.b/255, this.shadowColor.a/255];
            let color_bloom = [this.bloomColor.r/255, this.bloomColor.g/255, this.bloomColor.b/255, this.bloomColor.a/255];
            let k = 0.4/2048;
            this._mat.setProperty('i_gradient', this.gradient);
            this._mat.setProperty('i_color1', color1);
            this._mat.setProperty('i_color2', color2);
            this._mat.setProperty('i_color3', color3);
            this._mat.setProperty('i_bold', 1-this.bold);
            this._mat.setProperty('i_outline', this.outline ? 1 : 0);
            this._mat.setProperty('i_outlineBold', this.outline ? 1-this.outlineBold : 1);
            this._mat.setProperty('i_outlineColor', color_outline);
            this._mat.setProperty('i_shadow', this.shadow ? 1 : 0);
            this._mat.setProperty('i_shadowOffset', [-this.shadowOffset.x*k, this.shadowOffset.y*k]);
            this._mat.setProperty('i_shadowColor', color_shadow);
            this._mat.setProperty('i_bloom', this.bloom ? 1 : 0);
            this._mat.setProperty('i_bloomSpeed', this.bloomSpeed);
            this._mat.setProperty('i_bloomDepth', [Math.min(this.bloomDepthMin, this.bloomDepthMax), Math.max(this.bloomDepthMin, this.bloomDepthMax)]);
            this._mat.setProperty('i_bloomColor', color_bloom);
        }
    }

    update() {
        CC_EDITOR && this.use();
    }
}