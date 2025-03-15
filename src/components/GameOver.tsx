
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Crown } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { motion } from "framer-motion";

interface GameOverProps {
  gameState: any;
  navigate: NavigateFunction;
}

const GameOver = ({ gameState, navigate }: GameOverProps) => {
  const winner = gameState.players.find((p: any) => p.id === gameState.winner);
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20 flex items-center justify-center">
      <ThemeToggle />
      <motion.div 
        className="grass-morphism p-8 shadow-xl text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        </motion.div>
        <p className="text-xl mb-6">
          {winner?.name || "Someone"} has won the game!
        </p>
        <Button onClick={() => navigate('/')} className="grass-button">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default GameOver;
