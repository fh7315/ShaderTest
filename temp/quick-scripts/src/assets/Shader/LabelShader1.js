"use strict";
cc._RF.push(module, '8690aPIFAFMt5bHBUThcuBr', 'LabelShader1');
// Shader/LabelShader1.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, requireComponent = _a.requireComponent, disallowMultiple = _a.disallowMultiple, executeInEditMode = _a.executeInEditMode;
var Gradient = cc.Enum({
    None: 0,
    OneColor: 1,
    TwoColor: 2,
    TriColor: 3,
});
var GlowLevel = cc.Enum({
    None: 0,
    Lowp: 1,
    Mediump: 2,
    Highp: 3,
});
/**
 * 字体效果
 * - 阴影
 * - 描边
 * - 描边阴影
 * - 颜色渐变
 * - 扫光效果
 * - 外发光
 */
var LabelShader1 = /** @class */ (function (_super) {
    __extends(LabelShader1, _super);
    function LabelShader1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //-----------------------阴影
        _this.shadowUse = false;
        _this.shadowOffset = cc.v2(1, 1);
        _this.shadowColor = cc.color(0, 0, 0, 150);
        //-----------------------描边
        _this.outlineUse = false;
        _this.outlineWidth = 1;
        _this.outlineColor = cc.color(0, 0, 0, 255);
        //-----------------------描边阴影
        _this.olShadowUse = false;
        _this.olShadowOffset = cc.v2(1, 1);
        _this.olShadowColor = cc.color(0, 0, 0, 150);
        //-----------------------扫光
        _this.flowLightUse = false;
        _this.flSpeed = 1;
        _this.flRot = 0;
        _this.flWidth = 15;
        _this.flColor = cc.color(255, 255, 255, 255);
        //-----------------------文字颜色、渐变
        _this.gradient = Gradient.None;
        _this.color1 = cc.color(255, 0, 0, 255);
        _this.color2 = cc.color(0, 255, 0, 255);
        _this.color3 = cc.color(0, 0, 255, 255);
        //-----------------------外发光
        _this.glow = GlowLevel.None;
        _this.glowWidth = 10;
        _this.glowDepth = 2;
        _this.glowColor = cc.color(255, 255, 255, 255);
        _this._mtl = null;
        _this._time = 0;
        return _this;
    }
    LabelShader1.prototype.onLoad = function () {
        var _this = this;
        if (CC_EDITOR) {
            var url = 'Shader/LabelShader1';
            cc.resources.load(url, cc.Material, function (err, mat) {
                if (!err && mat) {
                    mat.define('USE_TEXTURE', true, 0);
                    _this.node.getComponent(cc.Label).setMaterial(0, mat);
                    _this.initMat();
                }
            });
        }
        else {
            this.initMat();
        }
    };
    LabelShader1.prototype.initMat = function () {
        this._mtl = this.node.getComponent(cc.Label).getMaterial(0);
        this._mtl.define('USE_TEXTURE', true, 0);
        this.node.getComponent(cc.Label).setMaterial(0, this._mtl);
        this.use();
    };
    LabelShader1.prototype.use = function () {
        if (!this._mtl)
            return;
        this._mtl.setProperty('i_resolution', [this.node.width, this.node.height]);
        this._mtl.setProperty('i_alpha', this.node.opacity / 255);
        this._mtl.setProperty('i_shadow', this.shadowUse ? 1 : 0);
        this._mtl.setProperty('i_shadowOffset', [-this.shadowOffset.x / this.node.width, -this.shadowOffset.y / this.node.height]);
        this._mtl.setProperty('i_shadowColor', [this.shadowColor.r / 255, this.shadowColor.g / 255, this.shadowColor.b / 255, this.shadowColor.a / 255]);
        this._mtl.setProperty('i_outline', this.outlineUse ? 1 : 0);
        this._mtl.setProperty('i_outlineWidth', [this.outlineWidth / this.node.width, this.outlineWidth / this.node.height]);
        this._mtl.setProperty('i_outlineColor', [this.outlineColor.r / 255, this.outlineColor.g / 255, this.outlineColor.b / 255, this.outlineColor.a / 255]);
        this._mtl.setProperty('i_olShadow', this.olShadowUse ? 1 : 0);
        this._mtl.setProperty('i_olShadowOffset', [-this.olShadowOffset.x / this.node.width, -this.olShadowOffset.y / this.node.height]);
        this._mtl.setProperty('i_olShadowColor', [this.olShadowColor.r / 255, this.olShadowColor.g / 255, this.olShadowColor.b / 255, this.olShadowColor.a / 255]);
        this._mtl.setProperty('i_gradient', this.gradient - 1);
        switch (this.gradient) {
            case Gradient.None:
                this._mtl.setProperty('i_color1', [this.node.color.r / 255, this.node.color.g / 255, this.node.color.b / 255, this.node.color.a / 255]);
                break;
            case Gradient.OneColor:
            case Gradient.TwoColor:
            case Gradient.TriColor:
                this._mtl.setProperty('i_color1', [this.node.color.r / 255, this.node.color.g / 255, this.node.color.b / 255, this.node.color.a / 255]);
                this._mtl.setProperty('i_color1', [this.color1.r / 255, this.color1.g / 255, this.color1.b / 255, this.color1.a / 255]);
                this._mtl.setProperty('i_color2', [this.color2.r / 255, this.color2.g / 255, this.color2.b / 255, this.color2.a / 255]);
                this._mtl.setProperty('i_color3', [this.color3.r / 255, this.color3.g / 255, this.color3.b / 255, this.color3.a / 255]);
                break;
        }
        this._mtl.setProperty('i_flowLight', this.flowLightUse ? 1 : 0);
        this._mtl.setProperty('i_flTime', this.flSpeed * this._time * 60 / this.node.width);
        this._mtl.setProperty('i_flRot', Math.atan(Math.tan(Math.PI * this.flRot / 180.) * this.node.height / this.node.width) * 180. / Math.PI);
        this._mtl.setProperty('i_flWidth', this.flWidth / this.node.width);
        this._mtl.setProperty('i_flColor', [this.flColor.r / 255, this.flColor.g / 255, this.flColor.b / 255, this.flColor.a / 255]);
        this._mtl.setProperty('i_glow', this.glow);
        this._mtl.setProperty('i_glowWidth', [this.glowWidth / this.node.width, this.glowWidth / this.node.height]);
        this._mtl.setProperty('i_glowDepth', this.glowDepth);
        this._mtl.setProperty('i_glowColor', [this.glowColor.r / 255, this.glowColor.g / 255, this.glowColor.b / 255, this.glowColor.a / 255]);
    };
    LabelShader1.prototype.update = function (dt) {
        this._time += dt;
        this.use();
    };
    __decorate([
        property({
            tooltip: '是否使用阴影',
        })
    ], LabelShader1.prototype, "shadowUse", void 0);
    __decorate([
        property({
            tooltip: '阴影偏移（像素）',
            visible: function () {
                return this.shadowUse;
            }
        })
    ], LabelShader1.prototype, "shadowOffset", void 0);
    __decorate([
        property({
            tooltip: '阴影颜色',
            visible: function () {
                return this.shadowUse;
            }
        })
    ], LabelShader1.prototype, "shadowColor", void 0);
    __decorate([
        property({
            tooltip: '是否使用描边',
        })
    ], LabelShader1.prototype, "outlineUse", void 0);
    __decorate([
        property({
            tooltip: '描边宽度（像素）',
            min: 1,
            visible: function () {
                return this.outlineUse;
            }
        })
    ], LabelShader1.prototype, "outlineWidth", void 0);
    __decorate([
        property({
            tooltip: '描边颜色',
            visible: function () {
                return this.outlineUse;
            }
        })
    ], LabelShader1.prototype, "outlineColor", void 0);
    __decorate([
        property({
            tooltip: '是否使用描边阴影',
            visible: function () {
                return this.outlineUse;
            }
        })
    ], LabelShader1.prototype, "olShadowUse", void 0);
    __decorate([
        property({
            tooltip: '描边阴影偏移（像素）',
            visible: function () {
                return this.outlineUse && this.olShadowUse;
            }
        })
    ], LabelShader1.prototype, "olShadowOffset", void 0);
    __decorate([
        property({
            tooltip: '描边阴影颜色',
            visible: function () {
                return this.outlineUse && this.olShadowUse;
            }
        })
    ], LabelShader1.prototype, "olShadowColor", void 0);
    __decorate([
        property({
            tooltip: '是否使用扫光动效',
        })
    ], LabelShader1.prototype, "flowLightUse", void 0);
    __decorate([
        property({
            tooltip: '扫光动效速度（像素）',
            visible: function () {
                return this.flowLightUse;
            }
        })
    ], LabelShader1.prototype, "flSpeed", void 0);
    __decorate([
        property({
            tooltip: '扫光动效旋转角度',
            visible: function () {
                return this.flowLightUse;
            }
        })
    ], LabelShader1.prototype, "flRot", void 0);
    __decorate([
        property({
            tooltip: '扫光动效宽度（像素）',
            min: 1,
            visible: function () {
                return this.flowLightUse;
            }
        })
    ], LabelShader1.prototype, "flWidth", void 0);
    __decorate([
        property({
            tooltip: '扫光效果颜色',
            visible: function () {
                return this.flowLightUse;
            }
        })
    ], LabelShader1.prototype, "flColor", void 0);
    __decorate([
        property({
            tooltip: '文字颜色\nNone：单色，使用节点color\nOneColor：单色，使用color1\nTwoColor：渐变色-双色\nTriColor：渐变色-三色',
            type: cc.Enum(Gradient),
        })
    ], LabelShader1.prototype, "gradient", void 0);
    __decorate([
        property({
            visible: function () {
                return this.gradient > Gradient.None;
            }
        })
    ], LabelShader1.prototype, "color1", void 0);
    __decorate([
        property({
            visible: function () {
                return this.gradient > Gradient.OneColor;
            }
        })
    ], LabelShader1.prototype, "color2", void 0);
    __decorate([
        property({
            visible: function () {
                return this.gradient > Gradient.TwoColor;
            }
        })
    ], LabelShader1.prototype, "color3", void 0);
    __decorate([
        property({
            tooltip: '外发光，外发光较耗性能\nNone：不使用\nLowp：低精度（建议）\nMediump: 中等精度\nHighp：高精度',
            type: cc.Enum(GlowLevel),
        })
    ], LabelShader1.prototype, "glow", void 0);
    __decorate([
        property({
            tooltip: '外发光宽度（像素）',
            min: 1,
            visible: function () {
                return this.glow > GlowLevel.None;
            }
        })
    ], LabelShader1.prototype, "glowWidth", void 0);
    __decorate([
        property({
            tooltip: '外发光颜色深度',
            min: 1,
            max: 32,
            visible: function () {
                return this.glow > GlowLevel.None;
            }
        })
    ], LabelShader1.prototype, "glowDepth", void 0);
    __decorate([
        property({
            tooltip: '外发光颜色',
            visible: function () {
                return this.glow > GlowLevel.None;
            }
        })
    ], LabelShader1.prototype, "glowColor", void 0);
    LabelShader1 = __decorate([
        ccclass,
        menu('UI/LabelShader1'),
        requireComponent(cc.Label),
        disallowMultiple(),
        executeInEditMode()
    ], LabelShader1);
    return LabelShader1;
}(cc.Component));
exports.default = LabelShader1;

cc._RF.pop();