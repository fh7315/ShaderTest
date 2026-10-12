let gfx = cc.gfx;
let vfmtPosUvColor = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
    { name: gfx.ATTR_COLOR0, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
]);

export default class XXXAssembler extends cc.Assembler {

    protected _renderData: cc.RenderData = null;
    
    init(comp: cc.RenderComponent) {
        super.init(comp);
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
    }

    updateColor(comp, color) {
        // do nothing
    }

    updateUVs(comp) {
        // do nothing
    }

    // 填充数据 buffer
    fillBuffers (comp, renderer) {
        let renderData = comp._renderData;
        let data = renderData._data;
        // 指定 buffer 的数据格式，并获取 buffer
        let buffer = renderer.getBuffer('mesh', vfmtPosUvColor),
            vertexOffset = buffer.byteOffset >> 2,
            vertexCount = renderData.vertexCount,
            indiceCount = renderData.indiceCount;

        let indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;
        // 通过设定的顶点数量及顶点索引数量获取 buffer 的数据空间
        buffer.request(vertexCount, indiceCount);

        let vbuf = buffer._vData,
            ibuf = buffer._iData;
        // 填充顶点缓冲
        for (let i = 0, l = vertexCount; i < l; i++) {
            let vert = data[i];
            vbuf[vertexOffset++] = vert.x;
            vbuf[vertexOffset++] = vert.y;
            vbuf[vertexOffset++] = vert.u;
            vbuf[vertexOffset++] = vert.v;
        }
        // 填充索引缓冲
        for (let i = 0, l = indiceCount / 6; i < l; i++) {
            ibuf[indiceOffset++] = vertexId;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 2;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 3;
            ibuf[indiceOffset++] = vertexId + 2;
            vertexId += 4;
        }
    }

    getVfmt() {
        return vfmtPosUvColor;
    }

    // 准备顶点数据
    updateRenderData (comp) {
        let verts = this._renderData.vDatas[0];
        let vertexOffset = 0;
        let x = 0.5, y = 0.5, r = 0.2;
        for (let i = 0; i < 4; ++i) {
            // left-bottom
            verts[vertexOffset++] = x - r;
            verts[vertexOffset++] = y + r;
            verts[vertexOffset++] = x - r;
            verts[vertexOffset++] = y + r;
            verts[vertexOffset++] = x;
            verts[vertexOffset++] = y;

            // right-bottom
            verts[vertexOffset++] = x + r;
            verts[vertexOffset++] = y + r;
            verts[vertexOffset++] = x + r;
            verts[vertexOffset++] = y + r;
            verts[vertexOffset++] = x;
            verts[vertexOffset++] = y;

            // left-top
            verts[vertexOffset++] = x - r;
            verts[vertexOffset++] = y - r;
            verts[vertexOffset++] = x - r;
            verts[vertexOffset++] = y - r;
            verts[vertexOffset++] = x;
            verts[vertexOffset++] = y;

            // right-top
            verts[vertexOffset++] = x + r;
            verts[vertexOffset++] = y - r;
            verts[vertexOffset++] = x + r;
            verts[vertexOffset++] = y - r;
            verts[vertexOffset++] = x;
            verts[vertexOffset++] = y;
        }
    }
}
