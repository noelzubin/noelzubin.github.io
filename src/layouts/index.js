import React, { useState } from "react"
import Transition from '../components/Transition';
import Navbar from '../components/Navbar';
import ThemeContext from '../components/ThemeContext';
import SmoothScroll from '../components/SmoothScroll'
import './index.scss';

export default function Layout({ children, location }) {

  const [theme, setTheme] = useState('light')
  const [font, setFont] = useState('serif')



  return (
    <div className={`theme-${theme}`}>
      <ThemeContext.Provider value={theme}>
        <Navbar setTheme={setTheme} theme={theme} location={location} font={font} setFont={setFont} /> 
        <div className={`container font-${font}`}>
            <SmoothScroll location={location}>
              <Transition location={location}>
                {children}
              </Transition>
            </SmoothScroll>
        </div>
      </ThemeContext.Provider>
    </div>
  )
}