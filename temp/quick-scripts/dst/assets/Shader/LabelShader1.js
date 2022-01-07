
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Shader/LabelShader1.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2hhZGVyXFxMYWJlbFNoYWRlcjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUFtRixFQUFFLENBQUMsVUFBVSxFQUEvRixPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxnQkFBZ0Isc0JBQUEsRUFBRSxnQkFBZ0Isc0JBQUEsRUFBRSxpQkFBaUIsdUJBQWlCLENBQUM7QUFFdkcsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNyQixJQUFJLEVBQUUsQ0FBQztJQUNQLFFBQVEsRUFBRSxDQUFDO0lBQ1gsUUFBUSxFQUFFLENBQUM7SUFDWCxRQUFRLEVBQUUsQ0FBQztDQUNkLENBQUMsQ0FBQTtBQUNGLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDdEIsSUFBSSxFQUFFLENBQUM7SUFDUCxJQUFJLEVBQUUsQ0FBQztJQUNQLE9BQU8sRUFBRSxDQUFDO0lBQ1YsS0FBSyxFQUFFLENBQUM7Q0FDWCxDQUFDLENBQUE7QUFFRjs7Ozs7Ozs7R0FRRztBQU1IO0lBQTBDLGdDQUFZO0lBQXREO1FBQUEscUVBaU9DO1FBL05HLDJCQUEyQjtRQUkzQixlQUFTLEdBQVcsS0FBSyxDQUFDO1FBTzFCLGtCQUFZLEdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFPbkMsaUJBQVcsR0FBWSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTlDLDJCQUEyQjtRQUkzQixnQkFBVSxHQUFXLEtBQUssQ0FBQztRQVEzQixrQkFBWSxHQUFVLENBQUMsQ0FBQztRQU94QixrQkFBWSxHQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FB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QyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxRQUFPLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsS0FBSyxRQUFRLENBQUMsSUFBSTtnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDaEksTUFBTTtZQUNWLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUN2QixLQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDdkIsS0FBSyxRQUFRLENBQUMsUUFBUTtnQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hILElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hILElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hILE1BQU07U0FDYjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLEdBQUMsSUFBSSxDQUFD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REFDZ0Q7SUEzSmpDLFlBQVk7UUFMaEMsT0FBTztRQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUN2QixnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzFCLGdCQUFnQixFQUFFO1FBQ2xCLGlCQUFpQixFQUFFO09BQ0MsWUFBWSxDQWlPaEM7SUFBRCxtQkFBQztDQWpPRCxBQWlPQyxDQWpPeUMsRUFBRSxDQUFDLFNBQVMsR0FpT3JEO2tCQWpPb0IsWUFBWSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eSwgbWVudSwgcmVxdWlyZUNvbXBvbmVudCwgZGlzYWxsb3dNdWx0aXBsZSwgZXhlY3V0ZUluRWRpdE1vZGV9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbmNvbnN0IEdyYWRpZW50ID0gY2MuRW51bSh7XHJcbiAgICBOb25lOiAwLFxyXG4gICAgT25lQ29sb3I6IDEsXHJcbiAgICBUd29Db2xvcjogMixcclxuICAgIFRyaUNvbG9yOiAzLFxyXG59KVxyXG5jb25zdCBHbG93TGV2ZWwgPSBjYy5FbnVtKHtcclxuICAgIE5vbmU6IDAsXHJcbiAgICBMb3dwOiAxLFxyXG4gICAgTWVkaXVtcDogMixcclxuICAgIEhpZ2hwOiAzLFxyXG59KVxyXG5cclxuLyoqXHJcbiAqIOWtl+S9k+aViOaenFxyXG4gKiAtIOmYtOW9sVxyXG4gKiAtIOaPj+i+uVxyXG4gKiAtIOaPj+i+uemYtOW9sVxyXG4gKiAtIOminOiJsua4kOWPmFxyXG4gKiAtIOaJq+WFieaViOaenFxyXG4gKiAtIOWkluWPkeWFiVxyXG4gKi9cclxuQGNjY2xhc3NcclxuQG1lbnUoJ1VJL0xhYmVsU2hhZGVyMScpXHJcbkByZXF1aXJlQ29tcG9uZW50KGNjLkxhYmVsKVxyXG5AZGlzYWxsb3dNdWx0aXBsZSgpXHJcbkBleGVjdXRlSW5FZGl0TW9kZSgpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhYmVsU2hhZGVyMSBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLemYtOW9sVxyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0b29sdGlwOifmmK/lkKbkvb/nlKjpmLTlvbEnLFxyXG4gICAgfSlcclxuICAgIHNoYWRvd1VzZTpib29sZWFuID0gZmFsc2U7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+mYtOW9seWBj+enu++8iOWDj+e0oO+8iScsXHJcbiAgICAgICAgdmlzaWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGFkb3dVc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHNoYWRvd09mZnNldDpjYy5WZWMyID0gY2MudjIoMSwgMSk7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+mYtOW9seminOiJsicsXHJcbiAgICAgICAgdmlzaWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGFkb3dVc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHNoYWRvd0NvbG9yOmNjLkNvbG9yID0gY2MuY29sb3IoMCwgMCwgMCwgMTUwKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t5o+P6L65XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+aYr+WQpuS9v+eUqOaPj+i+uScsXHJcbiAgICB9KVxyXG4gICAgb3V0bGluZVVzZTpib29sZWFuID0gZmFsc2U7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+aPj+i+ueWuveW6pu+8iOWDj+e0oO+8iScsXHJcbiAgICAgICAgbWluOiAxLFxyXG4gICAgICAgIHZpc2libGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3V0bGluZVVzZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgb3V0bGluZVdpZHRoOm51bWJlciA9IDE7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+aPj+i+ueminOiJsicsXHJcbiAgICAgICAgdmlzaWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vdXRsaW5lVXNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBvdXRsaW5lQ29sb3I6Y2MuQ29sb3IgPSBjYy5jb2xvcigwLCAwLCAwLCAyNTUpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3mj4/ovrnpmLTlvbFcclxuICAgIEBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdG9vbHRpcDon5piv5ZCm5L2/55So5o+P6L656Zi05b2xJyxcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm91dGxpbmVVc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIG9sU2hhZG93VXNlOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdG9vbHRpcDon5o+P6L656Zi05b2x5YGP56e777yI5YOP57Sg77yJJyxcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm91dGxpbmVVc2UgJiYgdGhpcy5vbFNoYWRvd1VzZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgb2xTaGFkb3dPZmZzZXQ6Y2MuVmVjMiA9IGNjLnYyKDEsIDEpO1xyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0b29sdGlwOifmj4/ovrnpmLTlvbHpopzoibInLFxyXG4gICAgICAgIHZpc2libGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3V0bGluZVVzZSAmJiB0aGlzLm9sU2hhZG93VXNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBvbFNoYWRvd0NvbG9yOmNjLkNvbG9yID0gY2MuY29sb3IoMCwgMCwgMCwgMTUwKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t5omr5YWJXHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+aYr+WQpuS9v+eUqOaJq+WFieWKqOaViCcsXHJcbiAgICB9KVxyXG4gICAgZmxvd0xpZ2h0VXNlOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdG9vbHRpcDon5omr5YWJ5Yqo5pWI6YCf5bqm77yI5YOP57Sg77yJJyxcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dMaWdodFVzZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZmxTcGVlZDpudW1iZXIgPSAxO1xyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0b29sdGlwOifmiavlhYnliqjmlYjml4vovazop5LluqYnLFxyXG4gICAgICAgIHZpc2libGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd0xpZ2h0VXNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBmbFJvdDpudW1iZXIgPSAwO1xyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0b29sdGlwOifmiavlhYnliqjmlYjlrr3luqbvvIjlg4/ntKDvvIknLFxyXG4gICAgICAgIG1pbjogMSxcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dMaWdodFVzZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZmxXaWR0aDpudW1iZXIgPSAxNTtcclxuICAgIEBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdG9vbHRpcDon5omr5YWJ5pWI5p6c6aKc6ImyJyxcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dMaWdodFVzZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZmxDb2xvcjpjYy5Db2xvciA9IGNjLmNvbG9yKDI1NSwgMjU1LCAyNTUsIDI1NSk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeaWh+Wtl+minOiJsuOAgea4kOWPmFxyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0b29sdGlwOifmloflrZfpopzoibJcXG5Ob25l77ya5Y2V6Imy77yM5L2/55So6IqC54K5Y29sb3JcXG5PbmVDb2xvcu+8muWNleiJsu+8jOS9v+eUqGNvbG9yMVxcblR3b0NvbG9y77ya5riQ5Y+Y6ImyLeWPjOiJslxcblRyaUNvbG9y77ya5riQ5Y+Y6ImyLeS4ieiJsicsXHJcbiAgICAgICAgdHlwZTpjYy5FbnVtKEdyYWRpZW50KSxcclxuICAgIH0pXHJcbiAgICBncmFkaWVudCA9IEdyYWRpZW50Lk5vbmU7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHZpc2libGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JhZGllbnQgPiBHcmFkaWVudC5Ob25lO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBjb2xvcjE6Y2MuQ29sb3IgPSBjYy5jb2xvcigyNTUsIDAsIDAsIDI1NSk7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHZpc2libGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JhZGllbnQgPiBHcmFkaWVudC5PbmVDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgY29sb3IyOmNjLkNvbG9yID0gY2MuY29sb3IoMCwgMjU1LCAwLCAyNTUpO1xyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdyYWRpZW50ID4gR3JhZGllbnQuVHdvQ29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGNvbG9yMzpjYy5Db2xvciA9IGNjLmNvbG9yKDAsIDAsIDI1NSwgMjU1KTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t5aSW5Y+R5YWJXHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+WkluWPkeWFie+8jOWkluWPkeWFiei+g+iAl+aAp+iDvVxcbk5vbmXvvJrkuI3kvb/nlKhcXG5Mb3dw77ya5L2O57K+5bqm77yI5bu66K6u77yJXFxuTWVkaXVtcDog5Lit562J57K+5bqmXFxuSGlnaHDvvJrpq5jnsr7luqYnLFxyXG4gICAgICAgIHR5cGU6Y2MuRW51bShHbG93TGV2ZWwpLFxyXG4gICAgfSlcclxuICAgIGdsb3cgPSBHbG93TGV2ZWwuTm9uZTtcclxuICAgIEBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdG9vbHRpcDon5aSW5Y+R5YWJ5a695bqm77yI5YOP57Sg77yJJyxcclxuICAgICAgICBtaW46IDEsXHJcbiAgICAgICAgdmlzaWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nbG93ID4gR2xvd0xldmVsLk5vbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGdsb3dXaWR0aDpudW1iZXIgPSAxMDtcclxuICAgIEBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdG9vbHRpcDon5aSW5Y+R5YWJ6aKc6Imy5rex5bqmJyxcclxuICAgICAgICBtaW46IDEsXHJcbiAgICAgICAgbWF4OiAzMixcclxuICAgICAgICB2aXNpYmxlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdsb3cgPiBHbG93TGV2ZWwuTm9uZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZ2xvd0RlcHRoOm51bWJlciA9IDI7XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHRvb2x0aXA6J+WkluWPkeWFieminOiJsicsXHJcbiAgICAgICAgdmlzaWJsZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nbG93ID4gR2xvd0xldmVsLk5vbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGdsb3dDb2xvcjpjYy5Db2xvciA9IGNjLmNvbG9yKDI1NSwgMjU1LCAyNTUsIDI1NSk7XHJcblxyXG4gICAgcHJpdmF0ZSBfbXRsOmNjLk1hdGVyaWFsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RpbWU6bnVtYmVyID0gMDtcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYoQ0NfRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSAnU2hhZGVyL0xhYmVsU2hhZGVyMSc7XHJcbiAgICAgICAgICAgIGNjLnJlc291cmNlcy5sb2FkKHVybCwgY2MuTWF0ZXJpYWwsIChlcnIsIG1hdDpjYy5NYXRlcmlhbCk9PntcclxuICAgICAgICAgICAgICAgIGlmKCFlcnIgJiYgbWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0LmRlZmluZSgnVVNFX1RFWFRVUkUnLCB0cnVlLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zZXRNYXRlcmlhbCgwLCBtYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdE1hdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0TWF0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRNYXQoKSB7XHJcbiAgICAgICAgdGhpcy5fbXRsID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5MYWJlbCkuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgdGhpcy5fbXRsLmRlZmluZSgnVVNFX1RFWFRVUkUnLCB0cnVlLCAwKTtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zZXRNYXRlcmlhbCgwLCB0aGlzLl9tdGwpO1xyXG4gICAgICAgIHRoaXMudXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXNlKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLl9tdGwpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfcmVzb2x1dGlvbicsIFt0aGlzLm5vZGUud2lkdGgsIHRoaXMubm9kZS5oZWlnaHRdKTtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfYWxwaGEnLCB0aGlzLm5vZGUub3BhY2l0eS8yNTUpO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9zaGFkb3cnLCB0aGlzLnNoYWRvd1VzZSA/IDEgOiAwKTtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfc2hhZG93T2Zmc2V0JywgWy10aGlzLnNoYWRvd09mZnNldC54L3RoaXMubm9kZS53aWR0aCwgLXRoaXMuc2hhZG93T2Zmc2V0LnkvdGhpcy5ub2RlLmhlaWdodF0pO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9zaGFkb3dDb2xvcicsIFt0aGlzLnNoYWRvd0NvbG9yLnIvMjU1LCB0aGlzLnNoYWRvd0NvbG9yLmcvMjU1LCB0aGlzLnNoYWRvd0NvbG9yLmIvMjU1LCB0aGlzLnNoYWRvd0NvbG9yLmEvMjU1XSk7XHJcbiAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX291dGxpbmUnLCB0aGlzLm91dGxpbmVVc2UgPyAxIDogMCk7XHJcbiAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX291dGxpbmVXaWR0aCcsIFt0aGlzLm91dGxpbmVXaWR0aC90aGlzLm5vZGUud2lkdGgsIHRoaXMub3V0bGluZVdpZHRoL3RoaXMubm9kZS5oZWlnaHRdKTtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfb3V0bGluZUNvbG9yJywgW3RoaXMub3V0bGluZUNvbG9yLnIvMjU1LCB0aGlzLm91dGxpbmVDb2xvci5nLzI1NSwgdGhpcy5vdXRsaW5lQ29sb3IuYi8yNTUsIHRoaXMub3V0bGluZUNvbG9yLmEvMjU1XSk7XHJcbiAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX29sU2hhZG93JywgdGhpcy5vbFNoYWRvd1VzZSA/IDEgOiAwKTtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfb2xTaGFkb3dPZmZzZXQnLCBbLXRoaXMub2xTaGFkb3dPZmZzZXQueC90aGlzLm5vZGUud2lkdGgsIC10aGlzLm9sU2hhZG93T2Zmc2V0LnkvdGhpcy5ub2RlLmhlaWdodF0pO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9vbFNoYWRvd0NvbG9yJywgW3RoaXMub2xTaGFkb3dDb2xvci5yLzI1NSwgdGhpcy5vbFNoYWRvd0NvbG9yLmcvMjU1LCB0aGlzLm9sU2hhZG93Q29sb3IuYi8yNTUsIHRoaXMub2xTaGFkb3dDb2xvci5hLzI1NV0pO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9ncmFkaWVudCcsIHRoaXMuZ3JhZGllbnQtMSk7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMuZ3JhZGllbnQpIHtcclxuICAgICAgICAgICAgY2FzZSBHcmFkaWVudC5Ob25lOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX2NvbG9yMScsIFt0aGlzLm5vZGUuY29sb3Iuci8yNTUsIHRoaXMubm9kZS5jb2xvci5nLzI1NSwgdGhpcy5ub2RlLmNvbG9yLmIvMjU1LCB0aGlzLm5vZGUuY29sb3IuYS8yNTVdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdyYWRpZW50Lk9uZUNvbG9yOlxyXG4gICAgICAgICAgICBjYXNlIEdyYWRpZW50LlR3b0NvbG9yOlxyXG4gICAgICAgICAgICBjYXNlIEdyYWRpZW50LlRyaUNvbG9yOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX2NvbG9yMScsIFt0aGlzLm5vZGUuY29sb3Iuci8yNTUsIHRoaXMubm9kZS5jb2xvci5nLzI1NSwgdGhpcy5ub2RlLmNvbG9yLmIvMjU1LCB0aGlzLm5vZGUuY29sb3IuYS8yNTVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9jb2xvcjEnLCBbdGhpcy5jb2xvcjEuci8yNTUsIHRoaXMuY29sb3IxLmcvMjU1LCB0aGlzLmNvbG9yMS5iLzI1NSwgdGhpcy5jb2xvcjEuYS8yNTVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9jb2xvcjInLCBbdGhpcy5jb2xvcjIuci8yNTUsIHRoaXMuY29sb3IyLmcvMjU1LCB0aGlzLmNvbG9yMi5iLzI1NSwgdGhpcy5jb2xvcjIuYS8yNTVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9jb2xvcjMnLCBbdGhpcy5jb2xvcjMuci8yNTUsIHRoaXMuY29sb3IzLmcvMjU1LCB0aGlzLmNvbG9yMy5iLzI1NSwgdGhpcy5jb2xvcjMuYS8yNTVdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfZmxvd0xpZ2h0JywgdGhpcy5mbG93TGlnaHRVc2UgPyAxIDogMCk7XHJcbiAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX2ZsVGltZScsIHRoaXMuZmxTcGVlZCp0aGlzLl90aW1lKjYwL3RoaXMubm9kZS53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX2ZsUm90JywgTWF0aC5hdGFuKE1hdGgudGFuKE1hdGguUEkqdGhpcy5mbFJvdC8xODAuKSp0aGlzLm5vZGUuaGVpZ2h0L3RoaXMubm9kZS53aWR0aCkqMTgwLi9NYXRoLlBJKTtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfZmxXaWR0aCcsIHRoaXMuZmxXaWR0aC90aGlzLm5vZGUud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9mbENvbG9yJywgW3RoaXMuZmxDb2xvci5yLzI1NSwgdGhpcy5mbENvbG9yLmcvMjU1LCB0aGlzLmZsQ29sb3IuYi8yNTUsIHRoaXMuZmxDb2xvci5hLzI1NV0pO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9nbG93JywgdGhpcy5nbG93KTtcclxuICAgICAgICB0aGlzLl9tdGwuc2V0UHJvcGVydHkoJ2lfZ2xvd1dpZHRoJywgW3RoaXMuZ2xvd1dpZHRoL3RoaXMubm9kZS53aWR0aCwgdGhpcy5nbG93V2lkdGgvdGhpcy5ub2RlLmhlaWdodF0pO1xyXG4gICAgICAgIHRoaXMuX210bC5zZXRQcm9wZXJ0eSgnaV9nbG93RGVwdGgnLCB0aGlzLmdsb3dEZXB0aCk7XHJcbiAgICAgICAgdGhpcy5fbXRsLnNldFByb3BlcnR5KCdpX2dsb3dDb2xvcicsIFt0aGlzLmdsb3dDb2xvci5yLzI1NSwgdGhpcy5nbG93Q29sb3IuZy8yNTUsIHRoaXMuZ2xvd0NvbG9yLmIvMjU1LCB0aGlzLmdsb3dDb2xvci5hLzI1NV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkdDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl90aW1lICs9IGR0O1xyXG4gICAgICAgIHRoaXMudXNlKCk7XHJcbiAgICB9XHJcbn0iXX0=