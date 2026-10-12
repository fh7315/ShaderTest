declare namespace cc {
    declare interface Node{
        /**
         * 获取节点
         * @param path 节点路径
         * @example node.child('a/n/c')
         */
        child(path: string):cc.Node;
        /**
         * 获取组件
         * @param type 组件类型
         */
        comp<T extends cc.Component>(type:{prototype:T}):T;
        readonly Canvas:cc.Canvas;
        readonly Camera:cc.Camera;
        readonly Mask:cc.Mask;
        readonly Graphics:cc.Graphics;
        readonly Sprite:cc.Sprite;
        readonly Label:cc.Label;
        readonly LabelOutline:cc.LabelOutline;
        readonly LabelShadow:cc.LabelShadow;
        readonly RichText:cc.RichText;
        readonly MotionStreak:cc.MotionStreak;
        readonly ParticleSystem:cc.ParticleSystem;
        readonly WebView:cc.WebView;
        readonly Animation:cc.Animation;
        readonly Spine:cc.Spine;
        readonly DragonBones:cc.DragonBones;
        readonly Button:cc.Button;
        readonly EditBox:cc.EditBox;
        readonly ScrollView:cc.ScrollView;
        readonly Scrollbar:cc.Scrollbar;
        readonly PageView:cc.PageView;
        readonly PageViewIndicator:cc.PageViewIndicator;
        readonly Layout:cc.Layout;
        readonly Widget:cc.Widget;
        readonly ProgressBar:cc.ProgressBar;
        readonly Toggle:cc.Toggle;
        readonly ToggleContainer:cc.ToggleContainer;
        readonly ToggleGroup:cc.ToggleGroup;
        /** 
         * 分层渲染-节点标签 
         * - self !=0 元素节点
         * - root（对应元素节点的self） !=0 sliceListContent子节点，parent != null 非元素子节点
         * - isNormal true 非sliceListContent子节点，非元素子节点
         * - self、root、isNormal 同时只可能有一个至不为0或true
        */
        __sliceFlag:{self:number, root:number, parent?:cc.Node, isNormal:boolean};
        /** 分层渲染-子节点控制-显隐 */
        activeSF:boolean;
        /** 分层渲染-子节点控制-位置 */
        posSF:cc.Vec2;
        /** 分层渲染-子节点控制-位置x */
        xSF:number;
        /** 分层渲染-子节点控制-位置y */
        ySF:number;
    }
    /**
     * 获取一个color对象，使用16进制表示的颜色
     * @param hex
     * @example let color1 = cc.color('#ffffff');
     */
	function color(hex?:string):cc.Color;
}
