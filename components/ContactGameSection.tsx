"use client";

import { useState, useEffect, useCallback, useRef, useMemo, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Brain, Calculator, BookOpen, ArrowRight, Check, X, RefreshCw } from 'lucide-react';

// Types for games
type GameType = 'logic' | 'math' | 'history';
type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

// Questions database
const questions: Record<GameType, Question[]> = {
  logic: [
    {
      question: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
      options: ["Yes", "No", "Cannot determine"],
      answer: "Cannot determine",
      explanation: "We know all roses are flowers, but we don't know which flowers fade quickly. They might or might not be roses."
    },
    {
      question: "A is taller than B, B is taller than C. Is A taller than C?",
      options: ["Yes", "No", "Cannot determine"],
      answer: "Yes",
      explanation: "If A > B and B > C, then A > C (transitive property)."
    },
    {
      question: "What comes next in the sequence: 2, 4, 8, 16, __?",
      options: ["24", "32", "64"],
      answer: "32",
      explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32."
    },
    {
      question: "If it's not true that 'it's not raining', then it is:",
      options: ["Sunny", "Raining", "Cloudy"],
      answer: "Raining",
      explanation: "This is a double negative. If 'it's not raining' is not true, then it must be raining."
    }
  ],
  math: [
    {
      question: "What is the value of x in the equation 3x + 7 = 22?",
      options: ["3", "5", "8"],
      answer: "5",
      explanation: "3x + 7 = 22, 3x = 15, x = 5"
    },
    {
      question: "If a rectangle has a length of 12 and a width of 5, what is its area?",
      options: ["17", "34", "60"],
      answer: "60",
      explanation: "Area of rectangle = length × width = 12 × 5 = 60"
    },
    {
      question: "What is 15% of 80?",
      options: ["8", "12", "15"],
      answer: "12",
      explanation: "15% of 80 = 0.15 × 80 = 12"
    },
    {
      question: "If 5 programmers can build an app in 10 days, how many days will it take 2 programmers?",
      options: ["4", "15", "25"],
      answer: "25",
      explanation: "5 programmers × 10 days = 50 person-days. 50 person-days ÷ 2 programmers = 25 days"
    }
  ],
  history: [
    {
      question: "Who is credited with inventing the World Wide Web?",
      options: ["Bill Gates", "Tim Berners-Lee", "Steve Jobs"],
      answer: "Tim Berners-Lee",
      explanation: "Tim Berners-Lee invented the World Wide Web in 1989 while at CERN."
    },
    {
      question: "Which programming language was developed first?",
      options: ["FORTRAN (1957)", "COBOL (1959)", "BASIC (1964)"],
      answer: "FORTRAN (1957)",
      explanation: "FORTRAN was developed by IBM in 1957, making it one of the oldest high-level programming languages."
    },
    {
      question: "When was the first website published?",
      options: ["1989", "1991", "1995"],
      answer: "1991",
      explanation: "The first website was published on August 6, 1991 by Tim Berners-Lee."
    },
    {
      question: "Which company released the first commercially available smartphone?",
      options: ["Apple", "IBM", "Nokia"],
      answer: "IBM",
      explanation: "IBM released the Simon Personal Communicator in 1994, the first device to be referred to as a smartphone."
    }
  ]
};

export default function ContactGameSection() {
  // Store shuffled questions in state instead of mutating the original object
  const [shuffledQuestions, setShuffledQuestions] = useState<Record<GameType, Question[]>>({
    logic: [],
    math: [],
    history: []
  });
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<Record<GameType, number>>({
    logic: 0,
    math: 0,
    history: 0
  });
  const [questionIndex, setQuestionIndex] = useState<Record<GameType, number>>({
    logic: 0,
    math: 0,
    history: 0
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const explanationRef = useRef<HTMLDivElement>(null);

  // Fisher-Yates shuffle algorithm to randomize questions
  const shuffleQuestions = useCallback((gameType: GameType) => {
    const gameCopy = [...questions[gameType]];
    for (let i = gameCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCopy[i], gameCopy[j]] = [gameCopy[j], gameCopy[i]];
    }
    return gameCopy;
  }, []);
  // Initialize or change game type - optimized to prevent flickering
  const startGame = useCallback((type: GameType) => {
    if (isAnimating) return; // Prevent starting game during animations
    
    setIsAnimating(true);
    
    // Batch state updates together to prevent flickering
    // Use a small delay to ensure proper transition
    requestAnimationFrame(() => {
      setActiveGame(type);
      setCurrentQuestion(shuffledQuestions[type][questionIndex[type]]);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        // Reset animation lock after transition completes
        setTimeout(() => {
          setIsAnimating(false);
        }, 400); // Slightly longer to ensure transition completes
      });
    });
  }, [questionIndex, shuffledQuestions, isAnimating]);
  // Handle answer selection - optimized to prevent flickering
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null || !currentQuestion || isAnimating) return; // Prevent multiple selections and during animations
    
    // Use a lock to prevent multiple rapid clicks
    setIsAnimating(true);
    
    // Use requestAnimationFrame to batch state updates in the next frame
    requestAnimationFrame(() => {
      const correct = answer === currentQuestion?.answer;
      
      // Batch state updates together
      setSelectedAnswer(answer);
      setIsCorrect(correct);
      
      if (correct && activeGame) {
        setScore(prev => ({
          ...prev,
          [activeGame]: prev[activeGame] + 1
        }));
      }
      
      // Release animation lock before showing explanation
      setIsAnimating(false);

      // Show explanation after selecting an answer
      // Use a consistent timing to avoid visual glitches
      const showExplanationTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          setShowExplanation(true);
        });
      }, 600); // Slightly longer but more stable transition
      
      // Clean up timer if component unmounts
      return () => clearTimeout(showExplanationTimer);
    });
  };
  // Handle moving to the next question - optimized to prevent flickering
  const handleNextQuestion = () => {
    if (!activeGame || isAnimating) return;
    
    setIsAnimating(true);
    const nextIndex = (questionIndex[activeGame] + 1) % shuffledQuestions[activeGame].length;
    
    // First update the index
    setQuestionIndex(prev => ({
      ...prev,
      [activeGame]: nextIndex
    }));
    
    // Use a smoother transition with requestAnimationFrame
    // This helps synchronize visual updates with the browser's rendering cycle
    requestAnimationFrame(() => {
      // Fade out current question first (handled by animation keys in the component)
      
      // Use a consistent delay to ensure smooth transition
      setTimeout(() => {
        // Batch these updates together in one render cycle
        requestAnimationFrame(() => {
          setCurrentQuestion(shuffledQuestions[activeGame][nextIndex]);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowExplanation(false);
          
          // Add a small delay before allowing new interactions
          // This prevents rapid consecutive clicks that could cause flickering
          setTimeout(() => {
            setIsAnimating(false);
          }, 100);
        });
      }, 200); // Slightly longer but more stable transition
    });
  };

  // Reset the game scores
  const resetScores = () => {
    if (isAnimating) return;
    
    setScore({
      logic: 0,
      math: 0,
      history: 0
    });
    setQuestionIndex({
      logic: 0,
      math: 0,
      history: 0
    });
    
    // Reshuffle questions when resetting scores
    const newShuffled: Record<GameType, Question[]> = {
      logic: shuffleQuestions('logic'),
      math: shuffleQuestions('math'),
      history: shuffleQuestions('history')
    };
    setShuffledQuestions(newShuffled);
    
    // Clear game state
    setActiveGame(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  // Scroll explanation into view when it appears
  useEffect(() => {
    if (showExplanation && explanationRef.current) {
      explanationRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showExplanation]);

  // Shuffle questions on initial load
  useEffect(() => {
    const newShuffled: Record<GameType, Question[]> = {
      logic: shuffleQuestions('logic'),
      math: shuffleQuestions('math'),
      history: shuffleQuestions('history')
    };
    setShuffledQuestions(newShuffled);
  }, [shuffleQuestions]);
  // Game selection interface - with improved styling
  const GameSelector = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Ready for a Challenge?</h3>
      <p className="text-gray-300 mb-6">
        Take a break and test your knowledge while your message is on its way!
      </p>
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-3 bg-[rgb(38,43,61)] border-0 rounded-lg text-left flex items-center gap-3 hover:bg-[rgb(50,55,70)] transition-colors"
          onClick={() => startGame('logic')}
        >
          <span className="p-2 bg-blue-500/10 rounded-full">
            <Brain size={20} className="text-blue-400" />
          </span>
          <div>
            <p className="font-medium text-white">Logic Puzzles</p>
            <p className="text-sm text-gray-400">Test your reasoning skills</p>
          </div>
          <ArrowRight size={16} className="text-blue-400 ml-auto" />
        </motion.button>          <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-3 bg-[rgb(38,43,61)] border-0 rounded-lg text-left flex items-center gap-3 hover:bg-[rgb(50,55,70)] transition-colors"
          onClick={() => startGame('math')}
        >
          <span className="p-2 bg-blue-500/10 rounded-full">
            <Calculator size={20} className="text-blue-400" />
          </span>
          <div>
            <p className="font-medium text-white">Math Challenges</p>
            <p className="text-sm text-gray-400">Solve quick math problems</p>
          </div>
          <ArrowRight size={16} className="text-blue-400 ml-auto" />
        </motion.button>
          <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-3 bg-[rgb(38,43,61)] border-0 rounded-lg text-left flex items-center gap-3 hover:bg-[rgb(50,55,70)] transition-colors"
          onClick={() => startGame('history')}
        >
          <span className="p-2 bg-blue-500/10 rounded-full">
            <BookOpen size={20} className="text-blue-400" />
          </span>
          <div>
            <p className="font-medium text-white">Tech History</p>
            <p className="text-sm text-gray-400">How well do you know tech history?</p>
          </div>
          <ArrowRight size={16} className="text-blue-400 ml-auto" />
        </motion.button>
      </div>
        {/* Game scores */}
      {(score.logic > 0 || score.math > 0 || score.history > 0) && (
        <div className="mt-6 p-3 bg-[rgb(38,43,61)] border-0 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-300">Your Scores:</p>
            <button 
              onClick={resetScores}
              className="text-xs flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Logic</p>
              <p className="text-lg font-semibold text-blue-400">{score.logic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Math</p>
              <p className="text-lg font-semibold text-blue-400">{score.math}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">History</p>
              <p className="text-lg font-semibold text-blue-400">{score.history}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );  // Game play interface with improved styling
  const GamePlay = () => {
    if (!currentQuestion || !activeGame) return null;
    
    const gameTypeLabels = {
      logic: "Logic Puzzle",
      math: "Math Challenge",
      history: "Tech History"
    };
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 overflow-visible bg-opacity-100 z-50" 
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => !isAnimating && setActiveGame(null)}
              disabled={isAnimating}
              className={`p-1.5 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowRight size={16} className="text-blue-400 rotate-180" />
            </button>
            <h3 className="text-lg font-semibold text-white">{gameTypeLabels[activeGame]}</h3>
          </div>
          <div className="text-sm text-gray-400">
            Question {questionIndex[activeGame] + 1}/{shuffledQuestions[activeGame].length}
          </div>
        </div>          <motion.div 
          key={`question-${activeGame}-${questionIndex[activeGame]}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut",
            opacity: { duration: 0.25 },
            y: { duration: 0.3 }
          }}
          className="p-4 bg-[rgb(38,43,61)] border-0 rounded-lg will-change-transform relative z-10"
        >
          <p className="text-white mb-4">{currentQuestion.question}</p>            <div className="space-y-2 relative z-10">
            {currentQuestion.options.map((option) => {
              // Determine button styling based on answer state
              const isSelectedOption = selectedAnswer === option;
              const isCorrectAnswer = option === currentQuestion.answer;
              const hasSelectedAnswer = selectedAnswer !== null;
              
              // Base style that doesn't change
              const baseClass = "w-full p-3 rounded-lg text-left";
              
              // Determine styling based on game state
              let styleClass = "";
                if (!hasSelectedAnswer) {
                // Unselected state
                styleClass = "bg-[rgb(38,43,61)]/50 border-0 hover:bg-[rgb(50,55,70)] text-gray-300 transition-colors duration-150";
              } else if (isSelectedOption && isCorrectAnswer) {
                // Selected and correct
                styleClass = "bg-green-500/20 border-0 text-white";
              } else if (isSelectedOption && !isCorrectAnswer) {
                // Selected but incorrect
                styleClass = "bg-red-500/20 border-0 text-white";
              } else if (isCorrectAnswer) {
                // Not selected but is correct answer (show after wrong selection)
                styleClass = "bg-green-500/20 border-0 text-white";
              } else {
                // Neither selected nor correct
                styleClass = "bg-[rgb(38,43,61)]/50 border-0 text-gray-400";
              }
              
              // Combine the styles
              const buttonClass = `${baseClass} ${styleClass}`;
              
              return (
                <motion.button
                  key={option}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={hasSelectedAnswer || isAnimating}
                  initial={false}
                  animate={{
                    backgroundColor: hasSelectedAnswer ? 
                      (isSelectedOption && isCorrectAnswer ? "rgba(16, 185, 129, 0.2)" :
                       isSelectedOption ? "rgba(220, 38, 38, 0.2)" : 
                       isCorrectAnswer ? "rgba(16, 185, 129, 0.2)" : 
                       "rgba(38, 43, 61, 0.5)") : 
                      "rgba(38, 43, 61, 0.5)"
                  }}
                  transition={{ duration: 0.3 }}
                  whileHover={!hasSelectedAnswer ? { scale: 1.005, backgroundColor: "rgba(38, 43, 61, 0.7)" } : {}}
                  whileTap={!hasSelectedAnswer ? { scale: 0.995 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    <AnimatePresence mode="wait">
                      {isSelectedOption && hasSelectedAnswer && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", duration: 0.3 }}
                        >
                          {isCorrect ? 
                            <Check size={16} className="text-green-400" /> : 
                            <X size={16} className="text-red-400" />}
                        </motion.span>
                      )}
                      {!isSelectedOption && hasSelectedAnswer && isCorrectAnswer && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", duration: 0.3, delay: 0.15 }}
                        >
                          <Check size={16} className="text-green-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>
            {/* Explanation - improved animation to prevent content jumps */}
          <AnimatePresence>
            {showExplanation && currentQuestion.explanation && (              <motion.div 
                ref={explanationRef}
                key="explanation"
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                transition={{ 
                  height: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
                  opacity: { duration: 0.25 }
                }}
                style={{ willChange: "opacity, height" }}
                className="mt-4 p-3 bg-blue-500/10 rounded-lg overflow-visible relative z-20 border-0"
              >
                <motion.p 
                  className="text-sm text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="font-medium text-blue-400">Explanation:</span> {currentQuestion.explanation}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          {/* Next question button - with smoother transitions */}
        <AnimatePresence mode="wait">
          {selectedAnswer !== null && (
            <motion.button
              key="next-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ 
                duration: 0.25, 
                ease: "easeOut" 
              }}
              whileHover={{ 
                backgroundColor: "rgba(37, 99, 235, 1)",
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: "transform, opacity" }}              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 relative z-30 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleNextQuestion}
              disabled={isAnimating}
            >
              <span>Next Question</span>
              <ArrowRight size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };  // Render components directly without memoization to avoid stale state issues
  // More straightforward rendering approach
  return (
    <div className="h-full relative">
      <div className="flex items-center justify-center mb-6">
        <Gamepad2 size={24} className="text-blue-400 mr-2" />
        <h3 className="text-2xl font-semibold text-white">Brain Games</h3>
      </div>
      
      <div className="relative min-h-[450px]">
        {/* Direct conditional rendering without memoization */}
        {activeGame === null ? (
          <GameSelector />
        ) : (
          <GamePlay />
        )}
      </div>
    </div>
  );
}
