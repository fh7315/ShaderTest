const {ccclass, property, menu, requireComponent, disallowMultiple, executeInEditMode} = cc._decorator;

const Gradient = cc.Enum({
    None: 0,
    OneColor: 1,
    TwoColor: 2,
    TriColor: 3,
})
const GlowLevel = cc.Enum({
    None: 0,
    Lowp: 1,
    Mediump: 2,
    Highp: 3,
})

/**
 * 字体效果
 * - 阴影
 * - 描边
 * - 描边阴影
 * - 颜色渐变
 * - 扫光效果
 * - 外发光
 */
@ccclass
@menu('UI/LabelShader1')
@requireComponent(cc.Label)
@disallowMultiple()
@executeInEditMode()
export default class LabelShader1 extends cc.Component {

    //-----------------------阴影
    @property({
        tooltip:'是否使用阴影',
    })
    shadowUse:boolean = false;
    @property({
        tooltip:'阴影偏移（像素）',
        visible:function(){
            return this.shadowUse;
        }
    })
    shadowOffset:cc.Vec2 = cc.v2(1, 1);
    @property({
        tooltip:'阴影颜色',
        visible:function(){
            return this.shadowUse;
        }
    })
    shadowColor:cc.Color = cc.color(0, 0, 0, 150);

    //-----------------------描边
    @property({
        tooltip:'是否使用描边',
    })
    outlineUse:boolean = false;
    @property({
        tooltip:'描边宽度（像素）',
        min: 1,
        visible:function(){
            return this.outlineUse;
        }
    })
    outlineWidth:number = 1;
    @property({
        tooltip:'描边颜色',
        visible:function(){
            return this.outlineUse;
        }
    })
    outlineColor:cc.Color = cc.color(0, 0, 0, 255);

    //-----------------------描边阴影
    @property({
        tooltip:'是否使用描边阴影',
        visible:function(){
            return this.outlineUse;
        }
    })
    olShadowUse:boolean = false;
    @property({
        tooltip:'描边阴影偏移（像素）',
        visible:function(){
            return this.outlineUse && this.olShadowUse;
        }
    })
    olShadowOffset:cc.Vec2 = cc.v2(1, 1);
    @property({
        tooltip:'描边阴影颜色',
        visible:function(){
            return this.outlineUse && this.olShadowUse;
        }
    })
    olShadowColor:cc.Color = cc.color(0, 0, 0, 150);

    //-----------------------扫光
    @property({
        tooltip:'是否使用扫光动效',
    })
    flowLightUse:boolean = false;
    @property({
        tooltip:'扫光动效速度（像素）',
        visible:function(){
            return this.flowLightUse;
        }
    })
    flSpeed:number = 1;
    @property({
        tooltip:'扫光动效旋转角度',
        visible:function(){
            return this.flowLightUse;
        }
    })
    flRot:number = 0;
    @property({
        tooltip:'扫光动效宽度（像素）',
        min: 1,
        visible:function(){
            return this.flowLightUse;
        }
    })
    flWidth:number = 15;
    @property({
        tooltip:'扫光效果颜色',
        visible:function(){
            return this.flowLightUse;
        }
    })
    flColor:cc.Color = cc.color(255, 255, 255, 255);

    //-----------------------文字颜色、渐变
    @property({
        tooltip:'文字颜色\nNone 0：单色，使用节点color\nOneColor 1：单色，使用color1\nTwoColor 2：渐变色-双色\nTriColor 3：渐变色-三色',
        type:cc.Enum(Gradient),
    })
    gradient = Gradient.None;
    @property({
        visible:function(){
            return this.gradient > Gradient.None;
        }
    })
    color1:cc.Color = cc.color(255, 0, 0, 255);
    @property({
        visible:function(){
            return this.gradient > Gradient.OneColor;
        }
    })
    color2:cc.Color = cc.color(0, 255, 0, 255);
    @property({
        visible:function(){
            return this.gradient > Gradient.TwoColor;
        }
    })
    color3:cc.Color = cc.color(0, 0, 255, 255);

    //-----------------------外发光
    @property({
        tooltip:'外发光，外发光较耗性能\nNone 0：不使用\nLowp 1：低精度（建议）\nMediump 2: 中等精度\nHighp 3：高精度',
        type:cc.Enum(GlowLevel),
    })
    glow = GlowLevel.None;
    @property({
        tooltip:'外发光宽度（像素）',
        min: 1,
        visible:function(){
            return this.glow > GlowLevel.None;
        }
    })
    glowWidth:number = 10;
    @property({
        tooltip:'外发光颜色深度',
        min: 1,
        max: 32,
        visible:function(){
            return this.glow > GlowLevel.None;
        }
    })
    glowDepth:number = 2;
    @property({
        tooltip:'外发光颜色',
        visible:function(){
            return this.glow > GlowLevel.None;
        }
    })
    glowColor:cc.Color = cc.color(255, 255, 255, 255);

    private _mtl:cc.Material = null;
    private _time:number = 0;

    onLoad() {
        if(CC_EDITOR) {
            let url = 'Shader/LabelShader1';
            cc.resources.load(url, cc.Material, (err, mat:cc.Material)=>{
                if(!err && mat) {
                    mat.define('USE_TEXTURE', true, 0);
                    this.node.getComponent(cc.Label).setMaterial(0, mat);
                    this.initMat();
                }
            })
        }
        else {
            this.initMat();
        }
    }

    initMat() {
        this._mtl = this.node.getComponent(cc.Label).getMaterial(0);
        this._mtl.define('USE_TEXTURE', true, 0);
        this.node.getComponent(cc.Label).setMaterial(0, this._mtl);
        this.use();
    }

    use() {
        if(!this._mtl) return;
        this._mtl.setProperty('i_resolution', [this.node.width, this.node.height]);
        this._mtl.setProperty('i_shadow', this.shadowUse ? 1 : 0);
        this._mtl.setProperty('i_shadowOffset', [-this.shadowOffset.x/this.node.width, -this.shadowOffset.y/this.node.height]);
        this._mtl.setProperty('i_shadowColor', [this.shadowColor.r/255, this.shadowColor.g/255, this.shadowColor.b/255, this.shadowColor.a/255]);
        this._mtl.setProperty('i_outline', this.outlineUse ? 1 : 0);
        this._mtl.setProperty('i_outlineWidth', [this.outlineWidth/this.node.width, this.outlineWidth/this.node.height]);
        this._mtl.setProperty('i_outlineColor', [this.outlineColor.r/255, this.outlineColor.g/255, this.outlineColor.b/255, this.outlineColor.a/255]);
        this._mtl.setProperty('i_olShadow', this.olShadowUse ? 1 : 0);
        this._mtl.setProperty('i_olShadowOffset', [-this.olShadowOffset.x/this.node.width, -this.olShadowOffset.y/this.node.height]);
        this._mtl.setProperty('i_olShadowColor', [this.olShadowColor.r/255, this.olShadowColor.g/255, this.olShadowColor.b/255, this.olShadowColor.a/255]);
        this._mtl.setProperty('i_gradient', this.gradient-1);
        switch(this.gradient) {
            case Gradient.None:
                this._mtl.setProperty('i_color1', [this.node.color.r/255, this.node.color.g/255, this.node.color.b/255, this.node.color.a/255]);
                break;
            case Gradient.OneColor:
            case Gradient.TwoColor:
            case Gradient.TriColor:
                this._mtl.setProperty('i_color1', [this.node.color.r/255, this.node.color.g/255, this.node.color.b/255, this.node.color.a/255]);
                this._mtl.setProperty('i_color1', [this.color1.r/255, this.color1.g/255, this.color1.b/255, this.color1.a/255]);
                this._mtl.setProperty('i_color2', [this.color2.r/255, this.color2.g/255, this.color2.b/255, this.color2.a/255]);
                this._mtl.setProperty('i_color3', [this.color3.r/255, this.color3.g/255, this.color3.b/255, this.color3.a/255]);
                break;
        }
        this._mtl.setProperty('i_flowLight', this.flowLightUse ? 1 : 0);
        this._mtl.setProperty('i_flTime', this.flSpeed*this._time*60/this.node.width);
        this._mtl.setProperty('i_flRot', Math.atan(Math.tan(Math.PI*this.flRot/180.)*this.node.height/this.node.width)*180./Math.PI);
        this._mtl.setProperty('i_flWidth', this.flWidth/this.node.width);
        this._mtl.setProperty('i_flColor', [this.flColor.r/255, this.flColor.g/255, this.flColor.b/255, this.flColor.a/255]);
        this._mtl.setProperty('i_glow', this.glow);
        this._mtl.setProperty('i_glowWidth', [this.glowWidth/this.node.width, this.glowWidth/this.node.height]);
        this._mtl.setProperty('i_glowDepth', this.glowDepth);
        this._mtl.setProperty('i_glowColor', [this.glowColor.r/255, this.glowColor.g/255, this.glowColor.b/255, this.glowColor.a/255]);
    }

    update(dt:number) {
        this._time += dt;
        this.use();
    }
}