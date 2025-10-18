// ARQUIVO: src/components/DownloadButton/DownloadButton.tsx

import { useEffect, useRef, useState, type FC } from 'react';
import { gsap } from 'gsap';
import Snap from 'snapsvg-cjs';
import './DownloadButton.css';

// ANOTAÇÃO TS: Definimos uma interface para o objeto de ponto para maior clareza.
interface Point {
  x: number;
  y: number;
}

// ANOTAÇÃO TS: Definimos o tipo do nosso componente como React.FC (Functional Component).
const DownloadButton: FC = () => {
  // ANOTAÇÃO TS: Adicionamos tipos aos nossos estados.
  const [buttonText, setButtonText] = useState<string>('download');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // ANOTAÇÃO TS: Adicionamos tipos específicos de elementos SVG para cada ref.
  // O tipo `| null` é necessário porque o valor inicial da ref é null.
  const btnRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);
  const mainCircleRef = useRef<SVGCircleElement | null>(null);
  const subCircleRef = useRef<SVGCircleElement | null>(null);
  const mainCircleFillRef = useRef<SVGCircleElement | null>(null);
  const arrowRef = useRef<SVGPathElement | null>(null);
  const rectRef = useRef<SVGRectElement | null>(null);
  const gradientStopsRef = useRef<SVGStopElement[]>([]);
  
  // ANOTAÇÃO TS: A timeline do GSAP pode ser tipada, aqui usamos 'any' por simplicidade
  // ou podemos usar o tipo do GSAP: gsap.core.Timeline
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.set(rectRef.current, { transformOrigin: '50% 50%', rotation: 45 });

    // ANOTAÇÃO TS: Usamos a interface Point que definimos.
    const points: Point[] = [];
    const data = Snap.path.toCubic('M0,0 a9,9 0 0,1 0,18 a9,9 0 0,1 0,-18');
    
    data.forEach((seg: (string | number)[]) => {
      if (seg[0] === 'M') {
        points.push({ x: seg[1] as number, y: seg[2] as number });
      } else {
        for (let i = 1; i < 6; i += 2) {
          points.push({ x: seg[i] as number, y: seg[i + 1] as number });
        }
      }
    });

    const subCircle = subCircleRef.current;
    // ANOTAÇÃO TS: TypeScript nos força a verificar se a ref não é nula antes de usá-la.
    if (subCircle) {
      const length = subCircle.getTotalLength();
      gsap.set(subCircle, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    }

    const changeText = () => {
      setButtonText('open');
      gsap.set(textRef.current, { x: -5 });
    };

    const restart = () => {
      setTimeout(() => {
        if (tl.current) {
          tl.current.seek(0).pause();
        }
        setButtonText('download');
        gsap.set(textRef.current, { x: 0 });
        setIsDownloading(false);
      }, 2000);
    };

    const handleAnimation = () => {
      if (isDownloading) return;
      setIsDownloading(true);
      const downloadTime = Math.random() * 0.5 + 0.7;

      tl.current = gsap.timeline({ onComplete: restart });

      // O código da timeline GSAP permanece o mesmo
      tl.current.restart().play()
        .to(arrowRef.current, .35, { y: 2.5, ease: 'power2.out' }, 'click')
        .to(textRef.current, .3, { svgOrigin: '55% 35%', scale: .77, ease: 'power2.out' }, 'click+=.05')
        .set(subCircleRef.current, { fillOpacity: 1, strokeOpacity: 1 }, 'squeeze-=.3')
        .to(subCircleRef.current, .35, { fillOpacity: 0, ease: 'power1.inOut' }, 'squeeze-=.3')
        .to(subCircleRef.current, .45, { attr: { r: 13 }, strokeOpacity: 0, className: '+=strokeW', ease: 'none' }, 'squeeze-=.3')
        .to(btnRef.current, .7, { attr: { d: 'M50,25 h0 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s0,0 0,0  a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h0' }, ease: 'sine.out' }, 'squeeze')
        .to([mainCircleRef.current, mainCircleFillRef.current, rectRef.current, arrowRef.current], .7, { x: 30, ease: 'sine.out' }, 'squeeze')
        .to(rectRef.current, .7, { fill: '#fff', rotation: 270, ease: 'sine.out' }, 'squeeze')
        .to(textRef.current, .3, { autoAlpha: 0, y: 7, onComplete: changeText }, 'squeeze')
        .to(arrowRef.current, .7, { attr: { d: 'M20,39 l3.5,-3.5 l-3.5,-3.5 M20,39 l-3.5,-3.5 l3.5,-3.5 M20,39 l0,0' }, transformOrigin: '50% 50%', rotation: 225, ease: 'sine.out' }, 'squeeze')
        .to(dotRef.current, .4, { attr: { r: 1.5 }, ease: 'back.out(7)' })
        .set(subCircleRef.current, { strokeOpacity: 1, transformOrigin: '50% 50%', x: 30, rotation: -90, attr: { r: 9.07 } })
        .to(subCircleRef.current, downloadTime, { strokeDashoffset: 0, ease: 'power2.in' }, 'fill+=.02')
        .to(dotRef.current, downloadTime, { bezier: { type: 'cubic', values: points }, attr: { r: 2.7 }, ease: 'power2.in' }, 'fill')
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
    };

    const btnElement = btnRef.current;
    // ANOTAÇÃO TS: Outra verificação de nulidade para adicionar o event listener com segurança.
    if (btnElement) {
      btnElement.addEventListener('click', handleAnimation);
      return () => {
        btnElement.removeEventListener('click', handleAnimation);
        if (tl.current) {
          tl.current.kill();
        }
      };
    }
  }, [isDownloading]); 

  return (
    <svg viewBox='0 0 100 50' width='620' height='310' fill='none'>
      <circle ref={mainCircleRef} cx='20' cy='35' r='8.5' fill='#00cffc' className='mainCircle'></circle>
      <circle ref={mainCircleFillRef} cx='20' cy='35' r='8.05' stroke='#00cffc' strokeWidth='.9' fill='url(#gradient)' className='mainCircleFill'></circle>
      <rect ref={rectRef} x='17.5' y='32.5' width='5' height='5' stroke='none' fill='#00cffc' className='rect'></rect>
      <path ref={arrowRef} d='M20,39 l3.5,-3.5 l0,0 M20,39 l-3.5,-3.5 l0,0 M20,39 l0,-7.5' stroke='#fff' strokeLinecap='round' strokeWidth='.8' className='arrow'></path>
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