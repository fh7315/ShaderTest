const {ccclass, property} = cc._decorator;

enum FishBgMaskShowType {
    Sprite,             //背景是图片
    SpriteTransAnim,    //背景是图片，转场动画
    SpineStatic,        //背景是spine，静态显示初始画面
    SpineDynamic,       //背景是spine，动态显示
}

@ccclass
export default class FishBgMask extends cc.Component {
    /**
    onLoad(){
        // cc.tween(cc.find('Canvas/bg/Tide'))
        //     .to(2, {x: 0})
        //     .start();
        // this.show(FishBgMaskShowType.TideAnim, null, cc.find('Canvas/bg/Tide').getComponent(cc.Sprite).spriteFrame);

        this.show(FishBgMaskShowType.Spine);


    }

    private _mtl:cc.Material = null;
    private initMat(){
        if(!this._mtl) {
            this._mtl = this.node.getComponent(cc.Sprite).getMaterial(0);
            this._mtl.define('USE_TEXTURE', true, 0);
            this.node.getComponent(cc.Sprite).setMaterial(0, this._mtl);
        }
    }

    private _type:FishBgMaskShowType = FishBgMaskShowType.Sprite;
    show(type:FishBgMaskShowType, sf0?:cc.SpriteFrame, sf1?:cc.SpriteFrame){
        this.initMat();
        this._type = type;
        if(sf0) {
            this.node.getComponent(cc.Sprite).spriteFrame = sf0;
        }
        if(!this._mtl) return;
        //设置tideAnim的图
        if(sf1) {
            this._mtl.setProperty('textureTide', sf1.getTexture());
        }
        //设置原始tideProgress
        this._mtl.setProperty('useTide', 1);
        //设置边缘宽度
        let scale = this.node.parent.scale;
        let out = (scale-1)/2/scale;
        this._mtl.setProperty('outSize', out);
    }

    private _cd:number = 0; //截图cd，0.05s截图一次
    update(dt){
        switch(this._type) {
            case FishBgMaskShowType.TideAnim:
                this.tideProgress();
                break;
            case FishBgMaskShowType.Spine:
                if(this._cd > 0.1) {
                    this._cd = 0;
                }
                if(this._cd == 0) {
                    this.takePicture();
                }
                this._cd += dt;
                break;
        }
    }

    private _tideNode:cc.Node = null;
    private tideProgress() {
        if(!this._mtl) return;
        if(!this._tideNode) {
            this._tideNode = cc.find('Canvas/bg/Tide');
        }
        this._mtl.setProperty('useTide', this._tideNode.x/1332);
    }
    
    private _rootNode:cc.Node = null;
    private _camera:cc.Camera = null;
    private _texture:cc.RenderTexture = null;
    private _sf:cc.SpriteFrame = null;
    private takePicture() {
        if(!this._rootNode) {
            this._rootNode = cc.find('Canvas/bg');

            this._camera = this._rootNode.addComponent(cc.Camera);
            this._camera.enabled = false;

            this._texture = new cc.RenderTexture();
            this._texture.initWithSize(1332, 740, cc.game['_renderContext']['STENCIL_INDEX8']);
            this._camera.targetTexture = this._texture;
    
            this._sf = new cc.SpriteFrame();
            this._sf.setTexture(this._texture);
            this.node.getComponent(cc.Sprite).spriteFrame = this._sf;
        }
        // this._camera.enabled = true;
        //截图是y轴颠倒的，所以截图是y赋值-1；适配方案中会缩放背景，需要还原为原始才能正确的截取完整显示
        let scale = this._rootNode.scale;
        this._rootNode.scaleX = 1;
        this._rootNode.scaleY = 1;
        this._camera.render(this._camera.node);
        this._rootNode.scale = scale;
    }
    */

    onLoad(){
        this.initMat();
    }

    private _mtl:cc.Material = null;
    private initMat(){
        if(!this._mtl) {
            this._mtl = this.node.getComponent(cc.Sprite).getMaterial(0);
            this._mtl.define('USE_TEXTURE', true, 0);
            this.node.getComponent(cc.Sprite).setMaterial(0, this._mtl);
        }
        
        let scale = this.node.parent.scale;
        let out = (scale-1)/2/scale;
        this._mtl.setProperty('outSize', out);

        this.schedule(()=>{
            this.takePicture();
        }, 0.1)
    }

    private _rootNode:cc.Node = null;
    private _camera:cc.Camera = null;
    private _texture:cc.RenderTexture = null;
    private _sf:cc.SpriteFrame = null;
    private takePicture() {
        if(!this._rootNode) {
            this._rootNode = cc.find('Canvas/FishBgMask/bg');

            this._camera = this._rootNode.addComponent(cc.Camera);
            this._camera.enabled = false;

            this._texture = new cc.RenderTexture();
            this._texture.initWithSize(333, 185, cc.game['_renderContext']['STENCIL_INDEX8']);
            this._camera.targetTexture = this._texture;
    
            this._sf = new cc.SpriteFrame();
            this._sf.setTexture(this._texture);
            // this.node.getComponent(cc.Sprite).spriteFrame = this._sf;
        }
        // this._camera.enabled = true;
        //截图是y轴颠倒的，所以截图是y赋值-1；适配方案中会缩放背景，需要还原为原始才能正确的截取完整显示
        let scale = this._rootNode.scale;
        this._rootNode.scaleX = 1;
        this._rootNode.scaleY = -1;
        this._camera.render(this._camera.node);
        this._rootNode.scale = scale;

        this.blur();
    }

    // update() {
    //     this.takePicture();
    // }

    private blur() {
        let data = this._texture.readPixels();
        let w = 333;
        let h = 185;
        let newData = new Uint8Array(w*h*4);
        let r = 2;
        let getC = (x:number, y:number):number[]=>{
            let index = x+w*y;
            if(x < 0 || x > w-1 || y < 0 || y > h-1) {
                return [0, 0, 0, 255];
            }
            return [data[index*4], data[index*4+1], data[index*4+2], 255];
        }
        let func = (x:number, y:number):number[]=>{
            let c = [0, 0, 0, 0];
            let sum = 0;
            for(let i=-r;i<=r;i++) {
                for(let j=-r;j<=r;j++) {
                    let weight = (r-Math.abs(i))*(r-Math.abs(j));
                    let gc = getC(x+i, y+j);
                    c[0] += weight*gc[0];
                    c[1] += weight*gc[1];
                    c[2] += weight*gc[2];
                    c[3] += weight*gc[3];
                    sum += weight;
                }
            }
            c[0] /= sum;
            c[1] /= sum;
            c[2] /= sum;
            c[3] /= sum;
            return c;
        }
        for(let i=0;i<w;i++) {
            for(let j=0;j<h;j++) {
                let index = i+w*j;
                index *= 4;
                let c = func(i, j);
                newData[index] = Math.floor(c[0]);
                newData[index+1] = Math.floor(c[1]);
                newData[index+2] = Math.floor(c[2]);
                newData[index+3] = Math.floor(c[3]);
            }
        }
        let rt = new cc.RenderTexture();
        rt.initWithData(newData, cc.Texture2D.PixelFormat.RGBA8888, w, h);
        let sf = new cc.SpriteFrame();
        sf.setTexture(rt);
        this.node.getComponent(cc.Sprite).spriteFrame = sf;
    }
}
