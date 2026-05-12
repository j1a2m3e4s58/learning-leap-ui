import Phaser from 'phaser';
import { GameMetadata, Subject } from '../../App';

export class MainGameScene extends Phaser.Scene {
  private gameMeta!: GameMetadata;
  private stageLevel!: number;
  private subject!: Subject;
  private onEvent!: (event: string, data?: any) => void;

  private score: number = 0;
  private maxScore: number = 10;
  private isGameOver: boolean = false;
  private countdownText?: Phaser.GameObjects.Text;
  private timeLeft: number = 0;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('MainGameScene');
  }

  initGame(game: GameMetadata, stage: number, subject: Subject, onEvent: (event: string, data?: any) => void) {
    this.gameMeta = game;
    this.stageLevel = stage;
    this.subject = subject;
    this.onEvent = onEvent;
    this.score = 0;
    this.isGameOver = false;

    this.maxScore = 5 + (stage * 2); 
    this.timeLeft = 60 - (stage * 3);
  }

  restart() {
    this.score = 0;
    this.isGameOver = false;
    this.scene.restart();
  }

  create() {
    this.createBackground();
    this.createTimer();
    this.createParticles();

    switch (this.gameMeta.type) {
      case 'mouse': this.startMouseGame(); break;
      case 'math': this.startMathGame(); break;
      case 'keyboard': this.startKeyboardGame(); break;
      case 'logic': this.startLogicGame(); break;
      case 'words': this.startWordsGame(); break;
      default: this.startMouseGame();
    }
  }

  private createParticles() {
    // Basic particle effect for rewards
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('spark', 8, 8);

    this.particles = this.add.particles(0, 0, 'spark', {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      emitting: false
    });
  }

  private createTimer() {
    this.countdownText = this.add.text(400, 30, `TIME: ${Math.ceil(this.timeLeft)}`, {
      fontSize: '28px',
      color: '#fff',
      fontStyle: '900',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setDepth(100);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.isGameOver) return;
        this.timeLeft--;
        this.countdownText?.setText(`TIME: ${Math.max(0, Math.ceil(this.timeLeft))}`);
        if (this.timeLeft <= 0) this.gameOver(false);
      },
      loop: true
    });
  }

  private createBackground() {
    const { width, height } = this.scale;
    const colors = { ICT: 0x3b82f6, Robotics: 0x8b5cf6, Science: 0x22c55e, Math: 0xf97316, English: 0xec4899, CriticalThinking: 0xeab308 };
    const color = colors[this.subject] || 0x334155;
    
    const graphics = this.add.graphics();
    graphics.lineStyle(2, color, 0.15);
    for (let i = 0; i < width; i += 80) { graphics.moveTo(i, 0); graphics.lineTo(i, height); }
    for (let i = 0; i < height; i += 80) { graphics.moveTo(0, i); graphics.lineTo(width, i); }
    graphics.strokePath();

    // Floating subject icon (simple representation)
    this.add.circle(width - 50, height - 50, 30, color, 0.2).setStrokeStyle(2, color);
  }

  private startMouseGame() {
    const spawnTarget = () => {
      if (this.isGameOver) return;
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 500);
      const radius = Math.max(15, 45 - (this.stageLevel * 3));
      
      const target = this.add.container(x, y);
      const circle = this.add.circle(0, 0, radius, 0x3b82f6, 0.8).setStrokeStyle(3, 0xffffff).setInteractive();
      const txt = this.add.text(0, 0, (this.score + 1).toString(), { fontSize: `${radius}px`, fontStyle: 'bold' }).setOrigin(0.5);
      target.add([circle, txt]);

      circle.on('pointerdown', () => {
        this.emitParticles(x, y);
        this.handlePoint(target);
        spawnTarget();
      });
    };
    spawnTarget();
  }

  private startMathGame() {
    const showProblem = () => {
      if (this.isGameOver) return;
      const diff = this.stageLevel;
      const n1 = Phaser.Math.Between(1, 10 + (diff * 5));
      const n2 = Phaser.Math.Between(1, 10 + (diff * 5));
      const isMagic = this.gameMeta.id === 'magic-1';
      
      const op = isMagic ? (Math.random() > 0.5 ? '×' : '+') : '+';
      const ans = op === '+' ? n1 + n2 : n1 * n2;

      const qBox = this.add.container(400, 200);
      const bg = this.add.rectangle(0, 0, 500, 120, 0x1e293b, 0.8).setStrokeStyle(4, 0xf97316);
      const qText = this.add.text(0, 0, `${n1} ${op} ${n2} = ?`, { fontSize: '60px', fontStyle: 'bold' }).setOrigin(0.5);
      qBox.add([bg, qText]);

      const choices = [ans, ans + 1, ans - 1, ans + 10].sort(() => Math.random() - 0.5);
      choices.forEach((c, i) => {
        const x = 200 + (i * 133);
        const btn = this.add.container(x, 450);
        const bBg = this.add.rectangle(0, 0, 110, 80, 0x334155).setStrokeStyle(2, 0xffffff).setInteractive();
        const bTx = this.add.text(0, 0, c.toString(), { fontSize: '32px' }).setOrigin(0.5);
        btn.add([bBg, bTx]);

        bBg.on('pointerdown', () => {
          if (c === ans) {
            this.emitParticles(x, 450);
            this.handlePoint(qBox);
            this.children.getAll().filter(child => child instanceof Phaser.GameObjects.Container).forEach(child => child.destroy());
            showProblem();
          } else {
            this.cameras.main.shake(200, 0.01);
            this.onEvent('sfx', 'fail');
          }
        });
      });
    };
    showProblem();
  }

  private startKeyboardGame() {
    const spawnKey = () => {
      if (this.isGameOver) return;
      const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const target = keys[Phaser.Math.Between(0, Math.min(25, 5 + this.stageLevel * 2))];
      const txt = this.add.text(400, 300, target, { fontSize: '150px', fontStyle: '900', color: '#8b5cf6' }).setOrigin(0.5);
      
      const onKey = (e: KeyboardEvent) => {
        if (e.key.toUpperCase() === target) {
          window.removeEventListener('keydown', onKey);
          this.emitParticles(400, 300);
          this.handlePoint(txt);
          spawnKey();
        }
      };
      window.addEventListener('keydown', onKey);
      this.events.once('shutdown', () => window.removeEventListener('keydown', onKey));
    };
    spawnKey();
  }

  private startLogicGame() {
    const target = this.add.rectangle(400, 500, 400, 100, 0x1e293b).setStrokeStyle(4, 0x22c55e);
    this.add.text(400, 500, "DRAG ROBOT CORE HERE", { fontSize: '24px', fontStyle: 'bold' }).setOrigin(0.5);

    const spawn = () => {
      if (this.isGameOver) return;
      const x = Phaser.Math.Between(100, 700);
      const core = this.add.circle(x, 150, 40, 0x22c55e).setInteractive();
      this.add.text(x, 150, "CORE", { fontSize: '14px' }).setOrigin(0.5);
      this.input.setDraggable(core);

      core.on('drag', (p: any, dx: number, dy: number) => { core.x = dx; core.y = dy; });
      core.on('dragend', () => {
        if (Phaser.Geom.Rectangle.Contains(target.getBounds(), core.x, core.y)) {
          this.emitParticles(core.x, core.y);
          this.handlePoint(core);
          spawn();
        } else {
          this.tweens.add({ targets: core, x: Phaser.Math.Between(100, 700), y: 150, duration: 500 });
        }
      });
    };
    spawn();
  }

  private startWordsGame() {
    const words = ["ICT", "RAM", "CPU", "BIT", "CODE", "DATA", "WEB", "LINK", "FILE", "DISK"];
    const word = words[Phaser.Math.Between(0, words.length - 1)];
    let idx = 0;

    const display = this.add.text(400, 200, "_ ".repeat(word.length), { fontSize: '64px', fontStyle: 'bold' }).setOrigin(0.5);
    const letters = word.split('').sort(() => Math.random() - 0.5);

    letters.forEach((l, i) => {
      const x = 100 + (i * 100);
      const btn = this.add.container(x, 450);
      const circle = this.add.circle(0, 0, 40, 0xec4899).setStrokeStyle(2, 0xffffff).setInteractive();
      const txt = this.add.text(0, 0, l, { fontSize: '32px', fontStyle: 'bold' }).setOrigin(0.5);
      btn.add([circle, txt]);

      circle.on('pointerdown', () => {
        if (l === word[idx]) {
          idx++;
          display.setText(word.substring(0, idx) + " _".repeat(word.length - idx));
          this.emitParticles(x, 450);
          btn.destroy();
          if (idx === word.length) {
            this.handlePoint(display);
            this.startWordsGame();
          }
        } else {
          this.cameras.main.shake(100, 0.01);
        }
      });
    });
  }

  private emitParticles(x: number, y: number) {
    this.particles?.emitAt(x, y, 15);
  }

  private handlePoint(obj: any) {
    this.score++;
    this.onEvent('update-score', { score: this.score * 10 });
    this.tweens.add({ targets: obj, scale: 1.5, alpha: 0, duration: 250, onComplete: () => obj.destroy() });
    if (this.score >= this.maxScore) this.gameOver(true);
  }

  private gameOver(win: boolean) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.onEvent(win ? 'game-win' : 'game-over', { score: this.score * 10 });
  }
}