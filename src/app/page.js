import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
        </ol>

        <div className={styles.ctas}>
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
