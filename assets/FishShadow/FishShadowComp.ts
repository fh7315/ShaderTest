import XXXAssembler from "./FishShadowAssembler";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.RenderComponent {

    @property(cc.Node) rootNode:cc.Node = null;

    _assembler:XXXAssembler = null;
    _renderData = null;
    

    _resetAssembler() {
        this.setVertsDirty();
        this._assembler = new XXXAssembler();
        this._assembler.init(this);
    }

    update() {
        this.setVertsDirty();
    }

    // _updateAssembler () {
    //     let assembler = XXXAssembler;

    //     if (this._assembler !== assembler) {
    //         this._assembler = assembler;
    //         this._renderData = null;
    //     }

    //     if (!this._renderData) {
    //         this._renderData = this._assembler.createData(this);
    //         this._renderData.material = this.rootNode.getComponent(cc.Sprite)?.getMaterial(0) || this.rootNode.getComponent(sp.Skeleton).getMaterial(0);
    //         this.markForUpdateRenderData(true);
    //     }
    // }
}
