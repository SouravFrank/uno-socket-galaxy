
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { motion } from "framer-motion";
import { LightbulbIcon } from "lucide-react";

const LearningModeToggle = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem("learningMode");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("learningMode", JSON.stringify(isEnabled));
  }, [isEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Toggle
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-full backdrop-blur-sm"
      >
        <LightbulbIcon
          className={`w-4 h-4 ${
            isEnabled ? "text-yellow-500" : "text-gray-500"
          }`}
        />
        <span className="text-sm font-medium">
          {isEnabled ? "Learning Mode: On" : "Learning Mode: Off"}
        </span>
      </Toggle>
    </motion.div>
  );
};

export default LearningModeToggle;
