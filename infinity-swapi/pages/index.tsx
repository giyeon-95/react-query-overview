import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { InfinitePeople } from "../components/InfinitePeople";
import { InfiniteSpecies } from "../components/InfiniteSpecies";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Infinite Query</h1>
      {/* <InfinitePeople /> */}
      <InfiniteSpecies />
    </div>
  );
};

export default Home;
