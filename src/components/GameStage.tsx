import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { GameMetadata, Subject } from '../App';
import { MainGameScene } from '../game/scenes/MainGameScene';
import { Trophy, RefreshCcw, XCircle } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface GameStageProps {
  game: GameMetadata;
  stage: number;
  subject: Subject;
}

export default function GameStage({ game, stage, subject }: GameStageProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const { playSound } = useSound();

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [MainGameScene],
      backgroundColor: '#0f172a',
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameInstance.current = new Phaser.Game(config);

    const handleGameEvent = (event: string, data?: any) => {
      if (event === 'game-win') {
        setGameState('won');
        playSound('win');
      } else if (event === 'game-over') {
        setGameState('lost');
        playSound('fail');
      } else if (event === 'update-score') {
        setScore(data.score);
        playSound('click');
      } else if (event === 'sfx') {
        playSound(data);
      }
    };

    const timeout = setTimeout(() => {
      const scene = gameInstance.current?.scene.getAt(0) as MainGameScene;
      if (scene) {
        scene.initGame(game, stage, subject, handleGameEvent);
      }
    }, 150);

    return () => {
      clearTimeout(timeout);
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
        gameInstance.current = null;
      }
    };
  }, [game, stage, subject]); // Re-run when game/stage changes

  const restart = () => {
    playSound('click');
    setGameState('playing');
    setScore(0);
    const scene = gameInstance.current?.scene.getAt(0) as MainGameScene;
    if (scene) scene.restart();
  };

  return (
    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden cursor-crosshair">
      <div ref={gameContainerRef} className="w-full h-full" />
      
      {/* HUD Overlay (HTML-based for accessibility and clarity) */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none select-none">
        <div className="flex flex-col gap-1">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-bold flex items-center gap-2">
            <span className="text-blue-400 uppercase text-xs tracking-widest">{subject}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>{game.title}</span>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-slate-300 text-xs w-fit">
            Basic Level {stage}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="bg-blue-600 px-6 py-2 rounded-xl border border-white/20 text-white font-black text-xl shadow-lg shadow-blue-500/20">
            {score} <span className="text-xs opacity-70">PTS</span>
          </div>
        </div>
      </div>

      {/* State Modals */}
      {gameState !== 'playing' && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-[1000]">
          <div className="bg-slate-800 p-8 md:p-12 rounded-[2rem] border-4 border-slate-700 text-center max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            {gameState === 'won' ? (
              <>
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-xl">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-black mb-3 text-white">GENIUS!</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  You successfully completed the <span className="text-blue-400 font-bold">{game.title}</span> challenge 
                  for Stage {stage}. Your cognitive skills are improving!
                </p>
                <div className="bg-slate-900/50 p-6 rounded-2xl mb-8 border border-white/5">
                  <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Final Score</div>
                  <div className="text-5xl font-black text-yellow-500">{score}</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-gradient-to-tr from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 -rotate-12 shadow-xl">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-black mb-3 text-white">SO CLOSE!</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Time ran out! But every expert was once a beginner. Let's try Basic {stage} again 
                  and master these {subject} concepts!
                </p>
              </>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={restart}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-600/30"
              >
                <RefreshCcw className="w-6 h-6" /> TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}