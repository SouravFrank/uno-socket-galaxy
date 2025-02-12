
import { create } from "zustand";

interface LearningStore {
  isLearningMode: boolean;
  setLearningMode: (value: boolean) => void;
}

export const useLearningStore = create<LearningStore>((set) => ({
  isLearningMode: localStorage.getItem("learningMode") === "true",
  setLearningMode: (value) => {
    localStorage.setItem("learningMode", String(value));
    set({ isLearningMode: value });
  },
}));
