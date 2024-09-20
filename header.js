import Link from 'next/link';
import logoImg from '@/app/assets/Logo.PNG'
import classes from '@/app/components/main-header.module.css'
export default function Header(){
    return (
        <header className={classes.header}>
            <Link className={classes.logo} href = "/">
            <img src={logoImg.src} alt='UBM logo'/>
            </Link>

            <nav className={classes.nav}>
                <ul>
                    <li>
                    <Link href= "/exercises"> Browse Exercises </Link>
                    </li>
                    <li>
                    <Link href= "/progress_tracking"> Track your Progress </Link>
                    </li>
                    <li>
                    <Link href= "/contact"> Contact Us </Link>
                    </li>
                    <li>
                    <Link href= "/sign_in"> Sign In </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}