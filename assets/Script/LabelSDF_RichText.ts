import LableSDF from "./LabelSDF";

const {ccclass, property, menu, requireComponent, disallowMultiple, executeInEditMode, playOnFocus} = cc._decorator;

/**
 * SDF文字 富文本
 * - 建议只使用：颜色、字号
 */
 @ccclass
 @menu('UI/LableSDF_RichText')
 @requireComponent(cc.RichText)
 @disallowMultiple()
 @executeInEditMode()
 @playOnFocus()
export default class LabelSDF_RichText extends cc.Component {

    onLoad() {
        this.setFont();
        let rt = this.node.getComponent(cc.RichText);
        rt.node.on('child-added', (child:cc.Node)=>{
            if(child.getComponent(cc.Label)) {
                !child.getComponent(LableSDF) && child.addComponent(LableSDF);
            }
        })
    }
    
    setFont() {
        let rt = this.node.getComponent(cc.RichText);
        if(rt.font?.name != 'Font_SDF') {
            rt.useSystemFont = false;
            let url = 'LabelSDF/FontSDF';
            cc.resources.load(url, cc.BitmapFont, (err, font:cc.BitmapFont)=>{
                if(!err && font && cc.isValid(rt)) {
                    rt.font = font;
                }
            })
        }
    }
}
