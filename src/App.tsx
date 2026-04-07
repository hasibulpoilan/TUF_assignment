import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import Calendar from './components/Calendar/Calendar';
import Notes from './components/Notes/Notes';
import Dashboard from './components/Dashboard/Dashboard';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function App() {
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('calendar_notes_')) {
            count++;
        }
    }
    setNotesCount(count);
  }, [selectedRange]); // Hacky trigger to update count when user clicks around

  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className={styles.appWrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.generatedBackground}>
        <img src="/generated_bg.png" alt="Premium Aesthetic" className={styles.hazyImage} />
        <div className={styles.hazyOverlay} />
      </div>

      <div className={styles.tufBoxesGrid}>
        {Array.from({ length: 150 }).map((_, i) => (
          <div key={i} className={styles.tufSmallBox}>TUF</div>
        ))}
      </div>

      <ThemeToggle />

      <div className={styles.perspectiveWrapper}>
        <motion.div
          className={styles.calendarContainer}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.heroSection}>
            <img src="/hero.png" alt="Serene misty mountains" className={styles.heroImage} />
            <div className={styles.heroOverlay} />

            <motion.div
              className={styles.tufFloatingLogo}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              TUF
            </motion.div>
          </div>
          {/* Main content split */}
          <div className={styles.mainSection}>
            <Calendar 
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedRange={selectedRange} 
              setSelectedRange={setSelectedRange} 
            />
            <Notes selectedRange={selectedRange} />

            {/* Dashboard Module cleanly within the main section flex column */}
            <Dashboard notesCount={notesCount} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
