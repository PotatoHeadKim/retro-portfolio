import type { PointerEvent } from 'react';
import type { PortfolioProject } from '../types/project';
import GameCartridge from './GameCartridge';

interface Props { projects: PortfolioProject[]; selectedId?: string; draggingId?: string; disabled: boolean; onGrab: (project: PortfolioProject, event: PointerEvent<HTMLButtonElement>) => void; onSelect: (project: PortfolioProject, element: HTMLButtonElement, keyboard: boolean) => void }
export default function CartridgeShelf({ projects, selectedId, draggingId, disabled, onGrab, onSelect }: Props) {
  return <section className="shelf" aria-labelledby="shelf-title"><h2 id="shelf-title">PROJECT CARTRIDGES</h2><div className="cartridge-grid">{projects.map(project => <div className="cartridge-bay" key={project.id} data-cartridge-id={project.id}><GameCartridge project={project} disabled={disabled} muted={selectedId === project.id || draggingId === project.id} onPointerDown={event => onGrab(project, event)} onClick={event => onSelect(project, event.currentTarget, event.detail === 0)}/></div>)}</div></section>;
}
