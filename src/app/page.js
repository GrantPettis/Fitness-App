import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import logoImg from '@/app/assets/Logo.PNG'
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
          <Image className = {styles.home}  src={logoImg} alt='UBM logo'></Image>
          <p className={styles.page}>Change Your Life, One Step At A Time</p>
        </ol>

        <div className={styles.ctas}>
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
