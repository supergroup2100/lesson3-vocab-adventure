// 2D Side-Scrolling Platformer Engine + Quiz Integration

(function () {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // UI Elements
  const hud = document.getElementById("hud");
  const hudStage = document.getElementById("hud-stage");
  const hudHearts = document.getElementById("hud-hearts");
  const hudProgress = document.getElementById("hud-progress");
  const hudScore = document.getElementById("hud-score");
  const hudCombo = document.getElementById("hud-combo");

  const screenMenu = document.getElementById("screen-menu");
  const stageCardsEl = document.getElementById("stage-cards");
  const screenFlashcards = document.getElementById("screen-flashcards");
  const flashcardListEl = document.getElementById("flashcard-list");

  const modalQuiz = document.getElementById("modal-quiz");
  const quizTypeBadge = document.getElementById("quiz-type-badge");
  const quizWordNum = document.getElementById("quiz-word-num");
  const quizPrompt = document.getElementById("quiz-prompt");
  const quizSubprompt = document.getElementById("quiz-subprompt");
  const quizOptions = document.getElementById("quiz-options");
  const quizFeedback = document.getElementById("quiz-feedback");
  const feedbackStatus = document.getElementById("feedback-status");
  const feedbackDetail = document.getElementById("feedback-detail");

  const modalClear = document.getElementById("modal-clear");
  const clearStars = document.getElementById("clear-stars");
  const clearScore = document.getElementById("clear-score");
  const clearAccuracy = document.getElementById("clear-accuracy");
  const clearMistakesBox = document.getElementById("clear-mistakes-box");
  const clearMistakesList = document.getElementById("clear-mistakes-list");
  const btnNextStage = document.getElementById("btn-next-stage");

  const touchControls = document.getElementById("touch-controls");
  const toastEl = document.getElementById("toast");

  // Constants
  const W = 960;
  const H = 540;
  const GROUND_Y = 460;
  const GRAVITY = 1550;
  const JUMP_VEL = -620;
  const MOVE_SPEED = 290;

  // Game State
  let state = "menu"; // menu | playing | quiz | clear
  let currentStageIndex = 0;
  let stageData = null;
  let score = 0;
  let combo = 0;
  let hearts = 5;
  const MAX_HEARTS = 5;
  let answeredCount = 0;
  let correctCount = 0;
  let mistakes = [];
  let bestScores = JSON.parse(localStorage.getItem("l3_vocab_best") || "{}");

  // World & Entities
  let cameraX = 0;
  let worldWidth = 3000;
  let platforms = [];
  let coins = [];
  let enemies = [];
  let gates = [];
  let particles = [];
  let goal = null;
  let activeGate = null;
  let pulseTime = 0;

  const player = {
    x: 80,
    y: GROUND_Y - 42,
    w: 32,
    h: 40,
    vx: 0,
    vy: 0,
    onGround: false,
    facingRight: true,
    walkTimer: 0,
    walkFrame: 0,
    invincible: 0,
    safeX: 80,
    safeY: GROUND_Y - 42
  };

  // Input State
  const keys = { left: false, right: false, jump: false };

  function showToast(msg, duration = 2200) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.add("hidden"), duration);
  }

  // Render Stage Cards on Menu
  function renderMenu() {
    stageCardsEl.innerHTML = "";
    window.VOCAB_STAGES.forEach((st, idx) => {
      const card = document.createElement("div");
      card.className = "stage-card";
      const best = bestScores[st.id];
      card.innerHTML = `
        <div>
          <div class="stage-type">${st.subtitle}</div>
          <h3>${st.title}</h3>
        </div>
        <p>${st.description}</p>
        <div class="stage-best">${best ? `🏆 最高紀錄：${best.stars} (${best.score}分)` : "▶ 點擊開始冒險"}</div>
      `;
      card.addEventListener("click", () => startStage(idx));
      stageCardsEl.appendChild(card);
    });
  }

  // Render Flashcards
  function renderFlashcards() {
    flashcardListEl.innerHTML = "";
    window.VOCAB_STAGES.forEach((st) => {
      st.words.forEach((w) => {
        const item = document.createElement("div");
        item.className = "flashcard-item";
        item.innerHTML = `
          <div class="fc-top">
            <span>#${w.num} ${w.word}</span>
            <button class="pixel-btn small" data-speak="${encodeURIComponent(w.word)}">🔊</button>
          </div>
          <div class="fc-zh">${w.phonetic} ${w.pos} ${w.zh}</div>
          <div class="fc-sent">${w.sentence}</div>
        `;
        item.querySelector("button").addEventListener("click", () => {
          window.gameAudio.speak(w.word);
        });
        flashcardListEl.appendChild(item);
      });
    });
  }

  // Build Level Layout for Selected Stage
  function buildLevel(stage) {
    platforms = [];
    coins = [];
    enemies = [];
    gates = [];
    particles = [];

    const segmentWidth = 440;
    const totalWords = stage.words.length;
    worldWidth = 260 + totalWords * segmentWidth + 280;

    // Ground segments
    platforms.push({ x: 0, y: GROUND_Y, w: worldWidth, h: H - GROUND_Y, type: "ground" });

    stage.words.forEach((wordObj, i) => {
      const baseX = 220 + i * segmentWidth;
      const pattern = i % 3;

      if (pattern === 0) {
        // Pattern 0: Ground Gate + High Bonus Sky Route + Flying Enemy
        const p1Y = GROUND_Y - 90;
        const p2Y = GROUND_Y - 165;
        platforms.push({ x: baseX + 20, y: p1Y, w: 100, h: 20, type: "brick" });
        platforms.push({ x: baseX + 145, y: p2Y, w: 110, h: 20, type: "brick" });

        coins.push({ x: baseX + 55, y: p1Y - 32, collected: false });
        coins.push({ x: baseX + 170, y: p2Y - 32, collected: false });
        coins.push({ x: baseX + 210, y: p2Y - 32, collected: false });

        // Ground enemy
        enemies.push({
          type: "ground",
          x: baseX + 60,
          y: GROUND_Y - 30,
          w: 30,
          h: 30,
          minX: baseX + 10,
          maxX: baseX + 240,
          vx: (i % 2 === 0 ? 1 : -1) * (80 + currentStageIndex * 15),
          frame: 0,
          frameTimer: 0
        });

        // Flying enemy patrolling mid-air
        enemies.push({
          type: "flying",
          x: baseX + 120,
          y: GROUND_Y - 135,
          baseY: GROUND_Y - 135,
          w: 36,
          h: 24,
          minX: baseX + 40,
          maxX: baseX + 270,
          vx: 85 + currentStageIndex * 15,
          bobPhase: i * 1.1,
          frame: 0,
          frameTimer: 0
        });

        gates.push({
          x: baseX + 310,
          y: GROUND_Y - 96,
          w: 48,
          h: 96,
          wordObj,
          solved: false
        });
      } else if (pattern === 1) {
        // Pattern 1: 2-Step Mid-Air Gate with Moving Platform
        const p1Y = GROUND_Y - 85;
        const p2Y = GROUND_Y - 165;
        platforms.push({ x: baseX + 15, y: p1Y, w: 95, h: 20, type: "brick" });
        platforms.push({
          x: baseX + 140,
          y: p2Y,
          w: 95,
          h: 20,
          type: "moving",
          minX: baseX + 120,
          maxX: baseX + 255,
          vx: 70 + currentStageIndex * 12,
          dx: 0
        });
        platforms.push({ x: baseX + 280, y: p2Y, w: 110, h: 20, type: "brick" });

        coins.push({ x: baseX + 52, y: p1Y - 32, collected: false });
        coins.push({ x: baseX + 175, y: p2Y - 32, collected: false });

        // Ground enemy below
        enemies.push({
          type: "ground",
          x: baseX + 90,
          y: GROUND_Y - 30,
          w: 30,
          h: 30,
          minX: baseX + 20,
          maxX: baseX + 320,
          vx: -85 - currentStageIndex * 15,
          frame: 0,
          frameTimer: 0
        });

        // Flying enemy guarding the aerial jump
        enemies.push({
          type: "flying",
          x: baseX + 200,
          y: p2Y - 48,
          baseY: p2Y - 48,
          w: 36,
          h: 24,
          minX: baseX + 100,
          maxX: baseX + 300,
          vx: -90 - currentStageIndex * 15,
          bobPhase: i * 0.9,
          frame: 0,
          frameTimer: 0
        });

        // Mid-Air Word Gate
        gates.push({
          x: baseX + 312,
          y: p2Y - 96,
          w: 48,
          h: 96,
          wordObj,
          solved: false
        });
      } else {
        // Pattern 2: 3-Step High Sky Staircase (連續踩踏才能觸發)
        const y1 = GROUND_Y - 80;
        const y2 = GROUND_Y - 155;
        const y3 = GROUND_Y - 230;
        platforms.push({ x: baseX + 10, y: y1, w: 85, h: 20, type: "brick" });
        platforms.push({ x: baseX + 115, y: y2, w: 85, h: 20, type: "brick" });
        platforms.push({ x: baseX + 220, y: y3, w: 85, h: 20, type: "brick" });
        platforms.push({ x: baseX + 325, y: y3, w: 95, h: 20, type: "brick" });

        coins.push({ x: baseX + 42, y: y1 - 32, collected: false });
        coins.push({ x: baseX + 147, y: y2 - 32, collected: false });
        coins.push({ x: baseX + 252, y: y3 - 32, collected: false });

        // Two flying enemies at different heights
        enemies.push({
          type: "flying",
          x: baseX + 140,
          y: y2 - 42,
          baseY: y2 - 42,
          w: 36,
          h: 24,
          minX: baseX + 60,
          maxX: baseX + 260,
          vx: 95 + currentStageIndex * 15,
          bobPhase: i * 0.7,
          frame: 0,
          frameTimer: 0
        });
        enemies.push({
          type: "flying",
          x: baseX + 280,
          y: y3 - 45,
          baseY: y3 - 45,
          w: 36,
          h: 24,
          minX: baseX + 180,
          maxX: baseX + 360,
          vx: -85 - currentStageIndex * 12,
          bobPhase: i * 1.5,
          frame: 0,
          frameTimer: 0
        });

        // High Sky Word Gate
        gates.push({
          x: baseX + 348,
          y: y3 - 96,
          w: 48,
          h: 96,
          wordObj,
          solved: false
        });
      }
    });

    goal = {
      x: worldWidth - 150,
      y: GROUND_Y - 110,
      w: 60,
      h: 110
    };

    // Reset player
    player.x = 70;
    player.y = GROUND_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.facingRight = true;
    player.invincible = 0;
    player.safeX = 70;
    player.safeY = GROUND_Y - player.h;
    cameraX = 0;
  }

  function startStage(idx) {
    currentStageIndex = idx;
    stageData = window.VOCAB_STAGES[idx];
    score = 0;
    combo = 0;
    hearts = MAX_HEARTS;
    answeredCount = 0;
    correctCount = 0;
    mistakes = [];
    activeGate = null;

    buildLevel(stageData);
    updateHUD();

    screenMenu.classList.add("hidden");
    modalClear.classList.add("hidden");
    modalQuiz.classList.add("hidden");
    hud.classList.remove("hidden");
    touchControls.classList.remove("hidden");
    state = "playing";

    showToast(`出發！${stageData.title}（遇見 ? 門即可答題）`, 2600);
  }

  function updateHUD() {
    hudStage.textContent = stageData.title.split("：")[0];
    hudHearts.textContent = "❤️".repeat(hearts) + "🖤".repeat(MAX_HEARTS - hearts);
    const solved = gates.filter((g) => g.solved).length;
    hudProgress.textContent = `${solved}/${gates.length}`;
    hudScore.textContent = score;
    hudCombo.textContent = combo;
  }

  function spawnParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 220,
        vy: -Math.random() * 200 - 40,
        life: 0.45 + Math.random() * 0.3,
        color,
        size: 4 + Math.floor(Math.random() * 4)
      });
    }
  }

  // Quiz System
  function getAllWordsPool() {
    return window.VOCAB_STAGES.flatMap((s) => s.words);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function openQuiz(gate) {
    state = "quiz";
    activeGate = gate;
    keys.left = false;
    keys.right = false;
    keys.jump = false;

    const w = gate.wordObj;
    const qType = stageData.questionType;
    const pool = getAllWordsPool().filter((item) => item.num !== w.num);
    const distractors = shuffle(pool).slice(0, 3);
    const options = shuffle([w, ...distractors]);

    quizWordNum.textContent = `#${w.num} / 36`;
    quizFeedback.classList.add("hidden");
    quizOptions.innerHTML = "";

    const btnSpeakPrompt = document.getElementById("btn-speak-prompt");
    btnSpeakPrompt.onclick = () => window.gameAudio.speak(w.word);

    if (qType === "en_to_zh") {
      quizTypeBadge.textContent = "第一關｜看英文／聽發音選中文";
      quizPrompt.textContent = w.word;
      quizSubprompt.textContent = `${w.phonetic}  ${w.pos}`;
      btnSpeakPrompt.classList.remove("hidden");
      window.gameAudio.speak(w.word);
    } else if (qType === "zh_to_en") {
      quizTypeBadge.textContent = "第二關｜看中文選正確英文";
      quizPrompt.textContent = w.zh;
      quizSubprompt.textContent = `詞性：${w.pos}`;
      btnSpeakPrompt.classList.add("hidden");
    } else {
      quizTypeBadge.textContent = "第三關｜課本例句挖空選擇";
      quizPrompt.textContent = w.cloze;
      quizSubprompt.textContent = `提示中文：${w.zh}（${w.pos}）`;
      btnSpeakPrompt.classList.add("hidden");
    }

    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.textContent = qType === "en_to_zh" ? opt.zh : opt.word;
      btn.addEventListener("click", () => handleAnswer(btn, opt.num === w.num, w));
      quizOptions.appendChild(btn);
    });

    modalQuiz.classList.remove("hidden");
  }

  function handleAnswer(clickedBtn, isCorrect, targetWord) {
    const allBtns = quizOptions.querySelectorAll("button");
    allBtns.forEach((b) => (b.disabled = true));

    answeredCount++;
    const qType = stageData.questionType;
    const correctLabel = qType === "en_to_zh" ? targetWord.zh : targetWord.word;

    if (isCorrect) {
      clickedBtn.classList.add("correct");
      combo++;
      correctCount++;
      score += 100 + combo * 20;
      window.gameAudio.correct();
      feedbackStatus.textContent = `✅ 答對了！(+${100 + combo * 20} 分，連擊 ${combo}x)`;
      feedbackStatus.className = "feedback-status ok";
    } else {
      clickedBtn.classList.add("wrong");
      allBtns.forEach((b) => {
        if (b.textContent === correctLabel) b.classList.add("correct");
      });
      combo = 0;
      hearts--;
      window.gameAudio.wrong();
      if (!mistakes.find((m) => m.num === targetWord.num)) {
        mistakes.push(targetWord);
      }

      if (hearts <= 0) {
        // Relaxed learning mode: refill hearts so student never loses progress
        hearts = MAX_HEARTS;
        feedbackStatus.textContent = "❌ 答錯囉！愛心已為你補滿，記住這題再出發！";
      } else {
        feedbackStatus.textContent = "❌ 答錯囉！沒關係，看看正解與例句：";
      }
      feedbackStatus.className = "feedback-status err";
    }

    feedbackDetail.innerHTML = `
      <b>${targetWord.word}</b> ${targetWord.phonetic} (${targetWord.pos}) — <b>${targetWord.zh}</b><br/>
      例句：<i>${targetWord.sentence}</i>
    `;
    document.getElementById("btn-speak-sentence").onclick = () => {
      window.gameAudio.speak(targetWord.sentence);
    };

    quizFeedback.classList.remove("hidden");
    updateHUD();
  }

  function closeQuizAndUnlock() {
    if (!activeGate) return;
    activeGate.solved = true;
    spawnParticles(activeGate.x + activeGate.w / 2, activeGate.y + 40, "#4ade80", 16);
    player.safeX = activeGate.x + activeGate.w + 10;
    player.safeY = activeGate.y + activeGate.h - player.h;
    activeGate = null;
    modalQuiz.classList.add("hidden");
    state = "playing";
    updateHUD();
  }

  document.getElementById("btn-quiz-continue").addEventListener("click", closeQuizAndUnlock);

  // Stage Clear
  function openStageClear() {
    state = "clear";
    window.gameAudio.stageClear();

    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;
    let starCount = 1;
    if (accuracy >= 85) starCount = 3;
    else if (accuracy >= 65) starCount = 2;
    const starStr = "⭐".repeat(starCount) + "☆".repeat(3 - starCount);

    // Save best score
    const prev = bestScores[stageData.id];
    if (!prev || score > prev.score) {
      bestScores[stageData.id] = { score, stars: starStr };
      localStorage.setItem("l3_vocab_best", JSON.stringify(bestScores));
    }

    clearStars.textContent = starStr;
    clearScore.textContent = score;
    clearAccuracy.textContent = `${accuracy}%`;

    if (mistakes.length === 0) {
      clearMistakesBox.innerHTML = "<h3>🌟 太厲害了！本關全對無錯題！</h3>";
    } else {
      clearMistakesBox.innerHTML = `<h3>📝 本關錯題複習（${mistakes.length} 題）</h3><div id="clear-mistakes-list" class="mistakes-list"></div>`;
      const listEl = document.getElementById("clear-mistakes-list");
      mistakes.forEach((m) => {
        const row = document.createElement("div");
        row.className = "mistake-row";
        row.innerHTML = `
          <div>
            <b>${m.word}</b> ${m.phonetic} (${m.pos}) — ${m.zh}<br/>
            <span style="color:#94a3b8;font-size:12px;">${m.sentence}</span>
          </div>
          <button class="pixel-btn small">🔊</button>
        `;
        row.querySelector("button").addEventListener("click", () => window.gameAudio.speak(m.word));
        listEl.appendChild(row);
      });
    }

    if (currentStageIndex < window.VOCAB_STAGES.length - 1) {
      btnNextStage.classList.remove("hidden");
    } else {
      btnNextStage.classList.add("hidden");
    }

    modalClear.classList.remove("hidden");
  }

  // AABB helper
  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // Update Physics
  function update(dt) {
    pulseTime += dt;
    if (state !== "playing") return;

    // Update moving platforms first
    for (const plat of platforms) {
      if (plat.type === "moving") {
        const oldX = plat.x;
        plat.x += plat.vx * dt;
        if (plat.x <= plat.minX) {
          plat.x = plat.minX;
          plat.vx = Math.abs(plat.vx);
        } else if (plat.x + plat.w >= plat.maxX) {
          plat.x = plat.maxX - plat.w;
          plat.vx = -Math.abs(plat.vx);
        }
        plat.dx = plat.x - oldX;
      }
    }

    // Horizontal movement
    if (keys.left && !keys.right) {
      player.vx = -MOVE_SPEED;
      player.facingRight = false;
    } else if (keys.right && !keys.left) {
      player.vx = MOVE_SPEED;
      player.facingRight = true;
    } else {
      player.vx = 0;
    }

    // Jump
    if (keys.jump && player.onGround) {
      player.vy = JUMP_VEL;
      player.onGround = false;
      window.gameAudio.jump();
    }

    // Gravity
    player.vy += GRAVITY * dt;
    if (player.vy > 900) player.vy = 900;

    // Apply X & check gate barrier
    player.x += player.vx * dt;
    if (player.x < 0) player.x = 0;
    if (player.x > worldWidth - player.w) player.x = worldWidth - player.w;

    for (const gate of gates) {
      if (!gate.solved && overlaps(player, gate)) {
        // Stop at gate & trigger quiz
        if (player.vx > 0) player.x = gate.x - player.w;
        else if (player.vx < 0) player.x = gate.x + gate.w;
        openQuiz(gate);
        return;
      }
    }

    // Apply Y & platform collisions
    player.y += player.vy * dt;
    player.onGround = false;

    for (const plat of platforms) {
      if (overlaps(player, plat)) {
        if (player.vy > 0 && player.y + player.h - player.vy * dt <= plat.y + 12) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.onGround = true;
          if (plat.type === "moving" && plat.dx) {
            player.x += plat.dx;
          }
        } else if (
          player.vy < 0 &&
          (plat.type === "brick" || plat.type === "moving") &&
          player.y - player.vy * dt >= plat.y + plat.h - 10
        ) {
          player.y = plat.y + plat.h;
          player.vy = 0;
        }
      }
    }

    // Walk animation
    if (Math.abs(player.vx) > 10 && player.onGround) {
      player.walkTimer += dt;
      if (player.walkTimer > 0.14) {
        player.walkTimer = 0;
        player.walkFrame = (player.walkFrame + 1) % 2;
      }
    } else {
      player.walkFrame = 0;
    }

    if (player.invincible > 0) {
      player.invincible -= dt;
    }

    // Coins
    for (const c of coins) {
      if (!c.collected && overlaps(player, { x: c.x, y: c.y, w: 20, h: 20 })) {
        c.collected = true;
        score += 25;
        window.gameAudio.coin();
        spawnParticles(c.x + 10, c.y + 10, "#fde047", 8);
        updateHUD();
      }
    }

    // Enemies
    for (const en of enemies) {
      en.x += en.vx * dt;
      if (en.x <= en.minX) {
        en.x = en.minX;
        en.vx = Math.abs(en.vx);
      } else if (en.x + en.w >= en.maxX) {
        en.x = en.maxX - en.w;
        en.vx = -Math.abs(en.vx);
      }
      if (en.type === "flying") {
        en.y = en.baseY + Math.sin(pulseTime * 3.5 + en.bobPhase) * 14;
      }
      en.frameTimer += dt;
      if (en.frameTimer > 0.18) {
        en.frameTimer = 0;
        en.frame = (en.frame + 1) % 2;
      }

      if (player.invincible <= 0 && overlaps(player, en)) {
        // Stomp check: if falling onto enemy, bounce up!
        if (player.vy > 60 && player.y + player.h - player.vy * dt <= en.y + 12) {
          player.vy = -420;
          score += 50;
          window.gameAudio.coin();
          spawnParticles(en.x + 15, en.y + 15, "#fca5a5", 10);
          updateHUD();
        } else {
          hearts--;
          window.gameAudio.hurt();
          player.invincible = 1.4;
          player.vy = -300;
          if (hearts <= 0) {
            hearts = MAX_HEARTS;
            player.x = player.safeX;
            player.y = player.safeY;
            showToast("愛心補滿！回到安全位置繼續冒險 💪");
          }
          updateHUD();
        }
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 500 * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Goal check
    const allSolved = gates.every((g) => g.solved);
    if (goal && overlaps(player, goal)) {
      if (allSolved) {
        openStageClear();
      } else {
        showToast("還有 ? 單字門未解鎖喔！");
      }
    }

    // Camera follow
    const targetCam = player.x - W * 0.35;
    cameraX = Math.max(0, Math.min(worldWidth - W, targetCam));
  }

  // Render Frame
  function render() {
    ctx.clearRect(0, 0, W, H);
    const theme = stageData ? stageData.theme : "halloween";

    window.PixelSprites.drawBackground(ctx, W, H, cameraX, theme);

    if (!stageData) return;

    ctx.save();
    ctx.translate(-Math.floor(cameraX), 0);

    // Platforms
    for (const plat of platforms) {
      if (plat.x + plat.w < cameraX - 20 || plat.x > cameraX + W + 20) continue;
      if (plat.type === "ground") {
        ctx.fillStyle = theme === "kitchen" ? "#22c55e" : theme === "castle" ? "#94a3b8" : "#6d28d9";
        ctx.fillRect(plat.x, plat.y, plat.w, 14);
        ctx.fillStyle = theme === "kitchen" ? "#92400e" : theme === "castle" ? "#475569" : "#3b0764";
        ctx.fillRect(plat.x, plat.y + 14, plat.w, plat.h - 14);
      } else if (plat.type === "moving") {
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.strokeStyle = "#7dd3fc";
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x + 1, plat.y + 1, plat.w - 2, plat.h - 2);
      } else {
        ctx.fillStyle = "#b45309";
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x + 1, plat.y + 1, plat.w - 2, plat.h - 2);
      }
    }

    // Coins
    for (const c of coins) {
      if (c.collected) continue;
      window.PixelSprites.drawCoin(ctx, c.x, c.y, pulseTime);
    }

    // Gates
    for (const g of gates) {
      window.PixelSprites.drawGate(ctx, g.x, g.y, g.w, g.h, g.solved, g.wordObj.num, pulseTime);
    }

    // Goal
    if (goal) {
      const allSolved = gates.every((g) => g.solved);
      window.PixelSprites.drawGoal(ctx, goal.x, goal.y, goal.h, allSolved, pulseTime);
    }

    // Enemies
    for (const en of enemies) {
      if (en.type === "flying") {
        window.PixelSprites.drawFlyingEnemy(ctx, en.x, en.y, theme, en.frame, en.vx > 0);
      } else {
        window.PixelSprites.drawEnemy(ctx, en.x, en.y, theme, en.frame, en.vx > 0);
      }
    }

    // Player
    window.PixelSprites.drawPlayer(
      ctx,
      player.x,
      player.y,
      player.w,
      player.h,
      player.facingRight,
      player.walkFrame,
      !player.onGround,
      player.invincible
    );

    // Particles
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    ctx.restore();
  }

  // Main Loop
  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  // Keyboard Events
  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
      keys.jump = true;
      if (state === "playing") e.preventDefault();
    }
    if (state === "quiz" && !quizFeedback.classList.contains("hidden") && (e.code === "Enter" || e.code === "Space")) {
      e.preventDefault();
      closeQuizAndUnlock();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") keys.jump = false;
  });

  // Touch Controls
  function bindTouch(id, key) {
    const el = document.getElementById(id);
    const on = (e) => {
      e.preventDefault();
      keys[key] = true;
    };
    const off = (e) => {
      e.preventDefault();
      keys[key] = false;
    };
    el.addEventListener("touchstart", on, { passive: false });
    el.addEventListener("touchend", off, { passive: false });
    el.addEventListener("mousedown", on);
    el.addEventListener("mouseup", off);
    el.addEventListener("mouseleave", off);
  }
  bindTouch("touch-left", "left");
  bindTouch("touch-right", "right");
  bindTouch("touch-jump", "jump");

  // UI Buttons
  document.getElementById("btn-menu").addEventListener("click", () => {
    state = "menu";
    hud.classList.add("hidden");
    touchControls.classList.add("hidden");
    modalQuiz.classList.add("hidden");
    modalClear.classList.add("hidden");
    renderMenu();
    screenMenu.classList.remove("hidden");
  });

  document.getElementById("btn-mute").addEventListener("click", (e) => {
    window.gameAudio.muted = !window.gameAudio.muted;
    e.target.textContent = window.gameAudio.muted ? "🔇 靜音" : "🔊 音效";
  });

  document.getElementById("btn-flashcards").addEventListener("click", () => {
    renderFlashcards();
    screenFlashcards.classList.remove("hidden");
  });

  document.getElementById("btn-close-flashcards").addEventListener("click", () => {
    screenFlashcards.classList.add("hidden");
  });

  document.getElementById("btn-replay").addEventListener("click", () => startStage(currentStageIndex));
  btnNextStage.addEventListener("click", () => startStage(currentStageIndex + 1));
  document.getElementById("btn-clear-menu").addEventListener("click", () => {
    document.getElementById("btn-menu").click();
  });

  // Init
  renderMenu();
  requestAnimationFrame(loop);
})();
