import React from 'react';

import styles from '../styles/auth.module.scss';

const Auth: React.FC = () => {
  return (
    <div className={styles.auth}>
      <div className={styles.auth_box}>
        <div className={styles.container}>
          <div className={styles.header}>
            <img src="../logo,svg" alt="logo" />
            <div className={styles.header_text}></div>
          </div>

          <form className={styles.auth_form}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input className={styles.password} name="username" type="text" />
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input className={styles.password} type="password" />

            <div className={styles.checkbox}>
              <input type="checkbox" className={styles.check} />
              Remember Me
            </div>

            <div className={styles.btn_submit}></div>
            <a href="#r">Forgot Password</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
