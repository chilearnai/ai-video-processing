import React from 'react';

import styles from '../styles/header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <nav className={styles.navbar}>
          {/* <a href="/" className={styles.navbar__brand}></a> */}
          <ul className={styles.navbar__nav}>
            <li className={styles.nav__item}>
              <a href="/" className="nav-link">
                Home
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/classes" className="nav-link">
                Class Management
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/teachers" className="nav-link">
                Teachers
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/class/form" className="nav-link">
                Add class
              </a>
            </li>
            {/* <li className={styles.nav__item}><a href="/students" className="nav-link">Student management</a></li> */}
            {/* <li className={styles.nav__item}><a href="/assignments" className="nav-link">Assignments management</a></li> */}
          </ul>
        </nav>
      </div>
    </header>
    // #0D204C
  );
};

export default Header;
