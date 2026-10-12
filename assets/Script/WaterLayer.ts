import FrameAnimation from "./FrameAnimation";

const {ccclass, property} = cc._decorator;

const TileWidth = 511, TileHeight = 511;
const HalfTW = TileWidth / 2, HalfTH = TileHeight / 2;
let WinWidth, WinHeight, HalfWW, HalfWH;

const getWinSize = function() {
    let sz = cc.view.getVisibleSize();
    WinWidth = sz.width, WinHeight = sz.height;
    HalfWW = WinWidth / 2, HalfWH = WinHeight / 2;
};

@ccclass
export default class WaterLayer extends cc.Component {

    @property(cc.SpriteAtlas) atlas:cc.SpriteAtlas = null;

    private _frames: cc.SpriteFrame[] = [];

    onLoad() {
        this._initTiles();
    }

    _initTiles() {
        if(this.node.childrenCount === 0 || !this.node.children[0].getComponent(FrameAnimation)) {
            cc.warn('no tile templete');
            return;
        }

        let hr = Math.ceil((HalfWH - HalfTH) / TileHeight);
        let hc = Math.ceil((HalfWW - HalfTW) / TileWidth);

        let total = (hr * 2 + 1) * (hc * 2 + 1);
        let tiles = this.node.childrenCount;
        let delta = total - tiles;
        if(delta > 0) {
            for(let i = 0; i < delta; i++) {
                let node = cc.instantiate(this.node.children[0]);
                this.node.addChild(node);
            }
        }
        else if(delta < 0) {
            let last = this.node.childrenCount + delta - 1;
            for(let i = this.node.childrenCount - 1; i > last; i--) {
                let node = this.node.children[i];
                node.active = false;
            }
        }
        for(let i = 0; i < total; i++) {
            let node = this.node.children[i];
            node.active = true;
        }

        let idx = 0;
        this.node.children[idx++].setPosition(cc.v2(0, 0));

        let l = 0, r = 0, u = 0, d =0;
        for (let x = 0; x < hc; x++) {
            l--, r++;
            this.node.children[idx++].setPosition(cc.v2(l * TileWidth, 0));
            this.node.children[idx++].setPosition(cc.v2(r * TileWidth, 0));
        }
        l = 0, r = 0;

        for(let y = 0; y < hr; y++) {
            u++, d--;
            this.node.children[idx++].setPosition(cc.v2(0, u * TileHeight));
            this.node.children[idx++].setPosition(cc.v2(0, d * TileHeight));
        }
        u = 0, d = 0;

        for(let y = 0; y < hr; y++) {
            u++; d--;
            for (let x = 0; x < hc; x++) {
                l--; r++;
                this.node.children[idx++].setPosition(cc.v2(l * TileWidth, u * TileHeight));
                this.node.children[idx++].setPosition(cc.v2(r * TileWidth, u * TileHeight));
                this.node.children[idx++].setPosition(cc.v2(l * TileWidth, d * TileHeight));
                this.node.children[idx++].setPosition(cc.v2(r * TileWidth, d * TileHeight));
            }
            l = 0, r = 0;
        }

        if(this._frames.length === 0) {
            let frames = [] ;
            for(let i=0 ; i<32 ; i++){
                frames.push(this.atlas.getSpriteFrame('water_wave_'+i));
            }
            this._frames = frames;
                this._addFrameAnim()
        }
        else {
            this._addFrameAnim();
        }
    }

    _addFrameAnim() {
        for(let i = 0; i < this.node.childrenCount; i++) {
            let node = this.node.children[i];
            if(!node.active) break;
            let anim = node.getComponent(FrameAnimation);
            anim.frames = this._frames;
        }
    }

}
