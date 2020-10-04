import React, { useRef, useEffect } from 'react';

let SmthScroll;
if (typeof window!== 'undefined') {
  const document = window.document
  
  const MathUtils = {
    // map number x from range [a, b] to [c, d]
    map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
    // linear interpolation, (previous, current, ease)
    lerp: (a, b, n) => (1 - n) * a + n * b
  };
  
  let docScroll;
  const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
  getPageYScroll()
  
  const body = document.body;
  
  class SmoothScroll {
    constructor(fixed, scrollable) {
      this.fixed = fixed; 
      this.scrollable = scrollable;
      this.translateY = { 
        previous: 0,
        currrent: 0,
        ease: 0.1,
        setValue: () => docScroll
      }
      this.update()
      this.setSize()
      this.style()
      this.initEvents();
  
      requestAnimationFrame(() => this.render());
    }
  
    setSize() {
      body.style.height = this.scrollable.scrollHeight + 70 + 'px';
    }
  
    initEvents() {
      window.addEventListener('scroll', getPageYScroll);
      window.addEventListener('resize', () => this.setSize());
      window.addEventListener('locationchange', () => this.setSize());
    }
  
    style() {
      this.fixed.style.position = 'fixed';
      this.fixed.style.width = '100vw'
      this.fixed.style.height = '100vh';
      this.fixed.style.top = 0;
      this.fixed.style.left = 0;
      this.fixed.style.overflow = 'hidden';
    }
  
    update() {
      this.translateY.current = this.translateY.previous = this.translateY.setValue();
      this.layout()
    }
  
    layout() {
      this.scrollable.style.transform = `translateY(${-1*this.translateY.previous}px)`;
    }
  
    render() {
        this.translateY.current = this.translateY.setValue();
        this.translateY.previous = MathUtils.lerp(this.translateY.previous, this.translateY.current, this.translateY.ease);
        this.layout()
        requestAnimationFrame(() => this.render());
    }
  }

  SmthScroll = SmoothScroll
}

export default ({ children, location }) => {
    const fixed = useRef(null);
    const scrollable = useRef(null);

    const ss = useRef(null);

    useEffect(() => {
        if(SmthScroll) ss.current = new SmthScroll(fixed.current, scrollable.current) 
    }, [])

    useEffect(() => {
      const interval = setInterval(() => {
        ss.current.setSize()
      }, 2000)

      setTimeout(() => {
        ss.current.setSize()
      }, 450);

      return () => {
        clearInterval(interval);
      }
    }, [location.pathname])

    return (
        <div ref={fixed} className="fixed-container">
            <div ref={scrollable}>
                {children}
            </div>
        </div>
    )
} 
