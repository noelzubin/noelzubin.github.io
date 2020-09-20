import React from 'react'
import s from './index.module.sass';
import LogoBlack from './logo-black.png'
import { Link } from "gatsby"
import sun from './sun.svg';
import moon from './moon.svg';
import coffee from './coffee.svg';

export default ({ theme, setTheme, location, font, setFont }) => {

    const setNextTheme = () => {
        const themes = ['light', 'coffee', 'dark'];
        const ind =  themes.findIndex(t => t === theme);
        setTheme(themes[(ind + 1) % themes.length])
    }

    const setNextFont = () => {
        const fonts = ["sans", "serif", "monospace"];
        const ind =  fonts.findIndex(f => f === font);
        setFont(fonts[(ind + 1) % fonts.length])
    }

    const isBlog = location.pathname.indexOf('/blog') !== -1;

    return (
        <div className={s.navbar}>
            <div className={s.inner}>
                <img src={LogoBlack} />
                <div className={s.right}>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/about">Blog</Link>
                    <button onClick={setNextTheme}>  
                        { theme === 'light' && <img src={sun} />}
                        { theme === 'dark' && <img src={moon} />}
                        { theme === 'coffee' && <img src={coffee} />}
                    </button>
                    {isBlog && <button onClick={setNextFont}>F</button> }
                </div>
            </div>
        </div>
    )
}
