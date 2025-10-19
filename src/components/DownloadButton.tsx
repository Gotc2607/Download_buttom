// ARQUIVO: src/components/DownloadButton.tsx

import { useEffect, useRef, useState, useCallback, type FC } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import '../style/DownloadButton.css';

gsap.registerPlugin(MotionPathPlugin);

interface DownloadButtonProps {
  onDownloadComplete: () => void;
}

const DownloadButton: FC<DownloadButtonProps> = ({ onDownloadComplete }) => {
  // Esta é a linha que o TypeScript aponta.
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('download'); 
  
  const isDownloadingRef = useRef(isDownloading);
  useEffect(() => {
    isDownloadingRef.current = isDownloading;
  }, [isDownloading]);

  const btnRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);
  const mainCircleRef = useRef<SVGCircleElement | null>(null);
  const subCircleRef = useRef<SVGCircleElement | null>(null);
  const mainCircleFillRef = useRef<SVGCircleElement | null>(null);
  const arrowRef = useRef<SVGPathElement | null>(null);
  const rectRef = useRef<SVGRectElement | null>(null);
  const gradientStopsRef = useRef<SVGStopElement[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const handleAnimation = useCallback(() => {
    if (isDownloadingRef.current) return;
    if (tl.current) tl.current.kill();
    
    setIsDownloading(true);
    const downloadTime = Math.random() * 0.5 + 0.7;

    const changeText = () => {
      setButtonText('open');
      gsap.set(textRef.current, { x: -5 });
      onDownloadComplete();
    };

    const restart = () => {
      if (tl.current) tl.current.eventCallback('onComplete', null);
      subCircleRef.current?.classList.remove('strokeW');
      setTimeout(() => {
        if (tl.current) tl.current.seek(0).pause();
        setButtonText('download');
        setIsDownloading(false);
      }, 500);
    };

    tl.current = gsap.timeline({ onComplete: restart });

    // A timeline está correta, não precisa de mudanças aqui.
    tl.current.restart().play()
      .to(arrowRef.current, .35, { y: 2.5, ease: 'power2.out' }, 'click')
      .to(textRef.current, .3, { svgOrigin: '55% 35%', scale: .77, ease: 'power2.out' }, 'click+=.05')
      .set(subCircleRef.current, { fillOpacity: 1, strokeOpacity: 1 }, 'squeeze-=.3')
      .to(subCircleRef.current, .35, { fillOpacity: 0, ease: 'power1.inOut' }, 'squeeze-=.3')
      .to(subCircleRef.current, .45, { 
        attr: { r: 13 }, 
        strokeOpacity: 0, 
        ease: 'none',
        onStart: () => subCircleRef.current?.classList.add('strokeW')
      }, 'squeeze-=.3')
      .to(btnRef.current, .7, { attr: { d: 'M50,25 h0 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s0,0 0,0  a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h0' }, ease: 'sine.out' }, 'squeeze')
      .to([mainCircleRef.current, mainCircleFillRef.current, rectRef.current, arrowRef.current], .7, { x: 30, ease: 'sine.out' }, 'squeeze')
      .to(rectRef.current, .7, { fill: '#fff', rotation: 270, ease: 'sine.out' }, 'squeeze')
      .to(textRef.current, .3, { autoAlpha: 0, y: 7, onComplete: changeText }, 'squeeze')
      .to(arrowRef.current, .7, { attr: { d: 'M20,39 l3.5,-3.5 l-3.5,-3.5 M20,39 l-3.5,-3.5 l3.5,-3.5 M20,39 l0,0' }, transformOrigin: '50% 50%', rotation: 225, ease: 'sine.out' }, 'squeeze')
      .to(dotRef.current, .4, { attr: { r: 1.5 }, ease: 'back.out(7)' })
      .set(subCircleRef.current, { transformOrigin: '50% 50%', x: 30, rotation: -90, attr: { r: 9.07 } })
      .to(subCircleRef.current, downloadTime, { strokeDashoffset: 0, strokeOpacity: 1, ease: 'power2.in' }, 'fill+=.02')
      .to(dotRef.current, downloadTime, { 
        motionPath: { path: 'M0,0 a9,9 0 0,1 0,18 a9,9 0 0,1 0,-18', align: "self", alignOrigin: [0.5, 0.5] },
        attr: { r: 2.7 }, 
        ease: 'power2.in' 
      }, 'fill')
      .to(gradientStopsRef.current, downloadTime, { attr: { offset: '0%' }, ease: 'power2.in' }, 'fill')
      .to(dotRef.current, .44, { fill: '#02fc86', y: -22, ease: 'power1.out' }, 'stretch-=.01')
      .to(dotRef.current, .27, { transformOrigin: '50% 50%', scaleX: .5, ease: 'slow(0.1, 2, true)' }, 'stretch+=.04')
      .to(dotRef.current, .3, { scaleY: .6, ease: 'slow(0.1, 2, true)' }, 'stretch+=.31')
      .to(dotRef.current, .44, { scaleX: .4, y: 22, ease: 'power2.in' }, 'stretch+=.45')
      .to([mainCircleRef.current, subCircleRef.current, arrowRef.current, rectRef.current, mainCircleFillRef.current], .33, { opacity: 0, ease: 'power2.out' }, 'stretch+=.2')
      .to(btnRef.current, .4, { attr: { d: 'M50,25 h20 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s-20,0 -40,0 a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h20' }, ease: 'power1.out' }, 'stretch+=.2')
      .set(dotRef.current, { opacity: 0 }, 'stretch+=.875')
      .to(btnRef.current, .01, { stroke: '#02fc86', ease: 'power2.in' }, 'stretch+=.87')
      .to(btnRef.current, .3, { attr: { d: 'M50,25 h20 a10,10 0 0,1 10,10 a12,12 0 0,1 -10,10.5 s-20,6 -40,0 a12,12 0 0,1 -10,-10.5 a10,10 0 0,1 10,-10 h20' }, ease: 'circ.inOut' }, 'stretch+=.869')
      .to(textRef.current, .45, { autoAlpha: 1, y: 0, ease: 'back.out(2.5)' }, 'stretch+=.855');
  }, [onDownloadComplete]); 

  useEffect(() => {
    gsap.set(rectRef.current, { transformOrigin: '50% 50%', rotation: 45 });
    const subCircle = subCircleRef.current;
    if (subCircle) {
      const length = subCircle.getTotalLength();
      gsap.set(subCircle, { strokeDasharray: length, strokeDashoffset: length });
    }
    
    const btnElement = btnRef.current;
    if (btnElement) {
      btnElement.addEventListener('click', handleAnimation);
      return () => {
        btnElement.removeEventListener('click', handleAnimation);
        if (tl.current) { tl.current.kill(); }
      };
    }
  }, [handleAnimation]);

  return (
    <svg viewBox='0 0 100 50' width='620' height='310' fill='none'>
      <circle ref={mainCircleRef} cx='20' cy='35' r='8.5' fill='#00cffc' className='mainCircle'></circle>
      <circle ref={mainCircleFillRef} cx='20' cy='35' r='8.05' stroke='#00cffc' strokeWidth='.9' fill='url(#gradient)' className='mainCircleFill'></circle>
      <rect ref={rectRef} x='17.5' y='32.5' width='5' height='5' stroke='none' fill='#00cffc' className='rect'></rect>
      <path ref={arrowRef} d='M20,39 l3.5,-3.5 l0,0 M20,39 l-3.5,-3.5 l0,0 M20,39 l0,-7.5' stroke='#fff' strokeLinecap='round' strokeWidth='.8' className='arrow'></path>
      
      {/* ===== AQUI ESTÁ A CORREÇÃO CRUCIAL ===== */}
      {/* O texto é renderizado usando a variável de estado buttonText. */}
      <text ref={textRef} x='55' y='36.5' fill='#fff' textAnchor='middle' fontSize='5.5' fontFamily='Roboto' letterSpacing='.2' className='text'>{buttonText}</text>
      
      <path ref={btnRef} d='M50,25 h30 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s-30,0 -60,0 a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h30' stroke='#00cffc' strokeWidth='.7' fill='transparent' className='btn'></path>
      <circle ref={subCircleRef} cx='20' cy='35' r='7.9' fill='none' stroke='#fff' strokeWidth='1.6' strokeOpacity='0' className='subCircle'></circle>
      <circle ref={dotRef} cx='50' cy='26' r='0' fill='#fff' className='dot'></circle>
      <linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
        <stop ref={el => { if (el) gradientStopsRef.current[0] = el; }} offset='98%' className='gradient' stopColor='transparent' />
        <stop ref={el => { if (el) gradientStopsRef.current[1] = el; }} offset='98%' className='gradient' stopColor='#00afd3' />
      </linearGradient>
    </svg>
  );
};

export default DownloadButton;