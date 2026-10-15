import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import CartridgeShelf from './components/CartridgeShelf';
import GameCartridge from './components/GameCartridge';
import GameConsole from './components/GameConsole';
import RetroTV from './components/RetroTV';
import ProjectScreen from './components/ProjectScreen';
import { projects } from './data/projects';
import { useGameConsole } from './hooks/useGameConsole';
import type { PortfolioProject } from './types/project';

type Box = { left: number; top: number; width: number; height: number };
type Drag = { project: PortfolioProject; x: number; y: number; offsetX: number; offsetY: number; width: number; height: number; startX: number; startY: number; moved: boolean; pointerId: number };
type Flight = { project: PortfolioProject; from: Box; to: Box; eject: boolean };

function FlyingCartridge({ flight, onDone }: { flight: Flight; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const { from, to, eject } = flight;
    const transform = (box: Box, lift = 0) => `translate(${box.left}px, ${box.top + lift}px) scale(${box.width / from.width}, ${box.height / from.height})`;
    const animation = ref.current!.animate([{ transform: transform(from), opacity: 1, clipPath: eject ? 'inset(0 0 72px 0)' : 'inset(0 0 0px 0)' }, { transform: transform(eject ? from : to, -65), opacity: 1, clipPath: 'inset(0 0 0px 0)', offset: eject ? 0.35 : 0.6 }, { transform: transform(to), opacity: eject ? 0.45 : 1, clipPath: eject ? 'inset(0 0 0px 0)' : 'inset(0 0 72px 0)' }], { duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 620, easing: 'cubic-bezier(.25,.7,.25,1)', fill: 'both' });
    animation.onfinish = onDone;
    return () => { animation.onfinish = null; animation.cancel(); };
  }, [flight, onDone]);
  return <div ref={ref} className="flying-cartridge" style={{ width: flight.from.width, height: flight.from.height }}><GameCartridge project={flight.project} decorative/></div>;
}

export default function App() {
  const { state, dispatch } = useGameConsole();
  const screenRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [near, setNear] = useState(false);
  const suppressClick = useRef(false);
  const overlayOpen = ['zooming', 'viewing', 'returning'].includes(state.phase);
  const slotBox = (): Box => { const r = slotRef.current!.getBoundingClientRect(); const width = Math.min(154, r.width - 26); return { left: r.left + (r.width - width) / 2, top: r.top - 69, width, height: width * 1.13 }; };
  const insert = (project: PortfolioProject, from: Box) => {
    if (state.phase !== 'empty') return;
    setFlight({ project, from, to: slotBox(), eject: false });
    dispatch({ type: 'INSERT', project });
  };
  const grab = (project: PortfolioProject, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (state.phase !== 'empty' || event.button !== 0 || drag) return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    suppressClick.current = false;
    setDrag({ project, x: r.left, y: r.top, offsetX: event.clientX - r.left, offsetY: event.clientY - r.top, width: r.width, height: r.height, startX: event.clientX, startY: event.clientY, moved: false, pointerId: event.pointerId });
  };
  useEffect(() => {
    if (!drag) return;
    const inSlot = (x: number, y: number) => { const r = slotRef.current!.getBoundingClientRect(); return x > r.left - 45 && x < r.right + 45 && y > r.top - 100 && y < r.bottom + 55; };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      const moved = drag.moved || Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6;
      setDrag({ ...drag, moved, x: event.clientX - drag.offsetX, y: event.clientY - drag.offsetY });
      setNear(inSlot(event.clientX, event.clientY));
    };
    const end = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      suppressClick.current = drag.moved;
      if (event.type !== 'pointercancel' && drag.moved && inSlot(event.clientX, event.clientY)) insert(drag.project, { left: event.clientX - drag.offsetX, top: event.clientY - drag.offsetY, width: drag.width, height: drag.height });
      setDrag(null); setNear(false);
    };
    const cancel = (event: KeyboardEvent) => { if (event.key === 'Escape') { setDrag(null); setNear(false); suppressClick.current = true; } };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end); window.addEventListener('keydown', cancel);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); window.removeEventListener('keydown', cancel); };
  }, [drag]);
  const eject = () => {
    if (state.phase !== 'loaded' || !state.project) return;
    const target = document.querySelector<HTMLElement>(`[data-cartridge-id="${state.project.id}"] button`)!;
    setFlight({ project: state.project, from: slotBox(), to: target.getBoundingClientRect(), eject: true });
    dispatch({ type: 'EJECT' });
  };
  const finishFlight = useRef(() => {});
  finishFlight.current = () => { suppressClick.current = false; const ejecting = state.phase === 'ejecting'; const id = state.project?.id; setFlight(null); dispatch({ type: ejecting ? 'EJECTED' : 'SEATED' }); requestAnimationFrame(() => { if (ejecting) document.querySelector<HTMLButtonElement>(`[data-cartridge-id="${id}"] button`)?.focus({ preventScroll: true }); else startRef.current?.focus({ preventScroll: true }); }); };
  const stableFinish = useRef(() => finishFlight.current()).current;
  return <><div className={`portfolio ${overlayOpen ? 'behind-screen' : ''}`} inert={overlayOpen || undefined}><header className="site-header"><a className="wordmark" href="#" aria-label="PotatoHeadKim home"><span className="brand-symbol" aria-hidden="true">▦</span>POTATOHEADKIM<span className="wordmark-small">/ PORTFOLIO</span></a><span className="header-status"><i/> OPEN TO POSSIBILITIES</span></header><main className="main-layout"><section className="system" aria-labelledby="system-title"><div className="section-heading"><h1 id="system-title">RETRO GAME SYSTEM</h1><span>EST. 1989 / REIMAGINED</span></div><RetroTV state={state} screenRef={screenRef}/><div className="connection-cable" aria-hidden="true"/><GameConsole state={state} near={near} slotRef={slotRef} startRef={startRef} onStart={() => dispatch({ type: 'START' })} onEject={eject}/><div className="system-caption"><span className="caption-line"/>A LITTLE NOSTALGIA. A LOT OF POSSIBILITY.<span className="caption-line"/></div></section><CartridgeShelf projects={projects} selectedId={state.project?.id} draggingId={drag?.moved ? drag.project.id : undefined} disabled={state.phase !== 'empty'} onGrab={grab} onSelect={(project, element, keyboard) => { if (suppressClick.current && !keyboard) { suppressClick.current = false; return; } insert(project, element.getBoundingClientRect()); }}/></main><footer className="site-footer"><span>© {new Date().getFullYear()} POTATOHEADKIM</span><span>BUILT FOR THE CURIOUS.</span><span className="footer-power">● SYSTEM READY</span></footer></div><div className="sr-only" role="status" aria-live="polite">{state.phase === 'empty' ? 'No cartridge. Select a cartridge to insert.' : state.phase === 'loaded' ? `${state.project?.title} loaded. Press Start.` : state.phase === 'viewing' ? `${state.project?.title} project open.` : ''}</div>{drag?.moved && createPortal(<div className="drag-cartridge" style={{ left: drag.x, top: drag.y, width: drag.width, height: drag.height }}><GameCartridge project={drag.project} decorative/></div>, document.body)}{flight && createPortal(<FlyingCartridge flight={flight} onDone={stableFinish}/>, document.body)}{overlayOpen && state.project && createPortal(<ProjectScreen project={state.project} phase={state.phase} screenRef={screenRef} startRef={startRef} dispatch={dispatch}/>, document.body)}</>;
}
