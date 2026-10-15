import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Dispatch, RefObject } from 'react';
import type { ConsoleAction, Phase } from '../hooks/useGameConsole';
import type { PortfolioProject } from '../types/project';

interface Props { project: PortfolioProject; phase: Phase; screenRef: RefObject<HTMLDivElement | null>; dispatch: Dispatch<ConsoleAction>; startRef: RefObject<HTMLButtonElement | null> }
export default function ProjectScreen({ project, phase, screenRef, dispatch, startRef }: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (!['zooming', 'returning'].includes(phase)) return;
    const node = overlay.current!;
    const rect = screenRef.current!.getBoundingClientRect();
    const small = `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / window.innerWidth}, ${rect.height / window.innerHeight})`;
    const entering = phase === 'zooming';
    const frames = [{ transform: small, borderRadius: '70px', opacity: 0.9 }, { transform: 'translate(0, 0) scale(1, 1)', borderRadius: '0px', opacity: 1 }];
    const anim = node.animate(entering ? frames : [...frames].reverse(), { duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 850, easing: 'cubic-bezier(.22, .75, .14, 1)', fill: 'both' });
    const finish = () => { dispatch({ type: entering ? 'OPENED' : 'CLOSED' }); if (!entering) requestAnimationFrame(() => startRef.current?.focus({ preventScroll: true })); };
    anim.onfinish = finish;
    return () => { anim.onfinish = null; anim.cancel(); };
  }, [phase, screenRef, startRef, dispatch]);
  useEffect(() => {
    if (phase === 'viewing') back.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase === 'viewing') dispatch({ type: 'BACK' });
      if (event.key === 'Tab') {
        const items = overlay.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
        if (!items?.length) { event.preventDefault(); return; }
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = oldOverflow; };
  }, [phase, dispatch]);
  return <div ref={overlay} className={`project-screen ${phase === 'viewing' ? 'project-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="project-title"><div className="project-scroll"><header className="project-header"><button ref={back} className="back-button" onClick={() => dispatch({ type: 'BACK' })} disabled={phase !== 'viewing'}>← BACK / CONSOLE</button><span>PROJECT SYSTEM</span></header><main className="project-main"><span className="project-eyebrow">DEMO CARTRIDGE / CONTENT COMING SOON</span><div className="project-layout"><div><h1 id="project-title">{project.title}</h1><p className="project-description">{project.description}</p><div className="technology-list" aria-label="Technology stack">{project.technologies.map(item => <span key={item}>{item}</span>)}</div>{project.githubUrl && <a className="github-button" href={project.githubUrl} target="_blank" rel="noopener noreferrer">VIEW ON GITHUB ↗</a>}</div><div className="pixel-art">{project.image ? <img src={project.image} alt={`${project.title} preview`}/> : <svg viewBox="0 0 160 160" aria-label="Pixel art cartridge" role="img" shapeRendering="crispEdges"><path d="M32 12h96v8h8v112h-8v12H32v-12h-8V20h8z" fill="#9bb68a"/><path d="M40 28h80v64H40z" fill="#234737"/><path d="M52 40h56v8H52zm0 16h40v8H52zm0 16h48v8H52z" fill={project.cartridgeColor}/><path d="M48 108h64v36H48z" fill="#d6c582"/><path d="M56 116h4v28h-4zm16 0h4v28h-4zm16 0h4v28h-4zm16 0h4v28h-4z" fill="#234737"/><path d="M32 20h8v8h-8zm88 0h8v8h-8z" fill="#e1ecd3"/></svg>}<span>WORK IN PROGRESS</span></div></div><footer className="project-footer"><span>A NEW CHAPTER IS LOADING.</span><span>© POTATOHEADKIM</span></footer></main></div></div>;
}
