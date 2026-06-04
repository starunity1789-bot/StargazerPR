
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

// —— i18n：语言切换时，若大陆信息面板正打开，则用新语言重新渲染 (Phase 3) ——
document.addEventListener('app:languagechange', function () {
    if (infoPanel.style.display === 'block') {
        var key = infoPanel.dataset.contKey;
        if (key && window.I18n) {
            panelTitle.innerText   = window.I18n.t('cont.' + key + '.title');
            panelContent.innerText = window.I18n.t('cont.' + key + '.body');
        }
    }
});

// ---- 核心工厂函数 ----
// 左右各生成11份副本，共23个polygon，覆盖22屏滚动范围
function addContinent(coords, name, description, i18nKey) {

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
        // 记住当前打开的大陆 key，供语言切换时重新取词刷新
        infoPanel.dataset.contKey = i18nKey || '';
        renderPanel();
    }
    // 按当前语言把标题/正文写入面板；有 i18nKey 走词典，缺失则回退到原始中文
    function renderPanel() {
        var hasI18n = (typeof window !== 'undefined') && window.I18n && i18nKey;
        var title = hasI18n ? window.I18n.t('cont.' + i18nKey + '.title') : name;
        var body  = hasI18n ? window.I18n.t('cont.' + i18nKey + '.body')  : description;
        // 词典缺失时 t() 会返回 key 本身，这里兜底回退到中文原文
        if (hasI18n && title === 'cont.' + i18nKey + '.title') title = name;
        if (hasI18n && body  === 'cont.' + i18nKey + '.body')  body  = description;
        panelTitle.innerText = title;
        panelContent.innerText = body;
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
    '主要国家：\n★精灵二十四族裔\n☆精灵之桥\n\n经历惨烈的凛冬战争后，流浪万余年的精灵一族终于建立了属于自己的民族国家——“精灵二十四族裔”。为了隔绝外界纷争，它们以庞大的“碧之结界”封锁整片大陆，自此进入近乎完全闭关锁国的时代。\n然而，精灵大陆盛产诸多外界无可替代的珍稀资源。在多国长期斡旋与协商下，精灵最终于大陆东南角设立了一座高度特殊化的独立贸易港——“精灵之桥”。这是唯一允许其他族群合法居留与活动的精灵城市，也成为连接精灵文明与外部世界的唯一通道。\n凭借垄断性的贸易地位，“精灵之桥”每年都会创造惊人的财富与贸易收益。而由于“精灵二十四族裔”本身拥有近乎完全自给自足的经济体系，为避免长期贸易顺差引发新的国际矛盾，精灵政府将大量贸易利润持续投入国际慈善、医疗援助与教育事业，使其在世界范围内逐渐形成了独特而复杂的国际影响力。', 'elf'
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
    '主要国家：\n★苍神缘起帝国\n★凛冬合众国\n☆河童重工集团\n\n由于水元素矿石的泛滥和古代残留的遗迹，这片大陆的西北地区常年产生非星球环境引起低温天气。凛冬战争之前，这里只有一些稀疏的本土居民。凛冬战争爆发后，这里先是被博爱-恩泽同盟军团占领为军事前沿阵地，后来被精灵联军反攻占领。战后，这里被精灵的盟友们建立起分属不同势力的独立国家，但是在国际政治上仍然被视为精灵二十四族裔的卫星国家。河童重工集团更是在大陆东南区域大举填海造陆，借助精灵势力的援助，跻身成为世界前列的工业势力。', 'deepwinter'
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
    '主要国家：\n★博爱联盟共和国\n★南海工业联合体\n★深海联盟\n☆霜湖合众国\n☆赤潮同盟\n☆远视主义技术治国委员会\n\n绵延漫长的海岸线、富饶稳定的自然环境，以及长期远离大规模战争的历史背景，共同塑造了这片大陆以重商主义与民主政治为核心的社会传统。贸易、航运与资本流通深刻影响着各国的发展路径，也使这里成为世界上商业最繁荣、意识形态最活跃的地区之一。\n\n然而，大陆内部复杂的种族与物种差异，也逐渐演化出严重的社会阶层分化。资源占有、寿命差距、种群能力与历史地位的不平等，使贫富鸿沟与身份矛盾长期存在，并最终推动各国政治思潮不断向左右两极激化。\n\n尽管“民主主义”仍是大陆各国共同承认的政治基础，但在长期的社会撕裂与利益博弈之下，各国逐渐发展出截然不同的政治体制：有的奉行资本主导的议会共和，有的演化为工团寡头统治，也有国家转向技术官僚主义，甚至形成以意识形态联盟维系的激进政权。', 'fraternity'
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
    '主要国家：\n★巅峰重工集群主权\n★飞升者技术统合控股领\n★进化之印工业企业特权领地\n☆西海半岛港口自由城市联盟\n\n位于博爱大陆与恩泽大陆之间的飞升大陆，自古便是贯通两大文明圈的核心航道与金融枢纽。依靠庞大的跨大陆贸易、资本流通与技术垄断，这片土地在早期迅速积累起惊人的财富与工业基础；然而，夹处于两大强权之间的地缘压力，也使飞升大陆长期笼罩在生存危机之中。再加上本土族群天生崇尚效率、秩序与力量的文化特性，各国逐渐形成了近乎狂热的工业主义与技术至上信仰。随着传统国家体系衰落，企业主权最终彻底取代民族主权。这片大陆的主要统治权被工业势力持有；巅峰重工集群主权更是全球公认最强的工业集团力量。', 'ascension'
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
    '主要国家：\n★恩泽帝国\n★三十列王联合帝国\n★幽泉谷\n☆红月皇国\n☆苍空神殿骑士团国\n\n为了抵御蜂龙意识共同体以千年计的长期袭扰和入侵，恩泽大陆的文明形成了明显的威权主义传统。在这个大陆上，集体主义和秩序被视为第一要义，个人自由和隐私则被普遍牺牲。科技的发展和突破的现代，蜂龙大陆的威胁已经化为往日泡影，但是这并未导致恩泽大陆诸国的政治体制变化；反而借助科技的力量，普遍实行了高度集中的政治体制和严密的社会监控系统。\n\n在文化层面，恩泽大陆的艺术、文学和哲学都深受威权主义思想的影响，强调集体主义、忠诚和牺牲精神。这种文化氛围既塑造了大陆独特的文明特色，也为其带来了诸多挑战和矛盾。', 'grace'
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
    '主要国家：\n★蜂龙意识共同体\n★原初树族意识共同体\n☆荒空冰原北方族群政治实体\n☆蜂龙自由意识团结阵线\n☆南方联盟联合防御委员会\n\n“蜂龙”是一种兼具绝对个体力量与蜂群意识的超大型智慧生物。它们彼此之间共享感知、记忆与思维网络，整个族群几乎可以被视作一个庞大的统一意识体。对于蜂龙而言，扩张、吞并与同化并非政治选择，而是刻入本能深处的生存规律。\n\n建立于这一种族基础上的“蜂龙意识共同体”，因此成为世界上最具压迫性的扩张文明之一。它们会不断向外侵蚀新的生态圈，将一切能够利用的生命、资源与土地纳入群体意识之中。对于许多文明而言，蜂龙并非传统意义上的国家，而更像一种不断蔓延的“活体文明灾害”。\n\n与之并立的“原初树族意识共同体”同样拥有高度统一的群体意识，因此长期被外界视为蜂龙天然的盟友。然而，原初树族并不具备侵略与扩张本能。它们更倾向于缓慢、生长式的生态文明，对外界事务始终保持克制与疏离。因此，两大意识文明虽存在深层联系，却始终维持着微妙而复杂的距离。\n\n值得注意的是，蜂龙族群中偶尔会诞生脱离主意识网络的“自由个体”。这些个体保留了蜂龙强大的生理能力，却获得了真正独立的自我意识。对于蜂龙共同体而言，它们属于必须被彻底清除的“意识异端”。\n\n经过漫长而血腥的反抗战争，自由蜂龙最终建立起属于自己的政权——“蜂龙自由意识团结阵线”。它们与南方诸国结成长期军事同盟，共同抵御蜂龙意识共同体持续不断的扩张与清洗。\n\n而位于大陆南方海域的“南方联盟联合防御委员会”，则是由三十一座联盟国共同组成的松散防御体系。这片大陆因长期地质破碎化而形成了高度分散的群岛与海洋文明，大量彼此迥异的智慧种族在此繁衍生息。复杂的海洋环境与割裂地形，使这里长期无法诞生真正统一的霸权国家。\n\n千年以来，南方诸国始终遭受蜂龙文明的侵袭。也正因自由蜂龙的存在，蜂龙共同体始终未能真正攻陷南方世界。即便在外敌压迫下，联盟内部依旧长期存在贸易冲突、领土战争与种族矛盾。直到近代，在蜂龙威胁日益加剧的背景下，这些彼此敌视的国家才终于被迫建立起统一协调的“联合防御委员会”。\n\n尽管南方联盟拥有多达三十一个成员国，但其中绝大多数国家规模狭小、实力有限。真正支撑这片文明延续至今的，从来不是单一国家的力量，而是复杂海洋环境、松散联盟体系，以及自由蜂龙带来的战略平衡。', 'hivedragon'
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
    '主要国家：\n★日月星列岛国度\n★海洋公主同盟国\n☆居云者军团国\n☆居云者商业共和国\n\n日月星大陆是一片被群岛、风暴洋流与巨大堡礁分割的海洋文明世界。漫长的“狂乱之海时代”中，失控的海灾、海盗战争与跨国饥荒曾使整片大陆陷入数百年的混乱与崩溃。也正是在这样的时代背景下，“拜泪教”迅速崛起，并最终成为统治整片大陆的核心宗教力量。\n\n拜泪教是一种高度组织化的一神信仰体系，强调“神权与世俗合一”，并将宗教身份置于族群、国家与阶级之上。对于无数底层民众而言，教会不仅提供精神寄托，更建立起覆盖大陆的救济、医疗与粮食援助体系。在最混乱的年代，无数濒临毁灭的贫困家庭因教会而得以存续。\n\n而“日月星列岛国度”，则是拜泪教文明最强大的代表国家之一。其拥有完善的神权政治体系、庞大的海上教会舰队与极高的社会组织能力，被许多国家视为“拜泪教世界的中心”。\n\n然而，拜泪教在带来秩序与稳定的同时，也拥有极强的排他性。对于教会而言，所有拒绝信仰拜泪之神的文明，都属于尚未开化的异端与野蛮者。漫长历史中，日月星大陆的大多数国家，不是被征服，便是在长期文化渗透中逐渐完成宗教同化。\n\n唯有“居云者”始终例外。\n\n居云者是一支拥有双翼、寿命悠长且高度理性化的强大族裔。它们外表优雅、美丽，拥有远超多数文明的科技积累与空域统治能力，却同时极度傲慢而排外。居云者文明的发展速度极快，但其技术体系长期处于高度封锁状态，几乎从不向外界共享。\n\n面对拜泪教持续数百年的扩张与渗透，居云者内部逐渐分裂为两大派系。\n\n“居云者商业共和国”主张有限开放与和平共处，希望通过贸易、金融与技术优势维持自身独立；而“居云者军团国”则认为拜泪教本质上是一种无法共存的文明侵蚀，必须以武力彻底阻断其扩张。\n\n尽管双方在政治路线与社会结构上存在巨大差异，但所有居云者都共同信奉“客观、逻辑与理性至上”的价值观。因此，无论哪个派系，都与建立在绝对信仰基础上的拜泪教意识形态存在根本冲突。\n\n相比之下，“海洋公主同盟国”则是一支长期偏居海洋深处的古老文明。它们属于水陆两栖的高等智慧种族，并依托日月星大陆外围天然形成的超巨型堡礁群，建立起独特的“海上陆地国家”。\n\n由于特殊的生态结构与海洋环境，海洋公主同盟国与陆地文明往来极少，却拥有极其强大的深海统治力与海域控制能力。其舰队与海兽军团长期被视为海洋世界最危险的力量之一。\n\n而在近代，其长公主更与“苍神缘起帝国”皇帝完成政治联姻，使这一长期孤立的海洋强国，首次真正进入大陆诸国的权力格局之中。。', 'sunmoonstar'
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
    '主要国家：\n★先驱者破碎帝国\n★先驱者破碎帝国军阀\n☆白港\n☆黑港\n\n先驱者破碎帝国通常并不被认为是开普勒452B上的原生文明。大量遗迹与残存技术都表明，它们极有可能源自某个高度发达的外星文明。尽管先驱者曾掌握远超当代诸国的先进科技，但不知出于何种原因，它们始终无法再次突破这颗星球的引力，重返星空。\n\n在极其久远的年代里，先驱者文明便已定居于这片大陆，并逐渐发展出一个高度封闭、依赖古代科技维系的庞大帝国。它们长期与外界隔绝，其文明结构、科技体系与社会制度都与其他大陆截然不同。\n\n然而，一场原因至今未知的“大灾难”彻底毁灭了这一文明的黄金时代。毁灭性的超级爆炸几乎撕裂整片大陆，留下了横贯国土的巨大冲击坑，使如今的先驱者大陆呈现出宛如“玄月”般残缺而扭曲的地貌。\n\n灾难发生后，掌握帝国最高统治权的核心家族几乎全部灭绝，大量地方军事集团趁机崛起，整个帝国迅速分裂为彼此征伐的军阀势力。\n\n这场爆炸最终间接导致了狂乱之海时代的结束。\n\n而在灾难之后，失去完整工业体系与古代科技维护能力的先驱者文明，也不再能够维持过去近乎完全自给自足的状态。于是，“白港”与“黑港”逐渐发展为整个先驱者大陆对外交流的核心窗口。\n\n这两座拥有高度独立性质的贸易港岛，长期游离于军阀战争之外，承担着物资流通、技术交换与国际贸易的职能，也成为外部世界少数能够接触先驱者文明的区域。\n\n不过总体而言，长期陷入割据与内战的先驱者诸势力，对于外部世界始终缺乏强烈干涉意愿。', 'pioneer'
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
    '主要国家：\n★极点帝国\n\n观星塔组织尚未公开此区域的情报。', 'pole'
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
    '主要国家：\n★极点帝国\n\n观星塔组织尚未公开此区域的情报。', 'pole'
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

// ===================================================
// 星图位置面板交互
// 逻辑与其他面板对称：active 类控制从下方浮出 + 点击外部关闭
// ===================================================

// --- 获取面板相关元素 ---
const starmapPanel = document.getElementById('starmap-panel'); // 整个面板
const starmapClose = document.getElementById('starmap-close'); // 关闭按钮

// --- 打开面板 ---
// id="Star-Map-Location" 与 index.html 中侧边栏一致（带连字符）
document.getElementById('Star-Map-Location').addEventListener('click', () => {
    starmapPanel.classList.add('active'); // 添加active，CSS动画浮出
});

// --- 关闭面板：点击 X 按钮 ---
starmapClose.addEventListener('click', () => {
    starmapPanel.classList.remove('active');
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        starmapPanel.classList.contains('active') &&
        !starmapPanel.contains(e.target) &&
        e.target.closest('#Star-Map-Location') === null
    ) {
        starmapPanel.classList.remove('active');
    }
});


// ===================================================
// 科技树面板交互
// 逻辑与政治体系面板完全对称
// 额外：鼠标滚轮纵向滚动加速处理
// ===================================================

// --- 获取面板相关元素 ---
const techtreePanel  = document.getElementById('techtree-panel');  // 整个面板
const techtreeClose  = document.getElementById('techtree-close');  // 关闭按钮
const techtreeScroll = document.getElementById('techtree-scroll'); // 内容滚动区

// --- 打开面板 ---
// id="Technology-Tree" 与 index.html 第97行完全一致（带连字符）
document.getElementById('Technology-Tree').addEventListener('click', () => {
    techtreePanel.classList.add('active'); // 添加active，CSS动画从下方浮出
});

// --- 关闭面板：点击 X 按钮 ---
techtreeClose.addEventListener('click', () => {
    techtreePanel.classList.remove('active');
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        techtreePanel.classList.contains('active') &&
        !techtreePanel.contains(e.target) &&
        e.target.closest('#Technology-Tree') === null
    ) {
        techtreePanel.classList.remove('active');
    }
});

// --- 鼠标滚轮纵向滚动 ---
// 科技树内容很长，加大滚动速度系数让体验更流畅
techtreeScroll.addEventListener('wheel', (e) => {
    e.preventDefault();                         // 阻止页面纵向滚动
    techtreeScroll.scrollTop += e.deltaY * 1.5; // 1.5倍速度，可调整
}, { passive: false });



// ===================================================
// 信仰与哲学面板交互
// 逻辑与政治体系面板完全对称，无额外复杂交互
// ===================================================

// --- 获取面板相关元素 ---
const beliefsPanel = document.getElementById('beliefs-panel'); // 整个面板
const beliefsClose = document.getElementById('beliefs-close'); // 关闭按钮

// --- 打开面板 ---
// id="Beliefs-and-Philosophy" 与 index.html 第107行完全一致（带连字符）
document.getElementById('Beliefs-and-Philosophy').addEventListener('click', () => {
    beliefsPanel.classList.add('active'); // 添加active，CSS动画从下方浮出
});

// --- 关闭面板：点击 X 按钮 ---
beliefsClose.addEventListener('click', () => {
    beliefsPanel.classList.remove('active'); // 移除active，面板收回下方
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        beliefsPanel.classList.contains('active') &&             // 面板当前是打开的
        !beliefsPanel.contains(e.target) &&                      // 点击位置不在面板内部
        e.target.closest('#Beliefs-and-Philosophy') === null     // 点击位置不是打开按钮
    ) {
        beliefsPanel.classList.remove('active');
    }
});


// ===================================================
// 种族特征面板交互
// 逻辑与政治体系面板完全对称，无额外复杂交互
// ===================================================

// --- 获取面板相关元素 ---
const racialPanel = document.getElementById('racial-panel'); // 整个面板
const racialClose = document.getElementById('racial-close'); // 关闭按钮

// --- 打开面板 ---
// id="Racial-Traits" 与 index.html 第117行完全一致（带连字符）
document.getElementById('Racial-Traits').addEventListener('click', () => {
    racialPanel.classList.add('active'); // 添加active，CSS动画从下方浮出
});

// --- 关闭面板：点击 X 按钮 ---
racialClose.addEventListener('click', () => {
    racialPanel.classList.remove('active'); // 移除active，面板收回下方
});

// --- 关闭面板：点击面板外部区域 ---
document.addEventListener('click', (e) => {
    if (
        racialPanel.classList.contains('active') &&       // 面板当前是打开的
        !racialPanel.contains(e.target) &&                // 点击位置不在面板内部
        e.target.closest('#Racial-Traits') === null       // 点击位置不是打开按钮
    ) {
        racialPanel.classList.remove('active');
    }
});

// ===================================================
// 奇观面板交互  按钮ID：Milestones
// ===================================================

const wonderPanel = document.getElementById('wonder-panel');
const wonderClose = document.getElementById('wonder-close');
const wonderScroll = document.getElementById('wonder-scroll');

// 打开面板
document.getElementById('Milestones').addEventListener('click', () => {
    wonderPanel.classList.add('active');
});

// 关闭：点击X按钮
wonderClose.addEventListener('click', () => {
    wonderPanel.classList.remove('active');
});

// 关闭：点击面板外部
document.addEventListener('click', (e) => {
    if (
        wonderPanel.classList.contains('active') &&
        !wonderPanel.contains(e.target) &&
        e.target.closest('#Milestones') === null
    ) {
        wonderPanel.classList.remove('active');
    }
});

// 滚轮滚动：阻止冒泡到地图层
wonderScroll.addEventListener('wheel', (e) => {
    e.stopPropagation();
}, { passive: true });



// ===================================================
// 移民生活指南面板 · 全部数据与交互逻辑
// ★ 粘贴位置：script.js 末尾
// ===================================================

// ===== 数据层 =====
// immigData：10条记录，每条包含 title（子选项名）和 content（原始文本）
// content 使用模板字符串存储原始 Markdown/纯文本，由 renderImmigMarkdown() 渲染成 HTML
const immigData = [
  {
    title: "灵魂摆渡协议",
        key: 'soul',  // 子选项按钮文字
    content: `


## 移民生活指南

**观星塔组织对地球公民公开信息 · 星间林地历5501年**

---

### 一、灵魂摆渡协议

灵魂摆渡协议是观星塔组织与星间林地部分主权国家联合推出的跨星际人口流动项目。

协议的技术基础是量子身份模式传输——这项技术在星间林地历5492年完成工程化，可以在生物个体死亡前的最后时刻，将其完整的意识结构以量子编码形式提取并传输至指定接收端。传输过程不可逆，不可中断，不可重复。

你只有一次机会。

协议的签署是自愿的，不限年龄，不限国籍，不限健康状况。签署后，协议在你死亡时自动触发。如果你在签署后反悔，可以在死亡前的任何时间撤销——撤销申请需要在你仍有行为能力时提交，意识丧失后无法撤销。

协议不加速你的死亡。

协议不延缓你的死亡。

它只是在你的死亡发生时，把你带走。

---

### 二、抵达

你的意识将被传输至参与项目的接收国的躯体培育仓。

培育仓会为你提供一个新的身体。身体的种族和性别由接收国根据你的生前档案进行综合匹配，匹配标准由各国自行制定，观星塔组织不干预这一过程。

你无法提前知道你会得到什么身体。

新的身体在生物学意义上是少年个体（深海联盟除外），健康状况良好，不携带任何遗传疾病。你的意识将被载入这个身体，与它完全整合。你将重新开始呼吸，重新开始感知，重新开始使用一套你可能从未使用过的感官。

这个过程有适应期。适应期的长度因人而异，因种族而异。

---

### 三、记忆

你有权保留你在地球上的全部记忆。

你也有权在抵达前提交删除申请，指定你希望删除的内容。删除是永久性的，无法恢复。观星塔组织不对删除内容做任何评判，但建议你在做这个决定时保持清醒——你在那个世界里活过的事，是你带到这里的唯一财产。

你的技能、语言能力、专业知识作为记忆的一部分会被保留，但它们能在新身体上发挥多大作用，取决于你的新身体的生理结构。一个在地球上弹了四十年钢琴的人，在得到一个有六肢的新身体之后，需要重新学习如何使用手指。

你的情感记忆会被完整保留。

你爱过的人，你失去的人，你后悔的事，你引以为傲的事——这些都会在。

---

### 四、法律身份

你将成为接收国的公民，遵守该国的一切法律，包括移民相关法律。

你不再是地球任何国家的公民。

你不会被遣返，因为没有地方可以遣返你。

你在接收国享有的权利，与该国其他公民相同，不多也不少。如果接收国是一个福利完善的民主国家，你享有完整的公民权利。如果接收国有其他的政治结构，你需要了解并适应那套结构下的生活方式。

观星塔组织建议你在签署协议之前，认真阅读本页面下方关于各参与国的说明。

---

### 五、参与国家

目前以下国家和地区参与了灵魂摆渡协议项目。接收国将根据你的生前档案进行匹配，你无法自行选择。

---

**博爱联盟共和国**

议会民主制，全民福利体系，贫富差距小。医疗、教育、基础收入均由国家保障。多种族共存，对外来人口历史上持开放态度。主要种族为三尾聆族，官方语言为博爱通用语。

政治上稳定，社会上包容。这里的人习惯在意见不同时通过投票解决问题，也习惯在路上和陌生人点头。

---

**苍神缘起帝国**

世袭君主制，当前处于政治过渡期。高福利，重视个人自由，对移民传统上持欢迎态度。各种种族的居民都有。帝国当前的政治局势较为复杂，建议关注相关动态后再做判断。

这里的人有一种不需要解释的慷慨，你来了，就是来了。

---

**凛冬合众国**

联邦共和制，与四国同盟关系密切。气候寒冷，工业基础扎实，社会秩序稳定。各种种族的居民都有，雪景极美。

这里的人不话多，但可靠。

---

**日月星列岛国度**

神权宪政制，拜泪教为主要信仰。信仰在这里渗透进日常生活的每一个角落，你必须信仰拜泪教才能享有正常公民权力。海洋环境，渔业和旅游业为主要经济形态。主要种族为思乡者。

如果你在地球上曾经有过信仰，你可能在这里找到某种熟悉的感觉。如果你没有，你会发现信仰和科技在这里以一种你不曾见过的方式共存。

---

**南海工业联合体**

工业联合体，能源和制造业为核心产业。根源发电技术的主要推进方之一。治理结构较为复杂，由多个工业财团联合运营。实用主义导向，对技术和工程人才有高度需求。

这里的人用工作来衡量价值，你在这里能做什么，比你从哪里来更重要。

---

**恩泽帝国**

中央集权帝制，国家意志高度整合。公民自出生起接入读心矩阵和团结协议芯片，集体认同感极强。医疗和基础保障完善，社会秩序高度稳定。主要种族为白尾族。

在签署协议并被匹配至恩泽帝国之前，请认真考虑你对个人隐私和集体认同的态度。这不是一个价值判断，只是一个你需要事先了解的事实：在那里，你的思维会成为一个更大整体的一部分。有些人在那里找到了从未有过的归属感。也有些人从未适应。

---

**巅峰重工工业集群**

企业国家，从出生到死亡均在企业的管理框架内运行。高度自动化，AGI深度参与社会运转。底线保障极为充足——即使完全不工作的成年公民，也能维持高质量的物质生活。合约等级制度决定你能参与的事务范围。

你在这里可以选择什么都不做，然后过得很好。也可以选择往上走，参与这个文明正在推进的某些你在地球上想象不到的事情。

---

**深海联盟**

**特别说明：深海联盟仅接收六岁以下儿童。**

如果你有六岁以下的子女，并希望他们通过此协议抵达星间林地，可由孩童的监护人代为签署协议。如果该儿童没有监护人，或监护人已死亡，深海联盟将对符合条件的儿童执行强制接收程序。

深海联盟不接收6岁以上人类。

关于深海联盟的社会制度，请参阅本网站其他页面。

---

### 六、你需要知道的事

**星间林地的重力是地球的1.9倍。**
你的新身体是为这个重力设计的，你不会因此受伤，但你会感觉到它。这颗星球比地球更用力地把你往下拉，很多人说，这种感觉在最初的几个月里像是一种提醒：你在一个真实的地方。

**你的地球语言在这里是外语。**
你的记忆里有你会的所有语言，但没有人懂它们。接收国提供语言学习支持，通常通过神经接口技术加速——这个过程比你在地球上学外语快得多，但仍然需要时间。

**你认识的人不在这里。**
除非他们也签署了协议，并且恰好被分配到了同一个国家。观星塔组织不协调家庭的共同安置，各国有各自的匹配逻辑。如果你最在意的事情是和某个人在一起，那么你需要知道这件事在协议层面是无法保证的。

**你不会死于你在地球上的死因。**
你的新身体没有携带那些病，没有那些伤，没有你在地球上被磨损的那些部分。你会以一个完整的身体，重新开始衰老。

**这个星球有你没有见过的东西。**
有上位元素，有灵气，有根源场，有世界树，有各种你在地球的任何文化里都没有对应词的事物。你的地球知识会让你理解这里的很多东西，也会在某些地方完全失效。这不是问题，这只是这里和那里不同。

---

### 七、关于"为什么"这个问题

我们不打算回答为什么你应该来，或者不应该来。

我们也不打算告诉你这里更好，或者那里更好。

你在地球上活过的那些年，是真实的。你在那里爱过的人，是真实的。你在那里失去的东西，是真实的。协议不改变这些，协议只是在那些事情全部发生完之后，给你一个继续的选项。

你来不来都可以。

如果你选择来，你会在某一天，在一个你没有选择的身体里，在一个你没有选择的国家里，睁开眼睛，闻到一种你从来没有闻过的空气的气味，感受到1.9倍重力把你的新身体压向一颗你从未踏上过的星球。

然后你就在这里了。

接下来怎么做，是你的事。

---

你可以通过本页面的其他选项了解参与国的普通人的真实生活状态。
是的，我们不在乎精英的生活状态，我们在乎普通人的生活状态。我们不在乎政治家的生活状态，我们在乎工人、农民、服务业从业者、学生、退休人员的生活状态。

*本页面内容由观星塔组织整理，定期更新。*
*如有疑问，观星塔组织不提供个人咨询服务。*


---

*· 星间林地历5501年 · 观星塔组织 ·*`
  },
  {
    title: "博爱联盟共和国",
        key: 'fraternity',  // 子选项按钮文字
    content: `

**《锚城，普通的一天》**

---

**一**

林槐每天上班要换两次轨道。

从他住的第十四居住区出发，先坐内环快线到中央货运站，然后换乘去往太空塔基区的专线，总共二十二分钟，如果不堵的话。

锚城有自己的公共交通系统，这不是废话，是林槐第一次来这里的时候确实需要花时间适应的事实——他在博爱大陆北部的小城市长大，那里的公共交通是县市级的，跑半个小时能到的地方已经是"跨区出行"了。锚城的内环光轨全长约两百一十公里，绕城一圈，途经工业区、居住区、港口区、商业核心区和教育医疗集中区，运行频率是每3分钟一班，这条线路的设计运力已经是博爱大陆多数二线城市主干线的两倍，但早高峰还是会坐满。

今天没有挤。今天他赶上了一个不知道为什么的空档，上车的时候座位空了一半，他在靠窗的位子坐下，把工具包放在腿上，把头靠在窗玻璃上，看外面。

第十四居住区在锚城的西北方向，属于城市的老区——所谓"老"，是说这里是锚城扩建序列里最早的一批居住用地，距今大概有一百五十年左右，建筑风格和城市其他地方不太一样，没有那种为了容纳大量人口而设计的高密度塔楼，更多是四到六层的中低层，外墙颜色偏暖，有一种被时间磨出来的质感。

林槐住在这里八年了，是他到锚城工作之后租的房子，一直没换。理由很简单——房子够住，租金在博爱同盟全民基本住房补贴的覆盖范围以内，走路三分钟有一家他喜欢的早餐店，楼下邻居是个不屈民老奶奶，活了三十八岁，在整个街区都是出了名的见多识广，虽然林槐跟她说话的时候要蹲下来才能对视，但他觉得跟她聊天比跟大多数博爱大陆来的同龄人聊天更有意思。

轨道车穿过居住区，进入工业带。

窗外的风景切换了——低矮的住宅消失，代之以大型厂房、管道网络、货物堆场、密集的工业设施，偶尔有几根高耸的排气管，顶端闪烁着红色的警示灯，在清晨的灰色天空里显得很突出。林槐看着这些东西，有一种他习以为常的平静感，就是他的城市的一部分，就是他每天经过的地方，就是这里。

然后轨道车转了一个弯，太空电梯出现在窗外。

---

他不是每次都特意去看它的，有时候坐在左侧就看不见，有时候在想别的事没注意，有时候天气不好能见度差。但今天他靠在右侧的窗口，角度正好，能从这个方向看见一号塔的主体结构——一根从城市中央垂直升起的、比任何建筑都更细、也更高的东西，细到和它的高度相比几乎不成比例，但你又能感觉到它不是细的，因为当你骑车经过它脚下的时候，你要仰头仰到脖子酸才能追踪到它消失在天空里的地方。

---

**二**

天之塔集团一号塔地面终端的主作业区，在城市核心圈的内侧，紧挨着电梯主体结构。

林槐所在的部门叫做**舱体维护二组**，负责对一号塔的上行和下行电梯舱在每次运行之后的检查、维护准备工作。这是一份体力和细心并重的工作，交接班制度，每班7小时，每个工作周工作四天休息三天，这是上一次工会谈判的结果，在那之前是五天和两天。

他们的工作区在电梯舱停靠平台的地面层，当一个舱次完成下行、舱体停靠之后，舱门打开，乘客或货物离开，然后维护组进入，按程序逐项检查，有问题标记和处理，没有问题清洁、补充、重置，最后完成签字放行，舱体才能进入下一个上行准备流程。

听起来像机场地勤，但不完全一样。这个星球的电梯舱体是在1.9G的重力环境里反复承受从零到近轨道高度的巨大压力变化的结构，每次运行结束之后的检查不是例行公事，是真实的安全确认，有严格的清单，每一项都有标准，偏差超过阈值就进修复流程，进了修复流程这个舱体就得退出排班，影响整个系统的吞吐量。

天之塔在这件事上的态度，林槐入职第一天就感受到了——操作手册有多厚，对安全的要求就有多认真。

他在这个岗位上工作了八年，手册上所有的检查项目他不用打开文件就能默写出来，顺序、标准、偏差判断方法，全都在肌肉记忆里。

这不是他特别努力的结果，是他在这个岗位上待了八年之后的自然结果。

---

今天的值班组是六个人。

除了他，还有：

肯，不屈民，二十四岁，在锚城出生，父母是三代移民，个子很小，皮肤白皙，反应极快，能同时处理的信息量让林槐每次看了都感到一种不服气的钦佩。他在这个岗位上工作了两年，但已经拿到了高级技师认证，理由是他发现了一个手册上没有明确规定的结构疲劳判断方法，后来被写进了更新版的操作规程里。他名字是锚城本地起的名字，没有飞升大陆的族谱名，他说他懒得改，"肯"这个音节顺口，就一直用着了。

克劳斯，深海联盟技术派驻，三十一岁，轮换合同第二年，专攻密封系统的精密检测，不怎么说话，工作的时候完全不说话，下班之后有时候在休息室坐着看技术文献，有时候对着什么东西发呆，林槐从来没搞清楚过他在发呆的时候在想什么，也没有真的问过，因为他感觉如果他问，克劳斯会用他那种中性的、没有任何情绪信号的方式回答一个他完全听不懂的答案，然后他们两个都会觉得很尴尬。

其余三人是他认识但不算特别熟悉的同事，两个博爱同盟本地人，一个来自博爱大陆东南部的三尾聆族，三条尾巴在工作服里收得很整齐，她每次进舱检查的时候动作比所有人都轻，像是在某种她单独一人掌握的方式里移动。

组长是一个叫秀的白尾族女人，四十多岁，在锚城待了将近二十年，白色长尾已经有几根杂了灰色，声音很低，从来不大声说话，但整个组在她走进作业区的时候会有一种隐性的秩序感出现，就像一个空间的焦点突然清晰了。

---

今天的第一个下行舱是七点零五分停靠的，载货，上一个班次做了初步清洁，林槐他们负责精检和放行。

林槐进入舱体的时候，先在入口站了一秒钟，闭眼，让自己从刚才轨道车上的半梦半醒状态完全切换过来。

他的前任老组长，一个在这个岗位上干了二十七年的白尾族老人，退休之前给他说的最后一句话是：每次进舱之前，把昨天的所有事留在外面。不是因为那些事不重要，是因为如果你把它们带进来，它们会占用你应该用来看眼前这个东西的那部分注意力。

他一直记得这句话，一直在做这件事。

然后他睁眼，打开检查设备，按流程开始。

---

**三**

十二点，交班休息。

林槐走出作业区，在主楼门口站了一会儿，吹了会儿风，然后往餐厅方向走。

天之塔一号塔的员工餐厅在主楼的第三层，面积不小，朝南的那侧是全玻璃幕墙，能看到城市中区的一片天际线，以及在正中央，那根柱子的下半段——它就在那里，从这个角度看，离得不远，甚至能看见它外表面的一些结构细节，但它的尺度还是让林槐每次在这个玻璃墙前吃饭的时候都会有一瞬间的轻微不适，像是他的大脑在某个地方还没有完全把它归类进"正常的城市背景"这个文件夹里，每次都要重新确认一次。

他端着餐盘找了个位子坐下，旁边是肯，已经吃到一半了，嘴里还有东西，眼睛在看一个他自己带来的小型检测仪，手边摊着笔记，在写什么。

"你中午还在干活？"林槐问。

"不是，"肯吞下去，说，"这是我自己的东西，和工作没关系，我在研究一种在高差压环境下判断复合材料微裂纹的新方法，想看看理论上有没有可能用声学参数代替现在的接触式探测，这样检查的时候可以快一倍。"

林槐看了眼那个小仪器，然后看了眼肯，说："这是你自己想出来的还是有人委托你研究的？"

"我自己想的，"肯说，"如果有结果我会写成报告交给工会的技术改进委员会，工会可以跟公司谈，如果公司采用了，有专利共享条款，我能拿到一部分收益。"

林槐想了一下，说："你现在二十四岁，干这行两年，就在想怎么改进检测方法。"

"对，"肯说，眼睛已经回到仪器上了，"因为现有方法有一个效率瓶颈，看到瓶颈就想改，很自然的事。"

林槐没有再说什么，开始吃饭。

他想起他二十四岁的时候在做什么——在博爱大陆的一个工厂里装配光元素芯片，工作稳定，收入中等，医保和退休金国家出，住房补贴按时到账，这些都没有问题，但他不记得他那时候在想什么，大概是在想下班之后去哪里，在想周末做什么，在想那个他后来分手了的女孩。

他不知道这是好还是不好，他那时候过得也不差，只是和肯过的是两种不同的二十四岁。

也许两种都对。

---

克劳斯后来也坐过来了，端着一份他总是点的那种没什么特色的套餐，在林槐对面坐下，没有说话，开始吃。

三个人坐在一起吃了大概十分钟，然后克劳斯放下筷子，说了一句话，这在他们组里属于罕见事件，因为克劳斯在非技术场合主动开口的频率大约是每天一次，有时候更少：

"今天早上那个舱体的第七密封环，你们有人注意到吗？"

林槐想了一下，说："边缘有轻微磨损，在阈值内，我标了观察，没有升修复级别。"

"我知道，"克劳斯说，"我也看了，阈值内是正确的判断。但磨损的方向和正常摩擦磨损不一样，是斜向的，可能意味着舱体在某一段运行区间有轻微的侧向振动。"

林槐在脑子里把那个细节重新调出来，想了一下，说："你有没有把这个记录下来？"

"记了，同时对比了这个舱体过去三个月的所有检查记录，有四次出现过类似的磨损方向，但每次都在阈值内，所以没有被标记关联。"克劳斯说，"我今天下班之后会整理成报告，发给舱体系统工程组，建议他们做专项分析。这不是我职责范围内的事，但我认为值得有人看一眼。"

沉默了几秒。

肯抬起头，认真地看了克劳斯一眼，说："你这个方法如果是对的，用声学参数来检测侧向振动留下的磨损特征，比接触式探测的分辨率高一个数量级。"

克劳斯看了他一眼，说："你在研究声学检测？"

"是，"肯说，"理论阶段，还没有原型。"

克劳斯点了一下头，然后从口袋里拿出一张名片，推到肯面前，说："你做出原型之后联系我，我有一些深海联盟那边的数据库可能对你有用。"

肯接过名片，看了一眼，说了声谢谢。

然后三个人继续吃饭，没有再说话。

林槐看着这个小小的交换，想，这就是锚城的某种日常——两种在很多事情上逻辑完全不同的人，因为对同一件技术问题感兴趣，在一个餐厅里用五分钟完成了一次对话，然后各自回去。

这不需要任何人去推动，也不需要任何人去设计，它就是自然发生的。

---

**四**

下午的班次里，出了一件事。

一个下行舱在停靠之后，林槐在例行检查里发现了一处非正常状态——不是设备问题，是舱体内部的货物固定架上有一处撞击痕迹，不在检查清单的常规项目里，但足够明显，明显到他不能假装没看见。

固定架本身没有损坏，货物舱次记录显示这批货物是一批来自轨道制造平台的返修组件，重量在正常范围内，但林槐把撞击痕迹的位置和方向记录下来，对照了一下这批货物的固定方案，发现那个位置如果在运行中发生位移，理论上不会造成安全问题，但意味着装载程序在某一步可能存在偏差。

他把这个发现记在工作日志里，标了"建议复核装载流程"，发给了今天的值班主管秀，同时抄送了货物装载组的主管接口。

秀十分钟后回复说：收到，我转给装载组做调查，你今天的记录很详细，谢谢。

林槐回复：正常工作。

然后他继续下午的检查队列。

这件事在流程上很清楚，他发现了，记录了，上报了，后续是别人的职责范围，他不需要追问结果，也不需要担心他的上报会不会被重视——天之塔在这件事上的机制他已经了解了八年，有问题报上去，就会有人处理。不是因为公司特别好，是因为公司知道这条电梯出了事情谁也负不起那个责任，所以在安全问题上的处理机制是真实有效的。

他喜欢这种清晰。

你的职责是这里，你把这里的事做到你能做到的程度，边界以外的事有边界以外的人处理。

不是冷漠，是秩序。

---

14点，换班前夕，林槐在休息室坐着，喝了一杯水，刷了一下今天的博爱同盟公共新闻。

头条是议会关于本年度轨道经济收益分配方案的审议进度，天之塔作为轨道经济的核心运营方，其上缴的国家收益如何在各加盟国之间分配，是每年都会有的争议。林槐看了几段，没有看完，因为那些内容他大致已经理解，具体数字会变，但争议的结构每年差不多——东南部的加盟国认为他们距离1号塔更近，应该获得更多收益；北部的认为2号塔在他们区域内，同样有理由；工会在这个问题上的立场是要求一部分收益以公共基础设施投入的形式定向流回锚城所在的礁区，而不是全部进入中央财政再分配。

林槐每次读到这些就感到一种复杂的、不是很热情但也不冷漠的参与感——这件事和他有关，他的工会代表在议程上，他上一次工会内部投票的时候投了支持礁区定向投入的那个提案，那个提案最后以不算压倒性但真实的多数通过了。

具体会落地多少，什么时候落地，他不知道，但他知道他的那一票是真实的，那个过程是真实的。

他把新闻关掉，开始整理今天的工具。

---

**五**

交班，出楼，走向轨道车站。

这段路大约七分钟，他走得很慢，因为不着急。

路上他经过了1号塔外围的开放公共区域，那是一片他平时不常走的地方，今天走过是因为顺路，也因为他偶尔想换条路看看。

外围区是锚城居民和游客都可以进入的区域，不需要工作证件，有一定的安全隔离，但视角很好——从这里可以在最近的距离看见1号塔的下端结构，那根柱子在你眼前的尺度会让你的视觉系统暂时失去参照。

今天这里有几个游客，一家三口，看样子来自博爱大陆，孩子大约十岁，仰着脸，嘴张开，手指着天空。父母站在旁边，大人的表情是那种成年人试图共情孩子的震撼但已经提前用理智处理过一遍的表情，孩子的表情没有任何处理，就是震惊，身后的尾巴兴奋的甩来甩去。

林槐在不远处停了一秒，看了这家人一眼，然后看了一眼他工作了八年的那根柱子。

他试图用那个孩子的眼睛看它。

做不到，那种感觉已经磨平了，已经是背景了，已经是他城市的一部分了，他不记得他第一次看见它的时候是什么感觉，也许他从来没有真正体验过那种感觉，也许他当时有，但被七年的日常稀释干净了。

他想，这大概没有什么问题。

那个孩子今天的震撼是真实的，他今天的平静也是真实的，两件事都是真实的，只是出现在不同的时间点，关于同一样东西。

他继续往轨道站走。

---

回程的路上，他绕去了楼下老奶奶那里，按门铃，问她今天需不需要带什么东西，这是他每个月会做几次的事，不是固定的，是他路过的时候顺手。

老奶奶开了门，说不用，然后说，正好你来了，你上次说想知道锚城礁区填海之前这里是什么样的，我今天整理东西找到一张老照片，你要不要看。

他进去了，坐在她那间摆得满满当当的小屋里，接过那张照片。

照片里是礁区在大规模建设之前的样子，全是海，海面上几块礁石，一艘小船，远处什么都没有。

"这是我父亲的父亲的父亲那一辈留下来的，"老奶奶说，"那个时候这里没有锚城，没有电梯，只有这些石头，还有我们不屈民家族里有几个人，跟着第一批建设队伍来，最后留下来了。"

林槐看着那张照片，看了很久，把照片里那片空海和他每天上班路过的工业带叠放在一起，中间有一百多年，有几代不屈民，有他老奶奶，有她说的那些人，有他自己这八年。

"你们家族里的人后来怎么样了？"他问。

"怎么样了就是怎么样了，"老奶奶说，语气是那种三十八岁见过很多事的人才有的平静，"打桩的人死了，建楼的人死了，开店的人死了，生孩子的人死了，孩子再生孩子，我就是那个孩子的孩子的孩子。我在这里生，将来也在这里死，就是这里。"


林槐把照片还给她，说谢谢，然后回了楼上自己的房间。

---

他坐在窗边，窗外是第十四居住区的夜晚。

不远处能隐约看见1号塔在夜色里的灯光，那些灯光是结构性的，沿着塔体的维度一层一层往上，越高越小，直到消失。

他今天做了什么？

检查了二十七个舱体，发现了一处异常，完成了正常的上报和移交，吃了一顿午饭，听了肯讲声学检测，看了克劳斯把名片推给肯，在回程的路上看了一张照片。

没有什么大事，也没有什么戏剧性，只是一天。

他的工作是检查电梯舱体，确认它们在进入下一个运行周期之前是安全的，这件事的意义不需要他每天去感受，就像他腿上不再有重力带来的酸意，他不再需要每天意识到这份工作的意义才能有理由去做它。

他只是每天去，每天做，做到他能做到的程度，然后回家。

这颗星球每天从这里往轨道送出去的货物，加上2号塔，加上其他文明的发射设施，那个总量是一个他说不清楚大小的数字。他不知道那些货物里有多少他检查过的舱体运过去的，他也不知道如果他哪一次没有看到那种不在检查清单里的磨损痕迹，最后会不会真的发生什么。

他不需要知道。

他只需要每次进舱之前把昨天的事留在外面，然后睁眼，看眼前这个东西，把它看清楚。

---

他的终端震动了一下，是肯发来的消息，时间已经接近午夜35点钟了：

*今天谢谢你提那个问题，我和克劳斯交换联系方式之后聊了两个小时，他给了我一个我之前没有想到的角度，我觉得这个方向可行，我打算认真做。*

林槐看了这条消息，回了一句：

*加油，做出来了告诉我。*

然后放下终端，关灯，在礁城夜晚那种混合了海风、金属、工业气息和某种林槐说不清楚是什么的城市气味里，闭上眼睛。

明天换班，下午班，可以睡到自然醒。

---

*宋野的货运协调记录里，那四件先驱者大陆的门廊石最终进入了轨道分馆的展厅。*

*林槐从来没有去看过，不是因为不感兴趣，是因为他的工作证权限够不到那个展厅，而他在休假期间去轨道分馆参观需要提前1个月预约，他每次想起来都忘了提前1个月。*

*肯的声学检测方案在三年后完成了原型，被工会技术改进委员会提交给天之塔，最终被采纳为可选检测方式之一。克劳斯在他的第二份驻场合同到期后回了深海联盟，但他留下的那份分析报告被纳入了舱体系统年度维护指引的更新版本。*

*楼下的老奶奶在林槐来锚城的第十一年去世了，三十八岁，在她的床上，在第十四居住区，在那间摆得满满当当的小屋里，旁边是她的两个孩子，那两个孩子是她有史以来见过的和将要见到的所有的明天。老奶奶没有签署任何飞升协议或者重生协定。*

*老照片被她的大女儿保存下来了。*

*礁城还在。*

*电梯还在运转。*

*每天。*`
  },
  {
    title: "苍神缘起帝国",
        key: 'allife',  // 子选项按钮文字
    content: `

**《此处有人住过》**

---

**一**

投票在七天后。

阿尔坎在镜子前站了很长时间，看着自己的脸。

他今年六十一岁，按照他出生的那个地方的标准，这已经是一个老人了。但他在苍神缘起帝国住了三十八年，帝国的医疗体系让他的身体比实际年龄年轻将近二十年，他的面孔是一张五十岁不到的面孔，头发有一半是白的，另一半还是深色的，像是身体在两种时间里各住了一半。

镜子里的他看起来不确定。

他转过身，去厨房烧水。

窗外是苍神缘起帝国的首都，晴天，能见度很好，远处的山脉清晰得像一幅画。他三十八年前第一次站在这扇窗前，也是这样的天气，那时候他二十三岁，身上只有两件换洗的衣服和一个装满文件的背包，把这座城市看了很长时间，然后喉咙里涌上来一种他那时候还不知道该叫什么名字的东西。

后来他知道了。那叫做安全。

不是那种什么都好的安全，而是一种更基础的安全——我可以在这里犯错，我可以在这里失败，我可以在这里不同意别人，明天醒来还会在这里。

他在那个时候不知道这种感觉有多罕见，因为他还没有在其他地方活得够久。后来他知道了。

---

阿尔坎来自一个他现在很少提起名字的地方。不是因为他不记得，而是因为每次他提起来，对话就会陷入一种特定的轨道——对方会说"那一定很辛苦"，或者"你能来这里真好"，或者更糟的，问一些关于他"逃出来"的细节，好像他的过去是一个可以被消费的故事。

他不想成为一个故事。他只是一个人，住在第七区，做室内植物培育工作，每周三去区里的语言交流中心帮新来的移民学帝国通用语，每周日早上去市场买菜，偶尔喝一点酒，不多。

他在这里有了一个妻子，然后失去了她——十一年前，心脏的问题，帝国的医疗系统尽了力，但有些事情不是医疗能解决的。她也是移民，来自另一个地方，两个人的故乡不同，但有一种东西是相同的，那就是他们都在二十多岁的时候坐上了前往苍神缘起帝国的交通工具，都在这里睁开眼睛，看着陌生的城市，心里升起同一种感觉。

他们没有孩子。这是他们当年商量过的决定，因为他们来的时候都太轻了，轻得以为自己随时还会走，不敢把孩子生在一个自己也不确定会不会一直在的地方。

后来他们就一直在了，但孩子没有生。

这是他唯一真正后悔的事。

---

**二**

他的邻居叫做华英，比他小十五岁，是在苍神缘起帝国出生的第二代移民，父母来自一个阿尔坎也知道的地方——那里这几年越来越难离开了，华英的父母在三十年前出来，算是赶上了最后一班宽松的列车。

华英在帝国的教育体系里长大，说三种语言，在第七区开一间小小的茶馆，是那种不以盈利为主要目的的茶馆，只要你愿意坐下来，他就给你倒茶，聊不聊都行。

这家茶馆是第七区的某种精神中心，各种人会来——老移民，新移民，土生土长的帝国公民，偶尔有研究者过来做田野调查，也有记者过来采访，华英对所有人都一视同仁，倒茶，点头，听。

阿尔坎今天上午去喝了一杯。

茶馆里有另外三个人，一个是刚来不到一年的年轻女孩，来自赤潮同盟，眼睛还有那种新来者特有的东张西望；一个是阿尔坎认识的老面孔，在第七区住了快五十年的居云者，很少说话，但总是在；还有一个他不认识的中年男人，穿着帝国公民的日常服饰，坐姿很放松，看起来像是在这里住了一辈子。

投票的事没有人主动提，但它悬在空气里，像一种气压的变化。

华英给阿尔坎倒了茶，用眼神问他最近怎么样。阿尔坎用耸肩回答，这是他们之间发展出来的一种无声语言，耸肩的意思是：说不清楚，但还在。

还在，在这个时候，是一个重要的词。

---

那个年轻的女孩最先开口。她的帝国通用语说得磕磕绊绊，但很努力，把每一个词都放在正确的位置，像是在走一条她还不完全熟悉的路，走得很仔细。

"我想问一件事，"她说，"关于投票。"

没有人反对，所以她继续说。

"如果变成共和国，对我们……"她停了一下，找词，"对移民，会有什么变化吗？"

华英把茶壶放下，想了一下，说："法律层面，移民的基本权利受宪法保护，无论帝国还是共和国都不会改变。"

"那实际上呢？"

华英没有立刻回答。

阿尔坎在自己的茶杯里看了一会儿，然后说："实际上不知道。"

这句话让那个女孩皱了一下眉头，但阿尔坎继续说。

"我在这里三十八年，"他说，"帝制从来没有让我觉得不安全，但我也不能告诉你共和国会让你不安全。我不知道，因为还没有发生过。我唯一知道的是，这里之所以是这里，不是因为它的政治形式，而是因为曾经有一个人，在一个没有人这样做的时候，决定让所有人都可以进来。"

那个女孩安静了一会儿。

"那个人，"她说，"是黯王？"

"是黯王。"

---

**三**

阿尔坎下午去了植物培育室，那是他工作的地方，也是他在失去妻子之后慢慢找回来的一种平静。

植物不在乎你从哪里来。它们只是生长，或者不生长，这取决于光和水和土壤，而不取决于你的档案上写着什么地方出生。阿尔坎觉得这是一种公正，虽然它不是那种大写字母的公正，只是一种很小的，每天都在发生的公正。

他今天要处理的是一批从精灵大陆进口的特殊植物种苗，通过精灵之桥来的，价格很贵，但帝国的植物研究委员会每年都会申请一批，用于研究。这些植物在精灵大陆的生长条件下可以存活几百年，移植到别的地方之后寿命会大幅缩短，但仍然比本地品种长得多。

阿尔坎戴上手套，把第一株取出来，放在培育台上。

植物的根系很复杂，像是在土壤里写了一段很长的话，只是没有人能读懂。他把它固定在新的介质里，调整了一下光照角度，然后在记录本上写下今天的日期和操作内容。

窗外，城市在下午的阳光里很安静。

他想到了投票。

他想到了自己是不是应该投票。他是帝国的永久居民，按照法律，居住满20年的外籍居民在地方公投中有投票权，但这次的投票是帝国有史以来级别最高的，关于政体本身的，法律对这种级别的公投中外籍居民的投票资格有争议，正在法院审查。

也就是说他可能没有投票权。

他把这件事放在心里翻了翻，然后发现一件让他轻微惊讶的事：他对有没有投票权本身没有什么强烈的感受，他真正在意的不是能不能投，而是不知道结果会是什么。

他意识到这种在意不完全是对自己的处境的在意，有一部分更古老，更不理性——他不想看见这里变成他曾经离开的那些地方。不是因为共和国一定会变成那样，而是因为他在二十三岁的时候曾经在某个地方亲眼看见一件事：一个很好的地方，在很短的时间里，变成了另一种东西。

那种速度让人来不及反应。

他那个时候走掉了。但他不想再走了，他已经六十一岁，他已经把这里叫做家叫了三十八年，他不想再重新学习什么地方可以是家。

---

下午快结束的时候，第一皇女的公开行程出现在帝国的公共频道里。

这不罕见。第一皇女不是那种深居宫殿的统治者，她的行程有相当一部分是公开的，有时候她会出现在城市的某个角落，参加某个普通的公共活动，不带大规模护卫，只有两三个随行，像一个普通的年轻人。

但她不是普通的年轻人。

阿尔坎记得，在他刚来的那一年，她还是一个十几岁的孩子，在帝国的公共教育体系里上学，偶尔会出现在新闻里，那时候的报道方式都很小心，像是在描述某种珍贵而易碎的东西。

然后那一年发生了外星利维坦的事。他记得那一天，帝国的预警系统在凌晨两点响起来，整个城市的灯光都亮了，街上有人跑，有人站着，有广播在说不要惊慌，情况正在处理中。

情况在处理中，是因为那个十七岁的孩子，第一皇女，带领着军队去处理了。

阿尔坎当时在自己的公寓里，抱着膝盖坐在角落，等着，不知道在等什么。他在他来的那个地方曾经经历过一次不知道在等什么，结果等来的是一场清洗，他比很多人幸运，他等来的是一张可以离开的机票。

那一次他等来的是：危险已解除，请居民正常休息。

他当时哭了，在那个角落里，一个人，哭了很长时间。

他说不清楚为什么哭。

---

今天频道里的画面是第一皇女在第三区的一个老年社区里，参加一个普通的社区午餐。她坐在一张大桌子旁边，旁边是各种各样的老人，来自各种各样的地方，她低着头，好像在认真听旁边一个老太太说话。

没有演讲，没有姿态，没有那种政治人物特有的被观察的表演感。

只是坐着，听。

帝国的媒体对这个画面的评论是分裂的——支持共和制的媒体说，看，她是个好人，但好人不等于应该永远是最高领导人，这不是民主的逻辑；支持现状的媒体说，这就是这个国家的气质，这种气质是黯王留下的，是不能轻易丢掉的。

阿尔坎把两边都看了一遍，然后关掉了频道。

他觉得两边说的都有道理，而两边说的都不是他真正想说的那件事。

他想说的那件事很难用语言表达，它不是关于民主还是帝制，不是关于第一皇女是好人还是坏人，不是关于四国同盟会不会解体。

它是关于那个三十八年前的二十三岁的自己，带着两件换洗衣服，站在这座城市的边缘，感到安全。

那种感觉从哪里来的？

---

**四**

晚上，阿尔坎去了一个他不常去的地方。

是帝国的公共纪念广场，在城市中心，建立于苍神缘起帝国建国之初，已经有将近五百年的历史了。广场很大，中央有一棵真正的树，不是世界树的分支，只是一棵普通的树，但已经活了将近五百年，树冠覆盖了半个广场。

阿尔坎记得，帝国的历史资料里说，这棵树是在建国之初种下的，种树的人是黯王，种树的时候没有任何仪式，他只是拿了一株树苗，在广场中央挖了一个坑，种进去，浇了水，然后去做别的事了。

树就一直长着。

广场里有人，但不多。一些年轻人坐在树下，有的在说话，有的各自看自己的东西。一个老人在广场边缘慢慢走，拄着一根手杖，走得很稳。几个孩子在跑，不在乎树或者广场或者任何历史，只是跑，因为腿可以跑。

阿尔坎找了一个长椅坐下来。

他没有特别的目的，只是觉得今天应该在这里待一会儿。像是某种他说不清楚的需要，不是仪式感，不是纪念，更接近于一种确认——确认这里还在。

树叶在晚风里发出轻微的声音。

这棵树在这里见过什么？见过建国之初的混乱，见过那场让第一皇女一个人去面对外星利维坦的凌晨，见过几百年里来来去去的移民潮，见过黯王的背影——最后一次是什么时候？他出发去执行那次探索任务的时候，有没有在这里停留过？

没有记录，阿尔坎不知道。

但他知道树还在，因为树不会去任何地方，它的任务就是把根扎进土里，把枝伸向天空，然后在这里见证所有经过的人。

---

一个年轻人在长椅的另一端坐下来，看了阿尔坎一眼，点了个头，然后继续看他的手里的东西。

过了一会儿，年轻人开口了，说的是帝国通用语，但口音有一点阿尔坎听出来了——是博爱联盟那边的口音，轻微的，但在。

"老前辈，"他说，"你在这里住很久了？"

"三十八年，"阿尔坎说。

年轻人点头，沉默了一会儿，说："我刚来两年，还没搞明白很多事。"

"什么事？"

"这里的人对投票的态度，"年轻人说，"我在博爱联盟长大，民主那套我从小就理解，投票这件事在我们那里很正常，但我发现，在这里，很多老移民对投票有一种……我说不准，不是反对，更像是一种担忧，但他们担忧的方向和我想的不一样。"

阿尔坎看了他一会儿。

"你担忧什么？"他问。

"我担忧共和国之后民粹会抬头，"年轻人说，很直接，这是博爱联盟来的人的特点，他们习惯把话说清楚，"那些对外来者不友好的声音，在民主框架下可能会找到更大的出口。"

"这是一个真实的危险，"阿尔坎说。

"那老移民们担忧的是什么？"

阿尔坎想了一下，想了很长时间，把脑子里说不清楚的东西努力整理成语言。

"你知道这里为什么是这里吗？"他最后说，"不是因为这里有好的法律，不是因为这里有好的医疗和教育，虽然这些都有。是因为在很久以前，有一个人，在没有任何人要求他的情况下，做了一个决定：所有人都可以来。"

年轻人等着。

"那个人不是被选出来的，"阿尔坎说，"他不需要赢得任何人的投票才能做这个决定，也不需要担心他的决定在下一次选举里失去支持。他就是决定了，然后这里就变成了这样。"

"所以你认为民主会改变这个？"

"我认为，"阿尔坎慢慢说，"在一个每隔几年就要重新计算民意的系统里，善意需要持续地得到多数人的支持才能存在，而善意不是总能得到多数人支持的。"

年轻人沉默了很长时间。

"但是，"他说，"依赖一个人的善意，本身就是不稳定的。那个人失踪了，善意就悬在那里，没有任何制度保证它能继续。"

"是的，"阿尔坎说，"你说的也对。"

他们两个都不再说话了。

树叶在头顶继续响，风从城市的某个方向来，带着一点夜晚的凉意。

---

**五**

回家的路上，阿尔坎经过了一面墙。

他每次经过这面墙都会停一下，今天也是。

这面墙在第七区和第八区交界的街角，是一面普通的建筑外墙，大约三米高，二十几米宽，完全被各种各样的字覆盖——不是涂鸦，不是官方标语，是很多年来很多人用很多种语言留下的话，有的用笔写，有的用刷子刷，有的好像是用手指沾着颜料写的，有的字体工整，有的字体潦草，有的已经开始褪色。

没有人知道这面墙最早是谁开始写的。反正某一年就有了第一句话，然后其他人看见了，觉得可以，就继续写。帝国的城市管理部门来检查过，说这面墙不违反任何法律，然后就让它继续在那里了。

阿尔坎站在那里，用眼睛扫过那些字。

他认识其中一部分语言，另一部分他不认识，但有人在每种语言旁边用帝国通用语标注了翻译，所以都能读懂。

*我从一万公里外来到这里，我的孩子第一次不用害怕*

*这里的医生看完我说，你以后不用再担心这个了，我一个人在诊所外面站了很久*

*我在我的国家因为喜欢一个男人而差点坐牢，在这里我们结婚了*

*我妈妈没有来得及来，我替她来了，我替她好好活着*

*我不会说这里的语言，但我的邻居每天早上在门口等我，带我去买菜*

*我以为我会一直记得回去，后来我发现我已经不记得了，但我不难过，因为这里是真实的*

阿尔坎在这面墙上也写过一句话。

是在他妻子去世那一年写的，找到她的那句话用的语言，她的故乡的语言，那门语言他学了一半，会说，会写，但写出来的字不好看。

他的那句话现在被其他人的字盖住了一部分，只能看见一半，另一半不见了。

他知道那一半写的是什么，所以没关系。

那句话的意思是：她在这里爱过我，这就够了。

---

他在那面墙前站了很长时间，比平时更长。

他在想一件他以前没有想清楚的事——这面墙是什么？它不是纪念碑，不是档案，不是任何官方的东西。它只是一面墙，上面有很多人留下的一句话。

但如果你站在这里读它，你会知道一件事：这里曾经接住了这些人。不是一个人，不是一种人，是各种各样的人，带着各种各样的重量，从各种各样的地方来，然后在这里放下了一些他们在别处放不下的东西。

这是一种已经发生了的事实。

它已经发生了，所以投票的结果改变不了它。共和国或者帝国改变不了它。这面墙上的字是真实的，那些人的故事是真实的，那种被接住的感觉是真实的。

它不会因为黯王失踪而消失，因为它已经发生了。

历史不可以被取消。

---

阿尔坎抬起头，看着那面墙最顶端。

那里有一句字，是用帝国通用语写的，字迹比其他所有字都大，应该是最早写上去的那句之一，油漆已经褪得很淡，但还能看见。

*此处有人住过。*

只有这五个字，没有名字，没有日期，没有来自哪里。

阿尔坎读了这句话不知道多少次，每次都觉得它有一种他说不准的重量。

今晚他站在这里，投票前七天，城市在他背后安静地运转，树叶在某个广场的树上响着，四个皇女在帝国的某个地方各自活着，一支舰队在星图上的某处不知道漂向哪里——他看着这五个字，忽然明白了它为什么重。

因为它是现在时。

不是"此处曾经有人住过"，不是"此处将会有人住过"，是此处*有*人住过。

有，是一个不会消失的时态。

它在说：我们在这里存在过，这件事是确凿的，是完成了的，是任何事情都拿不走的。不管接下来发生什么，不管投票结果是什么，不管四国同盟变成三国还是继续是四国，不管黯王在哪里或者是否还会回来——这件事，这里有人住过，这里接住了那些人，是已经发生了的事实，放在历史里，再也不会移动。

阿尔坎在那面墙前站了很久，直到背后的路灯亮起来，城市进入了它的夜晚。

然后他转身，走回家。

---

**六**

四十八点一比五十一点九。

共和派以微弱差距落败。

差距小到让所有人都沉默了很长时间。

不是因为意外，而是因为那个数字本身说明了一件事：这件事没有结束，只是这一次没有发生。五十点九不是压倒性的胜利，是一种悬而未决，是一个问题被暂时放回去了，但没有被回答。

法律的争议还在，制度的张力还在，精灵大陆的沉默还在，四国同盟的合约还在，第一皇女还在代摄，拒绝加冕，拒绝给任何一方一个她不打算给的答案。

一切都还在原来的地方。

但原来的地方，已经不完全是原来的地方了。

阿尔坎在那天早上，照例去了植物培育室。

他没有特别的感受，或者说，他的感受太复杂，复杂到找不到一个词放进去，就只好什么都不放，只是做手里的事——记录，浇水，调整光照，在本子上写下今天的日期。

下午他去了华英的茶馆。

那里比平时安静。不是冷清，是那种说完了很多话之后的安静，像一个人长跑之后坐下来的样子。华英一圈一圈地倒茶，不说话，那个从赤潮同盟来的年轻女孩坐在角落里，盯着桌面看，那个已经在第七区住了五十年的居云者还是在那里，还是不说话，像一块被时间打磨过的石头。

阿尔坎在他常坐的位子坐下，接过华英递来的茶杯，喝了一口。

"还会有下一次，"华英最后说，没有问句，也不完全是陈述，更像是一个他已经思考过很多次、最终接受了的事实。

"还会有下一次，"阿尔坎重复了一遍。

这句话里有一种他说不清楚是宽慰还是重量的东西。也许两者都是。


回家的路上，他经过了那面墙。

像往常一样停下来，抬起头，看了一眼。

那五个字还在，像它们一直在的那样。

此处有人住过。

他在那里站了很久，比平时更久。

他想到了一件事：这面墙上的字，有一部分他不认识它们用的语言。但每种语言旁边都有人标注了帝国通用语的翻译，所以他能读懂每一句话的意思。

是谁做的翻译？他以前没想过这个问题。

一定是某个人，或者某些人，觉得那些话值得被更多人读懂，所以花了时间，把它们翻译出来，写在旁边。

没有署名。

做了，就做了。


那天夜里，帝国的天文台发布了一条技术通报，措辞很平静，内容是常规的观测数据更新，但在附录里有一行字，只有一行，关于失踪舰队方向的信号监测情况。

那行字写道：信号特征存在，方向稳定，强度未变。

没有更多解释。

帝国的公共频道没有专门报道这件事，只是把这条通报放进了当天的技术简报里，和其他几十条技术简报并列，淹没在日常信息的流动里。

但阿尔坎睡前刷到了它。

他把那行字读了两遍，然后把手持设备放下，在黑暗里看了一会儿天花板。

信号特征存在，方向稳定，强度未变。

这不是"他回来了"，这什么都不是，只是信号还在。

但信号还在，意味着什么东西还在那个方向，还没有消失。

阿尔坎在心里把这件事放了很久，然后想，这件事和投票、和共和国、和所有那些关于这里会变成什么的讨论，可能根本不在同一个时间尺度上。也许当这里终于变成另一种形式的时候，那束信号还在。也许那时候会有一个答案，也许不会。

也许他等不到那一天。

他六十一岁，帝国的医疗系统很好，但他大约也就还有四五十年。

四五十年，在这件事的时间尺度里，可能什么都不够。

但他想，他还有四五十年，可以在这里继续住着。可以继续去植物培育室，继续去华英的茶馆，继续经过那面墙，继续在第七区的早晨醒过来，推开窗，看见那座他已经认识了三十八年的城市在阳光里站着。

那已经是很多了。

那已经是他二十三岁的时候，在那个他现在很少提起名字的地方，不敢想象会拥有的东西。


那面墙还在。

还有人在上面写字，用各种各样的语言，各种各样的字体，各种各样在别处放不下、只能在这里放下的话。

这件事没有因为那次投票而停止。

也没有因为舰队失踪而停止。

此处有人住过。

这个时态，不会因为任何投票结果而改变。

它只会因为这里不再接住任何人，而改变。

但那一天，还没有到来。

至于那一天什么时候到来——

没有人知道。

那取决于很多事情，取决于这个星球上，在另一些地方，另一些人，在他们自己的时间里，做出什么样的选择。

历史在等。

树还在广场中央长着。

天文台还对着那个方向。`
  },
  {
    title: "凛冬合众国",
        key: 'deepwinter',  // 子选项按钮文字
    content: `
凛冬合众国·西寒原联邦·白桦湾自治州

今天下雪了。

准确来说，是轨道气象局提前六小时发布的“低能见度寒潮型降雪”。整座城市从凌晨开始就进入了雪幕模式，沿海高架轨道全部切换成了防风编队运行。清晨六点半的时候，我家的窗户自动调暗，室内生态系统把照明色温调成了偏暖的琥珀色。

我醒来的第一件事，是先看联邦新闻。

厨房桌面终端正在播放今天的晨间简报：

“凛冬合众国与苍神缘起帝国联合宣布，第七环段维护工程提前结束。”
“河童重工集团新一代极寒轨道运输舰开始量产。”
“联邦议会今日将讨论《边境永久居民教育补贴修正案》。”

新闻主持人的声音还是一如既往平静。

我住在白桦湾第七居住集群。

这里以前是矿业城市，后来自动化完成以后，大部分地下矿井都改成了地热储能设施。祖父年轻时是真正在矿场工作的人，那时候还需要穿外骨骼下井。现在的孩子可能都不太理解“矿工”是什么概念了。

城市里的重工业几乎都在无人化运行。

真正还需要手动处理的工作，大多是：
系统协调、
地方管理、
教育、
设计、
心理服务、
联邦事务，
或者像我这样——轨道物流调度。

我七点四十出门。

住宅区外层穹顶上覆盖着一层薄雪，空气很冷，但不刺骨。联邦市政AI已经提前加热了主步道，鞋底踩上去只有一点湿润感。远处的港口区能看到巨大的轨道电梯穿过云层，像一根直达天空的黑色钢针。

街上人很多。


有从苍神缘起来的黑发商人；
有刚放学的海之子交换生；
甚至还有两个明显是合成生命的人在咖啡店门口争论什么。

凛冬合众国一直都这样。

这里的人很杂。

战争难民、边境移民、工业技术人员、海外学生、退役军人、企业工程师……什么人都有。

小时候老师告诉我们：

“凛冬大陆本来就是给无家可归的人准备的地方。”

我一直觉得这话挺准确。

八点，我抵达西寒原轨道物流中心。

今天最大的任务，是协调一批发往博爱大陆的超导矿物运输列车。整个流程其实已经高度自动化，我需要做的只是确认几个州之间的优先级配额，再和南方港口同步轨道窗口。

中午的时候出了点小插曲。

一支来自恩泽大陆的私人货运舰队试图提前插入港口时段，结果被联邦交通系统直接驳回了。整个调度大厅里的人都笑了。

“他们总觉得自己比较特殊。”

同事把咖啡递给我时这么说。

咖啡是免费的。

实际上这里大部分基础公共服务都接近免费。能源、交通、基础医疗、教育、公民住宅配额，联邦政府和各州财政承担了绝大部分成本。毕竟凛冬合众国是四国集团成员国之一，全球经济排名第十二。整个国家真正缺的从来不是资源。

下午，外面的雪变大了。

调度中心的观景窗外，数百列悬浮货运轨道正在暴风雪里穿行。远处的天空隐约能看到行星联合星环的一部分结构，像一道横跨天际的银色裂缝。

有时候我会意识到，我们其实活在一个很夸张的时代。

这个世界已经能够：

改造气候、
控制轨道工业、
AI共同执政、
甚至尝试离开恒星重力井。

可与此同时——

联邦议会仍然会因为某个州的税率争吵一整个月；
地方选举依然会有人贴满街的竞选广告；
酒吧里的人还是会骂政府；
年轻人还是会担心自己能不能申请到更好的大学；
邻居家的老太太还是会在暴风雪天给整层楼送热汤。

文明变得再大，人活着的方式好像也没有彻底改变。

14：30，下班后，我没有立刻回家。

白桦湾沿海商业区今晚很热闹。

巨大的全息广告漂浮在雪幕之间，自动清雪无人机正在高空巡逻，商业街播放着联邦建国纪念日的老音乐。广场中央的纪念碑下面，有人在给凛冬战争时期的老兵献花。

我在那里站了一会儿。

其实我们这一代人离战争已经很远了。

可战争留下来的东西还在。

它藏在城市里那些厚重得近乎夸张的地下避难结构里；
藏在联邦宪法关于地方自治的条款里；
藏在每一个州都保留独立防卫体系的传统里；
也藏在这个国家对“接纳流亡者”近乎执拗的态度里。

凛冬合众国从来不是最强大的国家。

但它大概是最像“边疆”的超级工业国家。

这里很冷。

可人并不冷。

晚上回家时，雪已经停了。

我站在住宅环的透明观景走廊上，看见远方的轨道电梯缓缓亮起蓝色灯光，穿透云层，一直延伸向近地轨道。

那一瞬间我忽然想到：

也许再过几十年，
普通人真的会像现在跨洲旅行一样，
随便去别的星球生活。

.
————————————————————————————————————————————————————————————————————————————————
————————————————————————————————————————————————————————————————————————————————
————————————————————————————————————————————————————————————————————————————————

**《普通的决定》**

---

**一**

薇拉在七十九岁生日过后的第十一天，去了社区卫生站，告诉那里的医生她不打算续了。

"续"是白桦湾的民间说法，正式术语叫"第三阶段延寿干预方案"，填表的时候有一整页选项，从细胞修复频率到机械液注射周期到机械飞升评估预约，密密麻麻，像一份轨道时刻表。薇拉以前帮丈夫看过一次，那时候她还觉得那些选项读起来令人安慰，证明这个国家是认真的，是在想办法的。

现在她坐在医生对面，听医生解释哪几个选项对她目前的身体状况最合适，点了点头，说谢谢，然后说她都不选。

医生是个年轻人，三十多岁，白尾族，在白桦湾工作了两年，薇拉见过他几次，他总是很认真，有一次她来做例行检查，他把每一项指标解释得非常详细，拿着平板给她看数值的含义，那种认真让她感到善意。

"您的指标都很好，"他说，"心脏、骨密度、神经传导……按照目前的状态，第一阶段的干预完全可以安全支撑到一百一十岁以上。"

"我知道，"薇拉说，"我就是不续了。"

"是暂时不续，还是——"

"就是不续了。"

医生在平板上停顿了一下，在某个选项里打了勾，薇拉没有看清楚那个选项的名字，但她知道大概是什么意思。

"您需要预约一个咨询吗？"医生问，"我们有专门的生命决策咨询，免费的，不是说服您改变主意，只是……聊一聊。"

"不用，"薇拉说，"我想清楚了。"

医生又停顿了一下，然后说了一句话，很轻，不像是在按程序说，更像是他自己的话：

"您这个年纪做这个决定，不需要给任何人解释的。"

薇拉看了他一眼，发现他是认真的。

她说谢谢，起身，出去了。

---

**二**

外面在下雪。

不是轨道气象局预报的那种精准降雪，是真正的、随意的、来自北方高压的自然降雪，在白桦湾冬天并不罕见，但每次来的时候薇拉都会停一下，在路边站着，看雪落在外骨骼清扫车顶上，落在轨道站玻璃顶棚上，落在远处港口区那根垂直的、通往轨道的黑色针上。

那根针叫做东海岸轨道电梯，是四国同盟参与建设的，薇拉在地质勘探部门工作的最后十年，有一部分工作就是评估其地基区域的岩层稳定性。那是她职业生涯里最后一个大项目，她做得很认真，写了厚厚的报告，里面有一页写到她的职业判断和当时主流意见不同，她坚持了自己的判断，最后事实证明她是对的。

她站在雪里，看着那根针，想，我做过的事情里有一点点在那里。

不是骄傲，更接近于确认。

---

**三**

邻居阿涅在楼下等她。

这不是事先约好的。阿涅是合成生命，在地区协调委员会工作，负责处理新到难民和移民的安置档案，这份工作她已经做了将近三十年，外形保持在大约四十岁的样子，薇拉认识她已经二十五年了，在这二十五年里阿涅几乎没有变过。

"你今天去卫生站，"阿涅说，不是问句，"我看见你出门了。"

"嗯。"

"结果怎么样。"

"我不续了，"薇拉说，"跟你说过的。"

"我知道你说过，我以为你可能会改变主意。"

薇拉说没有。

她们两个在雪里站了一会儿。阿涅脸上没有什么特别的表情——合成生命的情绪表达和有机体不完全一样，薇拉花了很多年才学会怎么读她——现在她能看出来阿涅在想什么：不是担心，不是反对，是一种很安静的、接受了这件事但还需要一点时间的状态。

"我会在的，"阿涅说，"一直到最后都会在。"

"我知道，"薇拉说，"走，上去喝点东西。"

---

**四**

薇拉的公寓在八楼，朝南，能看见港口区和那根针。

她丈夫六年前离开之前，这里住了两个人，书架上的书有一半是他的，薇拉现在不认识那些书，她自己不读那类书，但也没把它们移走，它们在那里，是一种形状。

她给阿涅倒了茶，自己倒了一杯，坐下来。

"你不难过吗，"阿涅问。

"难过什么。"

"不续了。"

薇拉想了一下，说："我不难过。我觉得……够了。"

阿涅没有说话。

"不是说活着不好，"薇拉说，"活着挺好的。今天早上下雪，我在雪里站了一会儿，感觉很好。我不是不想活，我只是……我现在这个样子很好，我不想让它继续被拉着走。"

阿涅把茶杯握在手里，合成生命感受温度的方式和有机体不同，但她说过她能感觉到热。

"萧知道吗，"她说，"你的女儿。"

"我跟她说了。"

"她怎么说。"

薇拉停了一下。

"她说她理解，"薇拉说，"我觉得她真的理解，只是……我们现在说话，有时候有一种隔着什么的感觉。不是不好，只是她那边的时间和我这边的时间不一样了。"

---

**五**

萧在十年前选择了机械飞升，现在在轨道工程部门工作，参与的是薇拉没有权限了解细节的项目，只知道和行星轨道基础设施有关。每个星期她们会视频通话一次。薇拉能看见萧的脸，那张脸和飞升之前没有太大区别——机械飞升不是科幻里那种半机械半人的形象，更多的是内部的，是那些看不见的部分。

但有一次通话，萧说了一句话，说她最近在做的一个项目时间跨度是十五年，说得很自然，好像十五年是一个很正常的工作周期。薇拉在那边听到，想到自己工作了四十年，每隔几年就会有一个项目，每个项目结束的时候都会有一种完成了某件事的感觉——那种感觉是她职业生涯里最重要的时刻之一。

萧说十五年的时候，脸上没有那种感觉。或者说，那种感觉被稀释了，因为十五年只是下一个阶段，下一个阶段之后还有下一个阶段，每件事都在一个非常长的叙事里，任何一件单独的事都不那么终结。

薇拉那次通话结束后在窗边坐了很久。

她想，这不是萧的错，也不是飞升的错，只是那是另一种活法，那种活法需要一种她没有的东西。或者说，需要你对时间有一种她没有的感受。

---

**六**

下午，薇拉去了社区图书馆，还了两本书，借了一本，在里面坐了一个小时。

图书馆里有几个孩子在做作业，旁边坐着一个合成生命的辅导员，在轻声解释什么，那几个孩子有的是本地孩子，有的看样子是刚来的移民，都坐得很专注。薇拉在旁边的椅子上看书，偶尔抬头看他们一眼。

这件事每次都让她感到某种她说不清楚的满足感。

不是因为它跟她有关，是因为它跟这里有关。这里是这个样子的，这件事是真实发生着的，有孩子在这里长大，有人在认真教他们，这个世界在以某种笨拙的、缓慢的、不那么优美的方式继续向前走——薇拉曾经是那个在这里成长的人，后来成了那个在这里工作的人，现在她是那个坐在这里看别人的人。

这个位置很好。她没有觉得这个位置有什么遗憾。

---

**七**

傍晚她去了战争纪念碑。

这不是她的习惯，她不是那种经常去纪念碑的人。今天不知道为什么走到了那里，就进去站了一会儿。

纪念碑不大，在白桦湾广场的边缘，记录的是凛冬战争里在这个城市死去的人的名字，用的是很小的字，密密麻麻刻在黑色石板上。薇拉的祖母曾经给她讲过那场战争，那时候薇拉很小，不太理解，只记得祖母说，那时候死的人里面有很多不是老死的，不是生病死的，是刚刚成年就死的，是孩子还没长大就死的，是本来还有很多年可以活但没有活成的人。

她站在那里，看着那些名字。

她七十九岁，身体很好，指标正常，生活稳定，住在一个这个星球上称得上安全和体面的城市里，做了四十年她认为有意义的工作，和一个好的人结婚了，那个人离开之后她学会了一个人生活，她有一个女儿，那个女儿选择了另一种活法，她理解，她不反对。

那些名字刻在石板上的人，他们有这些吗？

不是所有人都有。

薇拉在那里站了比她预期更长的时间，然后转身，走回家。

---

**八**

晚上萧打来了视频电话，比平时早了两天，薇拉接起来，萧说她知道妈妈今天去了卫生站，问结果怎么样。

"你怎么知道的，"薇拉说。

"我猜的，"萧说，"妈，你这个决定我早就知道了，你上次来的时候眼神就不一样了。"

薇拉笑了一下，说眼神什么的，你也能看出来。

"你一直这样，"萧说，"你做完了某件事，你的眼神会变的。你交完最后一份地质报告的时候也是这样。"

薇拉看着屏幕里萧的脸，那张脸现在比十年前更平静，是那种见过更多东西之后的平静，不是冷漠，是一种容量变大了的安静。

"你难过吗，"薇拉问。

萧想了一下，说："有一点。但我不觉得你做错了。我只是……我会在更长的时间里想你。"

"那挺好的，"薇拉说，"你想我的时候，你知道你想的那个人是真实存在过的，不是一直被续着的那个人，就是活了七十九年然后停了的那个人。"

萧沉默了一会儿，然后说妈妈你说话的方式怎么越来越像哲学家了。

薇拉说，你外婆也这么说过我。

她们又聊了一会儿，说了一些很普通的事——萧最近在吃什么，白桦湾今天下雪了，那颗最近发现的新行星还是没有好的命名方案。然后萧说她要去忙了，说妈妈你保重，薇拉说你也保重，然后电话断了。

---

**九**

凌晨36点，她还没睡。

这不罕见，她一直是晚睡的人，七十九岁了，身体的时间表还是年轻时候的样子，倒是其他很多事情都改变了，唯独这一点没有。

她在给一个很久没联系的老同事写信。不是邮件，是真正的信，手写的，她有一盒专门买来很久、但一直在等合适时机用的信纸，今天终于拿出来了。那个同事住在凛冬大陆的北部，当年他们一起做过一个野外项目，在零下三十度的地方待了两个月，发现了一组有意思的地热异常数据，后来那批数据被用在了凛冬合众国地热储能系统的规划里。

她写了那次项目，写了那两个月，写了那组数据，写了后来她看到地热储能设施的报道时想到了他们，想到了那批数据的去向。

写完，她封好信封，写了地址，放在门边，明天出门的时候顺手投到邮筒里。

她不知道他还在不在，不知道他续没续，已经很多年没有联系了。但那批数据是他们一起做的，那件事她记得，那件事值得被说出来。

---

**十**

她在窗边坐了很长时间，然后把窗帘拉上，去卧室，在她睡了三十多年的床上躺下来。

她想到了一件事，是今天在图书馆读到的，一句她很喜欢的话，已经记不清是哪个哲学家说的了，大意是：人们害怕死亡，是因为他们误以为死亡会夺走他们已经拥有的东西。但那些东西已经在了，已经发生了，没有什么可以夺走它们。

她活过的七十九年不会因为她停下来而消失。那些年是她的，永远是她的，她把它们放在那里，完整的，不被稀释的。

这不是放弃，是一种她花了很长时间才学会说清楚的东西：

她年轻的时候对活着有一种饥渴，想做很多事，想看很多东西，想知道事情会变成什么样。这种饥渴工作得很好，驱动了四十年，驱动了一段婚姻，驱动了一个女儿，驱动了很多个早晨她在白桦湾的寒风里去上班，觉得今天又有事情要做了，觉得这一天有它的重量。

现在那种饥渴很轻了。

不是消失了，是轻了，轻到她觉得满足——不是厌倦，就是满足，就是一种"好了，这些我都有了，我都做了，这些是我的"的感觉。

把一个已经满足的人拉着继续走，不是善意，是浪费。

机械飞升不是错，长生药物不是错，治愈机械液不是错，萧的选择不是错，那些每年选择续的人也没有错——那些人身体里还有那种饥渴，或者他们有还没做完的事，或者他们就是想看看这个世界再往哪里走，那都是真实的理由，那都是值得活下去的理由。

薇拉的理由只是：她的那份已经够了，她已经知道她能知道的，已经做了她能做的，已经爱了她能爱的。

够了不是放弃，够了是一种判断。

---

她明天打算去那家她一直想去但一直没去的小餐馆吃午饭，是上个月阿涅说的，说那家的鱼做得好，用的是北海的野生鱼，白桦湾现在这种餐馆越来越少了。她一直觉得可以以后再去，今天想到，以后也不是无限的，就约好了，明天去。

一件很小的事。

但它在明天等着她，明天就是因为这件事而有了它的形状。

这就够了。

这一直就够了。

---

*凛冬合众国的延寿干预是普遍可及的国家福利，覆盖所有持有效公民身份的居民，不设年龄上限，不设健康门槛，不设任何资产证明要求。*

*每年约有百分之十二的凛冬公民在卫生站提交自主终止延寿干预申请。*

*这个数字每年都大致相同。*

*首席持剑者对此没有发表过任何公开评论，因为首席持剑者从来不就个人生死选择发表公开评论。*

*这是凛冬合众国自建国以来持续贯彻的一项传统。*
`
  },
  {
    title: "日月星列岛国度",
        key: 'sunmoonstar',  // 子选项按钮文字
    content: `

---

**《第七滴泪》**

---

**一**

"至圣垂泪，洗我尘心；圣子引路，渡我苦身。"

晨钟响起时，汐见真在心里默念了今日的第一次祷词。

钟声不是从物理意义上的钟楼传来的——鸣门岛的旧钟楼在三十年前的台风里倒了，现在的晨钟是教堂的声学系统在每天六点整向全岛广播的数字音频，精确复刻了星光岛大教堂主钟的频率特征。至圣牧首的神学顾问团专门讨论过这件事，结论是：钟声的神圣性在于其内容与时机，而非其物理载体。这个解释被写进了二十年前那一届宗教大公会议的决议里，现在是正式教义的一部分。

汐见真接受这个解释。他接受大多数教会的解释，不是因为他从不怀疑，而是因为他思考过之后觉得那些解释通常是有道理的。

他睁开眼，窗外还是灰蓝色。

卧室角落的圣像灯已经自动亮起——那是他去年换的新款，用的是日月星列岛本地设计师和草木之心集团联合开发的生物光材料，光色会随着时间推移从暖黄渐变为日光白，模拟自然光的节律。圣像本身是传统的泪滴形圣子像，材质是从礁石区采集的半透明矿石手工雕刻，这个他坚持要用老工艺的——不是每件事都需要升级。

妻子不在床上。她昨晚参加教区守夜祈祷，为下周的圣泪巡游做准备，估计已经起来了。

他打开家庭终端的语音界面，说了一句话。厨房里传来烤箱预热的声音和煮水的声音。

---

早饭摆好的时候，妻子从楼上下来，头发还没梳，眼睛有点肿，但精神好。

"渔汛今天开始？"她坐下来，把草药茶推到他面前。

"对。北侧礁石区，今天潮汐时机很好。"汐见真打开终端的海况界面，把今天的数据扫了一眼——水温、洋流、鱼群密度分布图，数据来自行星轨道基础设施网络在日月星大陆区段部署的海洋监测节点，精度精确到十米级别。

他把鱼群密度图放大，在预计集中区域上点了一下，系统自动规划了三条捕捞路线，并标注了最优时间窗口。

他选了第二条，不是最优的那条，是他自己判断下来鱼的品质可能更好的那条。系统的最优解针对的是数量，他在乎的是那片礁石区的特定鱼群，那里的泪斑鱼肉质最好，卖价更高，而且他父亲也在那片海域捕鱼，他说不清楚为什么喜欢那个地方，说不清楚的事情他就不去解释。

妻子在他旁边坐下，看着他操作终端的手，说："我昨晚跟执事谈了，下周唱诗班的扩音系统要升级，教会打算用新的声场系统，说是能让全岛所有的室外公共区域都覆盖到，圣泪巡游的时候队伍走到哪里都能听见唱诗。"

"哪家的设备？"

"靛蓝纪念碑的。外来品牌，但教会批了，因为没有本地供应商能达到这个覆盖精度。"

汐见真想了一下，没说话。靛蓝纪念碑是深海联盟的科技企业，非拜泪教文明圈的。这种事在日月星列岛已经越来越常见——信仰是本地的，技术越来越不是。

这不是一个有标准答案的问题，他知道教会内部对此争论了几十年。

"圣光与你同在，"他站起来，把包拎上，"晚饭前我回来。"

"圣光与你同在，"妻子回答，去厨房热女儿的早饭了。

---

**二**

码头上停着大约二十条船，大小不一。

这跟以前很不一样。以前鸣门岛的码头全是人力操作的渔船，现在全是自动船，配备了导航AI和自动收网系统，只需要一到两个人操作，效率是以前的四五倍。剩下的那几条老船，有的是年纪大的渔民坚持用，有的是给旅游业留着的——现在有一种叫做"传统渔业体验"的项目，外地游客付钱来学怎么用老方法捕鱼，已经是鸣门岛旅游收入的重要来源。

汐见真的船叫"圣泪号"，是他父亲传下来的船名，但船体已经换过两次了，现在这艘是五年前换的，船头刻着拜泪教的圣徽，这个是他手工刻的，用了两天时间，系统可以激光雕刻，他不让，说这个要自己来。

邻居老源已经在整理渔网了，虽然"整理"的实质是在终端上检查智能渔网的传感器状态，确认所有节点都在线。

"今天用大网还是小网？"老源问。

"礁石区。小网，选择性捕捞，只取泪斑鱼，其余的过滤放回去。"汐见真说，"教会上个季度又更新了《渔业圣训补则》，礁石区的捕捞限额降了百分之十五，我们得算好。"

"我看了，"老源点头，"新补则里还加了一条，说机械化捕捞必须配备物种识别系统，防止混捞伤鱼群。我的网今年刚升了级，符合要求。你的呢？"

"上个月装的，"汐见真说，"教会要求强制安装之前我就装了。"

老源笑了："你这人就是这样，不用人催。"

这是拜泪教环境管教义的具体落地——教会认为海洋是圣子之泪的汇聚，对海洋的过度索取是亵渎，因此拜泪教渔业圣训对捕捞有明确的生态规定，而且每隔几年根据科学机构的海洋数据更新。负责更新的神学委员会里有海洋生物学家，这也是教会在近代改革后的产物——信仰需要根据知识来更新它的外在形式，这是现任至圣牧首二十年前上任时确立的方向。

汐见真认为这是对的，虽然他说不出多少神学理由。他认为这是对的，因为他父亲那一代过度捕捞几乎毁掉了这片礁石区，后来是教会介入，强制减捞，才把鱼群恢复回来，这是他小时候亲眼看见的事。

---

"今天小斋日，"老源在船驶出港湾之后说，"《泪经·海章》你带了吗？"

"带了，"汐见真拍了拍防水袋里的实体书，"带的是纸版。"

"现在还用纸版的人不多了，"老源说，有一点感慨，但不是批评，只是陈述。

"我知道，"汐见真说，"电子版功能多，注释多，还有语音朗读，我都用过，用着很好。但诵读的时候还是用纸，不知道为什么，就是这样。"

老源点头，表示理解，然后打开了他终端上的《泪经》应用，选了海章第七节的朗读模式，教区官方版本，由星光岛大教堂的首席诵读者录制，声音低沉而稳定。

两个人的诵读方式不同，但都在诵读，海面上的声音混在海风和引擎的低鸣里，成为某种汐见真无法描述但认得出来的东西。

---

**三**

上午的渔获很好。

智能渔网的实时数据显示，泪斑鱼群比预测的位置往北偏移了大约八十米，汐见真根据数据微调了两次位置，最终的收网质量相当理想——二十七条泪斑鱼，全部在限额内，物种识别系统没有记录到任何误捕，海面上没有多余的死鱼。

他在记录本上填了数据，同时把捕捞记录同步到了教区渔业管理系统——这是圣训补则要求的，每次捕捞必须实时上报，数据汇总后由教会的海洋健康委员会审计。有人觉得这是监控，汐见真觉得这是维护公共利益的正常手段，跟你信不信教没有关系。

"下午潮汐数据不太好，"老源看着终端，"我们要不要提前回？"

汐见真看了一眼卫星海况图，同意。

他们在船上吃午饭，是从家里带的：密封盒里装着妻子早上准备好的饭，米饭、腌鱼、炒时蔬，用低温保存模块维持着合适的温度，打开的时候还是热的。草药茶用的是保温壶，温度精确保持在他习惯的那个度数，因为他在家庭终端的健康档案里记录过这个偏好，妻子设壶的时候系统会自动提醒。

他闭眼做了餐前祷告，然后吃饭。

老源打开终端，边吃边看今天教区广播的内容。汐见真偶尔听了几句——今天讲的是居云者商业共和国代表团下周访问星光岛的事，祭司在分析这次访问的背景，语气平稳，说明了居云者和拜泪教之间的历史争议，也强调了此次访问的和平性质，最后引用了至圣牧首上个月的牧函原文：

"所有在圣子之泪覆盖的世界上行走的存在，无论信仰与否，皆受圣子悲悯所及。以悲悯待人，是信徒对自身信仰最诚实的证明。"

汐见真把这句话在心里过了一遍，觉得有道理，虽然他知道这颗星球上有很多人觉得这句话是政治表态多于神学。

也许两者都是。

---

**四**

下午三点回到码头，他没有直接回家，先去了教区的基因修复诊所。

那是教会三年前和彩环集团合作开设的，免费向全岛居民提供基础医疗和基因筛查服务。汐见真的父亲去年做了一次心脏基因修复手术，把家族遗传的心肌问题从根上处理掉了，手术是在星光岛的医院做的，全程费用由教会互助基金承担。

今天他来是替女儿拿本周的健康档案更新。教区对十八岁以下的孩子有强制健康追踪，每月一次基础数据更新，包括基因表达监测——这项技术在以前还只有最顶级的医疗机构才有，现在已经是日月星列岛基层医疗的标配了。

诊所里有五六个人在等候，有老有小。诊所的AI问诊系统在终端上运行，负责分诊和初步评估，医生只处理复杂案例和需要面对面的情况。墙上贴着一张宣传画，上面是草药茶的广告，下面印着一句话："照顾身体，是侍奉之道。"

汐见真接过女儿的档案数据包，存进了家庭健康终端，然后往家走。

路上经过了拜泪兄弟会的互助站。

今天是布施日，门口排了一队人，但跟三十年前的样子不一样——来领物资的人少了，来做志愿者的人反而多了。过去的布施站是因为真的有人填不饱肚子才排队来领，现在日月星列岛的基础生活保障体系已经相当完善，来这里的大多是在领一些特殊物资——比如给老人的特制辅助设备，比如给孩子的教育材料，还有一些是来接受心理辅导的，教会在每个互助站都配备了心理咨询的神职人员，这是教义里"灵魂的照顾等同于身体的照顾"这一条的具体实践。

汐见真放慢脚步，从鱼桶里挑了两条最好的泪斑鱼，走进去，交给执事。

"圣光与你同在，"执事接过鱼，在胸口画了个泪滴符号，"真哥，你今天收成不错？"

"还行，"他说，"这两条你们留着晚上吃，不用分发出去，执事们今天辛苦了。"

执事笑了，说圣光与你同在，眼睛里有一种很真实的高兴。

---

**五**

晚祷在五点开始。

石头砌的教堂用了好几百年，外观老旧，但里面的声学系统上个季度刚改造过——就是妻子说的那套靛蓝纪念碑的设备，声场覆盖整个室内，歌声和管风琴的频率在空间里混合得天衣无缝，汐见真进来的时候，唱诗班正在试音，那个声音让他在门口停了一秒。

技术是好的，他不得不承认。

今天祭司讲道的主题是居云者访问的事。他站在讲台上，身后投影着一张日月星列岛和居云者商业共和国的地理关系图，用平静的语气讲解两个文明之间从敌对到谈判的历史——这段历史他们从小就学，但每次听到都有不同的感受，因为讲解的人不同，侧重点不同。

"我们的先辈用一千年打了这场思想战争，"祭司说，"结果是什么？双方都没有消灭对方，双方都还在。圣子的悲悯不因为这场战争而减少，居云者的理性也不因为这场战争而消失。下周他们来访，我们要做的事只有一件：让他们看见我们是什么样的人，不是让他们成为我们。"

晚祷结束后，汐见真在教堂门口遇到了行政官阿部。他们谈了圣泪巡游的安保部署，这次巡游会有来自其他岛屿的教徒，规模比往年大，码头那一段需要有人协调。

汐见真答应了，说码头我来。

---

晚饭是鱼汤、蒸海贝和米饭，妻子做的，全家一起吃。

女儿从圣学课回来，拿出今天的作业给他看——不是一张画，是一个小型的全息演示模型，用教区圣学课配发的教育终端制作的，展示的是"圣子的第七滴泪"的故事：沙漠、枯骨、泪落沙中，泉水涌出。模型里的沙粒会移动，水的光影效果做得很真实，配上女儿用童声录制的经文朗读，看起来简单，但她说她做了两个多小时。

"爸爸，老师说下周我们全班要去星光岛参观大教堂，"她说，"坐轨道艇去，半个小时就到，我从来没坐过轨道艇。"

"那你会喜欢的，"汐见真说，"坐上去先别看终端，看窗外，能看到整个群岛的海面。"

"你坐过？"

"年轻的时候，去星光岛参加教区会议。"

"那是什么感觉？"

他想了一下，说："感觉世界比你平时看见的大很多，但又都是你认识的地方。"

女儿把这句话咀嚼了一会儿，说："我明白了。"

他觉得她大概是明白了，孩子有时候比大人更快明白一些说不清楚的东西。

---

睡前，他们一家三口做了家庭祈祷，然后关灯。

终端的屏幕亮了一下，弹出来自至圣牧首办公室的通知——明天全体信徒可以通过教区频道收看一场直播，内容是关于下周居云者访问期间的教义指引，牧首会亲自主讲。

汐见真把通知设为明天早晨提醒，然后把屏幕翻过去，屏幕朝下，不看了。

他在黑暗里听了一会儿窗外的海浪声，想到了今天一天经历的事，那些事里有很多是技术的、现代的、但也有一些没有变——老源在船上诵读海章的声音，互助站执事接过鱼时眼睛里的高兴，女儿用童声录制的经文，这些东西存在于那些技术的间隙里，不是技术带来的，也不是技术可以替代的。

他不知道怎么描述这种感觉。

也许不需要描述，有些东西存在着就是了，就像潮水每天都涨落，不需要解释它为什么涨落。

---

第二天早晨，晨钟的数字音频准时响起。

他睁开眼，窗外是日月星列岛西缘的灰蓝色，太阳还没从恩泽大陆那边爬上来。

他在心里默念了今日的第一次祷词。

然后起床，去厨房，昨晚已经设好的烤箱开始工作，草药茶的水已经烧开了。

他在等待早饭的时候打开了海况终端，查看今天的鱼群密度图，把今天的路线想了一遍，然后关上，坐在窗边，把早饭吃完。

外面是海，海上有鱼，潮水今天还会涨落，这些都是真实的，都是今天会发生的事，在所有今天会发生的事里，这些是他确定自己知道该做什么的部分。

足够了。

今天就从这里开始。`
  },
  {
    title: "南海工业联合体",
        key: 'southsea',  // 子选项按钮文字
    content: `

**《第七站》**

---

**一**

维兰每天早上做的第一件事，是把手放在协调台的感应板上。

这不是启动程序，协调台有自己的启动序列，他不需要参与。他这样做是因为感应板接触皮肤的瞬间会有一种轻微的振动——那是协调台在扫描他的生物签名——而这个振动的频率和强度，微妙地反映着当前根源场的基底状态。不是精确的数据，是一种感觉。他用了十五年来学习如何从这种感觉里读出有用的信息。

今天振动的质地不对。

不是异常报警那种不对，那种他知道，那种是仪器告诉你的。这是另一种——在报警触发之前，在数字出现在屏幕上之前，是他皮肤感觉到的某种"提前一秒"。

他把手放在那里，多停了几秒。

然后他打开系统，看今天的场图。

---

南海工业联合体第七根源协调站建在一座人工岛的中央，这座岛建在一处根源场的天然汇聚点上。十八年前建站之前，这里是南海的一片开阔水域，海图上什么都没有，只有一组水下地质探测的注记：*根源场密度异常，建议调查。*

那个调查变成了测绘，测绘变成了规划，规划变成了这座岛，这座岛上建起了第七站。

第七站不是南海工业联合体最大的根源协调站——最大的是一站和三站，建在场更深的汇聚节点上，功率是第七站的三到四倍。但第七站有一个特点：场位置稳定，节律清晰，几乎没有干扰源，是南海系统里读数最干净的站之一。

对于做监测工作的人来说，干净意味着任何偏差都很容易被看见。

维兰在第七站工作了十五年，从初级校准员做到高级场监测师，在这里见过的偏差比他记得住的多。大多数都是正常的——根源场不是一潭死水，它有自己的呼吸，有受月相影响的潮汐效应，有因行星自转带来的日节律，有偶尔出现的、来源不明但通常在几小时内自然消退的局部扰动。

这些他都见过，都记过，都标注在工作档案里。

今天的不一样。

---

场图在三维显示台上展开，是一组密度等值面和流向箭头的组合，看起来像某种气象图，但不是气象，是根源场的空间分布状态。第七站的正常场图有一种维兰熟悉的质感——主密度核在岛的正下方，向四周扩散，流向稳定，周期性的脉冲节律像一颗心跳，每隔大约三十一秒出现一次，振幅在正常范围内浮动。

今天的场图，主密度核在，流向也在，脉冲也在。

但脉冲的间隔变了。

不是大的改变，不是从三十一秒跳到六十秒那种，是从三十一秒变成了大约三十二点四秒。

一点四秒的差值。

维兰盯着这个数字看了一会儿，打开历史记录，调出过去四十八小时的数据，画成曲线——变化从昨天深夜开始，缓慢的，线性的，持续到现在，还没有停止。

他在备忘里写下：*脉冲周期异常延长，持续进行，原因待查。*

然后他去倒了一杯水。

---

**二**

早班的监测室里，今天有三个人。

维兰，还有奥赛和卡尔万。

奥赛是第七站最年轻的高级技师，来自南海联合体东部的一个岛屿城市，二十八岁，动作很快，思维更快，总是同时在处理三件事，但每件事都做得完整。维兰一开始对他有点不适应，后来发现他是这里遇到过的最有效率的同事之一。

卡尔万年纪和维兰差不多，是黄昏线公司派驻的技术协调员，在第七站驻扎了将近五年。他的工作是确保第七站的输出和黄昏线配电网络之间的协调，理论上他不需要关心上游的场状态，但在这里待了五年，他对场状态有了一种他自己都说不清楚的兴趣，变成了一个愿意参与场监测讨论的旁观者。

维兰把他发现的东西告诉了他们两个。

奥赛立刻调出同一组数据，看了不到一分钟，说："变化起点是昨天25:17:34，精确到秒。这不像自然扰动，自然扰动的起点通常是模糊的。"

"我也注意到了，"维兰说，"有没有可能是我们自己的计时系统出了问题？"

"我看了，"奥赛已经打开了另一个窗口，"绝对时间坐标系统的校准是三小时前做的，没有偏差。变化是真实的。"

卡尔万站在他们旁边，看着场图，说："你们这种感觉，是第七站第一次见到，还是以前有过？"

维兰想了一下，说："周期延长我见过，但通常是自然波动，不超过半秒，而且会自己回来。这次的变化是单向的，还在继续，这个我没见过。"

"根源场有文字记录以来的历史档案里，有没有类似的案例？"奥赛问。

第七站的历史只有十八年，维兰在的时间是十五年，历史档案是有限的。

"查联合体的大档案，"维兰说，"把这个变化特征提交去查，看看有没有匹配的历史记录。"

奥赛已经在输入了。

---

联合体的根源场历史监测档案是一个庞大的数据库，记录了南海工业联合体所有协调站从建站以来的所有场数据，最早的记录来自一号站，建站于星间林地历4891年，距今六百多年。这六百多年里，南海地区的各个汇聚点见证了根源场的各种状态：战争时期的异常，行星保障工程建设阶段的扰动，以及那些至今没有找到来源的周期性波动。

系统匹配查询需要时间，维兰让它在后台运行，继续做今天的常规监测。

根源场的基本工作不因为出现异常而暂停——场在持续运作，协调台在持续工作，输出在持续进行，黄昏线那边的配电网络需要稳定的输入。异常需要调查，但调查是在正常工作进行的同时进行的。

这是做根源场工作的基本要求——你必须能够同时保持对当前状态的处理和对异常的追踪，因为场不会因为你正在研究它而停下来等你。

维兰在这十五年里学到的最重要的一件事，大概就是这个：场不等人，人学会跟上场。

---

**三**

上午十点，查询返回了一个结果。

奥赛先看到，叫了维兰过来。

匹配的记录只有一条，来自南海根源场三号站的历史档案，记录时间：星间林地历5299年，距今两百零二年。

记录内容显示，三号站在那一年的某一天观测到了脉冲周期的单向延长，延长速率和今天第七站的数值高度吻合，持续了大约三十六小时，然后稳定在新的周期上——此后就一直是那个新周期，没有回到原来。

维兰把这段话读了两遍。

"稳定在新的周期上，"他说，"意思是，那次不是扰动，是调整。"

"是这个意思，"奥赛说，"根源场的基底节律调整了。"

"原因是什么？"

奥赛指了一下那条记录的注记栏，里面只有短短的一行字，是当时三号站的值班主任写的：

*与同期发生的行星保障工程防御护盾充能完成可能有相关性，原因待查。*

然后就没有了。"待查"之后没有结论。可能是当时没有查出来，可能是查出来了但没有更新在这条记录里，可能是被其他事情打断了。两百年前的事，档案里有很多这种空白的尾巴。

维兰和奥赛对视了一下。

卡尔万在旁边，把那行字读了一遍，然后说："行星保障工程防御护盾，两百零二年前——那不是护盾第一次充能完成的年份吗？"

维兰不确定，他对行星保障工程历史的了解是普通人的水平，不是专家。

"我去查，"奥赛说。

---

他查了五分钟，然后回来，说："是的。防御护盾的整体充能完成于历5298年末，三号站那条记录的时间点在充能完成后大约四十八小时。"

维兰在脑子里把这件事整理了一遍。

根源场——行星保障工程——护盾充能——场的基底节律改变。

这不是一个他能完整解释的逻辑链，因为他对行星保障工程的技术细节了解不够。但方向是清楚的：行星保障工程的某个大规模操作，影响了根源场的基底状态。

如果两百年前充能完成影响了场的节律，那么今天类似的场变化，意味着昨天深夜发生了什么。

"昨天，"维兰说，"行星保障工程有没有什么重大节点？"

没有人能立刻回答这个问题。行星保障工程的运行通报不是每天向民间机构发布的，发布的内容通常比实际发生的晚几天。

"我去问站长，"卡尔万说，站起来往走廊走，"他可能有渠道。"

---

**四**

站长叫萨尔托，一个在南海工业联合体干了三十多年的工程师，从基层一直干到现在，说话很少，但每一句都是他真正想说的那句。他有一个习惯：每次有人来他办公室报告什么事情，他会先把手边的东西放下，然后完整地听完，然后才开口。

卡尔万把情况报告完，萨尔托放下他手边的文件，沉默了大约五秒，然后说：

"你们的时间节点对了。"

然后他站起来，跟着卡尔万去了监测室。

他在场图前站了一会儿，把维兰和奥赛标注的那些数据点看了一遍，然后说：

"昨天23:07，行星综合防卫系统第三子系统建设完成，正式并入行星防卫整体架构，进行了首次全系统协同激活测试。这是今年最大的一次工程节点。你们的场变化起始时间是25:17，差了十分钟，和两百年前护盾充能那次的时间差，数量级是一致的。"

监测室里安静了一会儿。

"行星防卫系统从根源场取能，"维兰说，不是问句。

"不是取能，"萨尔托说，"是接入。行星保障工程的基础架构和根源场之间有一种协调关系，工程越大，接入越深，场越稳定，工程的运行越稳定。两者之间是共生的，不是单向的。新的子系统并入，场要重新找平衡——"他想了一下，"就像一张网新加了一个节点，整个网的张力分布会重新调整。"

"那这次调整会持续多久？"奥赛问。

"上一次调整了三十六小时，"萨尔托说，"但上一次接入的系统规模和这次不一样，这次第三子系统是行星综合防卫的核心部分，规模更大。我估计调整时间会更长。"他看了一眼场图，"两天，也可能三天。"

"调整完成后，场的基底节律会稳定在新的值上？"维兰问。

"是，"萨尔托说，"和两百年前一样。那次调整完成之后，根源场的整体能量密度实际上提高了，因为防御架构稳定后会向场反馈，这个反馈是正向的。"他在场图上指了一下密度核的位置，"这里，三天后会比今天更亮。"

然后他把手收回来，说："继续监测，每小时记录一次完整场读数，这是一次难得的数据窗口。我会联系一站和三站做同步记录，这三天的数据对后续场动力学研究有价值。"

然后他走了，回到他的办公室，把刚才放下的那份文件重新拿起来。

---

**五**

下午的班很安静。

异常报警没有触发，因为场的状态在可预期的范围内变化，维兰更新了监测参数，把这次调整期间的变化范围作为临时基准，系统在新的基准上平稳运行。

他每隔一小时记录一次完整数据，把数字填进报告模板，把场图截图存档，把任何微小的偏离都注明在备注栏里。

这就是这份工作大多数时候的样子：记录，存档，备注，再记录。

不是无聊，不是枯燥，是一种维兰在十五年里逐渐接受的、属于这份工作的节奏——根源场的时间尺度比人类生活的时间尺度慢得多，一次真正有意义的场变化，可能需要几天、几周甚至更长时间来展开。在那个展开过程里，你的工作是保持在场，持续记录，不错过任何一个数据点，因为你不知道哪一个数据点在将来会被证明是重要的。

两百年前三号站的那个"待查"，今天可能就找到了答案——也可能还没有完全找到，因为"共生"这个说法是萨尔托的解释，不是经过完整验证的结论，还需要更多的数据。

维兰想，也许他今天做的这批记录，会在某一天被某个还没有出生的人打开，用来理解当时发生了什么。

他把这个想法在脑子里放了一会儿，然后继续填数字。

---

傍晚，他在食堂碰见了奥赛，两人端着餐盘在靠窗的位置坐下。

窗外是人工岛的外围区域，能看见海。南海的黄昏颜色很深，橙红色压着远处的水平线，反光打在海面上，一直延伸到岛的护堤边。

"你以前见过场调整吗？"奥赛问。

"见过小的，"维兰说，"但没见过今天这个量级的。"

"你在这里待了十五年，这是第一次。"

"是。行星保障工程这个量级的节点，不会每年都有。"

奥赛想了一下，说："你有没有觉得，这件事本身有什么特别的？"

维兰想了很长时间，长到奥赛已经开始吃饭，以为这个问题不会有答案了。

然后维兰说："行星综合防卫系统的第三子系统完成了。这颗星球的防卫能力，昨晚扩展了一个新的维度。然后我们早上来上班，在一个仪器上看见场图里多出来的那一点四秒，觉得不对，查了一天，找到了原因。"

他把筷子放下，看了一眼窗外的海。

"那个系统在上面，"他说，"我们在下面。我们做的事情是每小时记录一次场数据，这两件事之间的关系说不清楚，但它们是有关系的。根源场把它们连在一起了——不是隐喻，是物理事实，是我们今天查档案查出来的。"

奥赛听完这段话，沉默了一会儿，然后说："你平时话不多，但说出来的话都挺难反驳的。"

维兰没有回答，拿起筷子，继续吃饭。

---

**六**

他住在人工岛北侧的员工居住区。

第七站的常驻员工大约三百人，岛上有配套的居住区、食堂、医务室、几个公共空间，生活基本自足，需要去岛外的时候有定期的交通船，到南海工业联合体最近的陆地城市大约两小时。

他已经习惯了这种生活——不在大陆上，在一个岛上，四面是水，脚下是场。

他的宿舍不大，但够用，窗户朝向海洋。这是他当年选宿舍时唯一提出的要求。

夜里，他有时候在宿舍里坐着，不开灯，看窗外的海。

不是失眠，不是在想什么特别深刻的事，只是坐着，让时间过一会儿。

根源场是看不见的。他这十五年里没有一次真正用眼睛看见过它，他看见的只是场图，只是数字，只是仪器把不可见的东西翻译成他能理解的视觉形式。但有时候在夜里，他坐在窗边，感觉到某种不完全是仪器告诉他的东西——某种微妙的存在感，像是他知道他坐在某样巨大的东西的表面，而那样东西在他脚下几百米的地方继续延伸，延伸到海床，延伸到行星的地壳，和整颗星球的根源场连在一起。

他说不清楚这是真实的感知还是十五年职业训练产生的心理印象。

可能都是。

今天晚上他在窗边坐着，想到了今天的场图，想到了两百年前三号站的那条记录，想到了萨尔托说的那句话：新子系统并入，场重新找平衡，就像网新加了一个节点，张力重新分布。

行星防卫系统，根源场，协调站，黄昏线的配电网络——连接这些东西的是一个共生的系统，不是某一方控制另一方，是所有东西一起在找平衡，持续地，每时每刻地。

他在这个系统里的位置，是每隔一小时记录一次数据，写备注，存档，在出现值得注意的变化时第一时间告诉有需要知道的人。

这不是一个宏大的位置，不是一个创造什么的位置，不是一个做出历史性决定的位置。

但如果他不在，如果所有像他这样的人都不在，那个系统就会有地方失去眼睛。那双眼睛能看见的东西，就会在某一天消失在档案的空白里，变成又一个"待查"，在两百年后等着某个人来查，或者永远等不到。

他不会因为这个就觉得自己的工作多么伟大，那不是他想问题的方式。

他只是把这件事在心里放了一会儿，像他每天早上在感应板上多停留的那几秒——让那种感觉在皮肤上留一下，然后他把窗帘拉上，去睡觉。

明天还有一个小时一次的记录要做。

场还在调整，还在找它的新平衡。

他明天去看它找到了没有。

---

*三天后，第七站的根源场脉冲周期稳定在了新的基准值：33.1秒。*

*比调整前延长了2.1秒。*

*萨尔托的预测是对的——场的基底能量密度比调整前提高了约百分之三。*

*维兰把这次完整的调整过程整理成报告，提交给了联合体的根源场研究委员会，同时更新了三号站那条两百年前的"待查"记录，在原来的注记下面新增了一行：*

*"参见第七站历5501年场调整报告，站点编号TOS-7，相关性已确认。整理：Velan Thos。"*

*然后他把那个档案窗口关上，打开今天的场图，看了一眼，打开今天的工作记录，写下第一行数字。*

*场是稳定的。*

*新的节律，稳定的。*

*比昨天更亮一点。*`
  },
  {
    title: "恩泽帝国",
        key: 'grace',  // 子选项按钮文字
    content: `
**晴，恩泽城，第四居住区，公民编号 EN-447-川-盛**

---

今天是芯片校准日。

每个月一次，去区公所的卫生站，坐进那把椅子，后颈贴上两个传感片，听见短促的一声轻响，结束。全程不超过三分钟。我从来没有感觉到任何不适。有些人说校准的时候会有轻微的温热感，我没有。我问过站里的医疗官，他说这是正常的个体差异，芯片运行一切正常。

我相信他。我也相信芯片。

出生的时候就注入了，所以我从来不觉得它的存在——就像你不会一直意识到自己的心跳。有时候想到它，只是觉得安心。这是帝国给每一个公民的礼物，是我们与生俱来的一部分。

它确保我们在一起。

---

校准完出来，去单位报到。我在第四区的文书整理部门工作，处理历史档案的数字化归档。今天的任务是蜂潮期间的战场通讯记录，约三百年前的内容，纸质原件已经脆得像落叶。

我戴上手套，一页一页翻。

那时候的士兵写字很潦草，很多字迹因为纸张的损坏变得难以辨认。但能读出来的部分我都仔细录入。有一段让我停了很久——一个普通士兵在信里写，他不知道自己能不能回来，但他知道帝国在他身后，所以脚可以继续往前迈。

我把这句话录完，然后坐了一会儿。

读心矩阵会在这个时候记录到什么，我想过。应该是平静，还有一种叫做感激的东西。我没有刻意整理自己的情绪——那是不必要的。帝国不要求我们假装，它要求我们真实。而我真实的感受，此刻确实是平静的，和感激的。

---

午饭在单位食堂。阶级配餐，我是第三文职序列，对应乙等餐标，主食加两份副食加一份汤。食堂的分餐员是个年轻的白尾族，动作利落，不说话，每个人的餐盘都在三秒内完成配发。

我旁边坐着同事，她是第二文职序列，比我高一级，餐盘里多了一份蛋白质补充剂。她没有刻意展示，也没有刻意遮掩。这是正常的。

阶级不是羞耻，也不是骄傲。阶级是位置，每个人在自己的位置上，帝国才能运转。我的老师很早就告诉我这句话，我认为这句话是对的。

我们谈了一些工作上的事，然后各自回去。

---

下午，区里的读心矩阵做了例行扫描。

不是针对某个人，而是整个区域的例行扫描，每周两次。通知会提前三天发出，频率、时间和覆盖范围都是公开的。帝国不做秘密的事。帝国做的事情，都可以被所有人知道，因为帝国做的事情都是对的。

扫描的时候我正在录入，没有特别的感觉。

据说外国人来恩泽城，第一次经历读心扫描时会很不适应。我能理解，他们没有芯片，他们的思维从来没有被整理过，所以他们的脑子里装着很多不必要的东西，扫描的时候会感到一种奇怪的暴露感。

我不会。因为我没有需要隐藏的东西。

---

傍晚，帝国广播照例在十七时整准时播出。

今天的内容是帝皇陛下关于东部边境农业产量的批示，以及军队在蜂龙方向的例行巡逻简报。简报很简短，结尾是固定的那句话："威胁已被识别，秩序已被维护，恩泽与你同在。"

我在厨房里听完，继续切菜。

这句话我听了三十年。它每一次都让我觉得：是的，我在正确的地方。

---

晚上，邻居的孩子来敲门，问能不能借一样工具。我借给他了。孩子很懂礼貌，进门前先报了自己的公民编号，这是礼节，也是规定，他记得很清楚。他父母教得好。

我想到了我自己的父母，已经去世十几年了。他们是普通的档案工人，和我现在做的工作差不多，只是那时候数字化程度没有现在高，很多事情还要用手。他们一辈子没有出过恩泽大陆，我也没有。

我不觉得遗憾。

外面的世界很大，但外面的世界也很乱。博爱联盟的议会永远在吵架，飞升大陆的人把决定权交给一个机器，日月星那边的事我从来看不懂。而我们这里，每件事都有它应该在的位置，每个人都知道自己应该做什么。



这是因为我们被整理过了。

---

睡前，照例做了五分钟的意识整理——这是帝国公民健康手册里推荐的睡前习惯。把今天经历的事情在脑子里过一遍，确认没有残留的困惑或者不必要的焦虑，然后放下。

我过了一遍。

芯片校准，档案录入，午饭，读心扫描，广播，邻居的孩子，父母，睡前整理。

没有困惑，没有焦虑。

一切都是应该的样子。

帝国与我同在。

我闭上眼睛。

---

*十七时广播收听确认：✓*
*读心矩阵例行扫描记录：正常*
*芯片月度校准状态：已完成*
*公民日志系统自动归档：EN-447-川-盛



————————————————————————————————————————————————————————————————————————————————

————————————————————————————————————————————————————————————————————————————————

————————————————————————————————————————————————————————————————————————————————




## 不怕咸




铃兰王国（恩泽帝国下属附庸国家）的天空永远是同一种蓝。

不是自然的蓝——是环境调节系统设定的蓝，色号#2A6F8F，色温6500K，全年无休。帝国环境署在五百年前拿掉了“天气”这个变量，理由是农业产出需要可预测，国防侦察需要无障碍，社会稳定需要可预期。铃兰王国居民对此没有意见，因为他们从出生起就没有见过第二种天空。

帝历4721年，铃兰王城第七扇区，一处普通得不能再普通的居民楼。楼高七十二层，每层十二户，每户格局相同，颜色相同，门牌字体相同。楼里有四部电梯，其中一部永远在检修，这是整栋楼里唯一的不确定性。

沈原住在第四十九层。

他的公寓里有十五件家具，二十三本纸质书，一盆不许开花的绿植，和一个标准的帝国公民信息终端。终端每天早上七点自动开机，播报当天的团结协议提醒、生产任务安排和上一日的情绪合规报告。今天的情绪合规报告显示：沈原，情绪波动指数3.2，低于阈值，合规。他看了一眼，关闭屏幕，去洗脸。

洗脸的时候他对着镜子看了一眼自己。二十七岁，中等身高，五官没有记忆点，帝国基因库里最普通的模板。他的工作是读心矩阵数据审核员，Level 4，坐办公室，每天盯着屏幕上飞速滚动的神经信号数据，判断哪些是正常思维，哪些需要标记为“异动”。他看了四年，从来没有发现过任何异动，因为帝国不存在异动。所有的异动在萌芽阶段就被团结协议芯片校准了。

这是帝国告诉他的。他相信。

他必须相信。

### 一

调令在帝历4721年3月14日到达。

沈原被调入读心矩阵运维中心的核心监控组，负责东海岸某军事缓冲区的实时神经信号筛查。这意味着他不再看历史数据，而是面对活生生的、正在思考的人的大脑。那些信号在屏幕上以彩色的波形呈现，红的是恐惧，蓝的是平静，黄的是愤怒，绿的是……他后来才知道，绿色是爱。

在此之前，他没见过绿色的波形。

运维中心在铃兰王城地下四十米，没有窗户，空气里有淡淡的臭氧味，是大型冷却系统工作时的副产品。他的工位在C区第七排，周围是二十四块屏幕，每一块都在实时刷新前线士兵和边境居民的心理状态。他的任务是确保没有任何人的情绪波动超出许可范围——许可范围由帝国安全署制定，每年更新一次，今年的版本比去年收窄了百分之三。

帝历4721年4月2日，下午三点十七分，沈原在D区第七号屏幕上第一次看见了绿色。

不是那种一闪而过的、可以被解释为信号干扰的绿色。是持续地、稳定地、像一条河一样流淌的绿色波形。他看了三秒钟，然后按照操作手册的指引，将这条信号标记为“异常情绪：待分类”，提交给二级审核。

二级审核在四分钟后返回了结果：不予处理。

他不知道为什么。操作手册没有写这种情况。他盯着那条绿色的波形看了很久，发现它和周边其他所有波形都不一样。周边的波形是碎片化的、跳跃的、被各种外部刺激不断打断的——一个士兵看到远处的火光，心跳加速，波形变成黄色；一个农民听到头顶的飞行器掠过，恐惧，红色；一个母亲想起家里的孩子，平静，蓝色。只有这条绿色的波形是连续的，像是一首他从没听过的、缓慢的歌。

他开始留意D区第七号屏幕。

不是每天都能看到绿色，有时候几天都没有。但只要出现，总是在同一时间段，总是在同一片区域——东海岸北部的一个小哨站。信号编号指向一个代号“鹄”的帝国边防军士兵。沈原不知道这人的名字，不知道长相，不知道年龄，只知道一个代号和一个岗位：哨兵，三级，驻守东海岸第十七号观察哨。

他开始在每天的报告中不提及这条绿色信号。

这不是他的职责。他的职责是如实上报。但他发现每次上报，二级审核的回复都是“不予处理”，而“不予处理”意味着这条信号会被存档，然后被某个更高级别的审核者在某个他看不见的地方看到。他不想让其他人看到。

他不知道自己在保护什么。

### 二

帝历4721年6月11日，运维中心接到了一个紧急通知：东海岸第十七号观察哨附近的神经信号监测节点出现故障，需要派人现场检修。沈原主动申请了这次外勤。他的组长看了他一眼，批准了，因为C区第七排的其他人都比他有更紧急的任务，而且没有人想去东海岸。

东海岸的空气和他习惯的不一样。

帝国环境的调节系统在这里似乎失去了某种精准度，天空的蓝色不是标准的#2A6F8F，而是略浅一些、略灰一些，像是有人在水彩里加了一点点白。风是存在的，带着咸味和远处海浪的声音。沈原站在运输车的踏板边上，眯着眼睛适应这种陌生的、不精确的蓝。

第十七号观察哨建在海岸线的一块高地上，是一栋灰色的混凝土建筑，没有窗户，只有一个很小的入口和屋顶上的观测设备。沈原走到门口，按了门铃，等了大约半分钟，门开了。

开门的人比他高半个头，短发，皮肤被海风吹得粗糙，眼睛是一种很深的棕色。穿着一件旧得发白的军便装，袖口磨出了毛边。

“检修的？”她说。声音比沈原想象的轻，像是怕吵到什么东西。

“嗯，信号节点故障。”沈原举了举手里的工具箱。

她侧身让他进去。里面是一个很小的房间，一张床，一张桌子，一把椅子，一个终端，一个简易的炊具台。墙上贴着一张手绘的地图，海岸线被画得很细致，每一个礁石和每一处弯折都用不同颜色的笔标注了。桌子上放着一杯已经凉了的茶，杯子是白色的，有细细的裂纹。

沈原蹲下来检查墙角里的信号节点设备，打开后盖，看到一根线松了。他把它重新插好，设备自检，故障灯灭了。

“好了。”他站起来。

“这么快？”

“只是接触不良。”

她给他倒了杯水，他喝了。他们在桌子的两边坐下来，中间隔着那杯凉掉的茶和一个小小的、装着干花的花瓶。沈原注意到那些干花是野生的滨海植物，紫色的小花，花瓣已经薄到透明，但颜色还在。

“这是什么花？”他问。

“不知道。海边长的。我叫它‘不怕咸’。”

沈原笑了一下。她看着他的笑，也笑了一下。他发现她笑的时候眼睛会先弯，然后嘴角才跟上，中间有一个很小的、几乎察觉不到的时间差。他不知道为什么记住了这个细节。

他该走了。他站起来，拿起工具箱，走到门口。

“你叫什么名字？”她问。

“沈原。”

“我叫津。”

他点了点头，推开门，走进那片不标准的蓝色天空里。

走出大约二十步的时候，他听见身后传来一个很轻的声音。

“你还会来吗？”

他没有回头。但他的耳朵捕捉到了一个波形——从她的方向传来的，微弱的、稳定的、绿色的波形。和他在屏幕上看了两个多月的那条一模一样。

他站住了，在风里站了几秒钟。

“信号节点可能会再出问题。”他说。

然后他走了。

### 三

之后他去了很多次。

每次的理由都一样：信号节点需要例行检查。他的组长开始觉得奇怪，但沈原的报告写得很规范，每次维修记录都真实，故障也都真实——有些是他故意制造的，轻轻碰松一根线，然后重新插好。这不是破坏，这是让他能再次见到她的方式。

津开始等他。

不是那种刻意的、在门口张望的等。是他在远处就看见屋顶上的观测设备旁边多了一把椅子，是桌上多了一副碗筷，是茶杯里的茶永远温热。她不说“我在等你”，但她做的每一件事都在说。

他们之间很少说话。沈原不是一个擅长说话的人，津也不是。他们坐在一起，喝茶，看海——津从观察哨的屋顶可以看见海，但沈原不能久留，他必须在规定时间内回到铃兰王城，他的终端在等他。

有时候津会问他铃兰王城的事。

“城里是什么样的？”

“很整齐。很干净。天是一个颜色。”

“什么样的颜色？”

“蓝色。一种蓝色。”

“你不喜欢？”

沈原想了一会儿。

“我没想过喜不喜欢。它一直是那个颜色。”

津沉默了。她看着海的方向。海的颜色不是一种，早晨是灰的，中午是蓝的，傍晚是金色的，夜里是黑的。她从小到大看着这些变化，沈原从小到大看着一种颜色。

“那你来这里，”津说，“会觉得天空不对劲吗？”

“会。但我觉得对劲的不对劲，比不对劲的对劲好。”

津眨了眨眼。“你在说什么？”

“我也不知道。”

他们都笑了。

### 四

帝历4721年9月，帝国的读心矩阵进行了一次例行升级。升级后的算法对“异常情绪”的敏感度提高了百分之十五。沈原在第一周就发现了变化：绿色波形出现的频率变低了。不是津不爱了，是矩阵开始主动抑制、过滤、压制那些它判定为“不利于社会稳定性”的神经信号。

他在自己的终端上看到了最新的情绪合规指导原则：

“个人依恋（非家庭单位内）属于次级优先级情绪，当与生产任务、集体义务或国家安全发生冲突时，应主动降低其神经激活水平。建议公民通过团结协议芯片的‘注意力重定向’功能，将相关神经资源转移至集体目标。”

他读了三遍。

他在想，如果津的绿色波形被矩阵压下去了，那他还能不能从屏幕上看到它。他在想，如果他自己的团结协议芯片监测到他此刻的情绪——不是平静，不是服从，而是别的什么——会不会把他的合规指数调高。

他没有答案。

但他做了一件事：他给津写了一封信。

不是通过帝国的信息网络——所有信息都会被读心矩阵扫描。他用的是一张纸，一支笔，把字写得小小的、密密的，折成很小的一块，塞进工具箱的夹层里。

信上写的是：

“你的绿色波形，矩阵开始压它了。我不知道它会压到什么程度。但如果有一天你感觉不到它了，不是它不在了，是它被藏起来了。藏在你的身体里，藏在你的肋骨后面，藏在你不说出口的那些话里。我会帮你记得它。”

他带去了。

津打开那张纸的时候，手在微微发抖。她没有哭，但她的眼睛红了，红得很慢，像是某种东西从很深的地方慢慢浮上来。

她把那张纸折好，放进那本手绘地图的夹页里。

“你能看到我的绿色？”她问。

“在屏幕上。你的波形是绿色的。我从四月就在看。”

“你知道绿色代表什么？”

“知道。”

“那你为什么还来？”

沈原看着她的棕色眼睛。

“因为你的绿色波形，是我在屏幕上见过的最好看的东西。”

### 五

帝历4721年11月，帝国安全署对东海岸边境地区进行了一次全面神经数据审查。原因是有情报称部分哨站士兵与境外势力存在未经授权的信息交换。审查范围包括所有驻军的通信记录、神经信号历史数据和情绪合规报告。

沈原知道这意味着什么。

他的每一次维修记录都被存档了，他去的次数远远超过了正常检修频率。他的工具箱夹层里有津写给他的回信——他还没来得及拿出来。津的回信也只有一句话：

“那你帮我记得。”

他很想把那张纸销毁，但他做不到。不是因为舍不得，是因为他觉得自己有义务保留它。那张纸是证据，证明在帝国之外、在矩阵之下、在那个#2A6F8F的单一蓝色之外，还有另一种颜色存在过。

他选择了不销毁。

帝历4721年11月17日，他被叫进了安全署的审讯室。

审讯室的灯是白色的，很亮，没有影子。桌子对面坐着三个人，中间的那个制服上的徽章最多，年纪也最大。他看着沈原，沉默了很久，像是在等沈原先开口。沈原没有开口。

“沈原，Level 4，数据审核员，入职四年。”那人终于说话了，声音不带任何情绪，像在读一份文件。“你去东海岸第十七号观察哨的次数，是正常检修频率的十一倍。请你解释。”

沈原张了张嘴。他的团结协议芯片在他开口之前就已经监测到了他的心率变化、血压变化、瞳孔扩张。他不需要说话，矩阵已经把他的每一个生理反应读成了数据，写进了面前的屏幕上。

“你在那里见了什么人？”那人继续问。

沈原没有回答。

“你的情绪合规指数在过去五个月内持续低于阈值，”那人看了一眼屏幕，“低得不正常。不是你不合规，是你太合规了。人在正常状态下不可能连续五个月没有情绪波动。”

他知道了。

沈原看着桌上那盏灯，白色的、没有影子的光。

“你在主动控制自己的情绪，”那人说，“你在训练自己不在矩阵面前产生反应。谁教你的？还是你自己学会的？”

沈原依然沉默。

审讯持续了四个小时。最后，他没有被逮捕，没有被处分，甚至没有被警告。他只是被调离了运维中心，安排到了一个完全不需要接触任何数据的后勤岗位，负责清点仓库里的办公用品。

他的新工位在地下八层，没有屏幕，没有信号，只有货架、纸箱和一盏嗡嗡作响的日光灯。他的团结协议芯片每天正常报告，情绪合规指数永远稳定在阈值以下零点几的位置，不多，不少，像一台校准过的仪器。

没有人知道他在想什么。

连矩阵也不知道。

因为他在过去的五个月里学会了一件事：在帝国最深的沉默不是不说话，是不在心里说话。他把所有关于津的念头压在肋骨后面，压在大脑的语言区之外，压在矩阵读不到的地方。他不想，他只感受。感受是没有形状的，矩阵抓不住。

### 六

津在那次审查之后被调离了东海岸。

她不知道沈原经历了什么，因为没有人和她说。她只知道他不再来了。那个带着工具箱、坐运输车穿过不标准的蓝色天空来修“信号节点”的人，在某一天之后消失了，像海浪退去后沙滩上的脚印。

她没有他的联系方式。帝国的信息网络不允许平民与士兵直接通信，何况他们之间没有任何合法的关系。她不知道他是死是活，不知道他还在不在恩泽城，不知道他有没有被矩阵标记、被降级、被送去某个她永远不会知道的地方。

她唯一知道的是，她的绿色波形还在。

矩阵压了它，压得很低，低到几乎看不见，但还在。它缩成了一个很小的点，藏在她胸腔左侧、第四根肋骨和第五根肋骨之间，像一颗种子，被雪盖住了，但没有死。

她记得他说过的话。

“我会帮你记得它。”

她不知道他在哪里，但她知道，在这个星球的某个地下深处，有一个人在替她记得。那是一种奇怪的、不对称的关系——她感受，他记忆。他的记忆成了她的感受能够继续存在的条件。

她每天对着海的方向，在心里说一句话，不说出声，不在脑子里组织成语言，只是让那个情绪从肋骨后面涌出来，涌到胸口，涌到喉咙口，然后在出口的地方停住。

她不知道他能不能收到。

但她的绿色波形，始终没有彻底熄灭。

### 七

帝历4723年，帝国安全署启动了一项新计划：对低风险被监控人员实施“有限信任释放”。

沈原被归入了这一批名单。不是因为他的档案干净——他的档案上有一行备注，写着“曾与高危个体存在未授权接触，已隔离处理，无后续异常”。但这行备注的末尾被加了一行新的字：“自隔离以来，情绪合规指数持续稳定，建议降级监控。”

他被释放回了常规工作岗位，但不是运维中心。他的新岗位是帝国中央档案馆的数据录入员，负责将纸质档案扫描进数字系统。工作枯燥，没有压力，适合“有过异常记录但已恢复正常”的员工。

他在档案馆的第一天，在分配给自己的工作台上发现了一本旧书。

书是从前一个使用者那里留下的，按照规定应该被清理掉，但不知道为什么还在。他翻开了第一页，看到扉页上有一行手写的字，笔迹很旧，墨水已经褪成了褐色。

“在东海岸，天空是有颜色的。”

他的手指停在那行字上，停了很久。

他翻到第二页，什么都没有。第三页，第四页，一直到书的最后一页——最后一页的空白处，有人用铅笔写了一行极淡的字，像是怕被谁看见：

“不怕咸。”

他的手开始抖。

这本书的前一个使用者，他不知道是谁，不知道是什么时候坐在这张桌子前的，不知道是男是女，是军人还是平民，是活着还是已经死了。但那个人在不知道多少年前，在同一个位置上，用同一支笔，写下了一个词。一个只有他知道意思的词。

他合上书，放到一边，开始工作。

他没有把那本书带回家，因为档案馆的物品出入需要登记，那本书不属于他。但他记住了那个位置，那个书架，那一排编号。每天午休的时候，他会走到那个书架前，把那本书拿出来，翻到最后一页，看那三个字。

他从来不拿笔写任何东西。

他只是看。

### 八

帝历4730年，铃兰王国的天空还是同一种蓝。

沈原三十七岁了。他的头发开始在鬓角变白，他的膝盖在下雨的时候会疼——尽管帝国已经不让雨随便下了，但那种疼还留着，像是身体自己的天气。他还在中央档案馆工作，录入那些永远录不完的纸质档案。他的情绪合规指数稳定得像是被焊死的铁。没有人再注意他。

他偶尔会想起津。

不是每天，不是每周，是偶尔。在某个瞬间——翻开一本书的某一页，闻到某种海洋的气味，听到某个很像她声音的人在走廊里说话——那个被压在肋骨后面的东西会动一下。只是一下。然后他深吸一口气，把它压回去。

他记得自己的承诺：替她记得。

记忆不需要频繁想起。记忆只需要不消失。

帝历4730年8月，铃兰王国中央档案馆收到了一批新物资——从东海岸各哨站撤离时清理出来的旧文件和私人物品。按照规定，所有物品需要经过安全审查后才能销毁或归档。沈原所在的小组负责分类。

他在一堆旧军装、旧地图、旧水壶中间，看到了一个东西。

一个白色的杯子，有细细的裂纹。

他没有动，没有拿起来，没有看杯底有没有名字。他只是看了一眼那个杯子，确认了它存在，然后继续工作。那一整天，他的情绪合规指数没有变化。不是因为不在乎，是因为他已经把“在乎”压得太深了，深到连他自己都够不着。

下班的时候，他走到档案馆门口，停下来。

他回头看了一下那堆还没有处理完的物品，看见那个白色的杯子在最上面，被日光灯照着，那些细细的裂纹像是一张画在陶瓷上的地图。他记下了它的位置。

第二天上班的时候，杯子不在了。

他查了处理记录：安全审查通过，已销毁。

他站在货架前面，手里拿着记录板，指甲掐进塑料板的边缘里。

他问自己：你难过吗？你想哭吗？你想要愤怒吗？你的心里有任何感受吗？

答案是没有。

不是真的没有，是矩阵替他拿掉了。

他的团结协议芯片在他看见那个杯子的瞬间就监测到了他心跳的变化、瞳孔的变化、呼吸的变化。它在他自己意识到之前，就把那些情绪标记为“次级优先级”，然后分配了注意力重定向资源——把他对那个杯子的注意转移到了记录板上的文字上，把他的悲伤转化成了工作的平静，把他的愤怒转化成了肩胛骨肌肉的轻微紧张——一种他甚至不会注意到的、身体的微小反应。

矩阵没有让他忘记津。

矩阵让他不再为津而痛苦。

他不知道自己应该感激还是恐惧。

### 九

帝历4735年，恩泽帝国与蜂龙意识共同体在禁咒海峡北岸发生了一次规模不大的冲突。

帝国需要增援边境地区的文职人员，沈原被列入了抽调名单。不是因为他有能力，是因为他没有家庭、没有子女、没有需要照顾的老人，是最理想的可消耗资产。

他被派到了东海岸的一个后勤基地，距离第十七号观察哨旧址大约十二公里。他在那里住了八个月，负责物资清点和运输调度。每天的工作量很大，他几乎没有时间想任何工作之外的事情。但每天早上，在天刚亮的时候，他会走到基地的围墙边，面朝大海，站五分钟。

海和九年前一样，灰的、蓝的、金的、黑的。

天空和九年前不一样了。帝国的环境调节系统覆盖到了东海岸，那种不标准的蓝色正在被一种更标准、更均匀、更塑料的蓝色取代。海的颜色也在变，但海比天空顽固，它还在抵抗。

后勤基地里有一个食堂，食堂里有三张桌子，十二把椅子，一台永远在播帝国新闻的屏幕。沈原每天在那里吃三餐，和一屋子的陌生人在沉默中咀嚼。没有人聊天，不是因为规定，是因为没有想聊的事。团结协议芯片已经把大家的注意力都重定向到了各自的任务上，聊天是一种低效率的信息交换方式，不符合帝国公民的行为准则。

有一天，食堂里多了一个人。

是一个女人，短发，皮肤粗糙，穿着一件洗得发白的军便装。她在沈原对面的位置坐下来，拿了一碗汤，开始喝。沈原没有看她，他低着头吃自己的饭。但他听到了一个声音——不是真实的声音，是他记忆里的声音——是一个很轻的、像是怕吵到什么东西的嗓音。

“我叫津。”

他抬起头的速度比他预想的快。

她的头发比九年前短了，脸上的皱纹比九年前多了，眼睛里那种很深的棕色没有变。她看着他的表情先是茫然，然后是困惑，然后是一种他描述不出来的、复杂的、像是很多层颜色叠加在一起的东西。

“沈原？”她说。

食堂里的屏幕在播帝国新闻。有人在说话，有人在吃饭，有人在收拾餐盘。周围的一切都在照常运转，矩阵在每一个人的身体里读取数据，调度注意力，压制异常，维持秩序。在所有人的数据流里，沈原和津的相遇只产生了微小的、可以被忽略不计的波动——他们的心率都加快了，瞳孔都放大了，呼吸都变得浅了。这些数据被矩阵标记为“意外重逢引起的正常生理反应”，然后归档，不予处理。

矩阵不知道的事：

沈原的手在桌子下面，离津的手只有三厘米。他没有握上去。他不需要握。那个距离本身就是一种语言，一种矩阵读不出的语言，因为没有波形，没有数据，没有可量化的信号。只是三厘米的空气，和两个人在同一秒钟想起的同一件事。

“你的绿色波形还在吗？”沈原问。

津看着他的眼睛。

“在。没有以前绿了，但还在。”

“那就好。”

他们继续吃饭。吃完，站起来，把餐盘放回回收处，然后各自走向各自的岗位。没有拥抱，没有道别，没有任何可以被记录的东西。

那天晚上，沈原站在基地的围墙边，面朝海，在黑暗里站了很久。他在心里想了一句话，没有说出来，没有在脑子里组织成语言，只是让那个情绪从肋骨后面涌出来，涌到胸口，然后停在那里。

他想的是：

她还在。

这就够了。

### 十

后来沈原知道了津为什么在东海岸。

她没有被调离，她只是换了一个哨站。帝国的调令把她从第十七号观察哨调到了第十九号观察哨，相距不到二十公里，但在帝国的行政体系里，这是两个完全不同的世界。她在第十九号哨站又守了八年，每天看海，每天压制自己的绿色波形，每天在沉默中完成帝国要求她完成的所有任务。

她被调到后勤基地，是因为她的身体撑不住了。

八年的海风、八年的潮湿、八年的单人执勤让她的膝盖和腰背出现了不可逆的损伤。帝国的医疗系统免费为她治疗，但评估报告上写着：“该员已不适合继续执行一线哨站任务，建议转岗至后勤部门。”

她在后勤基地的食堂里遇见沈原的那天，是她转岗后的第三天。她没有想过会再见到他。她以为他死了，或者被送到了某个她找不到的地方。她甚至没有期待过再见到他。期待是一种不合规的情绪，她早就把它压没了。

但当他抬起头的那个瞬间，她的绿色波形剧烈地震荡了一下。

矩阵捕捉到了，标记了，然后不予处理。因为“不予处理”是帝国安全署对这条绿色波形的长期政策——从九年前沈原第一次提交那条“异常情绪”开始，帝国就知道这两个人之间存在某种不合规的连接。但帝国也评估过：这条连接没有威胁国家安全，没有影响生产效率，没有扩散风险。消灭它需要成本，而容忍它几乎没有成本。

帝国选择了容忍。

这不是仁慈，这是效率。

沈原后来才知道这件事。他在后勤基地的某一天，偶然看到了内部的一份技术备忘录——他的权限其实不够，但后勤基地的信息管理不如运维中心严格，他坐在一个忘了关掉的终端前，看到了自己的编号和津的编号出现在同一页纸上。那一页的标题是：

“低优先级异常情绪连接监测报告——建议继续保持‘不予处理’状态。”

他盯着“低优先级”三个字看了很久。

在帝国的眼里，他和津之间的所有——九年的分离、一本旧书扉页上的一行字、一个白色杯子上的裂纹、三厘米的空气——全部加起来，只是一个“低优先级异常”。不值得处理，不值得消灭，不值得记住。只是一个可以忽略不计的数据点。

他笑了。

不是因为好笑。是因为他第一次意识到，帝国错了。帝国可以用矩阵读他的心跳、他的瞳孔、他的呼吸、他的每一个生理指标。但帝国读不出他在这一刻的感受——不是悲伤，不是愤怒，不是荒诞，是一种很轻的、像风一样的、从肋骨下面涌上来的东西。

他后来在帝国中央档案馆的一本旧词典里查到了一个词，这个词在帝国现在的语言里已经不常用了，因为它描述的情绪无法被量化、无法被调度、无法被任何算法预测。

那个词叫“希望”。

### 十一

帝历4740年，帝国安全署更新了情绪合规指导原则。新版删除了关于“个人依恋”的条款，代之以更宽泛的“社会情感协调”概念。不是因为帝国变得宽容了，是因为帝国的社会学家发现，完全压制个人情感会导致创造力下降、生育率降低、长期社会活力衰减。帝国需要人民有一点感情，只要那种感情能被预测、被引导、被用于帝国的目标。

沈原和津的绿色波形，在那一年从“低优先级异常”变成了“未分类社会情感”。

没有人通知他们这件事。他们只是发现，矩阵对那条绿色的压制变弱了。它开始允许津在想到沈原的时候产生一点微弱的绿光，允许沈原在工作间隙短暂地想起她而不被注意力重定向。

他们没有庆祝。他们甚至没有讨论这件事。

他们只是在每天早上的食堂里，坐在同一张桌子对面，喝同一锅汤，吃同一种面包，偶尔交换一个很短的眼神。那个眼神不需要翻译，不需要解释，不需要被任何系统读取。

它是他们的。

### 尾声

帝历4750年，沈原五十一岁，津五十三岁。

帝国东海岸的天空已经完全变成了标准的#2A6F8F，那种曾经存在过的不标准的、灰蓝色的、会让人眼睛不适的天空，只活在少数人的记忆里。沈原和津是其中之一。

他们还在同一个后勤基地工作。沈原在仓库里清点物资，津在食堂里帮忙。他们的工位相距不到两百米，但他们每天只在吃早饭的时候见面。不是不能见更多，是不需要。他们用了将近三十年的时间，学会了在帝国的缝隙里存活的方式——不张扬，不隐藏，不抵抗，不服从。只是存在。

有一天早上，津在沈原的面包旁边放了一朵花。

很小，紫色的，花瓣薄到透明。沈原拿起来看了很久。

“不怕咸？”他问。

津笑了一下。她的笑还是那个顺序——眼睛先弯，然后嘴角才跟上。

“你居然记得。”

“我答应过你，替你记得。”

窗外的天空是#2A6F8F。食堂里的屏幕在播帝国新闻。周围的人低着头吃饭，没有人注意到一个五十一岁的男人把一朵干花夹进了自己的记事本里。

他的团结协议芯片监测到了他的心率变化，标记为“正常生理波动”，归档，不予处理。

它不知道那是什么。

它不需要知道。

---

*很多年以后，恩泽帝国的档案系统里有一行记录：*

*“沈原，男，帝历4723年至今，情绪合规指数稳定，无异常。”*

*“津，女，帝历4723年至今，情绪合规指数稳定，无异常。”*

*两条记录之间没有关联。*

*帝国的数据库里，他们永远只是两个独立的、毫无关系的公民。*

*但在帝国读不到的地方——在一本旧书扉页的褪色字迹里，在一个白色杯子的裂纹里，在一朵压干了的紫色小花里——他们有一整个宇宙。*










`



  },
  {
    title: "巅峰重工集群",
        key: 'summit',  // 子选项按钮文字
    content: `

**《足够宽的地方》**

---

**一**

陈默今天早上做的第一件事，是把昨晚泡进水里的豆子捞出来。

这不是必要的。

他住的公寓里有一台全自动料理系统，只要说出你想吃什么，它会在合理的时间内做好，口味可以精确调整到你喜欢的每一个维度——咸淡、软硬、油脂比例、香料组合，误差在一个正常人的感知阈值以内，有时候甚至在阈值以外。他用过，味道确实好。

但他今天想自己煮豆汤。

不是因为自己煮的比机器好——不是，机器更好。是因为他昨晚泡豆子这件事本身，是他做的，他想看着它变成今天早上的某样东西。

这个逻辑说出来有点可笑，他知道，所以他从来不跟人说。

他把豆子倒进锅里，加水，调了一个他从母亲那里记住的火候，然后去洗了个澡。出来的时候锅里已经有了气味，那种豆子煮开之前的、带一点生腥的热气，他深吸了一口，觉得今天是好的。

---

陈默四十七岁，巅峰重工集群主权第七区居民，合约等级：基础持有（Level 0）。

Level 0是这个国家的底线。

底线是什么意思？

他的公寓在第七区的住宅楼里，七十二平米，两个房间，一个朝南，全年有充足的自然光；楼下有公共花园，有运动设施，有一个他偶尔去的阅览室；医疗完全免费，从感冒到他去年做的那个膝盖小手术，全部不产生任何账单；基础收入每个月自动到账，数目足够覆盖他所有的日常开销，还有余裕；每年有一次远途旅行的配额，可以去这颗星球上的任何地方，交通和住宿由公共资源调度，他去年去了博爱大陆，今年还没决定去哪里。

这是底线。

他在这条线上活了十一年，自愿的。

---

他女儿叫陈沥，Level 6，在巅峰重工集群的轨道工程部门工作，参与行星轨道基础设施网络的某一段建设。陈默不完全了解她的工作，不是因为她不说，是因为她说的内容里有相当一部分涉及他没有权限了解的技术细节——不是秘密，是他的合约等级不赋予他那个信息层级的接触权。

这是合约体系运行的方式。不是说Level 0的人不被信任，是信息和决策权按照合约等级分层，每一层有每一层的可见范围。

陈默没有因为这件事而对女儿的工作感到隔阂。他只是不知道细节，但他知道她在做的事情是真实的，是重要的，是在他所不知道的某个技术节点上推动着这个文明往前走。

这让他高兴。

---

豆汤好了，他盛了两碗，然后想起来只有他一个人，把其中一碗盖上，留着晚上喝。

他坐下来喝了早饭，没有打开任何屏幕。

这是他在十一年前养成的习惯。在他还是Level 4的时候，每天早上他都要在吃饭的同时处理工作消息，那时候吃饭的时候他的眼睛不在饭上，他的注意力不在这个房间里，他只是把食物送进嘴里，然后嘴里的东西不知道什么时候就没了，然后他去上班。

现在他吃饭就是吃饭。豆汤是什么温度，豆子煮到了什么程度，咸了还是淡了，都是真实的、在当下发生的。

这不是什么修行，只是他想要的早晨的样子。

---

**二**

上午九点，他去了第七区的公共制造站。

制造站是巅峰重工集群的基础公共设施之一，每个居住区都有，面向所有合约等级开放——这是少数几个不按合约等级分层的地方。里面有各种各样的制造设备，从基础的手工工具到精密的分子级制造台，任何人都可以预约使用，AGI会提供辅助，材料消耗在一定限额内免费。

陈默来这里已经三年了，每周两三次。

他在做一件他说不清楚有什么用处的事——他在用传统锻造工艺做刀。

不是用制造台直接生成，不是让AGI设计然后打印，是真正意义上的锻造：加热、锻打、折叠、淬火，一道一道的工序，每一步都要用手判断，用眼睛看，用耳朵听金属受热时的声音变化。

这个工艺在巅峰重工集群里不是没有人会，但会的人少，因为它的产出——一把手工刀——在质量上不可能超过制造台生成的产品，在效率上更没有可比性，它存在的唯一理由是制造的过程本身。

陈默第一次来制造站的时候，站里的技术顾问——一个比他年轻十几岁的女人——看着他的申请表，用一种中性的语气问他：你要学传统锻造，有什么项目目的？

他说：没有项目目的。

她沉默了一下，在表格的"目的"一栏里写了"个人探索"，然后给他分配了工位。

---

今天他来的时候，工位旁边已经有一个人了。

是一个很年轻的男孩，看样子不超过二十岁，正在用一台基础加工设备做什么，专注得没有注意到陈默来。陈默在旁边的工位放下东西，也没有打招呼，开始生火准备今天的材料。

过了大约二十分钟，那个男孩抬起头，看了陈默一眼。

"你在锻刀？"他说。

"嗯，"陈默说，眼睛看着炉子里的金属。

"为什么不用制造台？"

"喜欢这个。"

男孩想了一下，然后说了一句陈默没有预料到的话："我也是。我在做电路板，手焊的，不用自动焊接，因为我喜欢那个温度控制的感觉，要自己判断。"

陈默抬起头，看了他一眼。

"什么合约等级？"他问，然后意识到这个问题在制造站里问有点奇怪，这里不分等级。

但男孩没有介意，说：Level 0。

陈默说：我也是。

然后他们两个都没有再说话，各做各的，但那种沉默的质地和刚才不一样了。

---

陈默在制造站里待了三个小时，把今天的工序做到了他预计的位置。刀还没有成形，大概还需要四次来才能完成，他对这个进度满意，满意不是因为快，是因为他做到了他今天能做到的那个位置，没有敷衍，没有在某一步上偷懒。

他在回程的路上想，这把刀做完之后他会怎么处理它。

他不知道。他做完的上两把，一把放在家里，一把送给了朋友，那个朋友用来切菜，说比他家的那把机器刀更顺手，陈默觉得那肯定是客气话，但他还是高兴了很长时间。

也许这把也送人，也许放着，也许切菜，也许什么都不做，就在抽屉里待着，作为它曾经被做出来的证明。

---

**三**

下午，陈沥来了。

不是约好的，是陈沥临时联系他说她今天项目有一个节点完成，提前结束了，想来看他。

陈默在家，说来。

陈沥比他高，这一点他始终没有完全习惯，她从十六岁就超过他了，现在比他高将近一个头，进门的时候要微微低头，这让她看起来总是带着一种不完全属于这个地方的感觉，像是某个更大的空间里出来的人，临时弯下腰来待一会儿。

她坐下来，陈默把留着的那碗豆汤热了给她，她喝了一口，说：还是这个。

语气里有什么，陈默没有追问。

她今年二十六岁，Level 6，进展很快，她的同级里有些人三十岁都还没到Level 6。陈默知道她的速度，知道这意味着什么，也知道她自己知道这意味着什么。

---

"项目完成了什么节点？"他问。

"不能说细节，"她说，然后想了一下，"但那一段轨道现在可以承载真实负荷了，不是测试负荷，是真实的。"

"好事，"陈默说。

"嗯。"她把碗放下，看着窗外，"我在想要不要申请Level 7。"

陈默等着她继续说。

"Level 7之后，参与的项目就不一样了，"她说，"不是轨道建设这种量级的，是……"她停了一下，找了一个可以在Level 0面前说的词，"更大的。"

"你想去，"陈默说，不是问句。

"我想去，"她说，"但是Level 7要签十年全身心投入合约，那十年里我的时间配置权会大幅压缩，我大概没有办法经常来这里。"

陈默听见了她在说什么。

她在说：我申请了Level 7，我来看你的时间会少很多。

她在用项目语言说一件关于他们两个人的事，因为她不太会直接说关于他们两个人的事，这是她从小就有的特点，她绕一个圈才能到达真正想说的地方，而那个圈有时候绕得很远，但她最终会到的。

---

陈默想了一会儿。

他在想，他有没有权利对这件事说任何话。

从合约体系的逻辑来看，这是她的职业路径选择，跟他没有关系；从一个父亲的逻辑来看，他有一万件事情想说。但这两套逻辑在巅峰重工集群里的权重是不对等的，他非常清楚，他选择了Level 0，他选择了把决定权让渡出去，这个选择的代价之一就是，在很多事情上，他的意见只是意见，不是决策。

他选了Level 0，他的女儿选了Level 6，她在往Level 7走，这是两个人各自做的选择，他没有资格用父亲的身份去否定她的选择。

但他可以问一个问题。

"你去了Level 7，那十年里，"他说，"你想要做的事情里，有多少是那个等级才能做的，有多少是你现在已经可以做的，但还没做？"

陈沥看着他。

"你在问我有没有遗憾，"她说。

"我在问你有没有想清楚，"他说，"这是两个不同的问题。"

她沉默了很长时间。

窗外是第七区的下午，有孩子在公共花园里跑，有人坐在长椅上，有一个老人推着什么缓慢地走，天空的颜色是那种下午四点特有的、带一点金色的白，不是早晨也不是傍晚，是在两者之间的某个时刻。

"有，"她最后说，"有一些。"

"那就先做那些，"陈默说，"Level 7不会因为你晚一年申请就消失。"

---

她在他这里待到晚上，吃了晚饭，是他做的，不是机器做的，料理系统整晚都没有启动。她帮他把碗洗了，这是她小时候就有的习惯，他从来没有要求过，她就是会去做。

临走之前，她在门口站了一下，说：你这里还是这个味道。

他问：什么味道？

她想了一下，说：没有屏幕开着的味道。

然后她走了。

---

**四**

陈默洗完碗，在客厅里坐了一会儿。

他在想，她说的"没有屏幕开着的味道"是什么意思。

他Level 4的时候，他的公寓里屏幕几乎从来不关，不是他在用，是因为它们是工作环境的一部分，是他的合约等级赋予他的工具，也是他的合约等级对他的要求，那时候信息是流动的，决策是流动的，他是那个流动中的一个节点，节点不睡觉，节点不关机。

他在Level 4待了六年。那六年里他参与了真实的、重要的事情，有一些事情他后来在公开信息里见到了结果，知道那个结果里有他的一部分，那种感觉是真实的，有一种他说不准是骄傲还是别的什么的东西。

然后他选择了离开。

不是因为累，不是因为失败，是因为有一天他在处理一份文件的时候，抬起头，看见窗外的天空，发现他不知道那天是什么天气，因为他已经三天没有看过窗外了。

那不是他想要的生活的样子。

---

他在Level 0的这十一年里，有人问过他：你不觉得可惜吗？

他每次都想了一下，然后回答说：可惜什么？

对方通常的意思是：你有那个能力，你本来可以到更高的地方，你放弃了。

陈默理解这个逻辑。在一个合约等级决定参与度的系统里，往上走是有意义的，因为往上意味着参与更大的事，意味着你的决策会影响更多的节点，意味着你的存在在这个文明的坐标系里有更大的重量。

这是真实的意义，他不否认。

但他也知道另一件事，是他在Level 4的时候慢慢想清楚的：在一个物质已经充裕到底线的文明里，往上的意义是参与和权力，往下的意义是——

他一直在想这个问题的答案。

十一年了，他没有一个干净的答案。

今天下午陈沥走了之后，他坐在那里，在安静里想这个问题，想了很长时间，最后他想到的不是一个答案，是一个画面：

他今天上午在制造站里，把金属放进炉子，看着它慢慢变红，用眼睛判断温度，用耳朵听声音，用手的感觉知道什么时候可以锻打——这整个过程里，没有任何一步可以外包给AGI，不是AGI做不到，是他不想外包，因为他想用自己的判断决定这件事，哪怕这件事的产出只是一把刀，哪怕这把刀比制造台的产品差，哪怕它对这个文明的走向没有任何影响。

他想在一件事上，用他自己的手，做他自己的判断，承担他自己的结果。

这大概就是往下的意义。

不是更重要，不是更崇高，只是一种需要，一种在一个什么都可以被完美完成的世界里，想用不完美的方式做一件事的需要。

---

**五**

晚上九点，他的屏幕亮了一下，是陈沥发来的消息，只有一句话：

我想清楚了，先不申请，我还有一件事想做完。

他回复了一个字：好。

然后把屏幕放下，拿起今天在制造站里随手画的那张刀的草图，看了一会儿，在上面改了一个地方——刀柄的弧度，他原来设计的是一个对称的曲线，现在他想改成一个非对称的，左右各不相同，因为这样握起来更符合手的自然形状，但看起来不那么整齐。

没有人告诉他该怎么改，没有AGI给他建议，没有合约等级给他权限或者限制，他只是觉得应该改，所以改了。

他把草图重新放好，关灯，去睡觉。

窗外是巅峰重工集群的夜晚，城市在运转，AGI在处理每一个需要处理的节点，轨道上有陈沥参与建造的那一段，在黑暗里安静地承载着真实的负荷，那个文明在往前走，走向星门，走向更远的地方，那个走向里有她的一部分，有那些Level 7、Level 8、Level 12的人的一部分，也有那个首席执政官的一部分，那个可能是AGI的存在，从来不需要睡觉，从来不追求豆汤的温度，从来不在草图上改一条弧度，因为它的判断是完美的，它的产出是最优的，它不需要在一件事上用不完美的方式来确认自己还在。

陈默在黑暗里，觉得这没什么不好。

完美的东西做完美的事，他做他的刀。

这颗星球足够宽，宽到两件事可以同时存在。

---

*陈沥的那件"想做完的事"，后来花了八个月。*

*完成之后她申请了Level 7。*

*十年合约里，她每年回来一次，每次待三天。*

*陈默的第三把刀在她第一次回来的时候完成了。*

*她问他这把刀什么用处。*

*他说不知道。*

*她把它带走了。*

*后来陈默听说，那把刀放在她Level 7的工作站里，每天看得见的地方。*

*他问她为什么放那里。*

*她说：*

*提醒我有些事不能外包。*`
  },
  {
    title: "深海联盟",
        key: 'deepsea',  // 子选项按钮文字
    content: `**《第四千四百七十一号》**

---

**一**

苏明到办公室的时候，走廊里只有她一个人。

深海联盟国家儿童发展局第九评估站的走廊很长，天花板很高，灯光是经过严格调校的白色，照在白色的地板上，把影子压得很短。苏明的鞋底和地面之间发出轻微的回响，一步一步，像是在测量什么。

七点零三分。她早到了二十七分钟。

这不是习惯，是今天的任务让她睡不安稳。

她把文件包放在桌上，倒了一杯水，没有喝，只是握在手里。文件包里装着的东西她昨晚已经看了三遍。第四遍不会让它改变任何内容，但她还是把文件夹打开，摊在桌上。

**儿童编号：DL-4471**
**出生年份：5494年**
**当前年龄：七岁**
**所在设施：第十七号儿童发展中心（深海区）**
**评估触发原因：情绪适应性模块连续三次未达标**
**本次评估级别：终审**

苏明在"终审"两个字上停了一秒。

然后翻到下一页。

---

DL-4471的档案很厚。这不常见——大多数进入终审程序的儿童，档案都相对简单，因为问题往往很早就出现，很早就被记录，到终审的时候已经是一个完整的下坡趋势。读这样的档案有一种令人沮丧的流畅感，像是顺着一道斜面滑下去，每一页都是更低的地方。

DL-4471不是这样的。

苏明第一次读到这份档案是在三天前，被分配来的时候。她以为会是另一份流畅的下坡，结果翻开第一页就卡住了。

**语言认知发展指数：99.3 百分位**
**逻辑推理能力：98.7 百分位**
**数学抽象能力：99.6 百分位**
**空间建模能力：97.1 百分位**
**记忆整合能力：99.1 百分位**

---

**情绪识别与回应模块：第一次评估，41分（标准线：75分）**
**情绪识别与回应模块：第二次评估，38分**
**情绪识别与回应模块：第三次评估，44分**

---

苏明当时读到这里，把文件放下来，看了一会儿天花板。

她做这份工作十一年了。她见过各种各样的失败——智力缺陷的，情绪失调的，两者都有的，两者都没有但就是无法融入集体学习环境的。她见过那种让人心疼的孩子，眼睛里什么都没有，测什么都不行，像是在出生的时候就被什么东西漏掉了。她也见过那种让人说不清楚的情况，孩子各方面都不差，但就是有某一块会触发系统的红线。

但她没见过这样的。

这孩子，从认知指标来看，是她职业生涯里见过的最好的。没有之一。

然后情绪模块三次不及格。

---

**二**

DL-4471的指定评估员是一个叫做沈卓的中年男人，在第十七号中心工作了将近二十年。苏明联系他的时候，他沉默了比正常更长的时间。

"我知道你要来，"他说，"我已经知道一个月了。"

"你对这个孩子有什么评估意见？"

又是一段沉默。苏明等着。她学会了等。

"你来看了就知道了，"沈卓最后说，"我说不清楚。"

这是第一次有人对她说"我说不清楚"。在这个系统里，一切都应该是可以说清楚的。这是深海联盟的核心信念之一：任何可以被测量的东西，都应该被测量；任何可以被描述的东西，都应该被准确描述；任何可以被优化的东西，都应该被优化。模糊是失职，含混是怠惰。

"我明天上午到，"苏明说。

"好，"沈卓说，然后停了一下，补充道，"他今天问我，明天来的人是做什么的。"

苏明的手握了一下话筒。"你怎么说的？"

"我说是来跟他聊天的。"

苏明想说这不准确，但没说出口。她把话筒放下，然后在那天晚上把档案又读了两遍。

---

第十七号儿童发展中心在深海联盟南区，靠近海岸线，建筑是那种典型的联盟风格——功能主义的外观，大量玻璃和白色混凝土，线条干净，没有任何多余的装饰。所有的装饰都在里面，在儿童活动区，在教室的墙上，那是允许的，因为那些装饰是有功能的——刺激认知发展，提供情绪锚点，引导社会化进程。

苏明进门的时候，一楼的大厅里有几个孩子在做早操，动作整齐，像一台校准好的机器。

她在前台做了登记，一个工作人员带她去找沈卓。路上经过一间教室，透过玻璃，她看见里面坐了大约二十个孩子，年龄看起来都在六到八岁之间，每个人面前都有一块发光的学习板，安静地各做各的。没有噪音，没有互相说话，没有那种苏明小时候曾经在某段旧影像资料里见过的那种混乱的教室气氛。

很好，她想。
她停了一秒，继续走。

---

沈卓比档案照片里看起来老一些。他带苏明进了他的办公室，给她倒了咖啡，然后坐下来，两手放在桌上，像是在等待某种审判。

"他现在在哪？"苏明问。

"早读。八点半之前他会在学习室三号。"

"你陪我去之前，先跟我讲讲他。"

沈卓看了她一眼，然后开始说话。他的叙述很慢，措辞很小心，像是在走一条他不确定有没有地雷的路。

DL-4471，他说，在发展中心待了七年，从出生后第三十天就入住了，在那之前短暂地记录过一个出生信息，然后是标准程序——登记，编号，分配，入住。孩子的生物学信息档案存在基因库，是封存的，不开放查阅。这是标准做法，所有在联盟出生的孩子都是这样的，因为联盟认为生物学联系不应该成为认知发展的扭曲变量。

他很快，沈卓说。不是那种表演出来的快，而是那种你跟他说什么他都一下子就接住了的那种快。四岁的时候就开始自学高阶数学。五岁的时候他们给他做的认知评估是联盟儿童发展史上分数最高的记录之一，中心把这个报告报上去了，上面有人来看过，很高兴，说这是系统优化成果的完美体现。

"然后是情绪模块，"苏明说。

沈卓点头。"五岁半，第一次例行情绪评估，不及格。我们以为是正常的发展不均衡，给他做了额外的情绪干预训练，做了四个月。六岁，第二次评估，不及格，分数还比第一次低了一点。又做了干预，换了方案，加强了强度。六岁半，第三次，还是不及格。"

"他在情绪识别测试里具体哪里失分？"

沈卓停了一下。"他能准确识别情绪，"他说，"他在情绪识别单项上的得分是九十二分，高于平均水平。"

苏明看了一下手里的档案。"那失分在哪？"

"情绪回应。"沈卓把手指交叉起来，看着自己的手，"他知道对方是什么情绪，但他不做相应的回应。不是因为他不会，我们测过，他知道标准答案是什么。但他不做。测试员问他为什么，他说——"

沈卓停了。

"他说什么？"

"他说，知道一个人在哭，和应该让他停止哭泣，是两件不同的事。"

---

**三**

学习室三号是一个朝东的房间，早上的阳光从很高的窗户斜进来，在地板上切出几道清晰的光柱。房间里有三张桌子，只坐了一个孩子。

苏明在门口站了一会儿，看着他。

他坐在靠窗的那张桌子旁边，面前是一本翻开的书，不是学习板，是真正的纸质书。这有点不寻常——在联盟，纸质书不是禁止的，但是不常见，大多数儿童从来不会主动要求纸质书，因为学习板功能更强大，内容更丰富。

他大概知道有人进来了，但没有抬头。

苏明走过去，在对面坐下。

"你好，"她说，"我叫苏明。"

他抬起头，看了她一眼。

眼睛很大，颜色很深，看人的时候不回避，也不过分地黏，就是直接地看，不加评论。

"我知道你，"他说，"你是标准核验专员。"

苏明感到一点轻微的意外，但没有表现出来。"沈老师告诉你的？"

"他说是来聊天的，"孩子说，"但他那天晚上在院子里站了很长时间，我看见他了。他只有接到坏消息的时候才会那样站。所以我查了一下，核验专员是做什么的。"

"你查到了什么？"

"你们来做终审，"他说，没有任何情绪起伏，像是在描述一道算术题，"如果终审的结论是发展缺陷，儿童会被转移到修复项目。修复项目的文件是封存的，我查不到后续记录，但从进入修复项目的儿童人数和返回主流系统的儿童人数之间的差值来看，大多数没有回来过。"

苏明把手放在桌上，很平稳。

"你分析了统计数据。"

"是的。"

"你多大了？"

"七岁零四个月。"

苏明看着他。他回看着她。窗外的阳光往前移了一点，光柱在地板上漂移，像是时间在测量自己。

"你不害怕吗？"她问。

他想了一下。不是那种紧张的想，是那种认真的想，像是在处理一道需要精确的题目。

"我不确定害怕是什么感觉，"他说，"但是我不喜欢不知道的事情。我现在知道了，反而比昨天更好一点。"

---

苏明在第十七号中心待了三天。

第一天，她做了标准的评估流程——重复了情绪识别测试，重复了回应模块，又加了几组她自己设计的附加测试。结果和档案里记录的没有本质区别，只是她坐在对面，亲眼看见这个过程，所以多了一些档案里没有的东西。

比如，他在做情绪识别测试的时候，速度非常快，几乎在图像出现的瞬间就给出了答案，而且全对。

比如，到了回应模块——测试员给出一个情绪场景，要求受测儿童选择"最恰当的回应方式"——他会慢下来，有时候很长时间不回答，然后给出一个在选项里不存在的答案。

测试员提醒他只能从选项里选，他点头表示明白，然后还是不选。

"为什么不选？"苏明问。

"这四个选项都不对，"他说。

"什么叫不对？"

"题目是：你的同伴在比赛中失败了，他很难过。你应该怎么做？选项是：A，告诉他下次会更好；B，帮他分析失败的原因；C，转移他的注意力；D，给他一个拥抱。"他把选项背出来，一字不差，"这四个选项的前提都是假设他的难过是应该被消除的。但我不知道他的难过是不是应该被消除。也许他需要难过一会儿，也许失败让他难过是合理的。我不知道，所以我没办法选。"

苏明没有立刻说话。

他看着她，继续说："如果你告诉我选D能得分，我可以选D。我知道D在这里是'正确答案'。但你刚才问我为什么不选，我就告诉你我真正想的。"

苏明在记录本上写了一行字，然后盖上本子。

"我想跟你聊一些别的，"她说，"不是测试题。"

"好，"他说。

---

**四**

第二天下午，苏明找到沈卓，把他拉到走廊的一头，轻声问他："他有朋友吗？"

沈卓摇了摇头，然后想了一下，修正道："有一个。是个叫宋淮的孩子，认知指标也很高，但比他稍弱一些。他们经常在一起，但那不是通常意义上的友谊——更像是两个人找到了一个共同的频道，可以在上面交流，然后就一直用那个频道了。"

"他跟宋淮在一起的时候，情绪回应是什么样的？"

沈卓的表情出现了一点变化，不是明显的，是那种细微的、只有在某个话题上停了太久的人才会有的收紧。"你观察到了什么？"他反问。

苏明把昨天看到的一件事告诉了他。

昨天上午，她在走廊里，隔着玻璃看见DL-4471和宋淮坐在院子里，面对面，不说话，只是坐着。然后宋淮把头侧过去，靠在DL-4471的肩膀上，DL-4471没有动，也没有说话，只是抬起一只手，放在宋淮的头上，轻轻按了一下，又拿开了。

就这样。

"测试里的题目是，"苏明说，"你的同伴难过了，你应该怎么做。他的答案是，我不知道他的难过是不是应该被消除。但我看见他和宋淮坐在一起，他知道该怎么做。"

沈卓很长时间没有说话。

走廊里的光是均匀的白色，照得什么阴影都没有。

"他在测试里撒谎了吗？"苏明问。

"没有，"沈卓说，"他在测试里说的是真的，他在院子里做的也是真的。这两件事都是真的，但测试只能测到其中一件。"

苏明把这句话记在心里，带走了。

---

第二天傍晚，她去找DL-4471，不是在评估室，而是在他平时待的那个靠窗的学习室。

她带了两杯热茶，递给他一杯，他接过去，闻了一下，点头，没有说谢谢——不是因为他不礼貌，苏明已经大约明白了，他不会在不确定一件事是否值得感谢的时候说感谢，就像他不会在不确定应该如何回应的时候给出一个标准回应。

"我想问你一个问题，"苏明说，"不是测试题，是我自己的问题。"

"可以。"

"你知道这套评估系统在测什么吗？"

他把茶杯放下，想了一会儿。"我知道官方的定义，"他说，"情绪适应性，社会融入能力，协作效率，这些都有明确的定义。但你问的不是这个，你问的是它实际上在测什么。"

"是。"

"它在测你的感受是否符合标准的感受，你的回应是否符合标准的回应。它假设存在一种普遍正确的情绪处理方式，然后测量每个人与那种方式的距离。"他停了一下，"我的距离比较远。"

"你怎么看这件事？"

他看着自己的茶杯，里面的热气一圈圈地散开。"我不确定那种普遍正确的方式是不是真的存在，"他说，"但我理解为什么这个系统要设定它。如果每个人的情绪回应方式都完全不同，协作成本会很高。让大家用同一套情绪语言，是有效率的。"

"那为什么你不用那套语言？"

他沉默了更长的时间。苏明等着。

"因为宋淮那天在院子里靠过来，我知道他需要的不是A或者B或者C或者D，"他最后说，"那四个选项里没有'什么都不做，但待在旁边'。所以如果我用那套语言，我就会做一件对他没有帮助的事，或者什么都不做，而那两种结果都不好。"

苏明喝了一口茶，放下杯子。

"你有没有想过，"她说，"如果你在测试里选了D，得了及格分，你就不会在这里跟我谈这些。"

他看着她。

"想过，"他说，"但是如果我选了D，宋淮那天下午就只会得到一个拥抱。"

---

**五**

第三天，苏明开始写报告。

这是她的职责所在，是她来这里的原因。报告的格式是固定的，有清晰的框架：受测儿童基本信息，各维度评估结果，终审结论，处置建议。每一格都有它应该填写的内容，每一个结论都有对应的标准。

她在办公室坐了很久，页面是空白的。

她想到的第一件事是深海联盟建国的那段历史。她在档案里见过，也在教育手册里读过无数遍——那是一批人在AGI诞生后的混乱年代里，在博爱联盟的地下，怀揣着一个相信人类文明的出路在于提升个体质量而非扩大个体数量的信念，用了一场战争换来的立国之基。这个国家的核心价值是：每个被带到这个世界上的人，都应该是这个世界最好的人。

她很清楚这个价值观不是邪恶的。

她也很清楚这个价值观需要一套测量体系，而测量体系有边界，而边界的另一侧站着DL-4471。

不是因为他不好，而是因为他超出了那条边界所能理解的范围。

---

她想到的第二件事是沈卓昨晚在她离开之前说的最后一句话。

他们站在走廊里，沈卓的手指轻轻地敲着门框，像是在思考什么，又像是在等她先开口。

"你在这行多少年了？"他问。

"十一年，"苏明说。

"你处理过多少终审案例？"

"这是第三十七个。"

沈卓点头。停了一下，然后说："前三十六个，你的结论是什么？"

苏明知道他在问什么。她的数据库里有记录，她的三十六个终审案例，有三十四个结论是"确认发展缺陷，建议转入修复程序"，有两个结论是"评估误差，建议返回主流系统重新跟踪"。

那两个是真正的评估误差，数据问题，不是今天这种情况。

"你知道修复程序是什么，"沈卓说，不是问句。

苏明知道。修复程序的文件是封存的，但她的职级有权限查阅。那是一套深度干预方案，基因层面的修复、神经回路的重塑、行为模式的系统性替换。成功率很高——那些从修复程序回来的孩子，情绪模块评估往往能达到八十分以上。

他们也什么都不记得了。

不是全部，是特定的部分——那套系统会保留认知能力，清除掉它判定为"功能障碍来源"的情绪模式。剩下的孩子在技术上是完整的，认知指标没有损失，情绪回应符合标准。

只是不再是原来的那个孩子了。

---

苏明在空白的报告页面上，先写了DL-4471的编号和基本信息。

然后她停下来，把窗外的海看了一会儿。深海联盟的办公楼建在海岸附近，这个评估站的窗子朝向大海，她今天上午一直开着，海风把文件的边角吹得轻轻颤动。

她在想，七年前，有个人生下了这个孩子，然后按照法律，在第三十天把他送到这里，从此不再有任何法律意义上的联系。那个人现在在做什么？她知不知道她的孩子是这个系统里见过的最聪明的孩子之一？她知不知道他会在院子里，把一只手放在朋友的头上，轻轻按一下，然后拿开？

这个问题没有任何意义。深海联盟的法律不允许这种联系，正是因为这种联系会产生情感的偏差，让无关个体的质量评估变得不客观。这是有道理的，整个系统的逻辑是自洽的。

自洽的东西不一定是对的。

但苏明也知道，如果没有这个系统，如果没有这个国家，如果没有那群人在地下用战争换来的那个信念，这颗星球上大约也不会有DL-4471。因为让他存在的，是那套把每一个生命都当作全人类共同资产来优化的系统，是那套不管你是谁的孩子都给你最好的教育资源的系统。

他的聪明，是那个系统养出来的。

而他的"缺陷"，也是那个系统定义的。

---

苏明在报告里写了很多，删掉了很多。

她最终写完的版本比她通常的报告长了将近三倍，因为她在里面写了大量她通常不写的内容——观察细节，对话记录，评估工具本身的局限性分析，以及一段她斟酌了很久才留下来的结论附注。

**附注：本案受测儿童在情绪模块评估中持续未达标，但评估过程中存在显著的测量工具与被测对象之间的认知框架不匹配。受测儿童具备完整的情绪识别能力，其回应行为在非标准环境下的实际观察中显示高度的情境适应性和他者关怀能力，但该能力不符合当前情绪模块的回应标准。建议：在作出最终处置决定之前，建议上级考虑对本案进行扩展评估，以确认当前评估工具是否充分覆盖了本案受测儿童的实际情绪功能范围。**

她在结论栏里，写下了一个不属于标准选项的字段，然后停下来，看着它。

这不在表格里。这个字段是她自己加的，不符合格式要求，在递交之后会被系统标记为异常，会有人来问她。

她知道。

她还是留着它。

---

**六**

她离开第十七号中心的那天下午，在门口碰见了DL-4471。

他不是来送她的，他不知道她今天走。他只是在那个时候从里面出来，手里拿着那本纸质书，可能是去还给图书室的，或者去哪里。

他们对视了一下。

"你要走了，"他说。

"是，"苏明说，"今天下午。"

"报告写完了？"

"写完了。"

他点了点头，没有问报告写了什么。苏明觉得他大约知道那没有意义——报告写了什么是她的事，她不会因为他问就改变，他也不会因为知道就能影响什么。这个判断很准确，也很让她难受。

"你叫什么名字？"苏明问，然后意识到这个问题有点奇怪——她当然知道他的编号，但她没有在档案里看到名字，因为发展中心的孩子通常只有编号，直到他们进入社会以后才会按照程序领取正式的个人名称。

他看了她一眼。"我给自己取了一个，"他说，"但那不是正式的，没有登记的，不算数的。"

"你给自己取了什么名字？"

他停了一下，像是在决定要不要告诉她。然后说："远。"

苏明在心里把这个字默默地念了一遍。远。

"为什么是这个字？"

"因为我喜欢距离，"他说，"距离让你看见全貌。"

苏明把文件包挎上肩膀，在他面前站了最后几秒。她想说一句话，但那句话说出来对他没有任何实际帮助，所以她没说。

她往前走了。

在路上，她想，如果有一天这个孩子以某种方式完整地长大，他会成为一个什么样的人。她想不出来——不是因为他不可知，而是因为他太可知了，可知到某种程度以至于她没办法把他放进任何她认识的坐标系里。

这很难得。

这也是为什么他在这里，等着她的报告，等着一个她也不知道会通向哪里的结果。

---

苏明在回程的交通工具上，把报告又看了一遍。

那个附注还在。

那个不符合格式的字段还在。

她把文件包合上，靠着椅背，看窗外深海联盟的海岸线在逆光里缩小，变成一条线，然后消失。

她想到了一个她在这份工作里从来没有想过的问题：那些进入修复程序的孩子，那些三十四个，他们后来是什么样的？她见过一个——几年前，在一次行业交流会上，有人带着一个修复程序的"成功案例"过来做展示，十二岁，情绪模块评估九十一分，认知指标完整，表现良好，回应得体，礼貌大方。

她当时觉得很好。

她现在想，当时她说"很好"，用的是哪套语言。

---

报告在她回到总部的第二天被提交上去，随即触发了她预料中的流程——系统标记了格式异常，她的上级约谈了她，问那个附注是什么意思，问她为什么要给自己加一个不在表格里的字段。

她解释了。她把三天里看见的和听见的说了出来，尽量客观，尽量准确，像是在做一份更长的报告。

她的上级听完，沉默了一会儿，然后问："你的结论是什么？"

"我的结论在附注里，"苏明说，"建议扩展评估。"

"那不是一个终审结论。"

"是的，"苏明说，"因为我认为当前的评估工具不足以得出一个准确的终审结论。"

她的上级又沉默了更长的时间。办公室里的光是均匀的白色，和第九评估站走廊里的光一模一样。

"苏明，"她的上级说，"你知道这份报告如果按你的格式递上去，会是什么结果。"

"我知道，"苏明说，"会被退回来要求重新填写。"

"是的。"

"我知道，"苏明说，"那我就重新填写。但附注的内容我不会删，因为那是我的实际观察，删掉它，这份报告就是不完整的，而我的职责要求我提交一份完整的报告。"

她的上级看着她。

"你在这个岗位上做了十一年，"他说。

"是的。"

"前三十六份报告里，你有没有遇到过这种情况？"

苏明想了一下，然后回答了实话："没有这么典型的。"

"所以你认为这是特例。"

"我认为这是我的工具测量范围的边界，"苏明说，"我不知道边界之外有多少个这样的特例。"

这句话说完，她自己也没料到会说这句话，所以沉默了片刻。她的上级也沉默了。

窗外是深海联盟的城市天际线，那些干净的线条，那些功能主义的建筑，那些把每一块空间都利用到最优效率的设计。这是一个非常好的城市，苏明在这里出生，在这里长大，在这里工作了十一年。这是一个相信每一个人都应该是最好的人的城市。

最好是可以被定义的。

但定义是有边界的。

---

**尾声**

三周后，苏明收到了DL-4471案例的最终处置通知。

她在通知里看见的结论是：**建议扩展评估，暂缓执行修复程序，进行为期一年的非标准追踪观察。**

这不是她见过的任何一种标准结果。

这意味着他还在那里，还是那个给自己取名叫"远"的孩子，还在那个靠窗的学习室里读他的纸质书，还会在宋淮靠过来的时候把一只手放在他的头上，轻轻按一下，然后拿开。

她在通知上盖了章，归档，关上文件夹。

然后拿出下一份待处理的案例，翻开第一页。

窗外是海。

海风把文件的边角吹得轻轻颤动。

---

*苏明不知道的是：*

*一年之后，DL-4471的追踪观察报告被提交到联盟教育委员会，引发了一场持续了将近三年的学术争议，主题是当前情绪模块评估体系的理论基础是否需要修订。*

*争议尚未结束。*

*DL-4471，那个叫做"远"的孩子，在争议期间继续留在第十七号中心，继续读他的纸质书，继续在测试里不选D，继续在院子里用他自己的方式陪伴宋淮。*

*他长高了很多。*

*沈卓说他最近开始对天文学感兴趣，每天晚上趴在宿舍的窗台上看星星，有时候看到很晚。*

*他说，从这么远的地方看，每一颗星都很完整。*`
  },
  {
    title: "此外",
        key: 'others',  // 子选项按钮文字
    content: `## 花雨

### 一

花雨立宪王国没有星环，没有太空电梯，没有那种让其他大陆的人觉得“这就是文明”的东西。

它有的是雨。

每年三百天以上的降水，把整个国家的颜色洗成一种介于绿和灰之间的、温吞的、不着急的色调。王国的国土夹在居云者商业共和国和南方联盟的缓冲带之间，面积不大，人口不多，以农业和手工艺为主，工业能力勉强够造一条像样的公路。国际组织开会的时候，花雨的代表坐在最后一排，很少发言，从来不吵架，投票的时候看南南协定的大方向，大方向看不清的时候就弃权。

没有人觉得花雨立宪王国很重要。

包括花雨人自己。

他们不觉得这有什么问题。

---

### 二

耳语者伊生在花雨北部的一个河谷里。

河谷的名字叫“慢流”，因为那条河确实流得很慢，像是一个不着急赶路的人，被两岸的树和草反复挽留。伊生的家是一栋木石结构的老房子，房顶的瓦片上长满了青苔，每年雨季的时候青苔会开出细小的黄花，远远看过去像是屋顶在发光。

伊生是河谷里唯一的耳语者。

这不是说整个河谷只有她一个人——河谷里有大约两百户人家，大部分是白尾族和不屈民，偶尔有路过的三尾聆族商贩。耳语者在这里是稀罕的存在，因为耳语者通常生活在蜂龙大陆南部，那里温暖潮湿，夜行方便，食物充足。伊生的父母是几十年前从蜂龙大陆迁徙过来的，原因她已经不太记得了，大概是战争，大概是饥荒，大概是一些耳语者不擅长记住的、过于复杂的事情。

她擅长记住的是气味和声音。

她能闻出河谷里每一种花的花期，能从空气中湿度的变化判断明天什么时候下雨，能听出邻居家的白尾族老太太今天走路的时候左脚比右脚轻——说明她的旧伤又犯了。

这些能力在花雨立宪王国没什么用，不能换钱，不能换地位，但让她活得舒服。她喜欢知道周围在发生什么，喜欢那种“一切都在预期之内”的安稳感。

她不喜欢变化。

所以当那个居云者降落在她家后院的苹果树上、压断两根树枝、翅膀扇起的风把她晾在院子里的床单吹到河里的时候，她非常、非常不高兴。

---

### 三

居云者落下来的时候没有道歉。

他先把翅膀收好，检查了一下羽毛有没有受损，然后从树枝上跳下来，拍了拍衣服上并不存在的灰尘，用一种像是在朗读报告的语气说：

“我需要一个地方躲几天。”

伊生站在门口，手里攥着晾衣杆，看着河里越漂越远的床单。

“我的床单，”她说。

“什么？”

“我的床单。你把它吹到河里了。”

居云者看了一眼河面，又看了一眼她。

“我可以赔你。”

“你用什么赔？你带钱了吗？”

他没有带钱。

这是伊生和岁余的第一次见面。

---

### 四

岁余是居云者军团国的逃兵，确切地说，是拒绝执行命令的前军官。居云者军团国和拜泪教在东海岸的摩擦持续升温，他所在的部队接到了对一处拜泪教救济站进行“有限打击”的命令。他认为那不是一个军事目标，而是平民设施。他的上级说这不是他需要判断的事。他拒绝执行，然后在被逮捕之前飞走了。

他飞了很远，从日月星大陆西侧一路向南，穿过风暴带，穿过南南协定的几层监视网，最后燃料耗尽了，迫降在花雨立宪王国一个不知道叫什么名字的河谷里。

他没有说这些。他说的只是“我需要一个地方躲几天”。

伊生后来把这些事情一点一点拼了出来，不是通过问他——他不主动说——是通过他睡觉时的梦话和偶尔看着东北方向天空时的沉默。她说这些的时候岁余不承认，说“我的梦话你不应该听”，伊生说“我能控制我的耳朵，你控制不了你的嘴”。

他们就这样开始了一段极其别扭的共处。

---

### 五

岁余住在她的杂物间里。杂物间不大，刚好放下一张行军床和他的行李。他每天把床单叠得整整齐齐，把地面扫得一尘不染，把窗户擦得像是没有玻璃。伊生第一次进去的时候被反射的光晃了眼睛，退出来撞到门框上，疼了好一会儿。

“你能不能不要这么干净？”她说。

“你能不能不要这么邋遢？”他说。

“我不邋遢。我只是没有你那种病。”

“这是一种修养。”

“这是一种病。”

他们没有在这个问题上达成共识。

但伊生注意到一件事：岁余每天都会把院子里的落叶扫成一堆，放在那棵被他压断树枝的苹果树下。她不知道他为什么要扫落叶，花雨立宪王国的秋天到处都是落叶，扫了这一堆，风一吹又来了。他好像不在乎，每天都扫。

有一天她问他为什么。

他愣了一下，说：“因为它在那里。”

她觉得这不是一个完整的答案，但也没有再问。

---

### 六

岁余不会做饭。

居云者军团国的军人有标准的配给口粮，加热即食，营养均衡，味道统一。他在军团国生活了四百多年，从来没有自己做过一顿饭。伊生花了三天接受这个事实。

“你活了四百多年，连蛋都不会煮？”

“我没有煮过。”

“你看着。我教你。”

她教他煮蛋。水烧开，蛋放进去，数三百下，捞出来，放凉水，剥壳。岁余把每一个步骤都执行得极其精确，用秒表计时，用温度计量水温，剥壳的时候像在做手术。伊生站在旁边，看着他笨拙地捏着那个滑溜溜的蛋，觉得这个世界上大概没有什么比一个四百岁的居云者用手术刀一样的态度剥鸡蛋更荒谬的画面了。

蛋煮好了。他咬了一口，脸上的表情像是被人打了一拳。

“怎么了？”伊生问。

“好吃，”他说，“这蛋好吃。”

“废话。蛋本来就好吃。”

“我不是说蛋好吃。我是说——我自己做的。”

他看着手里的蛋，看了很长时间。伊生不知道为什么觉得鼻子有点酸。

---

### 七

他们一起度过了花雨立宪王国的雨季。

雨季很长，六个月。有时候是绵绵的细雨，有时候是倾盆的大雨，偶尔会有几天放晴，但晴天的阳光太烈，岁余的眼睛受不住，他习惯在阴天或者夜里活动。居云者不是夜行动物，但他的飞行让他对强光变得敏感。伊生告诉他，没有关系，这里雨多，适合你。

雨季里他们做的事情很简单。伊生去河谷里的手工艺作坊做编织，她用当地的藤草编篮子、编席子、编帽子，手艺在河谷里算好的，能换一些生活用品。岁余留在家里，看书——从伊生的书架上找的，书架上的书不多，大部分是花雨当地的民间故事集和农业手册，他看得津津有味，像是一个第一次见到文字的人。

“你没看过这些？”伊生问。

“我读的书都是战术手册、军事史、国际法、地质勘探报告。没有民间故事。”

“那你觉得好看吗？”

“不真实，但好看。”

岁余说“好看”的时候，表情很认真，像是在做一个重要的判断。伊生偷偷笑了。

---

### 八

夜里，伊生的听觉会变得格外敏锐。

耳语者是夜行种族，他们的听力在黑暗里会达到白天的数倍。伊生在河谷里长大，习惯了夜晚的各种声音——虫鸣、风声、远处溪水的流动、邻居家狗偶尔的梦呓。但岁余来了之后，她开始听到一种新的声音。

是他的心跳。

居云者的心跳比人类慢得多，每分钟只有三四十次，沉重、缓慢、像是一个巨大的鼓在很远的地方被敲响。伊生第一次听到的时候以为是地震，趴在地上听了很久，才发现声音是从隔壁杂物间传来的。她躺在床上，闭着眼睛，数他的心跳。一、二、三、四……她数到三十多的时候，自己就睡着了。

后来她养成了一个习惯：每天晚上睡前听一会儿他的心跳。

她没有告诉他。这是她的秘密。

---

### 九

雨季结束的时候，岁余的伤口——不是身体上的，是他来这里之前心里那个洞——似乎好了一些。他开始主动跟伊生说话，讲一些关于居云者军团国的事情。他讲得很少，很克制，像是一个不敢确认自己有没有资格回忆的人在小心翼翼地试探。

“我有一个朋友，”他说，“他不在了。”

他没有说“不在”是什么意思。伊生没有问。她只是把他的杯子里的茶续上了。

那天晚上，她听到他的心跳比平时快了一些。对于居云者来说，快一些也是每分钟四十多下，但她听得出区别。

她在黑暗里轻轻地说了一句：“我在这里。”

他没有回应。但心跳慢慢回到了原来的节奏。

---

### 十

河谷里的人开始注意到岁余的存在。

一个居云者出现在花雨立宪王国的小河谷里，这件事不可能瞒太久。有人来看了，有人问了，有人拍了照片，有人说要报告给镇政府，有人说“算了人家也没干什么坏事”。

伊生的邻居，那个白尾族老太太，专门走过来看了一次。

她站在院子门口，眯着眼睛看了岁余一会儿，然后对伊生说：“他太大了。”

伊生愣了一下：“什么太大了？”

“他那个翅膀，收起来的时候还是很大。你的房子太小，他住得难受。”

岁余在一旁听懂了，但没有说话。伊生看了他一眼，发现他的耳朵尖——居云者的耳朵尖上有一小撮羽毛——微微红了一下。她从来不知道居云者会脸红。

“他住杂物间，”伊生说，“他不住我的房间。”

白尾族老太太看了她一眼，眼神里有一种“你当我没年轻过”的意思，然后拄着拐杖走了。

---

### 十一

秋天的时候，岁余修好了那棵苹果树。

他用木条和绳索把被自己压断的树枝固定回去，用一种居云者特有的耐心每天检查接口的愈合情况，给树施肥，把周围的杂草拔干净。伊生看着他在树下忙活，觉得有点好笑。

“它又不是人，你不用这么伺候它。”

“它是活的，”岁余说，“它受伤是因为我。我应该负责。”

伊生沉默了一会儿。

“你对人也会这样吗？”她问。

他停下了手里的动作，看着她。

“什么样？”

“就是——别人受伤了，你觉得你应该负责。”

“看那个人值不值得。”

“那我呢？”

岁余看着她，羽毛微微竖起又放下，像是在做一个他从来没有练习过的决定。

“你值得，”他说。

然后他继续低头修树。

---

### 十二

花雨立宪王国的冬天不冷，但很湿。

岁余的关节开始疼。居云者的骨骼是中空的，为了减轻飞行重量，但这也意味着他们的骨壁更薄，对湿气的耐受性差。他在军团国的时候住在高海拔干燥地区，从未经历过这种连绵不绝的湿冷。伊生发现他每天早上起床的时候动作比以前慢，走路的时候左脚有点拖。

“你的脚怎么了？”

“没事。”

她走过去，蹲下来，摸了摸他的脚踝。他的体温比耳语者低，脚踝处有一块凸起的骨头，摸上去比另一边热。

“你在发炎，”她说，“你的骨头受不了这里的湿气。”

“我可以忍。”

“你不能忍一辈子。”

岁余没有接这句话。

一辈子。对于一个寿命不到六十年的耳语者来说，一辈子是一个可以预见的长度。对于一个已经活了四百多年、理论上还能再活几百年的居云者来说，一辈子是一段太短的时间。

他们都意识到了这个问题。

房间里安静了。窗外的雨声填满了所有的空隙。

---

### 十三

伊生开始给岁余做护膝。

她用的是一种当地的藤草，纤维细密，经过煮晒处理后柔软而有韧性。她编织的手艺好，编出来的护膝贴合腿型，能保暖又不妨碍活动。她在里面缝了一层软皮，是上次集市上从三尾聆族商贩那里换来的。

她做这些东西的时候，岁余坐在旁边看书。他偶尔抬头看她一眼，然后又低下。伊生知道他在看，因为他的心跳又快了。

“你老看我干什么？”她没抬头。

“我没有看你。”

“你看了。”

“我在看书。”

“书在你手里。你的眼睛在看我的方向。”

岁余合上书，看着她的侧脸。她的耳朵——耳语者的耳朵大而薄，能微微转动，像两片小扇子——正在朝向他的方向。

“你的耳朵出卖了你，”他说。

“我的耳朵怎么了？”

“它们在听我的心跳。”

伊生的手停了一下，然后继续编藤草。

“你怎么知道的？”她的声音很小。

“因为你每次听到它的时候，你的呼吸会变慢。”

他们两个都没有再说话。

窗外的雨不知道什么时候停了。这是这个雨季以来的第一个晴天，阳光从云层的缝隙里漏下来，落在院子里的苹果树上。那棵被压断过的树枝上，长出了新芽。

---

### 十四

夏天的时候，有人从北边来了。

不是河谷里的人，是从镇上来的人。镇政府派了一个工作人员，带着一沓表格，说需要登记外来人口的信息。那个人看了一眼岁余，又看了一眼伊生，表情很微妙。

“居云者？”他说。

“对，”岁余说。

“哪个国家的？”

“居云者军团国。”

“为什么来这里？”

岁余没有回答。他看向伊生。伊生替他回答了。

“他是来旅游的，”她说，“花雨风景好，气候宜人，适合度假。”

工作人员用一种“你当我傻”的眼神看了她一眼，但没有追问。他在表格上写了几笔，盖了个章，就走了。花雨立宪王国对这种事情的容忍度很高，因为这里太小了，小到没有人觉得有必要为难一个住在杂物间里的逃兵。

但岁余知道，这张表格最终会往上走，会经过某个人的手，会被某台机器的算法扫到。军团国的追查迟早会到这里。

那一天晚上，他对伊生说：“我该走了。”

伊生没有问他为什么。

她只是说：“去哪？”

“不知道。往南，去南方联盟的地盘。那里有居云者的社区，我可以重新开始。”

“你走了之后，还会回来吗？”

岁余看着她。他的表情平静，但耳朵尖上的那撮小羽毛在微微颤抖。

“我可以不走了，”他说，“如果你让我留下。”

“我没有不让你留下。”

“那你会跟我走吗？”

伊生想了想。她是花雨立宪王国的公民，她的房子在这里，她的编织手艺在这里，她认识的每一个人都在这个河谷里。如果她跟他走，她会变成一个没有根的人。一个居云者社区的耳语者，身高只到别人的胸口，寿命不到别人的零头，听不懂别人说的笑话，吃别人觉得寡淡无味的食物。

她想了很久。

“你先走吧，”她说，“你安顿好了，写信给我。不，你打电话给我。我可以买个电话。然后我再看要不要过去。”

岁余说：“你不会过去的。”

伊生看着他。

“你不会过去的，”他重复了一遍，“因为你知道你过去了会不习惯。你会想你的河谷，想你的雨，想你后院的那棵苹果树。你不想离开这里。而我不想让你为了我离开你不想离开的地方。”

伊生的眼睛红了。她没有让它变成眼泪。

“那你还走不走？”她问。

“走，”他说。

“那你什么时候走？”

“后天。”

“为什么是后天？”

岁余想了一下。

“后天是晴天，适合飞行。而且你还有两天时间，可以再多编一对护膝给我。”

---

### 十五

岁余走的那天，花雨立宪王国真的放了晴。

阳光从云层后面完全露了出来，整个河谷被照得亮晶晶的，每一片叶子上的水珠都在发光。伊生站在后院里，看着岁余把翅膀展开。居云者的翼展比她整个人都长，白色的羽毛在阳光下几乎是透明的。

他背上背了一个小包，包里有一对护膝、两件换洗的衣服、一张伊生给他画的手绘地图——从花雨到南方联盟边界的路线，用简笔画标出了每一个可以落脚的地方。

“你路上小心，”伊生说。

岁余点了点头。

“你到了给我打电话。”

“我没有电话。”

“那你买一个。”

“到了再说。”

他张开翅膀，地面上的草被他扇出的风吹得贴地。伊生往后退了一步，用手挡住眼睛。

“伊生。”

她放下手，看着他。

“我——”,他说了一个字，然后停住了。他站在那里，翅膀张着，像是不知道该继续说下去还是直接起飞。

伊生等了他几秒钟，然后替他补上了他没说出来的那个字。

“我知道，”她说。

岁余看着她，看了最后一眼，然后飞走了。

她站在后院里，看着他的身影越来越小，最后变成一个白色的小点，消失在东南方向的天际线里。她站在那里，一直站到天空重新被云层盖住，站到风把她的头发吹乱，站到第一滴雨落下来，落在她的鼻尖上。

她没有哭。

她走进屋里，拿起岁余留在杂物间里的那本书——那本花雨民间故事集，他翻了很多遍，书角都卷了。她翻开他折过的那一页，是一篇关于一只鸟和一棵树的故事。鸟每年冬天飞走，春天回来，树等它。

她合上书，放回书架上。

---

### 十六

岁余离开后的第三个星期，有人从南边寄来了一封信。

信是手写的，字迹工整到刻板，一看就是居云者的风格。信的内容很短，只有三行：

“我到了。很安全。这里有一个卖电话的，明天去买。”

伊生把信看了很多遍，然后收进抽屉里。

第二天，她的电话响了。

她接起来，听见了那个熟悉的声音。隔着几千公里，隔着数不清的山脉和河流，那个声音还是带着一种刻板的、不苟言笑的语气。

“我买好了，”他说。

“你吃了没有？”她问。

“吃了。”

“吃的什么？”

“蛋。”

“自己煮的？”

“自己煮的。数了三百下。”

伊生笑了。

电话那头沉默了一会儿。

“伊生。”

“嗯。”

“那棵树，”他说，“那个故事里的树。它每年等那只鸟回来。”

“我知道。”

“我不是那只鸟。我是那只鸟的话，我不会走。”

伊生握着电话，听见他的心跳。隔着几千公里，她还是能听见。耳语者的听力好到可以跨越大陆，但这是她第一次知道，它可以跨越这么远。

“那你是什么？”她问。

岁余想了很久。

“我是那棵树吧。但我走了。”

“树不会走的。”

“所以我是一棵会走的树。很蠢。”

伊生又笑了。她笑着笑着，眼泪掉下来了。

“岁余。”

“嗯。”

“你明年春天回来看看。”

电话那头安静了几秒。

“好。”

---

### 十七

后来，岁余没有等到明年春天。

他在第二年的冬天回到了花雨立宪王国，因为伊生的电话里咳嗽了两次。他说“你是不是感冒了”，她说“没有”，他说“你骗我”，她说“你隔着几千公里怎么知道我骗你”，他说“你的呼吸声不对”。

她确实感冒了。

他回来的时候，花雨正在下雨。他降落在后院的那棵苹果树下，翅膀淋湿了，羽毛贴在身上，看上去像一只落汤的巨鸟。伊生站在门口，手里拿着一条干毛巾。

“你回来了，”她说。

“你感冒了，”他说。

“我快好了。”

“你骗人。”

“我没有骗人。你自己听。”

她走近他，把毛巾递过去。他接过毛巾，但没有擦自己，而是把它披在她的肩膀上。

雨落在他们之间，落在苹果树上，落在那根曾经断过、后来又长出新芽的树枝上。

---

很多年以后，伊生死了。

她死在一个雨天的晚上，六十一岁，在耳语者里算长寿的。岁余坐在她的床边，握着她的手。她的耳朵已经听不太清了，但他知道她还能听见他的心跳。他故意让心跳慢一些，再慢一些，慢到几乎感觉不到，这样她就不用费力气去听。

她最后笑了一下，嘴角很小的弧度，像是怕笑太多会把这个时刻用掉。

然后她闭上眼睛，呼吸停了。

岁余没有哭。居云者不擅长流泪，他们的泪腺退化了，这是进化为了减轻飞行重量的代价之一。他只能在心里替她哭，用那种每分钟三十多次的、沉重的、像远古巨兽的心脏在遥远地方敲响的方式。

他握着她的手，在黑暗里坐了很久。

窗外的雨没有停。

后来他每年春天都会回到花雨立宪王国，住在伊生的老房子里，把院子里的落叶扫成一堆，放在苹果树下。那棵树后来长得很高，枝繁叶茂，每年秋天都会结很多苹果。岁余不吃苹果，但他会摘一些放在伊生的坟前。

有人问他，你为什么不搬回来住？你一个人住在南方联盟的居云者社区，那里什么都有，你在这里什么都没有。

他说，这里有雨。

---

*花雨立宪王国没有星环，没有太空电梯，没有那种让其他大陆的人觉得“这就是文明”的东西。*

*它有的是雨，和一棵会等鸟回来的树。*





————————————————————————————————————————————————————————————————————————————————

————————————————————————————————————————————————————————————————————————————————

————————————————————————————————————————————————————————————————————————————————


## 深海的婚礼

### 一

海洋公主同盟国没有婚礼。

不是因为没有爱情。是因为海之子不结婚。

他们的繁衍方式与陆地种族完全不同。雌性海之子每七年进入一次发情期，在此期间她会释放出一种特殊的化学信息素，吸引周围数百海里内的雄性。那些被吸引而来的雄性会在她选择的巢穴附近聚集，进行一系列复杂的求偶展示——用尾鳍拍打水面、用超声波唱一种无法被其他种族听见的歌、用荧光斑纹在黑暗的深海中画出转瞬即逝的光图。雌性会从中选择一到三个雄性，交配，然后独自完成整个孕育和分娩过程。雄性在交配后离开，不参与育儿，也不会与雌性建立任何长期关系。

这不是冷漠，这是生理。海之子的神经系统没有被设计成能够维持长期一对一情感连接的结构。他们的爱情是短暂的、季节性的、与生殖周期深度绑定的。发情期结束，那种被陆地种族称为“爱”的神经化学风暴就会退去，留下的只有一种温和的、类似老朋友之间的熟悉感。

海洋公主同盟国的社会结构建立在这一生物学基础之上。没有婚姻，没有家庭，没有“父亲”这个概念。幼崽由母系社群共同抚养，整个族群都是孩子的家长。社会学家把这个叫做“后家庭时代”，但海之子不觉得这有什么“后”不“后”的，他们一直这样。

所以当苏苏说她爱上了一个人的时候，她的母亲以为她疯了。

---

### 二

苏苏是海之子，三十四岁，在海洋公主同盟国的外交部门工作。

她的工作是翻译。不是语言翻译——海之子的超声波语言可以精确地转换成几乎所有种族的语言，这是他们与生俱来的天赋。她翻译的是“意图”。

海之子的信息素系统比任何语言都复杂。一个人释放的信息素可以告诉周围的人：她的情绪状态、她的健康水平、她是否处于发情期、她对身边某个特定个体的真实态度——是友善、是警惕、是渴望、是厌恶。陆地种族闻不到这些，所以他们经常误解海之子的意思。苏苏的工作就是在正式的外交场合，用陆地种族的语言向对方解释：这个海之子代表刚才说的那句话，意思是“我同意”，但他的信息素显示他实际上在犹豫；或者，她刚才的微笑不是友好的表示，而是紧张，她的鳞片竖起来了，你看不见但你应该知道。

这份工作需要她经常与陆地种族打交道。她去过博爱大陆、去过飞升大陆、去过恩泽帝国，甚至去过一次精灵之桥——虽然她只在港口待了三天。她见过各种各样的种族，各种各样的文化，各种各样的爱情。

她以为自己对爱情免疫。

毕竟她是海之子。

---

### 三

那个人叫北陆。不屈民，三十一岁，海洋公主同盟国与南方联盟联合海洋科考队的水文工程师。

他们的第一次见面是在一艘科考船上。船叫“浪语”号，不大，勉强能容纳三十个人在海上生活三个月。苏苏作为外交联络官随船，负责与沿途经过的南方联盟港口沟通。北陆是船的工程师，整天泡在轮机舱里，苏苏在船上住了两个星期才第一次见到他。

那天船在禁咒海峡南口抛锚，因为前方有风暴——不是普通风暴，是禁咒海峡特有的元素风暴，雷达上看不清楚，但海之子的皮肤能感觉到，那种水中的元素残留会让他们鳞片下的神经末梢微微发麻。苏苏站在甲板上，闭着眼睛感受那种麻。

“你不进去吗？”一个声音从后面传来。

她回头。一个男人站在那里，不高，皮肤被太阳晒得很黑，穿着一件满是油污的工作服。他的眼睛是一种很淡的灰色，像是被海水洗褪色了。

“你在感受什么？”他问。

“风暴。它的位置，它的强度，它还要多久到。”

“你能感觉到？”

“海之子都能。”

他点了点头，在她旁边站下来，也看着海的方向。苏苏注意到他的站姿——不是海之子那种随时准备潜入水中的前倾姿势，是很稳的、脚掌完全抓住甲板的直立姿势，像一棵树。

“你看不见风暴，”苏苏说，“你在看什么？”

“看你。你在感受风暴的时候，后背的鳞片会竖起来。很好看。”

苏苏愣住了。

不是因为他说的话——不屈民说话直来直去，她知道。是因为她的信息素系统在那一瞬间产生了一个她从未记录过的信号。不是友善，不是警惕，不是渴望，不是紧张。是一种新的、她没有名字的感觉。

她决定忽略它。

---

### 四

船在海上航行了三个月。

苏苏和北陆开始经常见面。不是因为刻意，是因为船太小了，小到你无法避开同一个人超过三天。他们在餐厅遇见，在甲板上遇见，在走廊里遇见。北陆总是在看书——纸质书，在飞升大陆已经很稀有的东西，北陆仍然在使用。他看的是水文工程手册，苏苏觉得那个世界上最无聊的东西，但他看得津津有味。

有一天她问他：“你为什么总在看那本书？”

“因为我想把它记住。”

“记住之后呢？”

“之后就不用看了。我就可以做别的事。”

“什么事？”

北陆想了一下。“不知道。可能是再看一本别的。”

苏苏觉得这个回答愚蠢又可爱。她笑了，笑的时候她的信息素系统再次产生了那个无法命名的信号。这一次她没有忽略它，她试着去分析它，像分析一个外交对手的真实意图一样。她失败了。它不是一个可以被分解成化学成分的东西，它是一个整体，像海，你不能说海是氢和氧，海是海。

北陆在那天晚上送了她一个东西。

是一个很小的玻璃瓶，里面装着禁咒海峡的海水。他在瓶身上用防水笔写了一行字：“你感受到的风暴。”

苏苏把瓶子放在床头。每天晚上睡觉之前，她会把瓶子贴在脸颊上，感受里面的水在黑暗中微微晃动。她不知道为什么要这样做，只是想做。

---

### 五

科考结束的时候，船在南方联盟的一个港口靠岸。所有人下船，各自散去。苏苏要回海洋公主同盟国，北陆要去飞升大陆参加一个工程项目的面试。

他们在码头上告别。

“你以后还会在海上吗？”苏苏问。

“可能会。也可能不会。”

“那你如果不在海上了，我去哪里找你？”

北陆看着她。他的灰色眼睛在港口的光线下几乎变成了透明。

“你找不到我的时候，给我写信。不屈民还没有完全抛弃邮政系统。”

“我不知道你的地址。”

“你写信到飞升大陆西海港口第一灯塔第十一区，‘北陆’收。他们能找到我。”

苏苏点了点头。

她站在那里，看着北陆拖着行李箱走进港口的人流里。他的背影很小，很快就被其他人遮住了。她站在码头上，站了很久，直到港口的管理员过来问她要船票。

她回到海洋公主同盟国的第一件事，是去找她的母亲。

---

### 六

苏苏的母亲叫汐，是海洋公主同盟国的一位资深外交官，已经一百二十多岁了，在海之子中算中年。她的鳞片已经从年轻的银白色变成了深灰色，但眼睛还是亮的，像两颗被海水打磨过的黑石。

苏苏在她的书房里找到了她。

“妈，我想问你一件事。”

“说。”

“你有没有喜欢过一个陆地种族？”

汐放下手里的文件，看着她。

“为什么问这个？”

“因为我好像喜欢上了一个不屈民。”

汐沉默了很长时间。苏苏可以闻到她的信息素——不是愤怒，不是担忧，是一种很复杂的、混合着悲伤和理解的东西。

“你知道海之子不会爱，对不对？”汐说。

“我们的神经系统不支持长期的一对一情感连接，”苏苏复述着教科书上的话，“发情期过后，那种感觉就会消退。我知道。”

“那你为什么还说你喜欢他？”

苏苏张了张嘴，找不到一个词可以把自己胸腔里那个东西装进去。她只能用手比划了一下胸口的位置，说：

“这里有东西。”

汐看着她的手，沉默了很久。然后她站起来，走到书架的角落，从一个落满灰尘的抽屉里拿出一个小盒子。盒子是木头的，已经被海水腐蚀得变了形，上面的漆几乎完全脱落了。

“这是什么？”苏苏问。

汐没有回答。她打开盒子，里面是一缕头发，用一条褪色的丝带扎着。头发的颜色是一种很浅的灰色，像是被海水洗褪色了。

“这是不屈民的头发，”汐说，“他的。”

苏苏看着她。

“我年轻的时候，也爱过一个人，”汐说，“不屈民。他是一个水文工程师。”

苏苏的心跳漏了一拍。

“他在哪？”

汐把盒子盖上，放回抽屉里。

“他死了。很久了。海难。他们的船在禁咒海峡遇到了元素风暴，没有幸存者。”

“你——你还记得他吗？”

汐看着窗外。窗外是海，海洋公主同盟国的海，终年不冻，颜色是那种很深很深的蓝，像是被什么东西压住了，透不过气。

“我的发情期只持续了两个月，”汐说，“两个月后，我对他的那种感觉就消退了。不是慢慢消失，是像退潮一样，一夜之间就退了。第二天早上我醒来，看着他的头发，什么感觉都没有。我知道我应该难过，但我的身体不让我难过。我的鳞片不会因为想起他而竖起来，我的信息素不会因为他而改变，我的身体已经完全准备好了去爱下一个人。”

她停了一下。

“但我的记忆还记得他。我的身体忘了，我的大脑没有忘。我记得他的名字，他的声音，他看书的样子。我记得他送我的那个瓶子——他装了禁咒海峡的海水，说那是‘我感受到的风暴’。这些我都记得。”

苏苏感觉自己的喉咙被什么东西堵住了。

“你还爱他吗？”她问。

汐想了很久。

“海之子不会爱，”她最后说，“但海之子的记忆会。”

---

### 七

苏苏开始给北陆写信。

不是用信息网络——海之子有更好的通信方式，他们的超声波可以穿过几百海里的海水，但跨大陆的距离不行。她用的是一张纸，一支笔，把字写得大大的、松松的，像一个刚学会写字的孩子。

第一封信只有一句话：

“我回到海上了。你到了飞升大陆吗？”

她在信封上写：飞升大陆西海港口第一灯塔第十一区，北陆收。她不知道这个地址能不能送到，但她把信投进了海洋公主同盟国唯一的一个邮筒里——那个邮筒在海边的一个小镇上，是几百年前建的，漆已经掉光了，但邮筒还在，每周有一个人来收一次信。

然后她等。

等了四十天。

第四十一天，她收到了一封回信。信封上盖满了不同颜色的邮戳，显示这封信穿越了海洋公主同盟国的群岛、南方联盟的海岸线、飞升大陆的工业区，最后到达了第十一区的某个角落。北陆的字和他人一样，工整，刻板，每一个字的间距都一样。

“我到了。面试通过了。下个月开始上班。住在第十一区的一个小公寓里，窗户朝西，傍晚的时候有阳光。这里没有海。”

苏苏把那封信看了很多遍。她把信纸贴在脸颊上，感受纸张的纹理和墨水的味道。这不是信息素，她闻不到他的情绪，但她在纸的纤维里找到了另一种东西——耐心。一个人花了四十天等一封信，又花了不知道多少天回信，这个行为本身已经不需要信息素来解释了。

她开始写第二封信。

“没有海的地方，你怎么生活？”

他回信：“我不知道。我可能会养一盆不需要太多水的植物。”

第三封。

第四封。

第五封。

他们开始写信，不是偶尔，是规律的、每两周一封的通信。苏苏在信里告诉他海的颜色、风的强度、她最近翻译的某个外交文件里有趣的地方。北陆在信里告诉他飞升大陆的天气、工作上的进展、他养的植物——他买了一盆仙人掌，因为不需要太多水，但一个月后死了，他又买了一盆，还是死了，他说他可能需要一盆假的。

苏苏每次读他的信都会笑。笑的时候她的信息素系统会产生那个无法命名的信号。她不再试图分析它了。她只是感受它，像一个海之子不应该做的那样感受它。

---

### 八

4745年，苏苏三十九岁，北陆三十六岁。

他们已经通信五年了。

五年来他们没有见过面。不是不想，是太远。从海洋公主同盟国到飞升大陆西海港口，坐船加飞行需要将近一个月的时间，而且苏苏的外交工作不允许她离开太久，北陆的工程项目也不允许他请那么长的假。他们被距离困住了，被困在纸和墨水里，被困在每两周一次的信封里。

苏苏的母亲汐看着女儿的状态，没有说话。她的信息素暴露了一切——不是爱情，海之子不会爱，但苏苏的信息素里有一种持续的低频信号，像海底的暗流，不激烈但从未停歇。汐闻到了它，知道它意味着什么。意味着她的女儿正在用海之子的身体做一件海之子不被允许做的事。

她在爱。

但她的身体不会让她爱太久。

苏苏的发情期在三十八岁时进入了一个新的阶段。海之子女性的发情期随着年龄增长会变得越来越不规律，间隔越来越长，强度越来越低。苏苏上一次发情期是两年前，按照正常的生理节奏，她应该在未来一年内再次进入发情期。一旦发情期过去，她对北陆的所有感觉都会在一夜之间消退。

她的身体会忘记他。

她的大脑不会。

汐知道这个。苏苏也知道。

---

### 九

苏苏在第四十三年没有等来她的发情期。

她的身体比她预想的更早进入了衰老阶段。不是疾病，不是异常，只是海之子个体的生理差异——有些人早一些，有些人晚一些，她属于前者。从四十三岁开始，她不会再有任何一次发情期了，她不会再产生那种驱动她去寻找配偶的化学风暴，她的信息素系统会逐渐萎缩，她对所有雄性——包括北陆——的化学吸引力会归零。

这是一个海之子女性的正常生命历程。繁衍期结束，她将进入一个漫长的、平静的、不再被生殖本能驱动的后繁衍阶段。在这个阶段，海之子通常会把精力转向社群服务、育儿辅助和文化传承。她们不再渴望任何人，也不再被任何人渴望。这是一种解脱，也是一种告别。

苏苏知道自己不会再爱了。

不是她不想，是她的身体不允许。

她把这件事写在信里，寄给了北陆。

这是她写过的最短的一封信。

“我不会再有发情期了。海之子不爱。这是我们的生理限制。但我记得你。”

寄出这封信之后，她没有再写信。不是因为她不想，是因为她不知道说什么。她的身体已经退出了爱情的化学游戏，她的信息素不再为北陆产生任何信号，她的鳞片不会因为他而竖起来，她的心跳不会因为他而加速。她是生理意义上的、彻底的自由了。

但她睡不着。

每天晚上她躺在床上，把那个玻璃瓶贴在脸颊上，感受里面的水在黑暗中微微晃动。水是五年前从禁咒海峡装的，现在已经不新鲜了，瓶壁上长了一层薄薄的藻类，绿色的，像一个小小的海洋。她在黑暗中睁着眼睛，想北陆的脸。她记得他的灰色眼睛，他的黑皮肤，他工作服上的油污，他看书时微微皱眉的样子。

记得。她只是记得。

她的身体不配合她。她的身体说：你是海之子，你已经结束了繁衍期，你应该去照顾幼崽，应该去帮助社区里的年轻母亲，应该去做一切海之子的老年女性应该做的事。你不应该躺在床上想一个远在飞升大陆的不屈民，不应该为了一个你再也无法感受到的人浪费你的夜晚。

她想反驳她的身体，但她没有词。海之子的语言里没有“尽管身体不爱但心还在爱”这样的表达，因为海之子的语言里“爱”这个词本身就是用来描述发情期神经化学风暴的。风暴过去了，这个词就没有意义了。她不能说“我爱他”，因为她的身体不同意。

她只能说“我记得他”。

这句话在她的语言里是合法的。

---

### 十

六个月后，苏苏收到了一封信。

信封上盖满了邮戳，比以往的任何一封信都多。信封的边角已经磨破了，里面的信纸露出来一角。她打开它。

北陆的笔迹。还是那样工整，刻板，每一个字的间距都一样。但他的字比以前轻了，像是握笔的手在微微发抖。

“苏苏。我知道你不会爱了。我记得你信里写的，海之子的生理限制，发情期结束，信息素消退。我都读了。我读了很多遍。

我不懂。不屈民的生理和海之子不一样。我们的爱情不依赖于发情期，因为我们没有发情期。不屈民可以爱一个人，从二十岁爱到四十岁，爱到六十岁，爱到死。不是因为我们的身体比你们强，是因为我们的身体不会分泌那种一夜之间就退去的化学风暴。我们的爱情是缓慢的、持续的、像侵蚀海岸一样一点一点进行的。它不会消失，它只会被时间磨损，但磨损不是消失。

我不知道你能不能理解这个。你的语言里可能没有对应的词。但我还是想说：

我不会因为你不再爱了就不爱你。这不是你的问题，这不是我的问题，这不是不屈民或者海之子的问题。这只是……距离。不是海的距离，是两种身体之间的距离。

我不知道怎么办。我只知道我的仙人掌还活着。第六盆。活了三个月了。我觉得这次可以。”

苏苏拿着信，在窗前站了很久。

窗外是海。她的海，海洋公主同盟国的海，终年不冻，颜色是那种很深很深的蓝，像是被什么东西压住了，透不过气。她想，北陆住在飞升大陆的一个小公寓里，窗户朝西，傍晚的时候有阳光。他在那里养仙人掌，死了五盆，第六盆活了。他每天上班，下班，看书，写信，想她。他不需要她爱他。他知道她不会爱了。他还在。

她不知道怎么回应这件事。

她的语言里没有对应的词。

---

### 十一

苏苏没有再写信。

但她做了一件事。她请了假，买了一张去飞升大陆的船票。船从海洋公主同盟国的最南端出发，经过南方联盟的海岸线，绕过禁咒海峡，最后在飞升大陆的东岸靠岸。整个航程需要二十三天。她在船上度过了二十三个夜晚，每晚把那个玻璃瓶贴在脸颊上，感受里面的水在黑暗中微微晃动。水已经不新鲜了，藻类越来越多，瓶壁上的绿色越来越厚。但水还是水，还是那个禁咒海峡的水，还是她和他共同感受过的那个风暴。

她在飞升大陆西海港口第一灯塔下了船。

西海港口第一灯塔第十一区没有海。空气是干的，风是硬的，阳光是直的，不像海上的阳光那样被水汽散射成柔软的漫射光。苏苏的皮肤在干燥的空气里微微发紧，她的鳞片本能地收缩，想要锁住水分。她不喜欢这里。但她在这里。

她找到了北陆的公寓。不是很难找，因为北陆给了她地址，写在信里，她用了一个月的时间把它背下来了。她站在门口，抬手想敲门，手停在半空中。

她在想：她的信息素不会对北陆产生任何反应了。她见到他的时候，她的鳞片不会竖起来，她的心跳不会加速，她的身体不会有任何信号告诉他“我在意你”。她只是一个普通的海之子女性，五十一岁，鳞片从银白色变成了深灰色，眼睛下面有细纹，身上带着海的味道。

她敲了门。

门开了。北陆站在门里面。

他老了。不是“老了”，是比五年前老了。他的头发以前是全黑的，现在鬓角有了白发，脸上的皱纹比记忆里的多，但他的眼睛还是那种很淡的灰色，像是被海水洗褪色了。

他看着她，没有说话。

苏苏也没有说话。

她的信息素系统沉默得像一块石头。没有信号，没有波动，没有任何可以被她自己或者其他人读取的情绪。她的身体站在这里，但她的身体不参与这件事。只有她的大脑在参与。

“我给你写了信，”她最后说，“很多封。但没有寄。”

“写的什么？”

“不记得了。”

北陆看着她。然后他伸出手，不是握她的手，是碰了碰她鬓角的一小片鳞片。那片鳞片已经变成了深灰色，边缘微微翘起，是衰老的迹象。

“你的鳞片，”他说，“颜色变了。”

“嗯。”

“还是好看。”

苏苏的鳞片没有竖起来。她的心跳没有加速。她的身体什么都没有做。

但她的眼睛里有了水。不是眼泪，是海之子眼眶里那种特殊的、用来冲洗眼睛的咸水。她的身体在说：这不是情绪反应，这只是生理需要，我的眼睛需要被冲洗。

她骗不了任何人。

---

### 十二

北陆的公寓很小，窗户朝西，傍晚的时候确实有阳光。阳光落在他的书桌上，落在他的仙人掌上——第六盆，活着，长了新的刺，颜色比以前深了。苏苏坐在他的书桌前，用手指碰了碰仙人掌的刺。

“疼吗？”北陆问。

“不疼。海之子的皮肤比你想象的要厚。”

“那你的心呢？也厚吗？”

苏苏没有回答这个问题。

她在飞升大陆待了七天。七天里，北陆带她去了他工作的地方——第十一区的一个水文工程项目部，他负责设计海上钻井平台的结构。他的同事看到她，问“这是谁”，北陆说“一个朋友”。苏苏听到“朋友”这个词的时候，她的信息素系统依然沉默。但她的记忆中，这个词被刻进了一个很深的地方。

七天结束的时候，北陆送她去机场。

“你还会再来吗？”他问。

苏苏看着他的灰色眼睛。

“不会了，”她说，“我的发情期已经结束了，我不会再对你有任何感觉。我来这一次，是为了确认这件事。”

北陆点了点头。

“那你确认了吗？”

“确认了。”

“什么感觉？”

苏苏想了很久。

“没有感觉。”

北陆笑了一下。他的笑很轻，像是一片叶子落在水面上，没有声音，但你能看到波纹。

“那你为什么还要来？”他问。

苏苏没有回答。

她走进登机口，没有回头。

飞机起飞的时候，飞升大陆的第十一区在她脚下变得越来越小，最后变成了一个灰色的点，消失在云层下面。她闭上眼睛，把那个玻璃瓶从口袋里拿出来，贴在脸颊上。瓶壁上的藻类已经厚到几乎看不清里面的水了。但水还在。风暴还在。那个下午她在甲板上闭着眼睛感受元素风暴的画面还在。

她想起北陆说的那句话：“你在感受风暴的时候，后背的鳞片会竖起来。很好看。”

她的鳞片没有竖起来。

她的眼眶里有了水。

---

### 十三

苏苏回到海洋公主同盟国之后，不再写信了。

不是因为不想写。是因为她发现，写信这个行为本身，就是她还在试图用大脑去弥补身体的沉默。她的身体已经退出了，她的意识还在挣扎。她不想挣扎了。

她把北陆所有的信都放在一个木盒子里，和那个玻璃瓶放在一起。盒子放在床头，每天晚上睡觉之前她会打开看一眼。不看信的内容，只是看一眼信封上盖满的邮戳。那些邮戳证明了一个事实：曾经有一个人，花了很长时间，把她的名字写在信封上，投进邮筒，然后等待。

这不需要信息素来理解。

---

### 十四

又过了十年。

苏苏六十一岁了。她的鳞片已经完全变成了深灰色，边缘翘起的地方越来越多，像是一棵老树的树皮。她的视力开始衰退，听力还好，信息素系统已经完全萎缩，她闻不到任何人的情绪了，包括她自己的。

但她的记忆还在。

北陆已经很久没有来信了。最后一封信是三年前寄来的，信上说他的仙人掌死了，第七盆，他决定不再养了。他说他可能要去南方的工地待一段时间，地址会变，让她暂时不要写信。

她没有再收到任何信。

她不知道他还在不在。不知道他是在南方的某个工地上，还是已经去了别的什么地方，还是——她不敢想的那个——已经不在了。不屈民的寿命只有三四十年，北陆已经四十九岁了，在不屈民中算中老年了。他的身体可能已经不行了，他的膝盖可能已经疼得走不了路了，他的眼睛可能已经看不清字了。

她每天还是会打开那个木盒子，看一眼那些信封。

有一天，她打开盒子的时候，发现那个玻璃瓶里的水已经完全变绿了，绿到看不见瓶子的另一侧。她打开瓶盖，犹豫了一下，然后把水倒进了自己的手心里。水很凉，带着一股陈旧的、潮湿的气味。她的手心里留下了一层绿色的藻类，她把手举到眼前，看着那些细小的、活着的东西在她的皮肤上慢慢干涸。

她在想，这些藻类是从禁咒海峡来的。它们跨越了半个星球，在那一个小小的玻璃瓶里活了十几年。它们不需要爱情，不需要信息素，不需要任何海之子的生理机制。它们只需要水和光。水还有，光从窗户进来，落在她的手心上。

藻类活着。她不知道这算不算一个回答。

---

### 十五

海洋公主同盟国有一个古老的传说。

传说说，很久很久以前，海之子和不屈民是同一种生物。他们生活在海里，有鳞片，有鳍，有尾，可以在深海中呼吸。后来有些个体开始浮上水面，开始尝试在陆地上呼吸，开始在沙滩上爬行，开始用鳍支撑身体，开始把尾分开成腿。他们花了几百万年，变成了不屈民。

这个传说是假的。科学已经证明了海之子和不屈民没有共同的祖先。但海之子还是讲这个传说，因为这是一个关于“离开”的故事。有些个体选择了离开海，变成了另一种生物，学会了在陆地上爱，学会了那种缓慢的、持续的、不需要发情期的爱。留下的那些，继续在海里，继续用发情期驱动一切，继续在风暴过去之后忘记一切。

苏苏小时候听这个故事，觉得留下的那些很幸运。不需要为爱受苦，多好。

现在她觉得留下的那些很可怜。不是因为没有爱。是因为有了爱，但身体不让它留下来。

她想，如果她当初选择了离开海——不是物理上的离开，是生理上的离开，是变成另一种生物——她会不会不一样？她会不会在四十三岁之后还能继续爱？她会不会看着北陆的灰色眼睛，心跳加速，鳞片竖起，信息素奔涌，像一个正常的、陆地种族的女人那样？

会的。

如果她不是海之子的话。

但她是。她只能在她自己的身体里活着，用她的身体去爱，用她的身体去忘记。她的身体选择了忘记，她的意识选择了记得。这是海之子的宿命——在遗忘和记得之间，永远无法和解。

---

### 十六

4762年，海洋公主同盟国与苍神缘起帝国的联合军事演习在禁咒海峡举行。

苏苏作为外交部的翻译随行。她站在甲板上，闭着眼睛感受水中的元素残留。那种熟悉的、让鳞片微微发麻的感觉，和三十年前一模一样。风暴不一样了，但感觉一样。

她睁开眼睛的时候，看见远处有一艘船。不是军舰，是一艘很小的民用船，挂的是飞升大陆的旗帜。她不知道为什么注意到了那艘船，也许是因为它的航线太靠近演习区域了，也许是因为——她说不清为什么。

那艘船越来越近。

苏苏拿起望远镜，调焦，看清了船头站着一个人。

那个人不高，皮肤被太阳晒得很黑，穿着一件旧得发白的工作服。他的头发几乎全白了，但他的眼睛——苏苏在望远镜里看不清眼睛的颜色，但她知道那是什么颜色。那种被海水洗褪色的灰色。

她的鳞片没有竖起来。

她的心跳没有加速。

她的信息素系统沉默得像一块石头。

但她丢下望远镜，跑向船舷。

船靠近了。那个人站在船头，看着她。他的脸上有皱纹，很多，很深，像被风刻过的石头。他的灰色眼睛在禁咒海峡的阳光下几乎变成了透明。他看着她，没有说话。

苏苏站在船舷上，看着他。

“北陆。”她说。

“苏苏。”他说。

“你怎么在这里？”

“我听说你在这艘船上。”

“你怎么听说的？”

“我一直在打听。”

“打听了多久？”

北陆想了一下。

“三年。”

苏苏站在船舷上，海风把她的白发吹到脸上。她的鳞片没有竖起来。她的心跳没有加速。她的身体什么都没有做。但她的眼眶里有了水，这一次不是冲洗眼睛的咸水，是别的什么东西，是她没有名字的东西，是她作为海之子不应该有的东西。

“你的仙人掌呢？”她问。

“死了。第八盆。”

“你还养吗？”

“不养了。”

“为什么？”

“因为我想养的不是仙人掌。”

苏苏看着他。风很大。

“那你养什么？”她问。

北陆没有回答。他从口袋里拿出一个小瓶子，很旧的玻璃瓶，瓶壁上有绿色的藻类，厚到几乎看不清里面。但水还在。风暴还在。

“这是我当年在禁咒海峡装的水，”他说，“和你的那瓶一样。我一直留着。”

苏苏看着他手里的瓶子，看着他满是皱纹的脸，看着他灰白的头发，看着他被太阳晒得黝黑的、粗糙的手。她想起了母亲汐抽屉里的那缕头发，想起了母亲说“海之子不会爱，但海之子的记忆会”。

她想，如果爱是一种记忆，那她爱了。

从三十年前那个下午开始，从她站在甲板上感受风暴、他站在她旁边说“你的鳞片很好看”开始，她的记忆就开始替她的身体做一件她的身体做不了的事。她的记忆在爱。缓慢地、持续地、像侵蚀海岸一样一点一点地爱。三十年了，没有发情期，没有信息素，没有鳞片竖起心跳加速，什么都没有。但记忆在。

她不知道这算不算爱。

她的语言里没有对应的词。

但她从船舷上跳了下去。

---

### 十七

海水很冷。

苏苏在海水里游向北陆的船，她的鳍划开水面，她的尾巴——她平时藏在裙子下面的、海之子真正的尾巴——在海水中舒展开来。她游到船边，抓住船舷，抬起头看着他。

北陆蹲下来，伸出手。

她握住了。

他的手很粗糙，骨节很大，指甲缝里有洗不掉的油污。他的体温比海水高，比她的体温高，比她记忆中任何东西都高。她的手在他的手心里，她感觉不到任何生理上的化学反应，没有多巴胺，没有催产素，没有那种让她眩晕的神经风暴。但她感觉到了另一件事。

她的手在他的手心里，刚好装满。

“北陆，”她说。

“嗯。”

“我老了。我的鳞片不好看了。”

“好看。”

“你的眼睛也看不见了吧。你在骗我。”

“我的眼睛看不见了，但我的手摸得到。你的鳞片还是滑的。”

苏苏笑了一下。她的笑还是那个顺序——眼睛先弯，然后嘴角才跟上。她不知道自己还有这个习惯。

“你的仙人掌死了八盆，”她说，“你什么都养不活。”

“嗯。”

“那你养我吧。”

北陆看着她。

“你不是仙人掌，”他说，“你不需要养。你是海。海只需要在那里。”

苏苏的眼眶又有了水。

她爬上他的船，坐在他旁边，两个人在禁咒海峡的阳光下，看着同一片海。海的颜色不是一种，早晨是灰的，中午是蓝的，傍晚是金色的，夜里是黑的。这一天是中午，海是蓝色的，很深很深的蓝，像是被什么东西压住了，透不过气。

但有一道光从云层的缝隙里漏下来，落在海面上，把一片水照成了金色。金色很小，在广阔的深蓝里像一粒沙子。但它在那里。

苏苏看着那片金色的水，想起母亲说过的话。

“海之子不会爱。但海之子的记忆会。”

她想，也许她母亲说错了。

也许不是记忆在爱。也许是海本身。海不需要发情期，不需要信息素，不需要任何陆地种族的生理机制。海只是在那里。深的时候深，浅的时候浅，冷的时候冷，暖的时候暖。风暴来的时候它会翻涌，风暴过去之后它会恢复平静。但它一直在。它不会因为风暴过去了就消失。

苏苏靠在北陆的肩膀上。

她的鳞片没有竖起来。

她的心跳没有加速。

她的信息素系统沉默得像一块石头。

但她在。

这就够了。

---

### 尾声

海洋公主同盟国没有婚礼。

但苏苏在北陆的船上住了下来。船不大，勉强能容两个人在海上生活。他们沿着禁咒海峡的航线慢慢漂，从一个港口到另一个港口，从一个黎明到另一个黎明。

苏苏的母亲汐在得知这件事之后，没有说什么。她只是把那个木盒子里的那缕头发拿出来，走到海边，松开手。头发被海风吹走了，落在水面上，被浪冲散了。她站在那里，看着头发消失的方向，站了很久。

第二天，她给苏苏发了一条消息。不是通过信息网络，是通过海洋公主同盟国最古老的通信方式——她把一张纸折成小船，放进海里，让它顺着洋流漂。小船上只写了一句话：

“替我看看你的海。”



————————————————————————————————————————————————————————————————————————————————

————————————————————————————————————————————————————————————————————————————————

————————————————————————————————————————————————————————————————————————————————


`
  }
];


// ===== Markdown 渲染器 =====
// 将 immigData 中的纯文本 / 简单 Markdown 转换为 HTML
// 支持：## 标题、### 标题、**粗体**、*斜体*、--- 分隔线、空行分段、*小字备注*行
function renderImmigMarkdown(text) {
    const lines = text.split('\n');
    let html = '';
    let paragraphLines = []; // 暂存当前段落的文字行

    // 把暂存的行合并成一个 <p> 输出
    function flushParagraph() {
        if (paragraphLines.length === 0) return;
        const content = paragraphLines.join(' ').trim();
        if (content) {
            html += `<p class="immig-body">${inlineImmig(content)}</p>\n`;
        }
        paragraphLines = [];
    }

    for (let i = 0; i < lines.length; i++) {
        const raw  = lines[i];
        const line = raw.trim();

        if (line === '---') {
            // 分隔线：先输出当前段落，再插入 <hr>
            flushParagraph();
            html += `<hr class="immig-hr">\n`;

        } else if (line.startsWith('## ')) {
            // 二级标题（## ）
            flushParagraph();
            html += `<p class="immig-h2">${inlineImmig(line.slice(3))}</p>\n`;

        } else if (line.startsWith('### ')) {
            // 三级标题（### ）
            flushParagraph();
            html += `<p class="immig-h3">${inlineImmig(line.slice(4))}</p>\n`;

        } else if (line === '') {
            // 空行：表示段落结束，输出当前段落
            flushParagraph();

        } else {
            // 普通文字行：先检测是否是脚注行（以 * 开头且不是 **）
            if (/^\*[^*]/.test(line) && line.endsWith('*')) {
                // 形如 *这是脚注* 的行，渲染为小字备注
                flushParagraph();
                const inner = line.slice(1, -1);
                html += `<p class="immig-footnote">${inlineImmig(inner)}</p>\n`;
            } else {
                // 普通文字行，加入当前段落缓冲
                paragraphLines.push(line);
            }
        }
    }

    // 文件末尾可能还有未输出的段落
    flushParagraph();
    return html;
}

// ===== 行内 Markdown（粗体 / 斜体）=====
// 在段落文字内处理 **粗体** 和 *斜体*
function inlineImmig(text) {
    // 先处理 **粗体**（必须先于 *斜体*，否则会被错误匹配）
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 再处理 *斜体*
    text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    return text;
}

// ===== 获取面板相关 DOM 元素 =====
const immigPanel        = document.getElementById('immig-panel');           // 整个面板
const immigClose        = document.getElementById('immig-close');           // 关闭按钮 ✕
const immigNav          = document.getElementById('immig-nav');             // 左侧导航栏容器
const immigContent      = document.getElementById('immig-content');         // 右侧内容区
const immigScrollbar    = document.getElementById('immig-scrollbar');       // 滚动条轨道
const immigScrollThumb  = document.getElementById('immig-scrollbar-thumb'); // 滚动条滑块

// ===== i18n 辅助：优先取词典译文，缺失回退中文原文 (Phase 5) =====
function immigGetTitle(item) {
    if (window.I18n && item.key) {
        var v = window.I18n.t('immig.' + item.key + '.title');
        if (v !== 'immig.' + item.key + '.title') return v;
    }
    return item.title;
}
function immigGetContent(item) {
    if (window.I18n && item.key) {
        var v = window.I18n.t('immig.' + item.key + '.content');
        if (v !== 'immig.' + item.key + '.content') return v;
    }
    return item.content;
}

// ===== 初始化左侧导航按钮 =====
// 根据 immigData 数组动态生成 10 个子选项按钮
immigData.forEach((item, index) => {
    const btn = document.createElement('div');
    btn.className = 'immig-nav-btn' + (index === 0 ? ' immig-nav-btn--active' : '');
    // data-index 属性：JS 靠此值决定渲染哪条内容
    btn.dataset.index = index;
    btn.textContent = immigGetTitle(item);
    btn.dataset.immigKey = item.key;
    immigNav.appendChild(btn);
});

// ===== 渲染第0条内容（默认显示"灵魂摆渡协定"）=====
immigContent.innerHTML = renderImmigMarkdown(immigGetContent(immigData[0]));
immigPanel.dataset.activeIndex = '0';
updateImmigScrollbar(); // 初始化滑块尺寸

// ===== i18n：语言切换时刷新移民指南（导航文字 + 当前内容）(Phase 5) =====
document.addEventListener('app:languagechange', function () {
    // 刷新导航按钮文字
    var btns = immigNav.querySelectorAll('.immig-nav-btn');
    btns.forEach(function (b) {
        var k = b.dataset.immigKey;
        var item = immigData.find(function (it) { return it.key === k; });
        if (item) b.textContent = immigGetTitle(item);
    });
    // 若面板打开，重渲染当前内容
    if (immigPanel.style.display === 'block' || immigPanel.classList.contains('active')) {
        var idx = parseInt(immigPanel.dataset.activeIndex || '0', 10);
        if (immigData[idx]) {
            immigContent.innerHTML = renderImmigMarkdown(immigGetContent(immigData[idx]));
            updateImmigScrollbar();
        }
    }
});

// ===== 左侧导航按钮点击事件 =====
immigNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.immig-nav-btn');
    if (!btn) return; // 点击了非按钮区域，忽略

    const index = parseInt(btn.dataset.index, 10);

    // 第一步：移除所有按钮的选中样式
    immigNav.querySelectorAll('.immig-nav-btn').forEach(b => {
        b.classList.remove('immig-nav-btn--active');
    });

    // 第二步：给当前按钮加选中样式
    btn.classList.add('immig-nav-btn--active');

    // 第三步：渲染对应内容到右侧内容区
    immigContent.innerHTML = renderImmigMarkdown(immigGetContent(immigData[index]));
    immigPanel.dataset.activeIndex = String(index);

    // 第四步：内容区回到顶部，更新滑块
    immigContent.scrollTop = 0;
    updateImmigScrollbar();
});

// ===== 打开面板 =====
// 点击左侧侧边栏"移民生活指南"按钮时触发
document.getElementById('Immigration-Life-Guide').addEventListener('click', () => {
    immigPanel.classList.add('active');     // CSS 动画：从下方浮出
    updateImmigScrollbar();                 // 打开时更新滑块
});

// ===== 关闭面板：点击 ✕ 按钮 =====
immigClose.addEventListener('click', () => {
    immigPanel.classList.remove('active');  // CSS 动画：收回屏幕下方
});

// ===== 关闭面板：点击面板外部区域 =====
document.addEventListener('click', (e) => {
    if (
        immigPanel.classList.contains('active') &&          // 面板当前是打开的
        !immigPanel.contains(e.target) &&                   // 点击位置不在面板内
        e.target.closest('#Immigration-Life-Guide') === null // 不是触发按钮本身
    ) {
        immigPanel.classList.remove('active');
    }
});

// ===== 自定义滚动条逻辑 =====

// 【函数】根据内容区滚动状态更新滑块的高度和位置
function updateImmigScrollbar() {
    const { scrollTop, scrollHeight, clientHeight } = immigContent;

    // 滑块高度占轨道的比例 = 可见区域 / 总内容高度
    const thumbRatio  = clientHeight / scrollHeight;
    const thumbHeight = Math.max(thumbRatio * 100, 10); // 最小 10%，防止难以点击

    // 滑块顶部位置 = 滚动进度 × 剩余轨道空间
    const scrollRatio = scrollHeight > clientHeight
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
    const thumbTop = scrollRatio * (100 - thumbHeight);

    immigScrollThumb.style.height = thumbHeight + '%';
    immigScrollThumb.style.top    = thumbTop    + '%';
}

// 【事件】内容区滚动时实时更新滑块
immigContent.addEventListener('scroll', updateImmigScrollbar);

// ===== 拖动滑块以滚动内容区 =====
let immigDragging       = false; // 是否正在拖动
let immigDragStartY     = 0;     // 拖动开始时鼠标 Y 坐标
let immigDragStartScroll = 0;    // 拖动开始时内容区 scrollTop

// 鼠标按下滑块：开始拖动
immigScrollThumb.addEventListener('mousedown', (e) => {
    immigDragging        = true;
    immigDragStartY      = e.clientY;
    immigDragStartScroll = immigContent.scrollTop;
    e.preventDefault(); // 防止拖动时触发文字选中
});

// 鼠标移动：同步更新内容区滚动位置
document.addEventListener('mousemove', (e) => {
    if (!immigDragging) return;
    const trackHeight   = immigScrollbar.clientHeight;
    const deltaY        = e.clientY - immigDragStartY;
    const scrollRange   = immigContent.scrollHeight - immigContent.clientHeight;
    // 将鼠标移动距离换算成内容区滚动距离
    const scrollDelta   = (deltaY / trackHeight) * immigContent.scrollHeight;
    immigContent.scrollTop = Math.max(0, Math.min(scrollRange, immigDragStartScroll + scrollDelta));
});

// 鼠标松开：结束拖动
document.addEventListener('mouseup', () => {
    immigDragging = false;
});

// 点击轨道空白区域：跳转到对应位置
immigScrollbar.addEventListener('click', (e) => {
    if (e.target === immigScrollThumb) return; // 点到滑块本身，忽略
    const trackRect  = immigScrollbar.getBoundingClientRect();
    const clickRatio = (e.clientY - trackRect.top) / trackRect.height;
    const scrollRange = immigContent.scrollHeight - immigContent.clientHeight;
    immigContent.scrollTop = clickRatio * scrollRange;
});
// ===== 移民生活指南面板逻辑结束 =====
