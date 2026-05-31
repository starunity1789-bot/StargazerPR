
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

// 告诉引擎：X 坐标从 0 到 32768 是一个完整的世界，超过了就重头开始循环！
crs.wrapLng = [0, 32768];

const map = L.map('map', {
    crs: crs,
    minZoom: 2.5,
    maxZoom: 7,
    zoomControl: false,
    zoomSnap: 0.1,
    maxBoundsViscosity: 1.0 // 【新增】：设置空气墙的硬度，1.0代表完全不可拖拽出界，就像撞到实体墙一样
});

const mapWidth = 32768;
const mapHeight = 20480;

var tileExtent = [0.00000000, -20480.00000000, 32768.00000000, 0.00000000];

L.tileLayer('./assets/map-tiles/{z}/{x}/{y}.png', {
    minZoom: 2.5,
    maxZoom: 7,
    noWrap: false, // 允许水平循环
    tms: false  // 注意：这里用 false
}).addTo(map);

map.setView([-10240, 16384], 2);

map.on('click', function(e) {
    console.log(e.latlng.lat, e.latlng.lng);
});


// 👇 【在这里新增：镜头空气墙设定】
// 限制Y轴（上下）不能拖出地图，同时允许X轴（左右）Infinity 无限拖拽
const verticalBounds = [
    [-20480, -Infinity], // 底部边界（留了几百像素的余量，防止边缘太死板）
    [ 0,  Infinity]    // 顶部边界（留了几百像素的余量）
];
map.setMaxBounds(verticalBounds);


// ================= 国家领土交互层 =================
// ================= 国家领土交互层 =================

// ================= 国家领土交互层 =================

// ---- 信息面板控制 ----
const infoPanel = document.getElementById('info-panel');
const panelTitle = document.getElementById('panel-title');
const panelContent = document.getElementById('panel-content');
const panelClose = document.getElementById('panel-close');

panelClose.addEventListener('click', () => {
    infoPanel.style.display = 'none';
});

// ---- 核心工厂函数 ----
// 左右各生成11份副本，共23个polygon，覆盖22屏滚动范围
function addContinent(coords, name, description) {

    const baseStyle = {
        color: '#58a6ff',
        fillColor: '#58a6ff',
        fillOpacity: 0,
        weight: 1.5,
        opacity: 0,
        
    };
    

    // 生成所有副本：偏移量从 -11 到 +11，共23个。觉得12屏不够，只需要把 -11 和 11 改成更大的数字就行
    const polygons = [];
    for (let i = -11; i <= 11; i++) {
        const shiftedCoords = coords.map(([lat, lng]) => [lat, lng + mapWidth * i]);
        const p = L.polygon(shiftedCoords, baseStyle).addTo(map);
        polygons.push(p);
    }

    function highlight() {
        polygons.forEach(p => p.setStyle({ fillOpacity: 0.01, opacity: 0.01 }));
    }
    function reset() {
        polygons.forEach(p => p.setStyle({ fillOpacity: 0, opacity: 0 }));
    }
    function openPanel() {
        infoPanel.style.display = 'block';
        panelTitle.innerText = name;
        panelContent.innerText = description;
    }

    polygons.forEach(p => {
        p.on('click', openPanel);
        p.on('mouseover', highlight);
        p.on('mouseout', reset);
    });
}


// ================= 11块大陆数据 =================

// ---- 大陆 1 ----
addContinent(
    [
        [-13086, 19744],
        [-13054, 19806],
        [-13040, 19829],
        [-13048, 19879],
        [-13060, 19940],
        [-13172, 19945],
        [-13316, 19869],
        [-13350, 19717],
        [-13277, 19689],
        [-13237, 19576],
        [-13145, 19635],
        [-13061, 19769],
        [-13045, 19804],
    ],
    '精灵大陆',
    '主要国家：\n★精灵二十四族裔\n☆精灵之桥\n\n经历惨烈的凛冬战争后，流浪万余年的精灵一族终于建立了属于自己的民族国家——“精灵二十四族裔”。为了隔绝外界纷争，它们以庞大的“碧之结界”封锁整片大陆，自此进入近乎完全闭关锁国的时代。\n然而，精灵大陆盛产诸多外界无可替代的珍稀资源。在多国长期斡旋与协商下，精灵最终于大陆东南角设立了一座高度特殊化的独立贸易港——“精灵之桥”。这是唯一允许其他族群合法居留与活动的精灵城市，也成为连接精灵文明与外部世界的唯一通道。\n凭借垄断性的贸易地位，“精灵之桥”每年都会创造惊人的财富与贸易收益。而由于“精灵二十四族裔”本身拥有近乎完全自给自足的经济体系，为避免长期贸易顺差引发新的国际矛盾，精灵政府将大量贸易利润持续投入国际慈善、医疗援助与教育事业，使其在世界范围内逐渐形成了独特而复杂的国际影响力。'
);

// ---- 大陆 2 ----
addContinent(
    [
        [-13610, 18841],
        [-13628, 18979],
        [-13677, 19093],
        [-13712, 19161],
        [-13758, 19253],
        [-13761, 19317],
        [-13920, 19310],
        [-13995, 19279],
        [-14171, 19284],
        [-14224, 19148],
        [-14197, 18933],
        [-14164, 18622],
        [-14154, 18553],
        [-14062, 18609],
        [-13929, 18563],
        [-13743, 18602],
        [-13612, 18643],
        [-13602, 18997],// 【粘贴大陆2的坐标】
    ],
    '凛冬大陆',
    '主要国家：\n★苍神缘起帝国\n★凛冬合众国\n☆河童重工集团\n\n由于水元素矿石的泛滥和古代残留的遗迹，这片大陆的西北地区常年产生非星球环境引起低温天气。凛冬战争之前，这里只有一些稀疏的本土居民。凛冬战争爆发后，这里先是被博爱-恩泽同盟军团占领为军事前沿阵地，后来被精灵联军反攻占领。战后，这里被精灵的盟友们建立起分属不同势力的独立国家，但是在国际政治上仍然被视为精灵二十四族裔的卫星国家。河童重工集团更是在大陆东南区域大举填海造陆，借助精灵势力的援助，跻身成为世界前列的工业势力。'
);

// ---- 大陆 3 ----
addContinent(
    [
             [-14388, 2297],
        [-14124, 1141],
        [-13400, 1030],
        [-12620, 1545],
        [-12996, 2827],
        [-13051, 4512],
        [-12954, 5821],
        [-12299, 5375],
        [-12048, 6238],
        [-11714, 6963],
        [-12062, 8035],
        [-12160, 9358],
        [-12146, 11154],
        [-12703, 12268],
        [-13400, 11711],
        [-14068, 13327],
        [-14026, 14970],
        [-14375, 15736],
        [-15628, 15374],
        [-16130, 13661],
        [-15489, 12505],
        [-16130, 12310],
        [-15168, 10555],
        [-14305, 11043],
        [-13149, 9678],
        [-14110, 7812],
        [-14778, 6224],
        [-16561, 7158],
        [-16213, 3189],
        [-16241, 1378],
        [-14486, 2214],
        [-13344, 946],
    ],
    '博爱大陆',
    '主要国家：\n★博爱联盟共和国\n★南海工业联合体\n★深海联盟\n☆霜湖合众国\n☆赤潮同盟\n☆远视主义技术治国委员会\n\n绵延漫长的海岸线、富饶稳定的自然环境，以及长期远离大规模战争的历史背景，共同塑造了这片大陆以重商主义与民主政治为核心的社会传统。贸易、航运与资本流通深刻影响着各国的发展路径，也使这里成为世界上商业最繁荣、意识形态最活跃的地区之一。\n\n然而，大陆内部复杂的种族与物种差异，也逐渐演化出严重的社会阶层分化。资源占有、寿命差距、种群能力与历史地位的不平等，使贫富鸿沟与身份矛盾长期存在，并最终推动各国政治思潮不断向左右两极激化。\n\n尽管“民主主义”仍是大陆各国共同承认的政治基础，但在长期的社会撕裂与利益博弈之下，各国逐渐发展出截然不同的政治体制：有的奉行资本主导的议会共和，有的演化为工团寡头统治，也有国家转向技术官僚主义，甚至形成以意识形态联盟维系的激进政权。'
);

// ---- 大陆 4 ----
addContinent(
    [
            [-7150.87, 6309.99],
        [-7082.28, 6858.63],
        [-7485.27, 7047.23],
        [-7356.65, 7201.53],
        [-7708.19, 8701.72],
        [-8171.2, 8873.17],
        [-8231.22, 9730.43],
        [-8265.52, 10081.9],
        [-7896.83, 10390.51],
        [-7999.72, 10553.39],
        [-8745.67, 10133.33],
        [-9097.21, 10356.22],
        [-8711.37, 10801.99],
        [-8779.97, 10973.44],
        [-9448.75, 11624.95],
        [-9705.98, 12302.18],
        [-9714.55, 10896.29],
        [-10357.62, 10364.79],
        [-10340.47, 9961.88],
        [-10203.28, 9464.68],
        [-9603.09, 9567.55],
        [-9594.52, 9036.05],
        [-10100.39, 9396.1],
        [-10254.73, 8916.04],
        [-9988.93, 8213.09],
        [-10511.95, 8221.66],
        [-10786.33, 7553.01],
        [-10426.21, 7235.82],
        [-10143.26, 6704.33],
        [-9603.09, 6892.92],
        [-9594.52, 7201.53],
        [-8960.03, 6687.18],
        [-8522.74, 6944.36],
        [-8042.59, 6121.4],
        [-7425.25, 6207.12],
        [-7142.3, 6344.28],
    ],
    '飞升大陆',
    '主要国家：\n★巅峰重工集群主权\n★飞升者技术统合控股领\n★进化之印工业企业特权领地\n☆西海半岛港口自由城市联盟\n\n位于博爱大陆与恩泽大陆之间的飞升大陆，自古便是贯通两大文明圈的核心航道与金融枢纽。依靠庞大的跨大陆贸易、资本流通与技术垄断，这片土地在早期迅速积累起惊人的财富与工业基础；然而，夹处于两大强权之间的地缘压力，也使飞升大陆长期笼罩在生存危机之中。再加上本土族群天生崇尚效率、秩序与力量的文化特性，各国逐渐形成了近乎狂热的工业主义与技术至上信仰。随着传统国家体系衰落，企业主权最终彻底取代民族主权。这片大陆的主要统治权被工业势力持有；巅峰重工集群主权更是全球公认最强的工业集团力量。'
);

// ---- 大陆 5 ----
addContinent(
    [
        [-4140.82, 16355.86],
        [-5181.68, 14591.26],
        [-5543.72, 13279.13],
        [-5679.48, 10473.88],
        [-6018.89, 9478.47],
        [-6448.81, 9614.2],
        [-7557.56, 10496.5],
        [-7240.77, 12939.79],
        [-7896.97, 12781.42],
        [-8892.57, 14817.49],
        [-9707.16, 15134.22],
        [-10861.16, 14862.74],
        [-11313.71, 14885.36],
        [-11902.02, 15405.69],
        [-12037.79, 16174.87],
        [-11766.26, 16197.5],
        [-11381.59, 15360.45],
        [-10793.28, 15405.69],
        [-10001.32, 19296.85],
        [-11064.81, 19952.91],
        [-10793.28, 20518.49],
        [-8847.32, 20020.78],
        [-7625.44, 19975.54],
        [-6720.34, 19771.93],
        [-6720.34, 19093.24],
        [-4774.38, 18572.91],
        [-4253.95, 17147.66],
        [-4186.07, 16514.22],
    ],
    '恩泽大陆',
    '主要国家：\n★恩泽帝国\n★三十列王联合帝国\n★幽泉谷\n☆红月皇国\n☆苍空神殿骑士团国\n\n为了抵御蜂龙意识共同体以千年计的长期袭扰和入侵，恩泽大陆的文明形成了明显的威权主义传统。在这个大陆上，集体主义和秩序被视为第一要义，个人自由和隐私则被普遍牺牲。科技的发展和突破的现代，蜂龙大陆的威胁已经化为往日泡影，但是这并未导致恩泽大陆诸国的政治体制变化；反而借助科技的力量，普遍实行了高度集中的政治体制和严密的社会监控系统。\n\n在文化层面，恩泽大陆的艺术、文学和哲学都深受威权主义思想的影响，强调集体主义、忠诚和牺牲精神。这种文化氛围既塑造了大陆独特的文明特色，也为其带来了诸多挑战和矛盾。'
);

// ---- 大陆 6 ----
addContinent(
    [
            [-4027.68, 25088.34],
        [-4615.99, 26151.62],
        [-5385.33, 26061.12],
        [-6132.03, 27848.34],
        [-6856.11, 26988.67],
        [-7987.48, 27395.88],
        [-8462.65, 26943.42],
        [-8575.79, 26490.96],
        [-9254.61, 26671.95],
        [-10182.34, 26536.21],
        [-10974.3, 25721.78],
        [-11698.37, 24884.73],
        [-12105.67, 25043.09],
        [-12829.75, 26264.73],
        [-13825.35, 26649.32],
        [-16766.92, 25495.55],
        [-15612.92, 25133.58],
        [-15771.31, 24047.68],
        [-15273.51, 22939.15],
        [-14572.06, 22260.46],
        [-14164.76, 21740.13],
        [-13169.16, 22215.21],
        [-12897.63, 23640.46],
        [-12218.81, 23979.81],
        [-10748.02, 22871.28],
        [-8779.44, 21740.13],
        [-8394.77, 22192.59],
        [-8123.24, 23617.84],
        [-7467.05, 23844.07],
        [-6788.23, 22939.15],
        [-5453.21, 23007.02],
        [-4412.35, 24092.92],
        [-4118.19, 24748.99],
    ],
    '蜂龙大陆',
    '主要国家：\n★蜂龙意识共同体\n★原初树族意识共同体\n☆荒空冰原北方族群政治实体\n☆蜂龙自由意识团结阵线\n☆南方联盟联合防御委员会\n\n“蜂龙”是一种兼具绝对个体力量与蜂群意识的超大型智慧生物。它们彼此之间共享感知、记忆与思维网络，整个族群几乎可以被视作一个庞大的统一意识体。对于蜂龙而言，扩张、吞并与同化并非政治选择，而是刻入本能深处的生存规律。\n\n建立于这一种族基础上的“蜂龙意识共同体”，因此成为世界上最具压迫性的扩张文明之一。它们会不断向外侵蚀新的生态圈，将一切能够利用的生命、资源与土地纳入群体意识之中。对于许多文明而言，蜂龙并非传统意义上的国家，而更像一种不断蔓延的“活体文明灾害”。\n\n与之并立的“原初树族意识共同体”同样拥有高度统一的群体意识，因此长期被外界视为蜂龙天然的盟友。然而，原初树族并不具备侵略与扩张本能。它们更倾向于缓慢、生长式的生态文明，对外界事务始终保持克制与疏离。因此，两大意识文明虽存在深层联系，却始终维持着微妙而复杂的距离。\n\n值得注意的是，蜂龙族群中偶尔会诞生脱离主意识网络的“自由个体”。这些个体保留了蜂龙强大的生理能力，却获得了真正独立的自我意识。对于蜂龙共同体而言，它们属于必须被彻底清除的“意识异端”。\n\n经过漫长而血腥的反抗战争，自由蜂龙最终建立起属于自己的政权——“蜂龙自由意识团结阵线”。它们与南方诸国结成长期军事同盟，共同抵御蜂龙意识共同体持续不断的扩张与清洗。\n\n而位于大陆南方海域的“南方联盟联合防御委员会”，则是由三十一座联盟国共同组成的松散防御体系。这片大陆因长期地质破碎化而形成了高度分散的群岛与海洋文明，大量彼此迥异的智慧种族在此繁衍生息。复杂的海洋环境与割裂地形，使这里长期无法诞生真正统一的霸权国家。\n\n千年以来，南方诸国始终遭受蜂龙文明的侵袭。也正因自由蜂龙的存在，蜂龙共同体始终未能真正攻陷南方世界。即便在外敌压迫下，联盟内部依旧长期存在贸易冲突、领土战争与种族矛盾。直到近代，在蜂龙威胁日益加剧的背景下，这些彼此敌视的国家才终于被迫建立起统一协调的“联合防御委员会”。\n\n尽管南方联盟拥有多达三十一个成员国，但其中绝大多数国家规模狭小、实力有限。真正支撑这片文明延续至今的，从来不是单一国家的力量，而是复杂海洋环境、松散联盟体系，以及自由蜂龙带来的战略平衡。'
);

// ---- 大陆 7 ----
addContinent(
    [
            [-13063.13, 27761.91],
        [-13363.98, 28036.32],
        [-13707.05, 28210.46],
        [-14203.18, 28257.95],
        [-14472.36, 28363.49],
        [-14720.43, 28907.02],
        [-14825.99, 29371.4],
        [-14762.65, 29598.31],
        [-14504.03, 29408.34],
        [-14219.02, 29661.64],
        [-14350.97, 30036.3],
        [-14509.31, 30194.61],
        [-14535.7, 30817.3],
        [-14752.1, 31075.87],
        [-14968.5, 31001.99],
        [-15248.23, 31044.21],
        [-15337.96, 31191.97],
        [-15227.12, 31846.31],
        [-14651.82, 32458.45],
        [-14746.82, 32986.15],
        [-15232.4, 32226.26],
        [-15554.36, 31688.0],
        [-15617.7, 30907.01],
        [-15802.43, 30384.58],
        [-15311.57, 29155.04],
        [-15063.5, 28822.59],
        [-14905.16, 28104.92],
        [-14794.32, 27925.5],
        [-14440.69, 28031.04],
        [-14277.08, 28089.09],
        [-13643.71, 27666.93],
        [-13432.59, 27598.33],
        [-13115.91, 27688.04],
    ],
    '日月星大陆',
    '主要国家：\n★日月星列岛国度\n★海洋公主同盟国\n☆居云者军团国\n☆居云者商业共和国\n\n日月星大陆是一片被群岛、风暴洋流与巨大堡礁分割的海洋文明世界。漫长的“狂乱之海时代”中，失控的海灾、海盗战争与跨国饥荒曾使整片大陆陷入数百年的混乱与崩溃。也正是在这样的时代背景下，“拜泪教”迅速崛起，并最终成为统治整片大陆的核心宗教力量。\n\n拜泪教是一种高度组织化的一神信仰体系，强调“神权与世俗合一”，并将宗教身份置于族群、国家与阶级之上。对于无数底层民众而言，教会不仅提供精神寄托，更建立起覆盖大陆的救济、医疗与粮食援助体系。在最混乱的年代，无数濒临毁灭的贫困家庭因教会而得以存续。\n\n而“日月星列岛国度”，则是拜泪教文明最强大的代表国家之一。其拥有完善的神权政治体系、庞大的海上教会舰队与极高的社会组织能力，被许多国家视为“拜泪教世界的中心”。\n\n然而，拜泪教在带来秩序与稳定的同时，也拥有极强的排他性。对于教会而言，所有拒绝信仰拜泪之神的文明，都属于尚未开化的异端与野蛮者。漫长历史中，日月星大陆的大多数国家，不是被征服，便是在长期文化渗透中逐渐完成宗教同化。\n\n唯有“居云者”始终例外。\n\n居云者是一支拥有双翼、寿命悠长且高度理性化的强大族裔。它们外表优雅、美丽，拥有远超多数文明的科技积累与空域统治能力，却同时极度傲慢而排外。居云者文明的发展速度极快，但其技术体系长期处于高度封锁状态，几乎从不向外界共享。\n\n面对拜泪教持续数百年的扩张与渗透，居云者内部逐渐分裂为两大派系。\n\n“居云者商业共和国”主张有限开放与和平共处，希望通过贸易、金融与技术优势维持自身独立；而“居云者军团国”则认为拜泪教本质上是一种无法共存的文明侵蚀，必须以武力彻底阻断其扩张。\n\n尽管双方在政治路线与社会结构上存在巨大差异，但所有居云者都共同信奉“客观、逻辑与理性至上”的价值观。因此，无论哪个派系，都与建立在绝对信仰基础上的拜泪教意识形态存在根本冲突。\n\n相比之下，“海洋公主同盟国”则是一支长期偏居海洋深处的古老文明。它们属于水陆两栖的高等智慧种族，并依托日月星大陆外围天然形成的超巨型堡礁群，建立起独特的“海上陆地国家”。\n\n由于特殊的生态结构与海洋环境，海洋公主同盟国与陆地文明往来极少，却拥有极其强大的深海统治力与海域控制能力。其舰队与海兽军团长期被视为海洋世界最危险的力量之一。\n\n而在近代，其长公主更与“苍神缘起帝国”皇帝完成政治联姻，使这一长期孤立的海洋强国，首次真正进入大陆诸国的权力格局之中。。'
);

// ---- 大陆 8 ----
addContinent(
    [
        [-4561.47, 31894.23],
        [-4518.6, 32048.54],
        [-4587.19, 32194.27],
        [-4801.55, 32168.55],
        [-4844.42, 32048.54],
        [-6927.94, 31919.95],
        [-7270.91, 32425.73],
        [-8248.37, 32477.16],
        [-8471.3, 31757.07],
        [-9320.14, 32605.75],
        [-9920.34, 32631.47],
        [-10349.04, 32254.28],
        [-10306.17, 31362.74],
        [-10786.33, 31019.84],
        [-10760.61, 30702.65],
        [-10494.81, 30694.08],
        [-10066.1, 31234.15],
        [-9551.65, 30805.52],
        [-8934.3, 31122.71],
        [-8574.19, 31594.2],
        [-8265.52, 31559.91],
        [-7708.19, 30839.81],
        [-6996.54, 31045.55],
        [-6773.61, 31654.2],
        [-4904.44, 31945.67],
        [-4784.4, 31859.94],
    ],
    '先驱者大陆',
    '主要国家：\n★先驱者破碎帝国\n★先驱者破碎帝国军阀\n☆白港\n☆黑港\n\n先驱者破碎帝国通常并不被认为是开普勒452B上的原生文明。大量遗迹与残存技术都表明，它们极有可能源自某个高度发达的外星文明。尽管先驱者曾掌握远超当代诸国的先进科技，但不知出于何种原因，它们始终无法再次突破这颗星球的引力，重返星空。\n\n在极其久远的年代里，先驱者文明便已定居于这片大陆，并逐渐发展出一个高度封闭、依赖古代科技维系的庞大帝国。它们长期与外界隔绝，其文明结构、科技体系与社会制度都与其他大陆截然不同。\n\n然而，一场原因至今未知的“大灾难”彻底毁灭了这一文明的黄金时代。毁灭性的超级爆炸几乎撕裂整片大陆，留下了横贯国土的巨大冲击坑，使如今的先驱者大陆呈现出宛如“玄月”般残缺而扭曲的地貌。\n\n灾难发生后，掌握帝国最高统治权的核心家族几乎全部灭绝，大量地方军事集团趁机崛起，整个帝国迅速分裂为彼此征伐的军阀势力。\n\n这场爆炸最终间接导致了狂乱之海时代的结束。\n\n而在灾难之后，失去完整工业体系与古代科技维护能力的先驱者文明，也不再能够维持过去近乎完全自给自足的状态。于是，“白港”与“黑港”逐渐发展为整个先驱者大陆对外交流的核心窗口。\n\n这两座拥有高度独立性质的贸易港岛，长期游离于军阀战争之外，承担着物资流通、技术交换与国际贸易的职能，也成为外部世界少数能够接触先驱者文明的区域。\n\n不过总体而言，长期陷入割据与内战的先驱者诸势力，对于外部世界始终缺乏强烈干涉意愿。'
);

// ---- 大陆 9 ----
addContinent(
    [
        [-2511.64, 15292.58],
        [-3914.54, 15518.81],
        [-3778.78, 15835.53],
        [-3145.21, 15948.64],
        [-3552.5, 16582.09],
        [-3461.99, 17034.55],
        [-2941.56, 17034.55],
        [-3643.01, 18075.21],
        [-3461.99, 18346.68],
        [-2873.68, 18776.52],
        [-3032.07, 19319.47],
        [-3326.23, 23730.96],
        [-2556.9, 24092.92],
        [-2330.62, 15631.92],
    ],
    '极点大陆',
    '主要国家：\n★极点帝国\n\n观星塔组织尚未公开此区域的情报。'
);

// ---- 大陆 10 ----
addContinent(
    [
        [-18112.6, 14477.42],
        [-17826.97, 14782.69],
        [-17994.41, 15668.94],
        [-17501.95, 17559.61],
        [-17876.22, 18170.13],
        [-17935.31, 20563.01],
        [-17600.44, 22030.25],
        [-17639.84, 22995.28],
        [-17777.73, 24039.08],
        [-18151.99, 24492.06],
        [-18191.39, 14625.13],
    ],
    '极点大陆',
    '主要国家：\n★极点帝国\n\n观星塔组织尚未公开此区域的情报。'
);








// ================= 开普勒452B 时钟 =================

function updateKeplerClock() {
    // ---- 历法常数 ----
    const DAYS_PER_YEAR   = 432;
    const DAYS_PER_MONTH  = 36;
    const HOURS_PER_DAY   = 36;
    const MINS_PER_HOUR   = 60;
    const SECS_PER_MIN    = 60;

    // 开普勒一天换算成毫秒
    // 逻辑：开普勒一年432天，地球一年365.25天
    // 开普勒一天 = 地球一天 × (365.25/432) × (36/24)
    const KEPLER_DAY_MS = 24 * 60 * 60 * 1000 * (365.25 / 432) * (36 / 24);
    const KEPLER_SEC_PER_DAY = HOURS_PER_DAY * MINS_PER_HOUR * SECS_PER_MIN;

    // 起始锚点：地球上某一刻 = 开普勒5500年9月20日 00:00:00
    const EPOCH_EARTH = new Date('2025-01-01T00:00:00Z');
    const EPOCH_YEAR  = 5500;
    const EPOCH_MONTH = 9;
    const EPOCH_DAY   = 20;

    // ---- 计算 ----
    const elapsedMs = new Date() - EPOCH_EARTH;
    const totalKeplerSec = (elapsedMs / KEPLER_DAY_MS) * KEPLER_SEC_PER_DAY;

    const totalDays    = Math.floor(totalKeplerSec / KEPLER_SEC_PER_DAY);
    const secInDay     = totalKeplerSec % KEPLER_SEC_PER_DAY;

    const hours   = Math.floor(secInDay / (MINS_PER_HOUR * SECS_PER_MIN));
    const minutes = Math.floor((secInDay % (MINS_PER_HOUR * SECS_PER_MIN)) / SECS_PER_MIN);
    const seconds = Math.floor(secInDay % SECS_PER_MIN);

    let dayOfYear  = (EPOCH_MONTH - 1) * DAYS_PER_MONTH + (EPOCH_DAY - 1) + totalDays;
    const yearOffset = Math.floor(dayOfYear / DAYS_PER_YEAR);
    dayOfYear = dayOfYear % DAYS_PER_YEAR;

    const year  = EPOCH_YEAR + yearOffset;
    const month = Math.floor(dayOfYear / DAYS_PER_MONTH) + 1;
    const day   = (dayOfYear % DAYS_PER_MONTH) + 1;

    const pad = n => String(n).padStart(2, '0');

    // ---- 写入DOM ----
    document.getElementById('kepler-year').innerText  = year;
    document.getElementById('kepler-month').innerText = month;
    document.getElementById('kepler-day').innerText   = day;
    document.getElementById('kepler-time').innerText  = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// 立即执行一次，然后每秒刷新
updateKeplerClock();
setInterval(updateKeplerClock, 1000);




// ===== 星球环境面板交互 =====
const planetPanel = document.getElementById('planet-panel');
const planetClose = document.getElementById('planet-close');

// 点击左侧「行星环境」按钮打开面板
document.getElementById('planetary-environment').addEventListener('click', () => {
    planetPanel.classList.add('active');
});

// 点击 X 关闭
planetClose.addEventListener('click', () => {
    planetPanel.classList.remove('active');
});

// 点击面板外部也关闭（可选）
document.addEventListener('click', (e) => {
    if (planetPanel.classList.contains('active') &&
        !planetPanel.contains(e.target) &&
        e.target.closest('#planetary-environment') === null) {
        planetPanel.classList.remove('active');
    }
});



// ===================================================
// 政治体系面板交互
// 逻辑与星球环境面板（planet-panel）完全对称
// ===================================================

// --- 获取面板相关元素 ---
const politicsPanel = document.getElementById('politics-panel');   // 整个面板
const politicsClose = document.getElementById('politics-close');   // 关闭按钮
const politicsContent = document.getElementById('politics-content'); // 内容滚动区
const scrollbarThumb = document.getElementById('politics-scrollbar-thumb'); // 自定义滚动条滑块
const scrollbarTrack = document.getElementById('politics-scrollbar'); // 滚动条轨道

// --- 打开面板 ---
// 点击左侧链条上的"政治体系"按钮时触发
document.getElementById('Political-System').addEventListener('click', () => {
    politicsPanel.classList.add('active'); // 添加 active 类，CSS动画从下方浮出
    updateScrollbarThumb(); // 打开时立即更新滑块位置和尺寸
});

// --- 关闭面板：点击 X 按钮 ---
politicsClose.addEventListener('click', () => {
    politicsPanel.classList.remove('active'); // 移除 active 类，面板收回屏幕下方
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        politicsPanel.classList.contains('active') &&      // 面板当前是打开的
        !politicsPanel.contains(e.target) &&               // 点击位置不在面板内部
        e.target.closest('#Political-System') === null     // 点击位置不是打开按钮
    ) {
        politicsPanel.classList.remove('active');
    }
});

// ===== 左侧导航Tab切换 =====
// 获取所有导航按钮
const politicsNavBtns = document.querySelectorAll('.politics-nav-btn');

politicsNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        // 第一步：把所有按钮的选中状态移除
        politicsNavBtns.forEach(b => b.classList.remove('politics-nav-btn--active'));

        // 第二步：给当前点击的按钮加上选中状态
        btn.classList.add('politics-nav-btn--active');

        // 第三步：读取当前按钮对应的 tab 名称（data-tab 属性）
        const targetTab = btn.dataset.tab; // 例如 "regime" 或 "global"

        // 第四步：隐藏所有 tab 内容区
        document.querySelectorAll('.politics-tab').forEach(tab => {
            tab.style.display = 'none';
        });

        // 第五步：显示对应的 tab 内容区
        // 规则：tab 的 id = "tab-" + data-tab 的值
        document.getElementById('tab-' + targetTab).style.display = 'block';

        // 第六步：切换tab后滚动区回到顶部，并更新滑块
        politicsContent.scrollTop = 0;
        updateScrollbarThumb();
    });
});

// ===== 自定义滚动条逻辑 =====

// 【函数】更新滑块的位置和尺寸
// 每次内容区滚动、或面板打开、或切换Tab时调用
function updateScrollbarThumb() {
    const { scrollTop, scrollHeight, clientHeight } = politicsContent;

    // 计算滑块高度比例：可见区域 / 总内容高度
    // 例如内容是显示区的3倍高，滑块就占轨道的1/3
    const thumbHeightRatio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(thumbHeightRatio * 100, 10); // 最小10%，防止太小难以点击

    // 计算滑块顶部位置：当前滚动进度 * 剩余轨道空间
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    const thumbTop = scrollRatio * (100 - thumbHeight);

    // 将计算结果写入滑块样式（百分比单位，相对于轨道高度）
    scrollbarThumb.style.height = thumbHeight + '%';
    scrollbarThumb.style.top = thumbTop + '%';
}

// 【事件】内容区滚动时，实时更新滑块位置
politicsContent.addEventListener('scroll', updateScrollbarThumb);

// 【事件】拖动滑块时，同步更新内容区的滚动位置
let isDraggingThumb = false; // 标记：是否正在拖动滑块
let dragStartY = 0;          // 拖动开始时鼠标的Y坐标
let dragStartScrollTop = 0;  // 拖动开始时内容区的滚动位置

// 鼠标按下滑块：开始拖动
scrollbarThumb.addEventListener('mousedown', (e) => {
    isDraggingThumb = true;
    dragStartY = e.clientY;                     // 记录鼠标起始Y坐标
    dragStartScrollTop = politicsContent.scrollTop; // 记录内容区起始滚动位置
    e.preventDefault(); // 防止拖动时选中文字
});

// 鼠标移动：如果正在拖动，计算并更新滚动位置
document.addEventListener('mousemove', (e) => {
    if (!isDraggingThumb) return; // 没在拖动就忽略

    const deltaY = e.clientY - dragStartY; // 鼠标移动了多少像素

    // 将鼠标移动量换算成内容滚动量
    // 逻辑：鼠标移动 1px 轨道 = 内容移动 (总内容高度/轨道高度) px
    const trackHeight = scrollbarTrack.clientHeight;
    const { scrollHeight, clientHeight } = politicsContent;
    const scrollAmount = (deltaY / trackHeight) * scrollHeight;

    // 更新内容区滚动位置，clamp 防止超出边界
    politicsContent.scrollTop = Math.max(
        0,
        Math.min(dragStartScrollTop + scrollAmount, scrollHeight - clientHeight)
    );
});

// 鼠标松开：结束拖动
document.addEventListener('mouseup', () => {
    isDraggingThumb = false;
});

// 【事件】点击轨道空白处：跳转到对应位置（不是拖动，而是直接跳）
scrollbarTrack.addEventListener('click', (e) => {
    if (e.target === scrollbarThumb) return; // 点的是滑块本身，不处理

    const trackRect = scrollbarTrack.getBoundingClientRect();
    const clickRatio = (e.clientY - trackRect.top) / trackRect.height; // 点击位置占轨道的比例
    const { scrollHeight, clientHeight } = politicsContent;
    politicsContent.scrollTop = clickRatio * (scrollHeight - clientHeight); // 按比例跳转
});



// ===================================================
// 货币体系面板交互
// 逻辑与政治体系面板完全对称，无左侧Tab导航
// ===================================================

// --- 获取货币面板相关元素 ---
const currencyPanel = document.getElementById('currency-panel');  // 整个面板
const currencyClose = document.getElementById('currency-close'); // 关闭按钮

// --- 打开面板 ---
// 点击左侧侧边栏"货币体系"按钮时触发
document.getElementById('Currency-System').addEventListener('click', () => {
    currencyPanel.classList.add('active'); // 添加 active，CSS动画从下方浮出
});

// --- 关闭面板：点击 X 按钮 ---
currencyClose.addEventListener('click', () => {
    currencyPanel.classList.remove('active'); // 移除 active，面板收回下方
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        currencyPanel.classList.contains('active') &&       // 面板当前是打开的
        !currencyPanel.contains(e.target) &&                // 点击位置不在面板内部
        e.target.closest('#Currency-System') === null       // 点击位置不是打开按钮
    ) {
        currencyPanel.classList.remove('active');
    }
});



// ===================================================
// 历史时间线面板交互
// 与政治体系面板开关逻辑完全一致
// 额外增加：时间轴横向定位计算、鼠标滚轮横向滚动
// ===================================================

// --- 获取面板相关元素 ---
const timelinePanel   = document.getElementById('timeline-panel');   // 整个面板
const timelineClose   = document.getElementById('timeline-close');   // 关闭按钮
const tlScrollArea    = document.getElementById('tl-scroll-area');   // 横向滚动区
const tlTrack         = document.getElementById('tl-track');         // 轨道
const tlRuler         = document.getElementById('tl-ruler');         // 底部刻度轴

// --- 打开面板 ---
document.getElementById('Historical-Timeline').addEventListener('click', () => {
    timelinePanel.classList.add('active');
    // 面板打开后初始化时间轴（只执行一次）
    if (!tlTrack.dataset.initialized) {
        initTimeline();
        tlTrack.dataset.initialized = 'true';
    }
});

// --- 关闭面板：点击 X 按钮 ---
timelineClose.addEventListener('click', () => {
    timelinePanel.classList.remove('active');
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        timelinePanel.classList.contains('active') &&
        !timelinePanel.contains(e.target) &&
        e.target.closest('#Historical-Timeline') === null
    ) {
        timelinePanel.classList.remove('active');
    }
});

// =====================================================
// 时间轴初始化函数
// 根据每个节点的 data-year 属性计算其在轨道上的 left 位置
// 年份范围：-1,000,000 到 5,501
// =====================================================
function initTimeline() {

    // --- 时间范围配置 ---
    const YEAR_MIN   = -1000000;    // 时间轴最左侧年份
    const YEAR_MAX   =  5501;       // 时间轴最右侧年份
    const TRACK_PAD  =  120;        // 左右留白（px）
    // 轨道总宽度：节点越多、时间跨度越大，这里设大一些让节点不拥挤
    const TRACK_WIDTH = 70000;       // px，可调整

    // 设置轨道宽度
    tlTrack.style.width = TRACK_WIDTH + 'px';

    // --- 年份→像素的映射函数 ---
    // 注意：时间轴是对数压缩的，因为 -1,000,000 到 -3000 年跨度极大
    // 但 -3000 到 5501 年的事件密集
    // 使用分段线性映射：远古部分压缩，近代部分展开
    function yearToX(year) {
        // 分段映射配置：[年份起点, 年份终点, 对应的像素起点, 像素终点]
        const segments = [
            [-1000000, -5000,  TRACK_PAD,              TRACK_WIDTH * 0.22],  // 远古：极度压缩
            [-5000,    -789,   TRACK_WIDTH * 0.18,     TRACK_WIDTH * 0.30],  // 前精灵历早期
            [-789,     0,      TRACK_WIDTH * 0.30,     TRACK_WIDTH * 0.45],  // 前精灵历晚期（事件密集）
            [0,        500,    TRACK_WIDTH * 0.45,     TRACK_WIDTH * 0.52],  // 精灵历早期
            [500,      2500,   TRACK_WIDTH * 0.52,     TRACK_WIDTH * 0.65],  // 扩张纪元
            [2500,     3855,   TRACK_WIDTH * 0.65,     TRACK_WIDTH * 0.75],  // 危机纪元
            [3855,     5501,   TRACK_WIDTH * 0.75,     TRACK_WIDTH - TRACK_PAD] // 现代纪元
        ];

        // 找到年份所在的分段并做线性插值
        for (const [ys, ye, xs, xe] of segments) {
            if (year >= ys && year <= ye) {
                const ratio = (year - ys) / (ye - ys);
                return xs + ratio * (xe - xs);
            }
        }
        // 超出范围的容错
        if (year < YEAR_MIN) return TRACK_PAD;
        return TRACK_WIDTH - TRACK_PAD;
    }

    // --- 定位所有事件节点 ---
    const nodes = tlTrack.querySelectorAll('.tl-node');
    nodes.forEach(node => {
        const year = parseFloat(node.dataset.year); // 读取 data-year 属性
        const x = yearToX(year);
        node.style.left = x + 'px';               // 设置水平位置
    });

    // --- 定位所有纪元色块 ---
    const eras = tlTrack.querySelectorAll('.tl-era');
    eras.forEach(era => {
        const yearStart = parseFloat(era.dataset.yearStart);
        const yearEnd   = parseFloat(era.dataset.yearEnd);
        const xStart    = yearToX(yearStart);
        const xEnd      = yearToX(yearEnd);
        era.style.left  = xStart + 'px';
        era.style.width = (xEnd - xStart) + 'px';
    });

    // --- 生成底部刻度轴 ---
    // 在关键年份处显示刻度标记
    const tickYears = [
        -1000000, -500000, -100000, -50000, -12000, -5000, -3000,
        -2333, -1802, -1000, -789, -750, -700, -650, -593, -511,
        -422, -312, -306, -211, -58, 0, 79, 433, 500, 821,
        1123, 1457, 2088, 2279, 2896, 3233, 3855, 3875, 3973,
        4002, 4222, 4250, 4337, 4580, 4752, 5026, 5330, 5499
    ];

    tlRuler.style.width = TRACK_WIDTH + 'px'; // 刻度轴与轨道等宽
    tlRuler.style.position = 'relative';

    tickYears.forEach(year => {
        const x = yearToX(year);

        // 刻度容器
        const tick = document.createElement('div');
        tick.style.cssText = `
            position: absolute;
            left: ${x}px;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        // 刻度短竖线
        const line = document.createElement('div');
        line.style.cssText = `
            width: 1px;
            height: 8px;
            background: rgba(193,160,94,0.6);
        `;

        // 刻度年份文字
        const label = document.createElement('div');
        // 远古年份显示简化（如 -1,000,000 → -100万）
        let displayYear;
        if (year <= -100000) {
            displayYear = (year / 10000).toFixed(0) + '万';
        } else {
            displayYear = year.toString();
        }
        label.style.cssText = `
            color: rgba(120,100,0,0.5);
            font-size: 0.38vw;
            white-space: nowrap;
            margin-top: 2px;
        `;
        label.textContent = displayYear;

        tick.appendChild(line);
        tick.appendChild(label);
        tlRuler.appendChild(tick);
    });

    // 同步刻度轴的横向滚动位置
    tlScrollArea.addEventListener('scroll', () => {
        tlRuler.style.marginLeft = -tlScrollArea.scrollLeft + 'px';
    });
}

// =====================================================
// 鼠标滚轮横向滚动
// 在滚动区域内，滚轮上下滚动被转换为左右滚动
// =====================================================
tlScrollArea.addEventListener('wheel', (e) => {
    e.preventDefault();                     // 阻止页面纵向滚动
    // 将纵向滚动量（deltaY）转换为横向滚动
    tlScrollArea.scrollLeft += e.deltaY * 2.5; // 乘以系数控制速度，可调整
}, { passive: false });                     // passive:false 才能 preventDefault

// =====================================================
// 鼠标拖动横向滚动（抓住拖动）
// =====================================================
let tlIsDragging  = false;  // 是否正在拖动
let tlDragStartX  = 0;      // 拖动开始时鼠标X坐标
let tlScrollStart = 0;      // 拖动开始时的scrollLeft值

// 鼠标按下：开始拖动
tlScrollArea.addEventListener('mousedown', (e) => {
    tlIsDragging  = true;
    tlDragStartX  = e.clientX;
    tlScrollStart = tlScrollArea.scrollLeft;
    e.preventDefault();
});

// 鼠标移动：如果在拖动，更新滚动位置
document.addEventListener('mousemove', (e) => {
    if (!tlIsDragging) return;
    const deltaX = e.clientX - tlDragStartX;   // 鼠标移动距离
    tlScrollArea.scrollLeft = tlScrollStart - deltaX; // 向右拖动→内容向左滚动
});

// 鼠标松开：结束拖动
document.addEventListener('mouseup', () => {
    tlIsDragging = false;
});



// ===================================================
// 巨型企业面板交互
// 逻辑与政治体系面板完全对称
// 无额外复杂交互，只有开关和滚轮滚动
// ===================================================

// --- 获取面板相关元素 ---
const megaPanel = document.getElementById('mega-panel');   // 整个面板
const megaClose = document.getElementById('mega-close');   // 关闭按钮
const megaTableWrap = document.getElementById('mega-table-wrap'); // 右侧滚动区

// --- 打开面板 ---
// ⚠ 'Mega-Corporations' 需与 index.html 中左侧按钮的 id 一致，按实际修改
document.getElementById('Megacorporations').addEventListener('click', () => {
    megaPanel.classList.add('active');
});

// --- 关闭面板：点击 X 按钮 ---
megaClose.addEventListener('click', () => {
    megaPanel.classList.remove('active');
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        megaPanel.classList.contains('active') &&
        !megaPanel.contains(e.target) &&
        e.target.closest('#Megacorporations') === null
    ) {
        megaPanel.classList.remove('active');
    }
});

// --- 鼠标滚轮纵向滚动（右侧排行榜区域）---
// 右侧表格区域默认支持滚轮滚动，这里额外加速系数让体验更流畅
megaTableWrap.addEventListener('wheel', (e) => {
    e.stopPropagation(); // 阻止事件冒泡到页面，防止干扰地图
    // 不需要 preventDefault，保持默认纵向滚动行为即可
}, { passive: true });


// ===================================================
// 国际组织面板交互
// 逻辑与政治体系面板完全对称，无额外复杂交互
// ===================================================

// --- 获取面板相关元素 ---
const intorgPanel = document.getElementById('intorg-panel'); // 整个面板
const intorgClose = document.getElementById('intorg-close'); // 关闭按钮

// --- 打开面板 ---
// id="International-Organizations" 与 index.html 第76行完全一致（带连字符）
document.getElementById('International-Organizations').addEventListener('click', () => {
    intorgPanel.classList.add('active'); // 添加active，CSS动画从下方浮出
});

// --- 关闭面板：点击 X 按钮 ---
intorgClose.addEventListener('click', () => {
    intorgPanel.classList.remove('active'); // 移除active，面板收回下方
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        intorgPanel.classList.contains('active') &&              // 面板当前是打开的
        !intorgPanel.contains(e.target) &&                       // 点击位置不在面板内部
        e.target.closest('#International-Organizations') === null // 点击位置不是打开按钮
    ) {
        intorgPanel.classList.remove('active');
    }
});