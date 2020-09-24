import React from 'react';
import sun from './sun.svg';
import moon from './moon.svg';
import coffee from './coffee.svg';
import s from './index.module.sass';

export default ({ theme, setNextTheme }) => (
    <button className={s.brightnessBtn}  onClick={setNextTheme}>
        {theme === 'light' && <img src={sun} />}
        {theme === 'dark' && <img src={moon} />}
        {theme === 'coffee' && <img src={coffee} />}
    </button>
);
