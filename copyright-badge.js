/* ============================================================
 * 版权角标 + 完整版权与法律声明弹窗（三语 zh / en / ja）
 * Stargazer Project — Copyright badge & legal-notice modal
 * © 2013–2026 YANYONG. All Rights Reserved.
 *
 * 【用法】把本文件放到与 index.html 同一目录，然后在
 *   index.html 中 i18n.js 之后加入一行：
 *       <script src="copyright-badge.js"></script>
 *
 * 组件会自动：
 *   1) 把 “© 2013–2026 YANYONG · 版权声明” 链接注入到右下角
 *      Leaflet 归属栏中（紧跟在 “Leaflet” 右边）；
 *   2) 点击该链接弹出完整声明；
 *   3) 跟随站点语言（监听 app:languagechange）自动切换中/英/日。
 * 全程不修改 index.html 的 <body>，也不改动 i18n.js。
 * ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. 三语文案 ---------- */

  // 角标短文字（显示在 Leaflet 归属栏里）
  const SHORT = {
    zh: "© 2013–2026 YANYONG · 版权声明",
    en: "© 2013–2026 YANYONG · Legal Notice",
    ja: "© 2013–2026 YANYONG · 著作権表示"
  };

  // 弹窗标题
  const TITLE = {
    zh: "版权与法律声明",
    en: "Copyright & Legal Notice",
    ja: "著作権・法的通知"
  };

  const UPDATED = {
    zh: "最后更新：2026年6月",
    en: "Last updated: June 2026",
    ja: "最終更新：2026年6月"
  };

  const CLOSE_LABEL = { zh: "关闭", en: "Close", ja: "閉じる" };

  // 完整声明正文（HTML）
  const BODY = {

    zh: `
<h3>一、著作权归属</h3>
<p>本网站（以下称"本作品"）及其所包含的全部内容，著作权由 YANYONG（以下称"作者"）单独所有。</p>
<p>本作品系一部原创虚构世界观创作项目，包含但不限于以下要素：世界观设定体系、地理与历史架构、政治与经济制度设定、种族与文明设定、信仰与哲学体系、文学作品、界面美术、视觉设计、网站结构与全部源代码、以及上述全部内容的选择、编排与整合。</p>
<p>上述内容均为作者独立构思、原创撰写，或在作者主导下，经由作者进行实质性的创造性选择、编辑、修改与整合而形成。作者对本作品整体及其各组成部分的独创性表达享有完整著作权。</p>

<h3>二、关于内容的创作方式</h3>
<p>为保持透明，作者声明本作品在创作过程中部分环节使用了人工智能辅助工具：</p>
<p>部分视觉素材（包括界面图像与地图底图）由作者借助人工智能图像生成工具创作，并由作者进行了实质性的编辑、调整与整合，以形成符合本作品整体设定的最终成果。</p>
<p>本作品中明确标注为"文学作品/短篇小说"的部分文本，系借助人工智能语言模型生成，并纳入作者的整体世界观框架。除此之外的全部文字内容——包括但不限于世界观设定、制度架构、历史脉络、种族与文明描述、以及全部说明性文本——均为作者本人独立原创撰写。</p>
<p>作者对本作品中体现其独创性智力投入的全部表达，依法主张著作权。本声明中对 AI 辅助工具的披露，不构成对任何权利的放弃。</p>

<h3>三、权利保留</h3>
<p>作者保留与本作品相关的一切权利（All Rights Reserved）。在未获得作者事先书面授权的情况下，任何个人或组织不得实施下列行为：</p>
<ul>
<li>复制、下载、镜像或以任何方式存储本作品的全部或部分内容（浏览网页所必需的临时缓存除外）；</li>
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

<p class="cr-sign">© 2013–2026 YANYONG　保留所有权利</p>
`,

    en: `
<h3>1. Copyright Ownership</h3>
<p>This website (the "Work") and all content it contains are copyrighted and owned solely by YANYONG (the "Author").</p>
<p>The Work is an original work of fictional worldbuilding, including but not limited to: the worldview and setting system, geographical and historical architecture, political and economic system design, race and civilization design, belief and philosophical systems, literary works, interface artwork, visual design, website structure and all source code, and the selection, arrangement, and integration of all of the foregoing.</p>
<p>All such content was independently conceived and originally written by the Author, or formed through the Author's substantial creative selection, editing, modification, and integration under the Author's direction. The Author holds full copyright in the original expression of the Work as a whole and in each of its component parts.</p>

<h3>2. On How the Content Was Created</h3>
<p>For transparency, the Author discloses that AI-assisted tools were used in certain parts of the creative process:</p>
<p>Some visual assets (including interface images and base maps) were created by the Author with the aid of AI image-generation tools, then substantially edited, adjusted, and integrated by the Author to produce final results consistent with the Work's overall design.</p>
<p>The portions of text explicitly labeled as "literary works / short fiction" were generated with the aid of AI language models and incorporated into the Author's overall worldview framework. All other textual content — including but not limited to the worldview settings, institutional structures, historical threads, race and civilization descriptions, and all explanatory text — was independently and originally written by the Author.</p>
<p>The Author asserts copyright, as provided by law, in all expression in the Work that embodies the Author's original intellectual effort. The disclosure of AI-assisted tools in this notice does not constitute a waiver of any rights.</p>

<h3>3. Reservation of Rights</h3>
<p>The Author reserves all rights related to the Work (All Rights Reserved). Without the Author's prior written authorization, no individual or organization may:</p>
<ul>
<li>copy, download, mirror, or store all or part of the Work by any means (except temporary caching necessary for browsing the web pages);</li>
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

<p class="cr-sign">© 2013–2026 YANYONG　All Rights Reserved</p>
`,

    ja: `
<h3>一、著作権の帰属</h3>
<p>本ウェブサイト（以下「本作品」）および本作品に含まれる全てのコンテンツの著作権は、YANYONG（以下「著作者」）が単独で保有します。</p>
<p>本作品は、オリジナルのフィクション世界観創作プロジェクトであり、以下の要素を含みますが、これらに限りません：世界観設定体系、地理・歴史構造、政治・経済制度の設定、種族・文明の設定、信仰・哲学体系、文学作品、インターフェース美術、ビジュアルデザイン、ウェブサイト構造および全ソースコード、ならびに上記全ての選択・編集・統合。</p>
<p>上記のコンテンツは、著作者が独自に構想しオリジナルに執筆したもの、または著作者の主導の下で実質的な創造的選択・編集・修正・統合を経て形成されたものです。著作者は、本作品全体およびその各構成部分における独創的表現について、完全な著作権を有します。</p>

<h3>二、コンテンツの制作方法について</h3>
<p>透明性のため、著作者は本作品の制作過程の一部で人工知能（AI）支援ツールを使用したことを表明します：</p>
<p>一部のビジュアル素材（インターフェース画像および地図のベース画像を含む）は、著作者が AI 画像生成ツールを用いて制作し、著作者が実質的な編集・調整・統合を行うことで、本作品全体の設定に適合する最終的な成果物としたものです。</p>
<p>本作品中で「文学作品／短編小説」と明示されているテキストの一部は、AI 言語モデルを用いて生成され、著作者の世界観の枠組みに組み込まれたものです。それ以外の全ての文章——世界観設定、制度構造、歴史的経緯、種族・文明の記述、および全ての説明文を含みますが、これらに限りません——は、著作者本人が独自にオリジナルで執筆したものです。</p>
<p>著作者は、本作品において著作者の独創的な知的投入を体現する全ての表現について、法に基づき著作権を主張します。本通知における AI 支援ツールの開示は、いかなる権利の放棄も構成しません。</p>

<h3>三、権利の留保</h3>
<p>著作者は、本作品に関する一切の権利を留保します（All Rights Reserved）。著作者の事前の書面による許諾を得ることなく、いかなる個人または団体も、以下の行為を行ってはなりません：</p>
<ul>
<li>本作品の全部または一部を、いかなる方法によっても複製・ダウンロード・ミラーリング・保存すること（ウェブページの閲覧に必要な一時的キャッシュを除く）；</li>
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

<p class="cr-sign">© 2013–2026 YANYONG　All Rights Reserved</p>
`
  };

  /* ---------- 2. 当前语言 ---------- */
  function getLang() {
    if (window.I18n && window.I18n.lang && BODY[window.I18n.lang]) return window.I18n.lang;
    try {
      const s = localStorage.getItem("stargazer_lang");
      if (s && BODY[s]) return s;
    } catch (e) {}
    return "zh";
  }

  /* ---------- 3. 注入样式 ---------- */
  const css = `
    /* 归属栏里的版权链接 */
    .leaflet-control-attribution .cr-link {
      cursor: pointer;
      text-decoration: underline;
      white-space: nowrap;
    }
    .leaflet-control-attribution .cr-link:hover { color: #b8860b; }

    /* 遮罩 */
    #cr-overlay {
      position: fixed; inset: 0;
      background: rgba(6, 9, 18, 0.72);
      -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
      display: none; align-items: center; justify-content: center;
      z-index: 100000; padding: 20px;
    }
    #cr-overlay.cr-open { display: flex; }

    /* 弹窗主体 */
    #cr-modal {
      position: relative;
      width: 100%; max-width: 720px; max-height: 82vh;
      display: flex; flex-direction: column;
      background: linear-gradient(160deg, #0f1424 0%, #161d31 100%);
      color: #dfe4f0;
      border: 1px solid rgba(255, 210, 120, 0.28);
      border-radius: 14px;
      box-shadow:
        0 0 0 1px rgba(255, 220, 130, 0.06),
        0 18px 60px rgba(0, 0, 0, 0.6),
        0 0 40px rgba(255, 200, 80, 0.10);
      font-family: "Noto Serif SC", "Noto Serif JP", "源ノ明朝", "Yu Mincho", "游明朝", Georgia, serif;
      animation: crIn 0.28s ease both;
    }
    @keyframes crIn {
      from { opacity: 0; transform: translateY(14px) scale(0.985); }
      to   { opacity: 1; transform: none; }
    }

    /* 头部 */
    #cr-head {
      padding: 22px 28px 14px;
      border-bottom: 1px solid rgba(255, 210, 120, 0.16);
      flex: 0 0 auto;
    }
    #cr-title {
      margin: 0; font-size: 1.35rem; font-weight: 600;
      letter-spacing: 0.04em; color: #f4d58a;
    }
    #cr-updated { margin: 6px 0 0; font-size: 0.8rem; color: #8a93a8; }

    /* 正文（可滚动） */
    #cr-body {
      padding: 8px 28px 26px;
      overflow-y: auto; -webkit-overflow-scrolling: touch;
      font-size: 0.94rem; line-height: 1.95;
    }
    #cr-body h3 {
      margin: 1.5em 0 0.5em; font-size: 1.02rem; font-weight: 600;
      color: #f0c878; letter-spacing: 0.02em;
    }
    #cr-body h3:first-child { margin-top: 0.3em; }
    #cr-body p { margin: 0.5em 0; color: #cdd4e3; }
    #cr-body ul { margin: 0.5em 0; padding-left: 1.25em; color: #cdd4e3; }
    #cr-body li { margin: 0.32em 0; }
    #cr-body a { color: #9ec5ff; text-decoration: underline; }
    #cr-body .cr-sign {
      margin-top: 1.8em; padding-top: 1.1em;
      border-top: 1px solid rgba(255, 210, 120, 0.16);
      text-align: center; color: #e9c578; letter-spacing: 0.06em;
    }
    /* 滚动条 */
    #cr-body::-webkit-scrollbar { width: 9px; }
    #cr-body::-webkit-scrollbar-thumb {
      background: rgba(255, 210, 120, 0.22); border-radius: 5px;
    }

    /* 关闭按钮 */
    #cr-close {
      position: absolute; top: 14px; right: 14px;
      width: 34px; height: 34px; line-height: 30px;
      border: 1px solid rgba(255, 210, 120, 0.3);
      border-radius: 50%; background: transparent;
      color: #f4d58a; font-size: 20px; cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    #cr-close:hover { background: rgba(255, 210, 120, 0.14); transform: rotate(90deg); }

    @media (max-width: 520px) {
      #cr-head { padding: 18px 18px 12px; }
      #cr-body { padding: 6px 18px 20px; }
      #cr-title { font-size: 1.18rem; }
    }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 4. 创建弹窗 ---------- */
  const overlay = document.createElement("div");
  overlay.id = "cr-overlay";
  overlay.innerHTML =
    '<div id="cr-modal" role="dialog" aria-modal="true" aria-labelledby="cr-title">' +
    '<button id="cr-close" type="button">&times;</button>' +
    '<div id="cr-head"><h2 id="cr-title"></h2><p id="cr-updated"></p></div>' +
    '<div id="cr-body"></div>' +
    "</div>";

  const titleEl = overlay.querySelector("#cr-title");
  const updatedEl = overlay.querySelector("#cr-updated");
  const bodyEl = overlay.querySelector("#cr-body");
  const closeBtn = overlay.querySelector("#cr-close");

  function appendOverlay() {
    if (document.body) document.body.appendChild(overlay);
    else document.addEventListener("DOMContentLoaded", () => document.body.appendChild(overlay));
  }
  appendOverlay();

  function render() {
    const L = getLang();
    titleEl.textContent = TITLE[L];
    updatedEl.textContent = UPDATED[L];
    bodyEl.innerHTML = BODY[L];
    closeBtn.setAttribute("aria-label", CLOSE_LABEL[L]);
    if (link) link.textContent = SHORT[L];
  }

  function open() {
    render();
    overlay.classList.add("cr-open");
    bodyEl.scrollTop = 0;
  }
  function close() { overlay.classList.remove("cr-open"); }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("cr-open")) close();
  });

  /* ---------- 5. 注入到 Leaflet 归属栏（"Leaflet"的右边）---------- */
  let link = null;

  function injectLink() {
    const attr = document.querySelector(".leaflet-control-attribution");
    if (!attr) return false;
    if (attr.querySelector(".cr-link")) { link = attr.querySelector(".cr-link"); return true; }

    attr.appendChild(document.createTextNode(" | "));
    link = document.createElement("a");
    link.href = "#";
    link.className = "cr-link";
    link.textContent = SHORT[getLang()];
    link.addEventListener("click", (e) => { e.preventDefault(); open(); });
    attr.appendChild(link);
    return true;
  }

  // 轮询等待 Leaflet 归属栏出现（地图初始化完成后）
  function tryInject(times) {
    if (injectLink()) return;
    if (times > 0) setTimeout(() => tryInject(times - 1), 200);
  }

  function start() { tryInject(25); }   // 最多重试约 5 秒
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  /* ---------- 6. 跟随站点语言切换 ---------- */
  document.addEventListener("app:languagechange", function () {
    if (!link) injectLink();   // 万一归属栏被 Leaflet 重建，补回链接
    render();
  });
})();