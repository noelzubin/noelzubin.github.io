import React, { useState } from 'react'
import s from './index.module.sass';
import LogoBlack from './logo-black.png'
import LogoWhite from './logo-white.png'
import cx from 'classnames';
import { Link } from "gatsby"
import BrightnessButton from './BrightnessButton';
import MenuIcon from './MenuIcon';

const Links = ({ className, setOpen }) => (
    <div className={cx(s.links, className)} onClick={() => setOpen(false)}>
        <Link to="/">Home</Link>
        {/* <Link to="/about">About</Link> */}
        {/* <Link to="/blog">Blog</Link> */}
    </div>
)

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

    const [open, setOpen] = useState(false);

    return (
        <div className={cx(s.navbar, { [s.open]: open })}>
            <div className={s.inner}>
                <div className={s.left}>
                    <Link to="/">
                        {theme === 'dark' 
                            ? <img src={LogoWhite} />
                            : <img src={LogoBlack} />
                        }
                    </Link>
                </div>
                <div className={s.right}>
                    <Links setOpen={setOpen}/>
                    <div className={s.fixedLinks}>
                        {isBlog && <button className={s.fontBtn} onClick={setNextFont}>F</button> }
                        <BrightnessButton theme={theme} setNextTheme={setNextTheme}/>
                        <MenuIcon onClick={() => setOpen(!open)}/>
                    </div>
                </div>
            </div>
            <Links className={s.mobile} setOpen={setOpen} />
        </div>
    )
}
