// Procedural Pixel-Art Sprite & Background Renderer

window.PixelSprites = {
  // Draw a pixel grid from a string array and palette
  drawGrid(ctx, x, y, scale, grid, palette, flipX = false) {
    const rows = grid.length;
    const cols = grid[0].length;
    ctx.save();
    if (flipX) {
      ctx.translate(x + cols * scale, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    for (let r = 0; r < rows; r++) {
      const row = grid[r];
      for (let c = 0; c < cols; c++) {
        const ch = row[c];
        if (ch === "." || !palette[ch]) continue;
        ctx.fillStyle = palette[ch];
        ctx.fillRect(Math.floor(x + c * scale), Math.floor(y + r * scale), scale, scale);
      }
    }
    ctx.restore();
  },

  // Cute 7th-grader adventurer (12x14 pixel grid)
  drawPlayer(ctx, x, y, w, h, facingRight, walkFrame, isJumping, invincibleTimer) {
    if (invincibleTimer > 0 && Math.floor(invincibleTimer * 15) % 2 === 0) return;

    const scale = 3; // 12*3 = 36, 14*3 = 42
    const palette = {
      H: "#3b2818", // hair
      S: "#ffd1a4", // skin
      E: "#1e1e2e", // eyes
      C: "#ff5a5f", // cap / scarf
      B: "#2563eb", // jacket
      Y: "#fbbf24", // backpack / badge
      P: "#1e3a8a", // pants
      W: "#ffffff", // shoes
      K: "#111827"  // outline/shoes
    };

    const idle = [
      "...CCCCCC...",
      "..CCCCCCCC..",
      "..HHHHHHHH..",
      "..HSSSSSSH..",
      "..HSEHHSES..",
      "..HSSSSSSH..",
      "...BBBBBB...",
      "..YBBBBBBY..",
      "..YBBBBBBY..",
      "...PPPPPP...",
      "...PP..PP...",
      "...PP..PP...",
      "..WW....WW..",
      "..KK....KK.."
    ];

    const run1 = [
      "...CCCCCC...",
      "..CCCCCCCC..",
      "..HHHHHHHH..",
      "..HSSSSSSH..",
      "..HSEHHSES..",
      "..HSSSSSSH..",
      "...BBBBBB...",
      "..YBBBBBBY..",
      "..YBBBBBBY..",
      "...PPPPPP...",
      "..PP....PP..",
      ".WW......PP.",
      ".KK......WW.",
      ".........KK."
    ];

    const jump = [
      "...CCCCCC...",
      "..CCCCCCCC..",
      "..HHHHHHHH..",
      "..HSSSSSSH..",
      "..HSEHHSES..",
      "..HSSSSSSH..",
      "..YBBBBBBY..",
      ".YYBBBBBBYY.",
      "...BBBBBB...",
      "...PPPPPP...",
      "..PP....PP..",
      "..WW....WW..",
      "..KK....KK..",
      "............"
    ];

    const grid = isJumping ? jump : walkFrame % 2 === 1 ? run1 : idle;
    this.drawGrid(ctx, x - 2, y - 2, scale, grid, palette, !facingRight);
  },

  // Cute patrolling enemy (slime / ghost / fork-imp depending on theme)
  drawEnemy(ctx, x, y, theme, frame, facingRight) {
    const scale = 3; // 10x10 -> 30x30
    if (theme === "kitchen") {
      // Spicy Chili Slime
      const palette = {
        R: "#ef4444",
        D: "#b91c1c",
        G: "#22c55e",
        W: "#ffffff",
        K: "#111827"
      };
      const g1 = [
        "....GG....",
        "...GGGG...",
        "..RRRRRR..",
        ".RRRRRRRR.",
        ".RRWKRRWK.",
        ".RRKKRRKK.",
        ".RRRRRRRR.",
        ".DDDDDDDD.",
        "..DD..DD..",
        ".........."
      ];
      const g2 = [
        "....GG....",
        "...GGGG...",
        "..........",
        "..RRRRRR..",
        ".RRRRRRRR.",
        ".RRWKRRWK.",
        ".RRKKRRKK.",
        ".RRRRRRRR.",
        ".DDDDDDDD.",
        "..DD..DD.."
      ];
      this.drawGrid(ctx, x, y, scale, frame % 2 === 0 ? g1 : g2, palette, !facingRight);
    } else if (theme === "castle") {
      // Mischievous Plate/Fork Knight
      const palette = {
        S: "#cbd5e1",
        D: "#64748b",
        P: "#a855f7",
        W: "#ffffff",
        K: "#0f172a"
      };
      const g = [
        "..S....S..",
        "..S.PP.S..",
        "..SSSSSS..",
        ".SSSSSSSS.",
        ".SSWKSSWK.",
        ".SSKKSSKK.",
        ".DDDDDDDD.",
        "..DDDDDD..",
        "..DD..DD..",
        "..KK..KK.."
      ];
      this.drawGrid(ctx, x, y + (frame % 2) * 2, scale, g, palette, !facingRight);
    } else {
      // Halloween Cute Ghost
      const palette = {
        W: "#f8fafc",
        B: "#cbd5e1",
        K: "#1e1b4b",
        P: "#f472b6"
      };
      const g = [
        "...WWWW...",
        "..WWWWWW..",
        ".WWWWWWWW.",
        ".WWKWWKWW.",
        ".WWKWWKWW.",
        ".WPWWWWPW.",
        ".WWWWWWWW.",
        ".WWBWWBWW.",
        ".W.W..W.W.",
        ".........."
      ];
      this.drawGrid(ctx, x, y + Math.sin(frame * 0.5) * 3, scale, g, palette, !facingRight);
    }
  },

  // Airborne Flying Enemy (flapping wings)
  drawFlyingEnemy(ctx, x, y, theme, frame, facingRight) {
    const scale = 3; // 12x8 -> 36x24
    const palette =
      theme === "kitchen"
        ? { W: "#fef08a", B: "#ef4444", E: "#ffffff", K: "#111827" } // Flying Hot Wing / Pepper
        : theme === "castle"
        ? { W: "#e2e8f0", B: "#7c3aed", E: "#fde047", K: "#0f172a" } // Flying Imp
        : { W: "#a855f7", B: "#1e1b4b", E: "#ef4444", K: "#f8fafc" }; // Halloween Bat

    const flapUp = [
      "WW........WW",
      "WWW..BB..WWW",
      ".WWBBBBBBWW.",
      "..BBKEKBBK..",
      "..BBBBBBBB..",
      "...BBBBBB...",
      "....B..B....",
      "............"
    ];
    const flapDown = [
      "............",
      ".....BB.....",
      "...BBBBBB...",
      "..BBKEKBBK..",
      ".WWBBBBBBWW.",
      "WWW.BBBB.WWW",
      "WW...BB...WW",
      "............"
    ];
    this.drawGrid(ctx, x, y, scale, frame % 2 === 0 ? flapUp : flapDown, palette, !facingRight);
  },

  // Word Gate / Question Block
  drawGate(ctx, x, y, w, h, solved, wordNum, pulse) {
    ctx.save();
    if (solved) {
      // Opened glowing arch
      ctx.fillStyle = "rgba(34, 197, 94, 0.25)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
      ctx.fillStyle = "#86efac";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OK!", x + w / 2, y + h / 2 + 5);
    } else {
      // Locked pixel mystery gate
      const glow = Math.sin(pulse * 4) * 2;
      ctx.fillStyle = "#92400e";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
      ctx.fillStyle = "#78350f";
      ctx.fillRect(x + 8, y + 8, w - 16, h - 16);

      // Corner rivets
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(x + 6, y + 6, 4, 4);
      ctx.fillRect(x + w - 10, y + 6, 4, 4);
      ctx.fillRect(x + 6, y + h - 10, 4, 4);
      ctx.fillRect(x + w - 10, y + h - 10, 4, 4);

      // Question mark & word number
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("?", x + w / 2, y + h / 2 + 4 + glow);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.fillText("#" + wordNum, x + w / 2, y - 6);
    }
    ctx.restore();
  },

  // Collectible Candy / Coin
  drawCoin(ctx, x, y, pulse) {
    const bob = Math.sin(pulse * 5 + x * 0.05) * 3;
    const cx = x + 10;
    const cy = y + 10 + bob;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(cx - 8, cy - 8, 16, 16);
    ctx.fillStyle = "#fde047";
    ctx.fillRect(cx - 6, cy - 6, 12, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 4, cy - 4, 3, 6);
  },

  // Stage Goal Portal / Party Banner
  drawGoal(ctx, x, y, h, unlocked, pulse) {
    // Flagpole
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(x + 18, y, 6, h);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(x + 15, y - 6, 12, 12);

    // Flag
    const wave = Math.sin(pulse * 5) * 3;
    ctx.fillStyle = unlocked ? "#22c55e" : "#ef4444";
    ctx.fillRect(x + 24, y + 6 + wave * 0.3, 42, 26);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(unlocked ? "PARTY!" : "LOCK", x + 45, y + 23 + wave * 0.3);
  },

  // Parallax Background per theme
  drawBackground(ctx, width, height, cameraX, theme) {
    if (theme === "kitchen") {
      // Warm daytime sky
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(1, "#bae6fd");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Pixel clouds
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 6; i++) {
        const cx = ((i * 260 - cameraX * 0.2) % (width + 200)) - 100;
        const cy = 55 + (i % 3) * 35;
        ctx.fillRect(cx, cy, 72, 20);
        ctx.fillRect(cx + 14, cy - 12, 44, 14);
      }

      // Distant shops / kitchen awnings
      for (let i = 0; i < 8; i++) {
        const bx = ((i * 220 - cameraX * 0.4) % (width + 220)) - 110;
        ctx.fillStyle = i % 2 === 0 ? "#fed7aa" : "#fecaca";
        ctx.fillRect(bx, height - 180, 140, 140);
        ctx.fillStyle = i % 2 === 0 ? "#ea580c" : "#dc2626";
        ctx.fillRect(bx - 6, height - 190, 152, 20);
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(bx + 20, height - 150, 40, 36);
        ctx.fillRect(bx + 80, height - 150, 40, 36);
      }
    } else if (theme === "castle") {
      // Sunset castle sky
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#4c1d95");
      grad.addColorStop(1, "#f97316");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Distant castle towers
      ctx.fillStyle = "#31105e";
      for (let i = 0; i < 7; i++) {
        const tx = ((i * 240 - cameraX * 0.3) % (width + 240)) - 120;
        ctx.fillRect(tx, height - 220, 90, 180);
        ctx.fillRect(tx - 8, height - 235, 24, 20);
        ctx.fillRect(tx + 33, height - 235, 24, 20);
        ctx.fillRect(tx + 74, height - 235, 24, 20);
        ctx.fillStyle = "#fde047";
        ctx.fillRect(tx + 35, height - 180, 20, 28);
        ctx.fillStyle = "#31105e";
      }
    } else {
      // Halloween starry night
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(1, "#312e81");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Big pixel moon
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(width - 140, 45, 64, 64);
      ctx.fillStyle = "#fde047";
      ctx.fillRect(width - 132, 53, 48, 48);

      // Stars
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 25; i++) {
        const sx = ((i * 97 - cameraX * 0.1) % width + width) % width;
        const sy = 25 + ((i * 53) % 180);
        ctx.fillRect(sx, sy, 3, 3);
      }

      // Spooky silhouettes
      ctx.fillStyle = "#1e1b4b";
      for (let i = 0; i < 6; i++) {
        const hx = ((i * 280 - cameraX * 0.35) % (width + 280)) - 140;
        ctx.fillRect(hx, height - 190, 120, 150);
        ctx.beginPath();
        ctx.moveTo(hx - 10, height - 190);
        ctx.lineTo(hx + 60, height - 250);
        ctx.lineTo(hx + 130, height - 190);
        ctx.fill();
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(hx + 30, height - 150, 20, 24);
        ctx.fillRect(hx + 70, height - 150, 20, 24);
        ctx.fillStyle = "#1e1b4b";
      }
    }
  }
};
