import React from 'react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  notesCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ notesCount }) => {
  // Generate a mock Github-style Heatmap (365 days / 52 weeks is too much, so 15 weeks = ~105 blocks)
  const heatmapData = Array.from({ length: 110 }).map(() => {
    // Generate a pseudo-random activity level (0 to 4)
    // Make the recent days match actual user interaction probabilistically
    const randomLevel = Math.floor(Math.random() * 5);
    return randomLevel;
  });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h3>Productivity Overview</h3>
        <span className={styles.subtitle}>Activity mapped across the quarter</span>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Heatmap Section */}
        <div className={styles.card}>
          <h4>Pulse Heatmap</h4>
          <div className={styles.heatmapWrapper}>
            <div className={styles.heatmapGrid}>
              {heatmapData.map((level, i) => (
                <div 
                  key={i} 
                  className={`${styles.heatBlock} ${styles[`level${level}`]}`} 
                  title={`Activity Level: ${level}`}
                />
              ))}
            </div>
            <div className={styles.heatLegend}>
              <span>Less</span>
              <div className={`${styles.heatBlock} ${styles.level0}`} />
              <div className={`${styles.heatBlock} ${styles.level1}`} />
              <div className={`${styles.heatBlock} ${styles.level2}`} />
              <div className={`${styles.heatBlock} ${styles.level3}`} />
              <div className={`${styles.heatBlock} ${styles.level4}`} />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsCard}>
            <div className={styles.statMetric}>
                <span className={styles.statLabel}>Total Notes Logged</span>
                <span className={styles.statValue}>{notesCount}</span>
            </div>
            <div className={styles.statMetric}>
                <span className={styles.statLabel}>Current Streak</span>
                <span className={styles.statValue}>4 Days</span>
            </div>
            <div className={styles.statMetric}>
                <span className={styles.statLabel}>Dominant Mood</span>
                <span className={styles.statValue}>😊</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
