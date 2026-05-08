
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

// 1. 初始化地图容器。
// L.CRS.Simple 是关键：它告诉引擎“这不是真实的地球经纬度，而是一个平面的游戏地图”
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,      // 允许缩小的最小级别 (LOD 1 的关键)
    maxZoom: 2,       // 允许放大的最大级别 (为未来的 LOD 2 和 3 预留)
    zoomControl: false, // 隐藏默认的加减号按钮，让界面更像纯粹的游戏
    zoomSnap: 0.1       // 允许滚轮进行极其丝滑的微调缩放
});

// 2. 设定你的巨幅地图的物理边界 [高, 宽]
// 注意：Leaflet 的坐标系默认是 [y, x]
const mapHeight = 4096;
const mapWidth = 8192;
const bounds = [[0, 0], [mapHeight, mapWidth]];

// 3. 将你的高清底图铺到这个边界内
const imageOverlay = L.imageOverlay('./assets/MAP1.png', bounds).addTo(map);

// 4. 指令：当网页加载时，镜头自动调整到能把整张地图看全的视野
map.fitBounds(bounds);

// ==========================================================

// ... 下面是你之前写的数据刷新和音效代码，保持不变 ...