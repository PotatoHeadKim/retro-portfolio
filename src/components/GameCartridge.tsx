import type { CSSProperties, PointerEvent, MouseEvent } from 'react';
import type { PortfolioProject } from '../types/project';

interface Props { project: PortfolioProject; decorative?: boolean; muted?: boolean; disabled?: boolean; onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void; onClick?: (event: MouseEvent<HTMLButtonElement>) => void }
export function CartridgeShape({ project }: { project: PortfolioProject }) {
  return <><span className="cartridge-ridges"/><span className="cartridge-screw screw-left"/><span className="cartridge-screw screw-right"/><span className="cartridge-label" style={{ backgroundColor: project.cartridgeColor }}><span>{project.title}</span></span><span className="cartridge-bottom"/><span className="cartridge-contacts"/></>;
}
export default function GameCartridge({ project, decorative, muted, disabled, onPointerDown, onClick }: Props) {
  const style = { '--label-color': project.cartridgeColor } as CSSProperties;
  if (decorative) return <div className="cartridge" style={style} aria-hidden="true"><CartridgeShape project={project}/></div>;
  return <button className={`cartridge ${muted ? 'cartridge-muted' : ''}`} style={style} disabled={disabled} onPointerDown={onPointerDown} onClick={onClick} aria-label={`Insert ${project.title}`}><CartridgeShape project={project}/></button>;
}
