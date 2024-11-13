import styles from "./page.module.css";
import HomePage from "./ui/homePage/HomePage";

export default function Home() {
  return (
      <div className={styles.homeContainer}>
      <HomePage />
    </div>
  );
}
