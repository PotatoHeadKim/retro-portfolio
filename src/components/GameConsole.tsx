import type { RefObject } from 'react';
import type { ConsoleState } from '../hooks/useGameConsole';
import GameCartridge from './GameCartridge';

interface Props { state: ConsoleState; near: boolean; slotRef: RefObject<HTMLDivElement | null>; startRef: RefObject<HTMLButtonElement | null>; onStart: () => void; onEject: () => void }
export default function GameConsole({ state, near, slotRef, startRef, onStart, onEject }: Props) {
  const seated = state.project && !['inserting', 'ejecting'].includes(state.phase);
  return <div className="console"><div className="console-top"><div className="console-vent"/><div ref={slotRef} className={`cartridge-slot ${near ? 'slot-near' : ''} ${seated ? 'slot-filled' : ''}`} aria-label="Cartridge slot"><div className="slot-well"/>{seated && <div className="installed-cartridge"><GameCartridge project={state.project!} decorative/></div>}</div><span className="console-top-brand">PROJECT ENTERTAINMENT SYSTEM</span></div><div className="console-front"><div className="console-identity"><span className={`power-led ${seated ? 'on' : ''}`}/><span>PROJECT<br/><strong>SYSTEM</strong></span></div><div className="console-buttons"><button ref={startRef} className="hardware-button start-button" disabled={state.phase !== 'loaded'} onClick={onStart}>START</button><button className="hardware-button eject-button" disabled={state.phase !== 'loaded'} onClick={onEject}>EJECT</button></div><div className="controller-ports" aria-hidden="true"><i/><i/></div></div><div className="console-foot console-foot-left"/><div className="console-foot console-foot-right"/></div>;
}
