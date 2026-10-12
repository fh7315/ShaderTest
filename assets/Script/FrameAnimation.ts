const {ccclass, property, menu, requireComponent, disallowMultiple} = cc._decorator;

const DEFAULT_ITV = 0.1;

@ccclass
@disallowMultiple
@menu('UI/FrameAnimation')
@requireComponent(cc.Sprite)
export default class FrameAnimation extends cc.Component {

    private _sprite: cc.Sprite = null;
    private _frameIdx = 0;
    private _elapse = 0;
    private _pause = false;
    private _auto = true;

    @property
    private _atlas: cc.SpriteAtlas = null;
    @property
    private _frames: cc.SpriteFrame[] = [];

    @property({type: cc.SpriteAtlas})
    get atlas(): cc.SpriteAtlas {
        return this._atlas;
    }
    set atlas(atlas: cc.SpriteAtlas) {
        this._atlas = atlas;
        this._atlas && (this._frames = this._atlas.getSpriteFrames());
    }

    @property({type: cc.SpriteFrame})
    get frames(): cc.SpriteFrame[] {
        return this._frames;
    }
    set frames(frames: cc.SpriteFrame[]) {
        this._frames = frames;
    }

    get frameIdx():number{
        return this._frameIdx ;
    }

    @property(cc.Float)
    frameInterval: number = DEFAULT_ITV;

    @property(cc.Boolean)
    autoPlay: boolean = true;
    
    get duration(): number {
        return this.frameInterval * this._frames.length;
    }

    onLoad() {
        this._sprite = this.getComponent(cc.Sprite);
        this._auto = this.autoPlay;
    }

    play() {
        this._pause = false;
    }

    pause() {
        this._pause = true;
    }

    replay() {
        this._frameIdx = 0;
        this._elapse = 0;
        this._pause = false;
    }

    reset() {
        this._frameIdx = 0;
        this._elapse = 0;
        this._frames = [];
        this._sprite && (this._sprite.spriteFrame = null);
        this._pause = false;
        this.autoPlay = this._auto;
        this.frameInterval = DEFAULT_ITV;
    }

    setAutoPlay(auto:boolean){
        this._auto = auto ;
        this.autoPlay = this._auto ;
    }

    frameUpdate(dt: number, bAuto = false) {
        if(!cc.isValid(this) || !this._sprite || !this.enabled || this._pause || this._frames.length === 0) return;
        if(this.autoPlay && !bAuto) this.autoPlay = false;
        this._elapse += dt;
        let delta = this.frameInterval - this._elapse;
        if(delta <= 0) {
            this._elapse = delta;
            this._runAnimation();
        }
    }

    _runAnimation() {
        this._sprite.spriteFrame = this._frames[this._frameIdx++];
        if(this._frameIdx >= this._frames.length){
            this._frameIdx = 0;
        }
        
        // let frame = this._sprite.spriteFrame;
        // let l = frame.uv[0];
        // let r = frame.uv[6];
        // let b = frame.uv[3];
        // let t = frame.uv[5];
        // let u_uvOffset = new cc.Vec4(l, t, r, b);
        // let u_uvRotated = frame.isRotated() ? 1.0 : 0.0;
        // this._sprite.getMaterial(0).setProperty("u_uvOffset", u_uvOffset);
        // this._sprite.getMaterial(0).setProperty("u_uvRotated", u_uvRotated);
    }

    update(dt: number) {
        this.autoPlay && this.frameUpdate(dt, true);
    }

    getNowSpriteFrame(): cc.SpriteFrame{
        return this._sprite.spriteFrame;
    }
}
