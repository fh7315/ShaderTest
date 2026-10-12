import Lable_SDF from "./LabelSDF";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Font) font:cc.Font = null;

    protected onLoad(): void {
        let lable = this.node.getComponent(cc.RichText);
        lable.font = this.font;
        lable.node.on('child-added', (child)=>{
            !child.getComponent(Lable_SDF) && child.addComponent(Lable_SDF);
        })
    }

    protected start(): void {
        let lable = this.node.getComponent(cc.RichText)
        lable.string = 
        '<height=100><size=100>dsads123213</size><color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>' 
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
        + 'dsads123213<color=#ff0000>456789</c><color=#ffff00>发呢的就撒娇对方撒开绿灯就撒了肯定就是</c>'
    }
}
