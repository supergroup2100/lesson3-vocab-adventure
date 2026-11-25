// Lesson 3 Vocabulary Data (Pages 132-133)
// Stage 1: Dialogue (#1-13) - 看英文選中文 / 聽音選字
// Stage 2: Word Power + Utensils (#14-24) - 看中文選英文
// Stage 3: Reading + Idioms (#25-35 + Idiom) - 課本例句挖空選擇題

window.VOCAB_STAGES = [
  {
    id: 1,
    title: "第一關：美味廚房街道",
    subtitle: "看英文 / 聽發音 ➔ 選中文意思",
    theme: "kitchen",
    questionType: "en_to_zh",
    description: "Dialogue 單字（13 個）｜收集食材，準備美味的百樂餐！",
    words: [
      {
        num: 1,
        word: "please",
        phonetic: "[pliz]",
        pos: "adv.",
        zh: "請",
        sentence: "Please stand up.",
        cloze: "______ stand up."
      },
      {
        num: 2,
        word: "put",
        phonetic: "[pʊt]",
        pos: "v.",
        zh: "放",
        sentence: "Put your shoes here, please.",
        cloze: "______ your shoes here, please."
      },
      {
        num: 3,
        word: "dish",
        phonetic: "[dɪʃ]",
        pos: "n.",
        zh: "菜餚",
        sentence: "This is my mother's best dish. It's really delicious!",
        cloze: "This is my mother's best ______. It's really delicious!"
      },
      {
        num: 4,
        word: "let's ...",
        phonetic: "[lɛts]",
        pos: "phr.",
        zh: "讓我們……",
        sentence: "Let's play basketball.",
        cloze: "______ play basketball."
      },
      {
        num: 5,
        word: "try",
        phonetic: "[traɪ]",
        pos: "v.",
        zh: "嘗試",
        sentence: "Let's try this new dish!",
        cloze: "Let's ______ this new dish!"
      },
      {
        num: 6,
        word: "beef noodles",
        phonetic: "[bif `nudḷz]",
        pos: "n.",
        zh: "牛肉麵",
        sentence: "Beef noodles are Dave's favorite.",
        cloze: "______ are Dave's favorite."
      },
      {
        num: 7,
        word: "use",
        phonetic: "[juz]",
        pos: "v.",
        zh: "使用",
        sentence: "Let's use a pen and draw a picture.",
        cloze: "Let's ______ a pen and draw a picture."
      },
      {
        num: 8,
        word: "chopsticks",
        phonetic: "[`tʃɑp,stɪks]",
        pos: "n.",
        zh: "筷子",
        sentence: "Let's use chopsticks to eat the beef noodles.",
        cloze: "Let's use ______ to eat the beef noodles."
      },
      {
        num: 9,
        word: "delicious",
        phonetic: "[dɪ`lɪʃəs]",
        pos: "adj.",
        zh: "美味的",
        sentence: "This cake is delicious!",
        cloze: "This cake is ______!"
      },
      {
        num: 10,
        word: "guys",
        phonetic: "[gaɪz]",
        pos: "n.",
        zh: "大家",
        sentence: "Guys, welcome to the zoo!",
        cloze: "______, welcome to the zoo!"
      },
      {
        num: 11,
        word: "just",
        phonetic: "[dʒʌst]",
        pos: "adv.",
        zh: "就，只是",
        sentence: "Don't use a pen. Just use a pencil.",
        cloze: "Don't use a pen. ______ use a pencil."
      },
      {
        num: 12,
        word: "hand",
        phonetic: "[hænd]",
        pos: "n.",
        zh: "手",
        sentence: "Is that an apple in your hand?",
        cloze: "Is that an apple in your ______?"
      },
      {
        num: 13,
        word: "bring",
        phonetic: "[brɪŋ]",
        pos: "v.",
        zh: "帶",
        sentence: "Can I bring some cake to my friend?",
        cloze: "Can I ______ some cake to my friend?"
      }
    ]
  },
  {
    id: 2,
    title: "第二關：餐具城堡與派對邀約",
    subtitle: "看中文意思 ➔ 選正確英文單字",
    theme: "castle",
    questionType: "zh_to_en",
    description: "Word Power & 餐具單字（11 個）｜擺好餐具，邀請朋友來參加派對！",
    words: [
      {
        num: 14,
        word: "talk",
        phonetic: "[tɔk]",
        pos: "v.",
        zh: "說話",
        sentence: "Don't talk in class.",
        cloze: "Don't ______ in class."
      },
      {
        num: 15,
        word: "party",
        phonetic: "[`pɑrtɪ]",
        pos: "n.",
        zh: "派對",
        sentence: "Let's go to Sam's party!",
        cloze: "Let's go to Sam's ______!"
      },
      {
        num: 16,
        word: "invite",
        phonetic: "[ɪn`vaɪt]",
        pos: "v.",
        zh: "邀請",
        sentence: "Let's invite Jack to the party, too.",
        cloze: "Let's ______ Jack to the party, too."
      },
      {
        num: 17,
        word: "join",
        phonetic: "[dʒɔɪn]",
        pos: "v.",
        zh: "參加",
        sentence: "Peter, do you want to join our basketball game?",
        cloze: "Peter, do you want to ______ our basketball game?"
      },
      {
        num: 18,
        word: "glass",
        phonetic: "[glæs]",
        pos: "n.",
        zh: "玻璃杯",
        sentence: "This beautiful glass is my father's favorite.",
        cloze: "This beautiful ______ is my father's favorite."
      },
      {
        num: 19,
        word: "bowl",
        phonetic: "[bol]",
        pos: "n.",
        zh: "碗",
        sentence: "A bowl of beef noodles, please.",
        cloze: "A ______ of beef noodles, please."
      },
      {
        num: 20,
        word: "spoon",
        phonetic: "[spun]",
        pos: "n.",
        zh: "湯匙",
        sentence: "The baby can't use a spoon.",
        cloze: "The baby can't use a ______."
      },
      {
        num: 21,
        word: "menu",
        phonetic: "[`mɛnju]",
        pos: "n.",
        zh: "菜單",
        sentence: "All the dishes on the menu are delicious.",
        cloze: "All the dishes on the ______ are delicious."
      },
      {
        num: 22,
        word: "fork",
        phonetic: "[fɔrk]",
        pos: "n.",
        zh: "叉子",
        sentence: "Please put your fork on the table.",
        cloze: "Please put your ______ on the table."
      },
      {
        num: 23,
        word: "plate",
        phonetic: "[plet]",
        pos: "n.",
        zh: "盤子",
        sentence: "The plate is dirty. Don't use it.",
        cloze: "The ______ is dirty. Don't use it."
      },
      {
        num: 24,
        word: "knife",
        phonetic: "[naɪf]",
        pos: "n.",
        zh: "刀子（複數為 knives）",
        sentence: "Let's use the knife to cut the cake.",
        cloze: "Let's use the ______ to cut the cake."
      }
    ]
  },
  {
    id: 3,
    title: "第三關：萬聖節幽靈古宅",
    subtitle: "課本例句挖空 ➔ 選最適合的單字",
    theme: "halloween",
    questionType: "cloze",
    description: "Reading & 慣用語（12 個）｜闖過萬聖節古宅，舉辦盛大派對！",
    words: [
      {
        num: 25,
        word: "e-mail",
        phonetic: "[`i`mel]",
        pos: "n.",
        zh: "電子郵件（= email）",
        sentence: "The e-mail is from my friend, Linda.",
        cloze: "The ______ is from my friend, Linda."
      },
      {
        num: 26,
        word: "everyone",
        phonetic: "[`ɛvrɪ,wʌn]",
        pos: "pron.",
        zh: "每個人",
        sentence: "Everyone in the park is happy.",
        cloze: "______ in the park is happy."
      },
      {
        num: 27,
        word: "house",
        phonetic: "[haʊs]",
        pos: "n.",
        zh: "房子",
        sentence: "Amy's house is big and clean.",
        cloze: "Amy's ______ is big and clean."
      },
      {
        num: 28,
        word: "wear",
        phonetic: "[wɛr]",
        pos: "v.",
        zh: "穿",
        sentence: "Do not wear a T-shirt at school.",
        cloze: "Do not ______ a T-shirt at school."
      },
      {
        num: 29,
        word: "something",
        phonetic: "[`sʌmθɪŋ]",
        pos: "pron.",
        zh: "某樣東西",
        sentence: "Don't just stand there. Do something.",
        cloze: "Don't just stand there. Do ______."
      },
      {
        num: 30,
        word: "country",
        phonetic: "[`kʌntrɪ]",
        pos: "n.",
        zh: "國家",
        sentence: "My country is a beautiful place.",
        cloze: "My ______ is a beautiful place."
      },
      {
        num: 31,
        word: "any",
        phonetic: "[`ɛnɪ]",
        pos: "adj.",
        zh: "任何的",
        sentence: "Don't draw any pictures on the desk.",
        cloze: "Don't draw ______ pictures on the desk."
      },
      {
        num: 32,
        word: "fun",
        phonetic: "[fʌn]",
        pos: "n.",
        zh: "樂趣",
        sentence: "Let's have fun!",
        cloze: "Let's have ______!"
      },
      {
        num: 33,
        word: "Halloween",
        phonetic: "[,hælo`in]",
        pos: "n.",
        zh: "萬聖節前夕",
        sentence: "Halloween is next week. Let's have a party!",
        cloze: "______ is next week. Let's have a party!"
      },
      {
        num: 34,
        word: "around the corner",
        phonetic: "[ə`raʊnd ðə `kɔrnɚ]",
        pos: "phr.",
        zh: "即將到來",
        sentence: "Dad's birthday is just around the corner.",
        cloze: "Dad's birthday is just ______."
      },
      {
        num: 35,
        word: "plan",
        phonetic: "[plæn]",
        pos: "v.",
        zh: "計畫",
        sentence: "Let's plan a potluck party for my friends.",
        cloze: "Let's ______ a potluck party for my friends."
      },
      {
        num: 36,
        word: "Just give it a shot!",
        phonetic: "[dʒʌst gɪv ɪt ə ʃɑt]",
        pos: "idiom",
        zh: "試試看吧！",
        sentence: "A: I can't use chopsticks. B: Just give it a shot!",
        cloze: "A: I can't use chopsticks. B: ______"
      }
    ]
  }
];
