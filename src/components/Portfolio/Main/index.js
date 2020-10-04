import React, { useEffect, useRef } from 'react';
import s from './index.module.sass'
import anime from 'animejs';
import cx from 'classnames';
import { useLayoutEffect } from 'react';
import { useState } from 'react';

const Main = () => {
    const main = useRef(null);
    const [ show, setShow ] = useState(false);

    useLayoutEffect(() => {
        setShow(true);
    }, [])

    useEffect(() => {
        anime ({
            targets: `.letter`,
            top: [-100,0],
            easing: "easeOutExpo",
            duration: 1000,
            delay: (el, i) => 400 + (30 * i)
        });
    }, [])

    return (
        <div ref={main} style={{ visibility: 'hidden' }} className={cx(s.main, {[s.show]: show} )}>
            <div className={cx(s.line, s.line1)}>
                <Lettered>
                    Hi I'm Noel
                </Lettered>
            </div>
            <div>
                <div className={s.line}>
                    <Lettered>
                        Im passionately curious
                    </Lettered>
                </div>
                <div className={s.line}>
                    <Lettered> and I </Lettered>
                    <span className={s.love}>
                        <Lettered> love </Lettered>
                    </span>
                    <Lettered> to code. </Lettered>
                </div>
            </div>
        </div>
    )
}

const Lettered = ({ children }) => {
    if (typeof children !== 'string') throw new Error('expected string children');
    return (
        <>
            {[...children].map((char,ind) => <span key={ind} className="letter">{char}</span> )}
        </>
    )
} 

export default Main;
