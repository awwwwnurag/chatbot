import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  hideDefaultCursor = true,
  parallaxOn = true
}) => {
  const cursorRef = useRef(null);
  const arrowRef = useRef(null);
  const glowRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: parallaxOn ? 0.05 : 0,
      ease: 'power2.out'
    });
  }, [parallaxOn]);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    if (hideDefaultCursor) {
      document.body.classList.add('hide-cursor');
    }

    const cursor = cursorRef.current;
    let activeTarget = null;

    gsap.set(cursor, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const moveHandler = e => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const mouseDownHandler = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.15 });
    };

    const mouseUpHandler = () => {
      gsap.to(cursor, { scale: 1, duration: 0.15 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = e => {
      const target = e.target.closest(targetSelector);
      if (target && activeTarget !== target) {
        activeTarget = target;
        gsap.to(cursor, { scale: 1.3, duration: 0.3 });
        if (glowRef.current) gsap.to(glowRef.current, { scale: 1.5, opacity: 0.9, duration: 0.3 });
      }
    };

    const leaveHandler = e => {
      const target = e.target.closest(targetSelector);
      if (target && activeTarget === target) {
        activeTarget = null;
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        if (glowRef.current) gsap.to(glowRef.current, { scale: 1, opacity: 0.6, duration: 0.3 });
      }
    };

    window.addEventListener('mouseover', enterHandler);
    window.addEventListener('mouseout', leaveHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('mouseout', leaveHandler);
      document.body.classList.remove('hide-cursor');
    };
  }, [targetSelector, moveCursor, hideDefaultCursor, isMobile]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper default-arrow-mode">
      <div ref={glowRef} className="target-cursor-glow" />
      <div className="target-arrow-container">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="target-cursor-arrow"
        >
          {/* Classic OS Arrow Path */}
          <path 
            ref={arrowRef}
            d="M5 3L5 19.5L9.4 15.1L12.8 22.3L15.4 21.2L12 14.2L18.1 14.2L5 3Z" 
            fill="white"
            stroke="#000"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default TargetCursor;
