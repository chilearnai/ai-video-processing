import React from 'react';
import styles from '../../styles/sidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>________</h2>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <span className={styles.icon}>🏠</span>
          <span>Home</span>
        </li>
        <li className={styles.navItem}>
          <span className={styles.icon}>👥</span>
          <span>Teachers</span>
        </li>
        <li className={styles.navItem}>
          <span className={styles.icon}>⚙️</span>
          <span>Settings</span>
        </li>
        <li className={styles.navItem}>
          <span className={styles.icon}>🚪</span>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
