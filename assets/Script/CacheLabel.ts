const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {
        this.refreshLabelArr();

        let len = this.node.children.length;
        
        // setTimeout(()=>{
        //     for(let i=0;i<len;i++) {
        //         let lab = this.node.children[i];
        //         lab.opacity = 255;
        //     }
        // }, 1000);

        this.scheduleOnce(()=>{
            this.draw()
        }, 1);
    }

    private _strArr = [
        '大苏打撒旦撒旦',
        'ds',
        '大萨达萨达萨达萨达飒飒',
        '倒萨倒萨倒萨',
        '话就刚好符合法规和规划风格化规范化广泛',
        '华国锋瓜分',
        '华国锋回归',
        '和法国花粉管花粉管和法国恢复供电和的风格和的风格和广东富豪的法国',
        '和广泛的华国锋',
        '华国锋 h',
        '华国锋和法国',
        '放光和fgfg',
        'ddd',
        'dddddddddddd',
        '  ___',
        'dsadsadsa ',
        'htkjh',
        '广泛大概豆腐干地方',
        '高浮雕鬼地方古典风格地方给对方给对',
        '广泛的放光dd',
        '广泛的地方gg',
        '给对方',
    ]

    refreshLabelArr() {
        for(let i=0;i<1000;i++) {
            let lab = this.node.children[i];
            if(!lab) {
                lab = cc.instantiate(this.node.children[0]);
            }
            lab.setPosition(Math.random()*1000-500, Math.random()*600-300);
            lab.getComponent(cc.Label).string = this._strArr[Math.floor(Math.random()*this._strArr.length)];
            lab.parent = this.node;
            lab.opacity = 0;
        }
    }

    draw() {
        // let lab = this.node.children[0];
        // console.log((lab.getComponent(cc.Label) as any)._frame._texture);
        // let tex:cc.Texture2D = (lab.getComponent(cc.Label) as any)._frame._texture;
        // console.log(tex.readPixels());

        let eff = this.node.getComponent(cc.Sprite).getMaterial(0);
        for(let i=0;i<5;i++) {
            let lab = this.node.children[i];
            let tex:cc.Texture2D = (lab.getComponent(cc.Label) as any)._frame._texture;
            eff.setProperty(`label${i}`, tex);
        }
    }
}
