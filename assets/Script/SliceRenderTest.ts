import SliceList from "../SliceRender/SliceList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    /*_xxx = [];
    _xxx_index = 0;
    protected onLoad(): void {
        for(let i=0;i<50;i++) {
            this._xxx[i] = '';
            for(let j=0;j<20;j++) {
                for(let k=0;k<20;k++) {
                    this._xxx[i] += `${i}`;
                }
                this._xxx[i] += '\n';
            }
        }
    }

    protected update(dt: number): void {
        this.node.getComponent(cc.Label).string = this._xxx[this._xxx_index];
        this._xxx_index ++;
        if(this._xxx_index >= this._xxx.length) this._xxx_index = 0;
    }*/

    protected onLoad(): void {
        cc.debug.setDisplayStats(true);

        for(let i=0;i<150;i++) {
            let item = this.node.children[i];
            if(!item) {
                item = cc.instantiate(this.node.children[0]);
                item.parent = this.node;
            }
            item.child('lab').Label.string = i.toString();
            item.targetOff(this);
            item.on('click', ()=>{
                item.child('lab').ySF += 2;
            }, this);
        }
        SliceList.applyNode(this.node);
    }
}
