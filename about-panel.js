/* ============================================================
 * 灯泡面板 · 关于本站 + 完整版权与法律声明（三语 zh / en / ja）
 * Stargazer Project — Lightbulb "About & Legal" panel
 * © 2013–2026 YANYONG. All Rights Reserved.
 *
 * 背景框：./assets/TS.png（与 PlanetaryEnvironmentAD.png 同目录）
 * 行为：点击右上角灯泡 .ui-Lightbulb 浮出本面板；点图中右上角 X
 *       或按 Esc 关闭；几何与动画与 .planet-panel 完全一致。
 *
 * 【用法】把本文件放到与 index.html 同目录，并在 index.html 中
 *   i18n.js 之后加入一行（放在 copyright-badge.js 旁边即可）：
 *       <script src="about-panel.js"></script>
 * 不需要改 index.html 的 <body>，也不需要改 i18n.js。
 * ============================================================ */
(function () {
  "use strict";

  const ASSET = "./assets/TS.png";

  /* ---------- 1. 文案（三语）---------- */

  const TITLE = {
    zh: "关于本站 · 版权与法律声明",
    en: "About · Copyright & Legal Notice",
    ja: "本サイトについて · 著作権表示"
  };
  const UPDATED = {
    zh: "最后更新：2026年6月",
    en: "Last updated: June 2026",
    ja: "最終更新：2026年6月"
  };
  const CLOSE_LABEL = { zh: "关闭", en: "Close", ja: "閉じる" };

  /* —— 网站简介（占位文案，可自行替换）—— */
  const INTRO = {
    zh: `
<h3>网站简介</h3>
<p>《观星者计划》是一部原创的虚构世界观创作项目。它以一套力求逻辑自洽的架空设定为骨架，用文学化的方式呈现政治学与历史的现实运作逻辑。</p>
<p>本项目的世界观最初构思于 2013 年，并于 2026 年整合为这一网站。</p>
<p>站内除部分美术素材借助 AI 图像工具创作外，其余设定、制度、历史脉络与说明性文字均为作者原创。这些想法源自2013年开始，并且在漫长的时间中缓慢完善，并且悲剧性的预言了现实生活中威权主义的崛起。《观星者计划》的完整内容已逾百万字，本网站只展出了一小部分。在获得沃土之前，这片花朵不会绽放。</p>`,
    en: `
<h3>About This Site</h3>
<p>"The Stargazer Project" is an original work of fictional worldbuilding. Built upon a framework of speculative settings that strive for internal logical consistency, it gives literary form to the real-world workings of political science and history.</p>
<p>The world of this project was first conceived in 2013 and consolidated into this website in 2026.</p>
<p>Aside from certain art assets created with AI image tools, all settings, institutions, historical threads, and explanatory text on this site are the author's original work. These ideas began in 2013 and were slowly refined over many years, tragically prophesying the rise of authoritarianism in the real world. The complete body of "The Stargazer Project" already exceeds one million words, of which this website displays only a small fraction. Until it finds fertile soil, this flower will not bloom.</p>`,
    ja: `
<h3>本サイトについて</h3>
<p>『観星者計画』は、オリジナルの架空世界観創作プロジェクトです。論理的な自己整合性を追求した架空設定を骨格とし、政治学と歴史の現実的な作動原理を文学的な手法で描き出します。</p>
<p>本プロジェクトの世界観は2013年に最初に構想され、2026年にこのウェブサイトとして統合されました。</p>
<p>サイト内では、一部の美術素材をAI画像ツールで制作した以外、その他の設定・制度・歴史的経緯・説明文はすべて作者によるオリジナルです。これらの構想は2013年に始まり、長い歳月をかけてゆっくりと練り上げられ、そして現実世界における権威主義の台頭を悲劇的にも予言することとなりました。『観星者計画』の全内容はすでに百万字を超えており、本ウェブサイトはそのごく一部を展示しているにすぎません。肥沃な土壌を得るまで、この花は咲くことはありません。</p>`
  };

  /* —— 完整版权与法律声明（与 copyright-badge.js 内容一致）—— */
  const NOTICE = {

    zh: `
<h3>一、著作权归属</h3>
<p>本网站（以下称"本作品"）及其所包含的全部内容，著作权由 YANYONG（以下称"作者"）单独所有。</p>
<p>本作品系一部原创虚构世界观创作项目，包含但不限于以下要素：世界观设定体系、地理与历史架构、政治与经济制度设定、种族与文明设定、信仰与哲学体系、文学作品、界面美术、视觉设计、网站结构与全部源代码、以及上述全部内容的选择、编排与整合。</p>
<p>上述内容均为作者独立构思、原创撰写，或在作者主导下，经由作者进行实质性的创造性选择、编辑、修改与整合而形成。作者对本作品整体及其各组成部分的独创性表达享有完整著作权。</p>

<h3>二、关于内容的创作方式</h3>
<p>为保持透明，作者声明本作品在创作过程中部分环节使用了人工智能辅助工具：</p>
<p>部分视觉素材（包括界面图像与地图底图）由作者借助人工智能图像生成工具创作，并由作者进行了实质性的编辑、调整与整合，以形成符合本作品整体设定的最终成果。</p>
<p>本作品包括但不限于世界观设定、制度架构、历史脉络、种族与文明描述、以及全部说明性文本——均为作者本人独立原创撰写。</p>
<p>作者对本作品中体现其独创性智力投入的全部表达，依法主张著作权。本声明中对 AI 辅助工具的披露，不构成对任何权利的放弃。</p>

<h3>三、权利保留</h3>
<p>作者保留与本作品相关的一切权利（All Rights Reserved）。在未获得作者事先书面授权的情况下，任何个人或组织不得实施下列行为：</p>
<ul>
<li>复制、下载、镜像或以任何方式存储本作品的全部或部分内容；</li>
<li>转载、传播、公开展示或公开传输本作品的全部或部分内容；</li>
<li>修改、改编、翻译、二次创作或制作衍生作品；</li>
<li>将本作品的任何部分用于商业目的，包括但不限于销售、出版、广告、产品开发或服务推广；</li>
<li>将本作品的设定、文本、美术或代码用于训练任何机器学习模型或人工智能系统；</li>
<li>移除、遮蔽或篡改本声明及任何著作权标识。</li>
</ul>

<h3>四、关于第三方组件</h3>
<p>本网站在技术实现上使用了以下开放源代码软件，相关组件的著作权归其各自权利人所有，其使用受各自开源许可证约束，不属于本作品著作权的主张范围：</p>
<ul>
<li>地图交互功能使用 Leaflet（BSD-2-Clause 许可证），著作权归 Volodymyr Agafonkin 及 Leaflet 贡献者所有。</li>
<li>本作品中涉及的真实科学信息（如系外行星开普勒452b的相关数据）来源于公开科学资料，相关事实信息本身不构成本作品的著作权主张范围。</li>
</ul>
<p>本作品为虚构创作。文中所有国家、组织、种族、人物、事件及设定均属虚构，与任何真实存在的国家、组织、团体、个人或事件无关。任何相似之处纯属巧合。</p>

<h3>五、商业使用与授权咨询</h3>
<p>作者保留将本作品用于商业开发的全部权利，包括但不限于出版、影视、游戏、周边衍生及其他商业形式。</p>
<p>如有意就本作品进行授权合作、商业使用或投资洽谈，请通过以下方式联系作者：</p>
<p>联系邮箱：<a href="mailto:starunity1789@gmail.com">starunity1789@gmail.com</a></p>
<p>在获得作者书面授权之前，任何对本作品的商业性使用均属侵权。</p>

<h3>六、侵权处理</h3>
<p>作者将依法保护其著作权及其他合法权益。对于任何未经授权使用本作品的行为，作者保留依据相关法律法规追究侵权责任的权利，包括但不限于要求停止侵权、消除影响、赔偿损失等。</p>

<h3>七、声明的解释与变更</h3>
<p>本声明的最终解释权归作者所有。作者保留随时修改本声明的权利，修改后的声明自公布之日起生效。</p>
<p>本声明的成立、效力、解释及争议解决，适用作者所在法域的相关法律。</p>

<p class="ap-sign">© 2013–2026 YANYONG　保留所有权利</p>`,

    en: `
<h3>1. Copyright Ownership</h3>
<p>This website (the "Work") and all content it contains are copyrighted and owned solely by YANYONG (the "Author").</p>
<p>The Work is an original work of fictional worldbuilding, including but not limited to: the worldview and setting system, geographical and historical architecture, political and economic system design, race and civilization design, belief and philosophical systems, literary works, interface artwork, visual design, website structure and all source code, and the selection, arrangement, and integration of all of the foregoing.</p>
<p>All such content was independently conceived and originally written by the Author, or formed through the Author's substantial creative selection, editing, modification, and integration under the Author's direction. The Author holds full copyright in the original expression of the Work as a whole and in each of its component parts.</p>

<h3>2. On How the Content Was Created</h3>
<p>For transparency, the Author discloses that AI-assisted tools were used in certain parts of the creative process:</p>
<p>Some visual assets (including interface images and base maps) were created by the Author with the aid of AI image-generation tools, then substantially edited, adjusted, and integrated by the Author to produce final results consistent with the Work's overall design.</p>
<p>This work — including but not limited to its worldbuilding, institutional structures, historical threads, descriptions of races and civilizations, and all explanatory text — was independently conceived and written by the author.</p>
<p>The Author asserts copyright, as provided by law, in all expression in the Work that embodies the Author's original intellectual effort. The disclosure of AI-assisted tools in this notice does not constitute a waiver of any rights.</p>

<h3>3. Reservation of Rights</h3>
<p>The Author reserves all rights related to the Work (All Rights Reserved). Without the Author's prior written authorization, no individual or organization may:</p>
<ul>
<li>copy, download, mirror, or store all or part of the Work by any means;</li>
<li>reproduce, distribute, publicly display, or publicly transmit all or part of the Work;</li>
<li>modify, adapt, translate, create secondary works, or produce derivative works;</li>
<li>use any part of the Work for commercial purposes, including but not limited to sale, publication, advertising, product development, or service promotion;</li>
<li>use the settings, text, artwork, or code of the Work to train any machine-learning model or artificial-intelligence system;</li>
<li>remove, obscure, or tamper with this notice or any copyright identifier.</li>
</ul>

<h3>4. On Third-Party Components</h3>
<p>This website uses the following open-source software in its technical implementation. Copyright in these components belongs to their respective rights holders, their use is governed by their respective open-source licenses, and they fall outside the scope of the copyright claimed in the Work:</p>
<ul>
<li>The map interaction feature uses Leaflet (BSD-2-Clause license); copyright belongs to Volodymyr Agafonkin and the Leaflet contributors.</li>
<li>The real scientific information referenced in the Work (such as data relating to the exoplanet Kepler-452b) is drawn from publicly available scientific sources; such factual information itself falls outside the scope of the copyright claimed in the Work.</li>
</ul>
<p>The Work is a work of fiction. All nations, organizations, races, characters, events, and settings in it are fictitious and bear no relation to any actually existing nation, organization, group, individual, or event. Any resemblance is purely coincidental.</p>

<h3>5. Commercial Use & Licensing Inquiries</h3>
<p>The Author reserves all rights to develop the Work commercially, including but not limited to publishing, film and television, games, merchandising and other derivatives, and other commercial forms.</p>
<p>For licensing cooperation, commercial use, or investment discussions regarding the Work, please contact the Author at:</p>
<p>Contact email: <a href="mailto:starunity1789@gmail.com">starunity1789@gmail.com</a></p>
<p>Prior to obtaining the Author's written authorization, any commercial use of the Work constitutes infringement.</p>

<h3>6. Handling of Infringement</h3>
<p>The Author will protect their copyright and other lawful rights and interests in accordance with the law. For any unauthorized use of the Work, the Author reserves the right to pursue liability for infringement under applicable laws and regulations, including but not limited to demanding cessation of infringement, elimination of effects, and compensation for losses.</p>

<h3>7. Interpretation and Amendment of This Notice</h3>
<p>The Author reserves the right of final interpretation of this notice. The Author reserves the right to amend this notice at any time; the amended notice takes effect upon publication.</p>
<p>The formation, validity, interpretation, and dispute resolution of this notice are governed by the relevant laws of the Author's jurisdiction.</p>

<p class="ap-sign">© 2013–2026 YANYONG　All Rights Reserved</p>`,

    ja: `
<h3>一、著作権の帰属</h3>
<p>本ウェブサイト（以下「本作品」）および本作品に含まれる全てのコンテンツの著作権は、YANYONG（以下「著作者」）が単独で保有します。</p>
<p>本作品は、オリジナルのフィクション世界観創作プロジェクトであり、以下の要素を含みますが、これらに限りません：世界観設定体系、地理・歴史構造、政治・経済制度の設定、種族・文明の設定、信仰・哲学体系、文学作品、インターフェース美術、ビジュアルデザイン、ウェブサイト構造および全ソースコード、ならびに上記全ての選択・編集・統合。</p>
<p>上記のコンテンツは、著作者が独自に構想しオリジナルに執筆したもの、または著作者の主導の下で実質的な創造的選択・編集・修正・統合を経て形成されたものです。著作者は、本作品全体およびその各構成部分における独創的表現について、完全な著作権を有します。</p>

<h3>二、コンテンツの制作方法について</h3>
<p>透明性のため、著作者は本作品の制作過程の一部で人工知能（AI）支援ツールを使用したことを表明します：</p>
<p>一部のビジュアル素材（インターフェース画像および地図のベース画像を含む）は、著作者が AI 画像生成ツールを用いて制作し、著作者が実質的な編集・調整・統合を行うことで、本作品全体の設定に適合する最終的な成果物としたものです。</p>
<p>本作品は、世界観設定・制度構造・歴史的経緯・種族および文明の描写、そしてすべての説明文を含むがこれらに限られず——いずれも作者本人が独自に創作・執筆したものです。</p>
<p>著作者は、本作品において著作者の独創的な知的投入を体現する全ての表現について、法に基づき著作権を主張します。本通知における AI 支援ツールの開示は、いかなる権利の放棄も構成しません。</p>

<h3>三、権利の留保</h3>
<p>著作者は、本作品に関する一切の権利を留保します（All Rights Reserved）。著作者の事前の書面による許諾を得ることなく、いかなる個人または団体も、以下の行為を行ってはなりません：</p>
<ul>
<li>本作品の全部または一部を、いかなる方法によっても複製・ダウンロード・ミラーリング・保存すること；</li>
<li>本作品の全部または一部を転載・配信・公開展示・公衆送信すること；</li>
<li>改変・翻案・翻訳・二次創作または派生作品の制作を行うこと；</li>
<li>本作品のいかなる部分も、販売・出版・広告・製品開発・サービス宣伝を含むがこれらに限らない商業目的に使用すること；</li>
<li>本作品の設定・テキスト・美術・コードを、いかなる機械学習モデルまたは人工知能システムの学習に使用すること；</li>
<li>本通知または著作権表示を除去・隠蔽・改ざんすること。</li>
</ul>

<h3>四、第三者コンポーネントについて</h3>
<p>本ウェブサイトは、技術的実装において以下のオープンソースソフトウェアを使用しています。これらのコンポーネントの著作権はそれぞれの権利者に帰属し、その使用はそれぞれのオープンソースライセンスに従うものであり、本作品の著作権主張の範囲には含まれません：</p>
<ul>
<li>地図のインタラクション機能には Leaflet（BSD-2-Clause ライセンス）を使用しており、著作権は Volodymyr Agafonkin および Leaflet の貢献者に帰属します。</li>
<li>本作品中で言及される実在の科学的情報（系外惑星ケプラー452bに関するデータ等）は、公開された科学資料に基づくものであり、当該事実情報自体は本作品の著作権主張の範囲には含まれません。</li>
</ul>
<p>本作品はフィクションです。作中の全ての国家・組織・種族・人物・事件・設定は架空のものであり、実在するいかなる国家・組織・団体・個人・事件とも関係ありません。類似する点があったとしても、全くの偶然です。</p>

<h3>五、商業利用およびライセンスに関するお問い合わせ</h3>
<p>著作者は、出版・映像・ゲーム・関連グッズその他の商業的形態を含むがこれらに限らない、本作品の商業的開発に関する全ての権利を留保します。</p>
<p>本作品に関するライセンス提携・商業利用・投資のご相談は、以下までご連絡ください：</p>
<p>連絡先メール：<a href="mailto:starunity1789@gmail.com">starunity1789@gmail.com</a></p>
<p>著作者の書面による許諾を得る前の、本作品のいかなる商業的利用も権利侵害となります。</p>

<h3>六、権利侵害への対応</h3>
<p>著作者は、法に基づきその著作権およびその他の正当な権利・利益を保護します。本作品の無許諾使用に対し、著作者は、侵害の差止め・影響の除去・損害賠償の請求を含むがこれらに限らない、関連法令に基づく侵害責任の追及の権利を留保します。</p>

<h3>七、本通知の解釈および変更</h3>
<p>本通知の最終的な解釈権は著作者に帰属します。著作者は、本通知をいつでも変更する権利を留保し、変更後の通知は公表日より効力を生じます。</p>
<p>本通知の成立・効力・解釈および紛争解決には、著作者の所在法域の関連法令が適用されます。</p>

<p class="ap-sign">© 2013–2026 YANYONG　All Rights Reserved</p>`
  };

  /* ---------- 2. 当前语言 ---------- */
  function getLang() {
    if (window.I18n && window.I18n.lang && NOTICE[window.I18n.lang]) return window.I18n.lang;
    try {
      const s = localStorage.getItem("stargazer_lang");
      if (s && NOTICE[s]) return s;
    } catch (e) {}
    return "zh";
  }

  /* ---------- 3. 样式 ---------- */
  const css = `
    /* 让灯泡显得可点击 */
    .ui-Lightbulb { cursor: pointer; transition: transform 0.25s ease; }
    .ui-Lightbulb:hover { transform: scale(1.08); }

    /* 面板容器：几何 / 动画与 .planet-panel 完全一致 */
    #about-panel {
      position: fixed;
      bottom: 0;
      left: 50%;
      top: 17vh;
      transform: translateX(-50%) translateY(100%);
      width: 56vw;
      height: 72vh;
      z-index: 5000;
      transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
      opacity: 0;
      pointer-events: none;
    }
    #about-panel.active {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* 背景框（TS.png），拉伸填满，和其他面板一致 */
    #about-panel .ap-bg {
      position: absolute; inset: 0;
      background-image: url('${ASSET}');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      pointer-events: none;
    }

    /* 右上角 X 关闭热区（透明，盖在图中已有的 X 上）—— 用 % 定位以跟随拉伸 */
    #about-panel .ap-close {
      position: absolute;
      left: 90.5%; top: 5%;
      width: 7%; height: 8%;
      border: none; background: transparent; cursor: pointer;
      border-radius: 50%;
      z-index: 10;
      transition: background 0.2s ease, transform 0.2s ease;
    }
    #about-panel .ap-close:hover {
      background: radial-gradient(circle, rgba(200,160,48,0.20), rgba(200,160,48,0) 70%);
      transform: scale(1.08);
    }

    /* 内容区：避开徽章(上)与四角花纹(边)，可滚动 */
    #about-panel .ap-content {
      position: absolute;
      top: 19%; left: 8.5%; right: 8.5%; bottom: 9%;
      display: flex; flex-direction: column;
      font-family: "Noto Serif SC", "Noto Serif JP", "源ノ明朝", "Yu Mincho", "游明朝", Georgia, serif;
      color: rgba(74, 58, 33, 0.92);
    }
    #about-panel .ap-title {
      margin: 0; text-align: center; flex: 0 0 auto;
      color: #5e4710; font-weight: 700;
      font-size: clamp(15px, 1.25vw, 26px);
      letter-spacing: 0.05em;
    }
    #about-panel .ap-updated {
      margin: 0.3em 0 0.6em; text-align: center; flex: 0 0 auto;
      color: #8a7a52; font-size: clamp(10px, 0.7vw, 14px);
    }

    /* 可滚动正文 */
    #about-panel .ap-body {
      flex: 1 1 auto; overflow-y: auto; padding-right: 0.8vw;
      -webkit-overflow-scrolling: touch;
      font-size: clamp(12px, 0.82vw, 17px); line-height: 1.9;
      text-align: justify;
    }
    #about-panel .ap-body h3 {
      margin: 1.4em 0 0.45em; color: #786400; font-weight: 700;
      font-size: clamp(13px, 0.95vw, 19px); letter-spacing: 0.02em;
      text-align: left;
    }
    #about-panel .ap-body h3:first-child { margin-top: 0; }
    #about-panel .ap-body p { margin: 0.45em 0; }
    #about-panel .ap-body ul { margin: 0.45em 0; padding-left: 1.3em; }
    #about-panel .ap-body li { margin: 0.3em 0; }
    #about-panel .ap-body a { color: #8a5a16; text-decoration: underline; }
    #about-panel .ap-body .ap-div {
      border: none; border-top: 1px solid rgba(120, 100, 0, 0.3);
      margin: 1.6em 0 1.2em;
    }
    #about-panel .ap-body .ap-sign {
      margin-top: 1.6em; padding-top: 1em;
      border-top: 1px solid rgba(120, 100, 0, 0.3);
      text-align: center; color: #786400; letter-spacing: 0.06em;
    }
    /* 滚动条（细金色）*/
    #about-panel .ap-body::-webkit-scrollbar { width: 8px; }
    #about-panel .ap-body::-webkit-scrollbar-track { background: transparent; }
    #about-panel .ap-body::-webkit-scrollbar-thumb {
      background: rgba(120, 100, 0, 0.35); border-radius: 4px;
    }
    #about-panel .ap-body::-webkit-scrollbar-thumb:hover { background: rgba(120, 100, 0, 0.55); }

    /* 窄屏适配：面板占满、内边距放宽一点 */
    @media (max-width: 820px) {
      #about-panel { left: 50%; top: 8vh; width: 94vw; height: 86vh; }
      #about-panel .ap-content { top: 17%; left: 9%; right: 9%; bottom: 8%; }
      #about-panel .ap-body { font-size: 14px; }
      #about-panel .ap-title { font-size: 18px; }
    }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 4. 创建面板 ---------- */
  const panel = document.createElement("div");
  panel.id = "about-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "ap-title");
  panel.innerHTML =
    '<div class="ap-bg"></div>' +
    '<button class="ap-close" type="button"></button>' +
    '<div class="ap-content">' +
    '<h2 class="ap-title" id="ap-title"></h2>' +
    '<p class="ap-updated"></p>' +
    '<div class="ap-body"></div>' +
    "</div>";

  function attach() {
    if (document.body) document.body.appendChild(panel);
    else document.addEventListener("DOMContentLoaded", () => document.body.appendChild(panel));
  }
  attach();

  const titleEl = panel.querySelector(".ap-title");
  const updatedEl = panel.querySelector(".ap-updated");
  const bodyEl = panel.querySelector(".ap-body");
  const closeBtn = panel.querySelector(".ap-close");

  function render() {
    const L = getLang();
    titleEl.textContent = TITLE[L];
    updatedEl.textContent = UPDATED[L];
    bodyEl.innerHTML = INTRO[L] + '<hr class="ap-div">' + NOTICE[L];
    closeBtn.setAttribute("aria-label", CLOSE_LABEL[L]);
  }

  function open() {
    render();
    panel.classList.add("active");
    bodyEl.scrollTop = 0;
  }
  function close() { panel.classList.remove("active"); }

  // 对外暴露，方便其它入口（如角标）复用同一面板
  window.openAboutPanel = open;
  window.closeAboutPanel = close;

  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("active")) close();
  });

  /* ---------- 5. 接管灯泡点击 ---------- */
  function wireBulb() {
    const bulb = document.querySelector(".ui-Lightbulb");
    if (!bulb) return false;
    bulb.setAttribute("role", "button");
    bulb.setAttribute("tabindex", "0");
    bulb.setAttribute("aria-label", TITLE[getLang()]);
    bulb.setAttribute("title", { zh: "关于本站 / 版权", en: "About / Copyright", ja: "概要 / 著作権" }[getLang()] || "");
    bulb.addEventListener("click", open);
    bulb.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    return true;
  }
  function startBulb(times) {
    if (wireBulb()) return;
    if (times > 0) setTimeout(() => startBulb(times - 1), 200);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => startBulb(20));
  } else {
    startBulb(20);
  }

  /* ---------- 6. 跟随站点语言切换 ---------- */
  document.addEventListener("app:languagechange", function () {
    const bulb = document.querySelector(".ui-Lightbulb");
    if (bulb) {
      bulb.setAttribute("aria-label", TITLE[getLang()]);
      bulb.setAttribute("title", { zh: "关于本站 / 版权", en: "About / Copyright", ja: "概要 / 著作権" }[getLang()] || "");
    }
    if (panel.classList.contains("active")) render();
  });
})();