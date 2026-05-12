import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MousePointer2, 
  Cpu, 
  FlaskConical, 
  Calculator, 
  Languages, 
  Brain, 
  Wand2, 
  ChevronRight, 
  Lock, 
  Play, 
  Settings,
  Volume2,
  VolumeX,
  Home,
  Star
} from 'lucide-react';
import GameStage from './components/GameStage';
import { useSound } from './hooks/useSound';

export type Subject = 'ICT' | 'Robotics' | 'Science' | 'Math' | 'English' | 'CriticalThinking';

export interface GameMetadata {
  id: string;
  title: string;
  type: 'mouse' | 'keyboard' | 'logic' | 'math' | 'words';
  description: string;
}

const STAGES = Array.from({ length: 9 }, (_, i) => i + 1);

const SUBJECTS: Record<Subject, { icon: any; color: string; games: GameMetadata[] }> = {
  ICT: {
    icon: MousePointer2,
    color: 'bg-blue-500',
    games: [
      { id: 'mouse-1', title: 'Target Click', type: 'mouse', description: 'Master your mouse precision.' },
      { id: 'folder-1', title: 'Folder Sort', type: 'mouse', description: 'Organize files into folders.' },
      { id: 'key-1', title: 'Alpha Keys', type: 'keyboard', description: 'Learn the home row.' },
      { id: 'scroll-1', title: 'Scroll Master', type: 'mouse', description: 'Control scrolling speed.' },
      { id: 'right-click-1', title: 'Context Menu', type: 'mouse', description: 'Master the right click.' },
    ]
  },
  Robotics: {
    icon: Cpu,
    color: 'bg-purple-500',
    games: [
      { id: 'bot-1', title: 'Robot Path', type: 'logic', description: 'Program the bot to the finish.' },
      { id: 'circuit-1', title: 'Circuit Link', type: 'logic', description: 'Connect the power lines.' },
      { id: 'sensor-1', title: 'Sensor Logic', type: 'logic', description: 'If/Then coding logic.' },
      { id: 'gear-1', title: 'Gear Match', type: 'mouse', description: 'Connect the right gears.' },
      { id: 'code-1', title: 'Syntax Type', type: 'keyboard', description: 'Type simple bot commands.' },
    ]
  },
  Science: {
    icon: FlaskConical,
    color: 'bg-green-500',
    games: [
      { id: 'atom-1', title: 'Atom Sort', type: 'logic', description: 'Group atoms by weight.' },
      { id: 'planet-1', title: 'Solar Order', type: 'mouse', description: 'Place planets in orbit.' },
      { id: 'bio-1', title: 'Cell Lab', type: 'mouse', description: 'Identify cell parts.' },
      { id: 'water-1', title: 'Water Cycle', type: 'logic', description: 'Complete the cycle.' },
      { id: 'chem-1', title: 'Reaction Mix', type: 'logic', description: 'Balance the equation.' },
    ]
  },
  Math: {
    icon: Calculator,
    color: 'bg-orange-500',
    games: [
      { id: 'magic-1', title: 'Magic Sums', type: 'math', description: 'Find the hidden numbers.' },
      { id: 'speed-1', title: 'Rapid Calc', type: 'math', description: 'Solve before time runs out.' },
      { id: 'geom-1', title: 'Shape Shift', type: 'logic', description: 'Match 3D shapes.' },
      { id: 'fract-1', title: 'Pizza Slices', type: 'math', description: 'Learn fractions visually.' },
      { id: 'money-1', title: 'Shop Keeper', type: 'math', description: 'Calculate the change.' },
    ]
  },
  English: {
    icon: Languages,
    color: 'bg-pink-500',
    games: [
      { id: 'spell-1', title: 'Word Bubble', type: 'words', description: 'Pop the letters in order.' },
      { id: 'gram-1', title: 'Verb Race', type: 'words', description: 'Identify the action.' },
      { id: 'story-1', title: 'Plot Sort', type: 'logic', description: 'Put the story in order.' },
      { id: 'vocab-1', title: 'Synonym Match', type: 'words', description: 'Find matching words.' },
      { id: 'rhyme-1', title: 'Rhyme Time', type: 'words', description: 'Match rhyming pairs.' },
    ]
  },
  CriticalThinking: {
    icon: Brain,
    color: 'bg-yellow-500',
    games: [
      { id: 'maze-1', title: 'Pattern Maze', type: 'logic', description: 'Follow the pattern to escape.' },
      { id: 'det-1', title: 'Spot Error', type: 'logic', description: 'Find the odd one out.' },
      { id: 'bridge-1', title: 'Logic Bridge', type: 'logic', description: 'Build a safe path.' },
      { id: 'shadow-1', title: 'Shadow Match', type: 'logic', description: 'Match shapes to shadows.' },
      { id: 'seq-1', title: 'Next In Line', type: 'logic', description: 'Predict the next item.' },
    ]
  }
};

export default function EduGamePlatform() {
  const [stage, setStage] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);
  const { isMuted, toggleMute, playSound } = useSound();

  const handleStageSelect = (s: number) => {
    playSound('click');
    setStage(s);
  };

  const handleSubjectSelect = (sub: Subject) => {
    playSound('click');
    setSelectedSubject(sub);
  };

  const handleGameSelect = (game: GameMetadata) => {
    playSound('click');
    setActiveGame(game);
  };

  const goBack = () => {
    playSound('click');
    if (activeGame) setActiveGame(null);
    else if (selectedSubject) setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSelectedSubject(null); setActiveGame(null); }}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduQuest Academy
            </h1>
            <p className="text-xs text-slate-400">Learning through play • Basic {stage}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-slate-700/50 p-1 rounded-lg">
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => handleStageSelect(s)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  stage === s ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-600 text-slate-400'
                }`}
              >
                B{s}
              </button>
            ))}
          </div>
          <button 
            onClick={toggleMute}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {!selectedSubject && !activeGame && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {(Object.keys(SUBJECTS) as Subject[]).map((subKey) => {
              const sub = SUBJECTS[subKey];
              const Icon = sub.icon;
              return (
                <button
                  key={subKey}
                  onClick={() => handleSubjectSelect(subKey)}
                  className="group relative flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all hover:scale-[1.02] overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${sub.color}`} />
                  <div className={`p-4 rounded-full mb-4 ${sub.color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-12 h-12 text-white`} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{subKey}</h2>
                  <p className="text-slate-400 text-sm text-center">
                    Level {stage} Curriculum • 5 Games
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedSubject && !activeGame && (
          <div className="animate-in slide-in-from-right duration-300">
            <button 
              onClick={goBack}
              className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              <ChevronRight className="w-5 h-5 rotate-180" /> Back to Subjects
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-xl ${SUBJECTS[selectedSubject].color}`}>
                {React.createElement(SUBJECTS[selectedSubject].icon, { className: 'w-8 h-8' })}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{selectedSubject} Hub</h2>
                <p className="text-slate-400">Basic {stage} Mastery Games</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUBJECTS[selectedSubject].games.map((game, idx) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  className="flex items-center gap-6 p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 group transition-all"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-400">
                    {idx + 1}
                  </div>
                  <div className="text-left flex-grow">
                    <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                    <p className="text-slate-400 text-sm">{game.description}</p>
                  </div>
                  <div className="p-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 fill-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGame && (
          <div className="animate-in zoom-in duration-300">
             <button 
              onClick={goBack}
              className="mb-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              <ChevronRight className="w-5 h-5 rotate-180" /> Back to {selectedSubject} Hub
            </button>
            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden relative shadow-2xl">
              <GameStage game={activeGame} stage={stage} subject={selectedSubject!} />
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-slate-500 text-sm">
        <p>© 2024 EduQuest Academy. Developed for ICT & Robotics excellence.</p>
      </footer>
    </div>
  );
}