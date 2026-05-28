// ==================== 🌐 国际化多语言配置 ====================

const i18n = {
    zh: {
        btnText: "English",
        title: "🔮 开启你的塔罗占卜",
        subtitle: "请在心中默想你的问题，或选择/输入下方的问题：",
        placeholder: "输入你想问的问题，例如：我这周财运如何？",
        startBtn: "契约结成，开始占卜",
        defaultQuestion: "今日运势占卜",
        presets: [
            "我今天会有好运降临吗？",
            "手头上的这笔工作今天能顺利完成吗？",
            "未来三个月内我的财运走势如何？",
            "暗恋的人对我是什么看法？",
            "如何突破我目前遇到的瓶颈？"
        ]
    },

    en: {
        btnText: "中文",
        title: "🔮 Start Your Tarot Reading",
        subtitle: "Focus on your question in mind, or select/type one below:",
        placeholder: "Type your question...",
        startBtn: "Cast the Circle & Start",
        defaultQuestion: "Daily Fortune Reading",
        presets: [
            "Will good luck find me today?",
            "Can I successfully finish my work today?",
            "What will my financial trend look like?",
            "What does my crush think of me?",
            "How can I break through my bottleneck?"
        ]
    }
};

let currentLang = 'zh';
let userQuestion = "";

// ==================== ✨ 语言切换 ====================

function updateLanguage() {

    const langData = i18n[currentLang];

    document.getElementById("lang-btn").innerText =
        langData.btnText;

    document.querySelectorAll("[data-i18n]").forEach(el => {

        const key = el.getAttribute("data-i18n");

        if (langData[key]) {
            el.innerText = langData[key];
        }
    });

    document.getElementById("question-input")
        .setAttribute("placeholder", langData.placeholder);

    document.querySelectorAll(".tag").forEach(tag => {

        const idx = tag.getAttribute("data-tag-idx");

        tag.innerText = langData.presets[idx];
    });
}

// ==================== 🎨 画布 ====================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const centerX = width / 2;
const centerY = height / 2;

const radius = 240;

const totalCards = 22;

let tarotDeck = [];
let drawnCards = [];

let isSpinning = true;
let currentAngle = 0;

// ==================== ✨ 卡牌背面 ====================

const cardBackImg = new Image();

cardBackImg.src =
"https://img.js.design/assets/element/7fe12999dae1471b8be88b48858f96e4/image/d3674640bfcc6cda984bc2d98bfbc464ee8090ff.png";

// ==================== ✨ 中文牌名 ====================

const majorArcanaZH = [

    "愚者",
    "魔术师",
    "女祭司",
    "女皇",
    "皇帝",
    "教皇",
    "恋人",
    "战车",
    "力量",
    "隐士",
    "命运之轮",
    "正义",
    "倒吊人",
    "死神",
    "节制",
    "恶魔",
    "高塔",
    "星星",
    "月亮",
    "太阳",
    "审判",
    "世界"
];
const tarotMeanings = {

愚者:{

upright:
"新的开始、冒险、自由、无限可能",

reversed:
"冲动、迷失方向、逃避现实"
},

魔术师:{

upright:
"创造力、行动力、掌控力、实现愿望",

reversed:
"欺骗、操控、缺乏行动"
},

女祭司:{

upright:
"直觉、神秘、智慧、潜意识",

reversed:
"隐藏真相、迷茫、情绪压抑"
},

女皇:{

upright:
"丰盛、母性、成长、温柔",

reversed:
"依赖、停滞、缺乏安全感"
},

皇帝:{

upright:
"权威、稳定、领导力",

reversed:
"控制欲、僵化、压迫"
},

教皇:{

upright:
"传统、信仰、精神指导",

reversed:
"叛逆、质疑规则、束缚"
},

恋人:{

upright:
"爱情、连接、选择",

reversed:
"矛盾、分离、不平衡"
},

战车:{

upright:
"胜利、前进、掌控",

reversed:
"失控、冲突、焦虑"
},

力量:{

upright:
"勇气、内在力量、耐心",

reversed:
"脆弱、自我怀疑"
},

隐士:{

upright:
"思考、探索、自省",

reversed:
"孤独、封闭"
},

命运之轮:{

upright:
"转机、命运变化、好运",

reversed:
"停滞、坏运气、循环"
},

正义:{

upright:
"公平、真相、平衡",

reversed:
"偏见、不公平"
},

倒吊人:{

upright:
"等待、牺牲、新视角",

reversed:
"拖延、停滞"
},

死神:{

upright:
"结束、重生、转变",

reversed:
"抗拒改变、停滞"
},

节制:{

upright:
"平衡、疗愈、和谐",

reversed:
"失衡、极端"
},

恶魔:{

upright:
"欲望、束缚、诱惑",

reversed:
"挣脱束缚、觉醒"
},

高塔:{

upright:
"崩塌、真相、剧变",

reversed:
"逃避变化、压抑"
},

星星:{

upright:
"希望、灵感、疗愈",

reversed:
"失望、缺乏信心"
},

月亮:{

upright:
"潜意识、幻想、迷雾",

reversed:
"真相浮现、焦虑"
},

太阳:{

upright:
"成功、快乐、能量",

reversed:
"短暂低潮、自我怀疑"
},

审判:{

upright:
"觉醒、重生、召唤",

reversed:
"逃避、自责"
},

世界:{

upright:
"完成、圆满、成功",

reversed:
"未完成、停滞"
}

};

// ==================== ✨ 初始化牌组 ====================

function initDeck() {

    tarotDeck = [];
    drawnCards = [];

    isSpinning = true;

    for (let i = 0; i < totalCards; i++) {

        const frontImg = new Image();

        // ✨ 本地塔罗牌图片
        frontImg.src =
        `cards/m${String(i).padStart(2, '0')}.jpg`;

        tarotDeck.push({

            id: i,

            name: majorArcanaZH[i],

            isUpright: Math.random() > 0.5,

            status: 'spinning',

            frontImage: frontImg,

            x: 0,
            y: 0,

            targetX: 0,
            targetY: 0,

            animProgress: 0,

            flipProgress: 0
        });
    }
}
// ==================== ✨ 动画 ====================

function animate() {

    ctx.clearRect(0, 0, width, height);

    const time = Date.now() * 0.002;

    // ==================== ✨ 星空粒子 ====================

    for (let i = 0; i < 120; i++) {

        ctx.beginPath();

        let px = (i * 97 + time * 25) % width;
        let py = (i * 57) % height;

        ctx.arc(px, py, 1.2, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(255,255,255,0.15)";

        ctx.fill();
    }

    // ==================== ✨ 中央法阵 ====================

    ctx.beginPath();

    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);

    ctx.fillStyle = 'rgba(157,115,217,0.08)';

    ctx.strokeStyle = 'rgba(212,175,55,0.35)';

    ctx.lineWidth = 2;

    ctx.fill();

    ctx.stroke();

    // ==================== ✨ 旋转 ====================

    if (isSpinning) {

        currentAngle += 0.003;
    }

    tarotDeck.forEach((card, index) => {

        let cardAngle =
            currentAngle +
            (index * (Math.PI * 2 / totalCards));

        let displayAngle = 0;

        // ==================== ✨ 旋转状态 ====================

        if (card.status === 'spinning') {

            card.x =
                centerX +
                Math.cos(cardAngle) * radius;

            card.y =
                centerY +
                Math.sin(cardAngle) * radius;

            // ✨ 漂浮感
            card.y += Math.sin(time + index) * 4;

            displayAngle = cardAngle + Math.PI / 2;
        }

        // ==================== ✨ 飞出状态 ====================

        else if (card.status === 'flying') {

            card.animProgress += 0.04;

            if (card.animProgress >= 1) {

                card.animProgress = 1;

                card.status = 'displayed';
            }

            let startX =
                centerX +
                Math.cos(cardAngle) * radius;

            let startY =
                centerY +
                Math.sin(cardAngle) * radius;

            card.x =
                startX +
                (card.targetX - startX) *
                card.animProgress;

            card.y =
                startY +
                (card.targetY - startY) *
                card.animProgress;

            let startAngle =
                cardAngle + Math.PI / 2;

            displayAngle =
                startAngle +
                (0 - startAngle) *
                card.animProgress;
        }

        // ==================== ✨ 展示状态 ====================

        else if (card.status === 'displayed') {

            card.x = card.targetX;

            card.y = card.targetY;

            displayAngle =
                card.isUpright
                ? 0
                : Math.PI;

    
        }

        // ==================== ✨ 开始绘制 ====================

        ctx.save();

        ctx.translate(card.x, card.y);

        ctx.rotate(displayAngle);

        let isDrawn =
            (card.status === 'flying' ||
             card.status === 'displayed');

        let cardW =
            isDrawn ? 110 : 55;

        let cardH =
            isDrawn ? 180 : 95;

        // ==================== ✨ 柔和 glow ====================

        ctx.shadowBlur =
            isDrawn ? 12 : 5;

        ctx.shadowColor =
            isDrawn
            ? 'rgba(255,215,0,0.3)'
            : 'rgba(157,115,217,0.25)';

        // ==================== ✨ 已翻开的牌 ====================

        if (
            card.status === 'displayed'
        ) {

            try {

                // =========================
                // ✨ 高级塔罗发光
                // =========================

                ctx.shadowBlur =
                    isDrawn ? 35 : 12;

                ctx.shadowColor =
                    card.isUpright
                    ? 'rgba(255,215,0,0.95)'
                    : 'rgba(180,20,20,0.95)';

                // =========================
                // ✨ 逆位暗化
                // =========================

                if (!card.isUpright) {

                    ctx.filter =
                        "brightness(0.72) contrast(1.25)";
                }

                // =========================
                // ✨ 主图
                // =========================

                ctx.drawImage(

                    card.frontImage,

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );

                // =========================
                // ✨ 黑色遮罩
                // =========================

                ctx.fillStyle =
                    "rgba(0,0,0,0.15)";

                ctx.fillRect(

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );

                // =========================
                // ✨ 外层金边
                // =========================

                ctx.strokeStyle =
                    "#d4af37";

                ctx.lineWidth = 3;

                ctx.strokeRect(

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );

                // =========================
                // ✨ 内层白边
                // =========================

                ctx.strokeStyle =
                    "rgba(255,255,255,0.35)";

                ctx.lineWidth = 1;

                ctx.strokeRect(

                    -cardW / 2 + 5,
                    -cardH / 2 + 5,

                    cardW - 10,
                    cardH - 10
                );

                // =========================
                // ✨ 四角符文
                // =========================

                ctx.fillStyle =
                    "#d4af37";

                ctx.font =
                    "18px serif";

                ctx.fillText(
                    "☽",
                    -cardW/2 + 8,
                    -cardH/2 + 20
                );

                ctx.fillText(
                    "☾",
                    cardW/2 - 22,
                    -cardH/2 + 20
                );

                ctx.fillText(
                    "✦",
                    -cardW/2 + 8,
                    cardH/2 - 8
                );

                ctx.fillText(
                    "✦",
                    cardW/2 - 22,
                    cardH/2 - 8
                );

                // =========================
                // ✨ 底部渐变
                // =========================

                let gradient =
                    ctx.createLinearGradient(
                        0,
                        cardH / 2 - 50,
                        0,
                        cardH / 2
                    );

                gradient.addColorStop(
                    0,
                    "rgba(0,0,0,0)"
                );

                gradient.addColorStop(
                    1,
                    "rgba(0,0,0,0.75)"
                );

                ctx.fillStyle = gradient;

                ctx.fillRect(

                    -cardW / 2,
                    cardH / 2 - 50,

                    cardW,
                    50
                );

                // =========================
                // ✨ 恢复滤镜
                // =========================

                ctx.filter = "none";

            } catch (e) {

                ctx.fillStyle =
                    '#f5f2eb';

                ctx.fillRect(

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );
            }
        }

        // ==================== ✨ 未翻开牌背 ====================

        else {

            try {

                ctx.drawImage(

                    cardBackImg,

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );

                ctx.strokeStyle =
                    '#9d73d9';

                ctx.lineWidth = 1;

                ctx.strokeRect(

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );

            } catch (e) {

                ctx.fillStyle =
                    '#4a2e80';

                ctx.fillRect(

                    -cardW / 2,
                    -cardH / 2,

                    cardW,
                    cardH
                );
            }
        }

        ctx.restore();
    });

    requestAnimationFrame(animate);
}

// ==================== ✨ 抽牌 ====================

function drawACard() {

    if (drawnCards.length >= 3) return;

    let availableCards =
        tarotDeck.filter(
            c => c.status === 'spinning'
        );

    if (availableCards.length === 0) return;

    let selectedCard =
        availableCards[
            Math.floor(
                Math.random() *
                availableCards.length
            )
        ];

    let slotIndex =
        drawnCards.length;

    selectedCard.targetX =
        centerX +
        (slotIndex - 1) * 150;

    selectedCard.targetY =
        centerY;

    selectedCard.status =
        'flying';

    drawnCards.push(selectedCard);

    if (drawnCards.length === 3) {

        isSpinning = false;

        generateReading();
    }
}

// ==================== ✨ 初始化 ====================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById("question-input");

        const randomBtn =
            document.getElementById("random-btn");

        const startBtn =
            document.getElementById("start-btn");

        const tags =
            document.querySelectorAll(".tag");

        const overlay =
            document.getElementById("dialog-overlay");

        const canvasEl =
            document.getElementById("canvas");

        const langBtn =
            document.getElementById("lang-btn");

        updateLanguage();

        langBtn.addEventListener(
            "click",
            () => {

                currentLang =
                    currentLang === 'zh'
                    ? 'en'
                    : 'zh';

                updateLanguage();
            }
        );

        tags.forEach(tag => {

            tag.addEventListener(
                "click",
                () => {

                    input.value =
                        tag.innerText;
                }
            );
        });

        randomBtn.addEventListener(
            "click",
            () => {

                const langData =
                    i18n[currentLang];

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        langData.presets.length
                    );

                input.value =
                    langData.presets[randomIndex];
            }
        );

        startBtn.addEventListener(
            "click",
            () => {

                userQuestion =
                    input.value.trim() ||
                    i18n[currentLang].defaultQuestion;

                overlay.style.display =
                    "none";

                canvasEl.style.display =
                    "block";

                initDeck();

                animate();
            }
        );

        canvasEl.addEventListener(
            "click",
            () => {

                drawACard();
            }
        );
    });
async function generateReading(){

    const readingBox =
    document.getElementById("reading-box");

    const readingContent =
    document.getElementById("reading-content");

    // =========================
    // ✨ 三张牌
    // =========================

    const cardsText =
    drawnCards.map((c,i)=>{

        const position =
        i === 0
        ? (currentLang === 'zh' ? '过去' : 'Past')
        : i === 1
        ? (currentLang === 'zh' ? '现在' : 'Present')
        : (currentLang === 'zh' ? '未来' : 'Future');

        return `
${position}：
${c.name}
${c.isUpright ? '正位' : '逆位'}
`;
    }).join('\n');

    // =========================
    // ✨ Prompt
    // =========================

    const prompt =
`
你是一位神秘而富有哲理的塔罗占卜师。

用户的问题：
${userQuestion}

抽到的三张牌：

${cardsText}

请根据牌面、
正逆位、
过去现在未来牌阵，
进行详细解读。

语言：
${currentLang === 'zh' ? '中文' : 'English'}

风格：
神秘、
诗意、
治愈、
具有命运感。
`;

    // =========================
    // ✨ loading
    // =========================

    readingBox.style.display = "block";

    readingContent.innerHTML =
    currentLang === 'zh'
    ? "🔮 AI 正在解读命运..."
    : "🔮 AI is reading your destiny...";

    // =========================
    // ✨ 调 OpenAI
    // =========================

    try{

    const response =
    await fetch(
    "/api/reading",
    {
        method:"POST",

        headers:{

            "Content-Type":"application/json",

        },

        body:JSON.stringify({

            model:"openai/gpt-3.5-turbo",

            messages:[

                {
                    role:"system",

                    content:`
    你是一位神秘、
    诗意、
    富有哲理的塔罗占卜师。
    `
                },

                {
                    role:"user",

                    content:`

    用户问题：

    ${userQuestion}

    抽到的牌：

    ${drawnCards.map((c,i)=>`

    ${i===0 ? '过去' :
    i===1 ? '现在' : '未来'}

    ：
    ${c.name}

    ${c.isUpright ? '正位' : '逆位'}
    牌义：

    ${
    c.isUpright
    ? tarotMeanings[c.name].upright
    : tarotMeanings[c.name].reversed
    }

    `).join('')}

    请详细解读。
    `
                }
            ]
        })
    }
    );

const data =
await response.json();

console.log(data);

if(data.error){

readingContent.innerHTML =
"❌ " + data.error.message;

return;
}

const text =
data.choices[0]
.message.content;

readingContent.innerHTML =
text.replace(/\n/g,"<br>");

}catch(err){

console.log(err);

readingContent.innerHTML =
"❌ AI 请求失败";

}
const data =
await response.json();

console.log(data);

const text =
data.choices[0]
.message.content;

readingContent.innerHTML =
text.replace(/\n/g,"<br>");


document
.getElementById("close-reading")
.addEventListener(
"click",
()=>{

document.getElementById(
"reading-box"
).style.display = "none";

})};