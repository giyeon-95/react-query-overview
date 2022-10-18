import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Posts from "../components/Posts";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Posts />
    </div>
  );
};

export default Home;
