import React from "react";

import styles from "./Hero.module.css";
import logo from "../../assets/images/chatongptLogo.png"
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hey chat gpt</h1>
        <p className={styles.description}>
            A MERN stack webapp to provide a platform to chat with each other with ChatGPT support
        </p>
        <a href="/login" className={styles.contactBtn}>
          Try it now
        </a>
      </div>
      <img
        src={logo}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
