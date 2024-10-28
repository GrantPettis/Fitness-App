import Link from 'next/link';
import style from '@/app/components/exercise-item.module.css'
export default function contact_page(){
    return(
    <div>
         <header className={style.headerText} style={{ textAlign: 'center' }}>
            <h1>Contact Us</h1>
        </header>
    </div>
    )
}