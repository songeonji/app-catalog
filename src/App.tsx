import { useAppStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import Step1Recommend from './pages/Step1Recommend';
import Step1Gallery from './pages/Step1Gallery';
import Step2Customize from './pages/Step2Customize';
import Step3Interaction from './pages/Step3Interaction';
import Step4Confirm from './pages/Step4Confirm';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
};

function App() {
  const step = useAppStore((s) => s.step);
  const mode = useAppStore((s) => s.mode);

  const renderStep = () => {
    switch (step) {
      case 1:
        return mode === 'recommend' ? (
          <motion.div key="step1-recommend" {...pageTransition}>
            <Step1Recommend />
          </motion.div>
        ) : (
          <motion.div key="step1-gallery" {...pageTransition}>
            <Step1Gallery />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" {...pageTransition}>
            <Step2Customize />
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" {...pageTransition}>
            <Step3Interaction />
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" {...pageTransition}>
            <Step4Confirm />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
}

export default App;
