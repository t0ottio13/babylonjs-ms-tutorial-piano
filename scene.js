const createScene = async () => {
    const scene = new BABYLON.Scene(engine);

    // カメラを追加
    const alpha = 3 * Math.PI / 2;
    const beta = Math.PI / 50;
    const radius = 220;
    const target = new BABYLON.Vector3(0, 0, 0);
    // カメラの位置と方向を設定
    const camera = new BABYLON.ArcRotateCamera("camera", alpha, beta, radius, target, scene);
    camera.attachControl(canvas, true);

    // ライトを追加
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;

    const keyParams = [
        {type: "white", note: "C", topWidth: 1.4, bottomWidth: 2.3, topPositionX: -0.45, wholePositionX: -14.4},
        {type: "black", note: "C#", wholePositionX: -13.45},
        {type: "white", note: "D", topWidth: 1.4, bottomWidth: 2.4, topPositionX: 0, wholePositionX: -12},
        {type: "black", note: "D#", wholePositionX: -10.6},
        {type: "white", note: "E", topWidth: 1.4, bottomWidth: 2.3, topPositionX: 0.45, wholePositionX: -9.6},
        {type: "white", note: "F", topWidth: 1.3, bottomWidth: 2.4, topPositionX: -0.55, wholePositionX: -7.2},
        {type: "black", note: "F#", wholePositionX: -6.35},
        {type: "white", note: "G", topWidth: 1.3, bottomWidth: 2.3, topPositionX: -0.2, wholePositionX: -4.8},
        {type: "black", note: "G#", wholePositionX: -3.6},
        {type: "white", note: "A", topWidth: 1.3, bottomWidth: 2.3, topPositionX: 0.2, wholePositionX: -2.4},
        {type: "black", note: "A#", wholePositionX: -0.85},
        {type: "white", note: "B", topWidth: 1.3, bottomWidth: 2.4, topPositionX: 0.55, wholePositionX: 0},
    ]
    
    // Transform Node that acts as the parent of all piano keys
    const keyboard = new BABYLON.TransformNode("keyboard");
    
    keyParams.forEach(key => {
        buildKey(scene, keyboard, Object.assign({register: 4, referencePositionX: 0}, key));
    })

    // XRエクスペリエンスを有効化
    const xrHelper = await scene.createDefaultXRExperienceAsync();

    return scene;
};

// ピアノのキーを作成する関数
const buildKey = function (scene, parent, props) {
    if (props.type === "white") {
        /*
        Props for building a white key should contain: 
        note, topWidth, bottomWidth, topPositionX, wholePositionX, register, referencePositionX

        As an example, the props for building the middle C white key would be
        {type: "white", note: "C", topWidth: 1.4, bottomWidth: 2.3, topPositionX: -0.45, wholePositionX: -14.4, register: 4, referencePositionX: 0}
        */

        // Create bottom part
        const bottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: props.bottomWidth, height: 1.5, depth: 4.5}, scene);

        // Create top part
        const top = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: props.topWidth, height: 1.5, depth: 5}, scene);
        top.position.z =  4.75;
        top.position.x += props.topPositionX;

        // Merge bottom and top parts
        // Parameters of BABYLON.Mesh.MergeMeshes: (arrayOfMeshes, disposeSource, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials)
        const key = BABYLON.Mesh.MergeMeshes([bottom, top], true, false, null, false, false);
        key.position.x = props.referencePositionX + props.wholePositionX;
        key.name = props.note + props.register;
        key.parent = parent;

        return key;
    }
    else if (props.type === "black") {
        /*
        Props for building a black key should contain: 
        note, wholePositionX, register, referencePositionX

        As an example, the props for building the C#4 black key would be
        {type: "black", note: "C#", wholePositionX: -13.45, register: 4, referencePositionX: 0}
        */

        // Create black color material
        const blackMat = new BABYLON.StandardMaterial("black");
        blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

        // Create black key
        const key = BABYLON.MeshBuilder.CreateBox(props.note + props.register, {width: 1.4, height: 2, depth: 5}, scene);
        key.position.z += 4.75;
        key.position.y += 0.25;
        key.position.x = props.referencePositionX + props.wholePositionX;
        key.material = blackMat;
        key.parent = parent;

        return key;
    }
}