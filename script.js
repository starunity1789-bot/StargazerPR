
    // 这是一个通用的“魔法工厂”函数：专门用于计算带百分比浮动的随机数
function generateFluctuatedValue(baseValue, floatPercent) {
    // Math.random() 会生成一个 0 到 1 之间的随机小数
    // 下面这行代码的数学逻辑是：在基准值上，加上或减去指定百分比的波动
    const randomMultiplier = 1 + ((Math.random() * 2 - 1) * floatPercent);
    return Math.round(baseValue * randomMultiplier); // Math.round 用于四舍五入取整
}

// 专门处理有小数点的数字（比如基尼系数 0.38）
function generateFluctuatedFloat(baseValue, absoluteFloat, decimals) {
    const randomValue = baseValue + ((Math.random() * 2 - 1) * absoluteFloat);
    return randomValue.toFixed(decimals); // toFixed 保留指定的小数位数
}

// ----------------- 数据生成与绑定 ----------------- //

// 1. 生成幼年人口 (基准: 4154782062, 浮动: 3%)
const youngPopBase = 4154;
const youngPopCurrent = generateFluctuatedValue(youngPopBase, 0.03);

// 2. 将纯数字格式化为易读的文本 (例如将 4154782062 变成 "41.5亿" 或者加逗号 "4,154,782,062")
// 这里我们使用日本和国际通用的逗号分隔法
const youngPopText = youngPopCurrent.toLocaleString(); 

// 3. 门牌号"
document.getElementById('val-pop-young').innerText = youngPopText+"M";


const adultPopBase = 5244;
const adultPopCurrent = generateFluctuatedValue(adultPopBase, 0.03);
const adultPopText = adultPopCurrent.toLocaleString(); 
document.getElementById('val-pop-adult').innerText = adultPopText+"M";

const elderlyPopBase = 4855;
const elderlyPopCurrent = generateFluctuatedValue(elderlyPopBase, 0.03);
const elderlyPopText = elderlyPopCurrent.toLocaleString(); 
document.getElementById('val-pop-elderly').innerText = elderlyPopText+"M";

const electricityGenerationBase = 89; // Example base value for electricity generation
const electricityGenerationCurrent = generateFluctuatedValue(electricityGenerationBase, 0.05);
const electricityGenerationText = electricityGenerationCurrent.toLocaleString(); 
document.getElementById('val-electricity-generation').innerText = electricityGenerationText+"PWh/D";




// --- 举例：生成基尼系数 (基准: 0.38, 浮动绝对值: 0.02) ---
const giniCurrent = generateFluctuatedFloat(0.38, 0.02, 2);
document.getElementById('val-gini-coefficient').innerText = giniCurrent; // 注意：这里为了演示借用了 val-gini-coefficient 的 ID，你需要自己在 HTML 里写对应的 ID



const cpiCurrent = generateFluctuatedFloat(19, 0.2, 2);
document.getElementById('val-cpi').innerText = cpiCurrent+"/100";


const crimeCurrent = generateFluctuatedFloat(3.1, 0.1, 2);
document.getElementById('val-violent-crime-rate').innerText = crimeCurrent+"/100k";

const engelCurrent = generateFluctuatedFloat(9, 0.2, 2);
document.getElementById('val-engel-coefficient').innerText = engelCurrent+"%";

const spiCurrent = generateFluctuatedFloat(92, 2, 2);
document.getElementById('val-spi').innerText = spiCurrent+"/100";


// ================= 音效系统 =================

// 将音频文件加载到内存
const drawerAudio = new Audio('./assets/Drawer.wav');
drawerAudio.volume = 0.5; // 音量控制在 50%

// 找到整个左侧边栏链条
const UIleftSidebar = document.getElementById('ui-left-sidebar');

// 监听鼠标进入大链条的瞬间
UIleftSidebar.addEventListener('mouseenter', () => {
    // 重置音频播放进度，确保每次划入都能立刻发声
    drawerAudio.currentTime = 0;
    drawerAudio.play();
});


// ================= 核心地图引擎 (Leaflet) =================



// ================= 核心地图引擎 =================

var mapMinResolution = Math.pow(2, 5) * 4.0; // mapMaxZoom=5, maxResolution=4.0

var crs = L.CRS.Simple;
crs.transformation = new L.Transformation(1, 0, -1, 0);
crs.scale = function(zoom) {
    return Math.pow(2, zoom) / mapMinResolution;
};
crs.zoom = function(scale) {
    return Math.log(scale * mapMinResolution) / Math.LN2;
};

const map = L.map('map', {
    crs: crs,
    minZoom: 0,
    maxZoom: 5,
    zoomControl: false,
    zoomSnap: 0.1
});

const mapWidth = 32768;
const mapHeight = 16384;

var tileExtent = [0.00000000, -16384.00000000, 32768.00000000, 0.00000000];

L.tileLayer('./assets/map-tiles/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 5,
    noWrap: true,
    tms: false  // 注意：这里用 false
}).addTo(map);

map.fitBounds([
    crs.unproject(L.point(tileExtent[2], tileExtent[3])),
    crs.unproject(L.point(tileExtent[0], tileExtent[1]))
]);


// ================= 国家领土交互层 =================

// 1. 设定这个 SVG 在地图上的大致边界框 [左下角 Y, 左下角 X], [右上角 Y, 右上角 X]
// 反复修改这四个数字，把 SVG 拼图完美地对齐到底图上。
// 先随便写一个范围，它可能会出现在地图的某个角落。
const countryBounds = [[1900, 2500], [2900, 3900]]; 

// 2. 使用 Fetch API 动态去获取你的 SVG 文件
fetch('./assets/MAPSVG1.svg')
    .then(response => response.text()) // 将文件内容读取为文本
    .then(svgText => {
        // 3. 将文本解析为真正的网页 SVG 元素
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // 4. 给这个 SVG 贴上一个 class 标签，方便我们等会儿用 CSS 让它发光
        svgElement.setAttribute('class', 'interactive-country');

        // 5. 将这层“贴膜”盖到地图上，并开启鼠标交互允许
        const countryOverlay = L.svgOverlay(svgElement, countryBounds, {
            interactive: true 
        }).addTo(map);

        // 6. （额外魔法）当鼠标点击这个国家时，左侧栏弹出提示！
        svgElement.addEventListener('click', () => {
            // 你还记得我们之前的音频逻辑吗？可以在这里也加个点击音效！
            alert('你点击了未知国家！正在加载左侧百科数据...');
            // 未来我们将在这里写逻辑：打开指定的左侧抽屉，更新人口数据等
        });
    })
    .catch(error => {
        console.error("加载 SVG 失败，请检查文件路径是否正确:", error);
    });