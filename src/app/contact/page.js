"use client";

import Link from 'next/link';
import style from '@/app/components/exercise-item.module.css';
import button from '@/app/components/workout-plan-button.module.css'

export default function ContactPage() {
    return (
        <div>
            <header className={style.headerText} style={{ textAlign: 'center' }}>
                <h1>Contact Us</h1>
            </header>
            
            {/* Send Message Button */}
            <button
                className={button.button}
                style={{ display: 'block', margin: '20px auto', padding: '10px 20px' }}
                onClick={() => window.location.href = 'mailto:manager@example.com?subject=Message%20for%20Our%20Team&body=Hello, I would like to reach out to your team regarding...'}
            >
                Send a Message to Our Team
            </button>
        </div>
    );
}
