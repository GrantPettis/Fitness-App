import Link from 'next/link';
import logoImg from '@/app/assets/Logo.PNG'
import classes from '@/app/components/main-header.module.css'
import Image from 'next/image';
import MainHeaderBackground from '@/app/components/main-header-background';
export default function Header(){
    return (
        <>
        <MainHeaderBackground/>
        <header className={classes.header}>
            <Link className={classes.logo} href = "/">
            <Image src={logoImg} alt='UBM logo' priority/>
            </Link>

            <nav className={classes.nav}>
                <ul>
                    <li>
                    <Link href= "/exercises"> Browse Exercises </Link>
                    </li>
                    <li>
                    <Link href= "/progress_tracking"> Track Your Progress </Link>
                    </li>
                    <li>
                    <Link href= "/workout_plan"> Workout Plan </Link>
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
        </>
    );
}