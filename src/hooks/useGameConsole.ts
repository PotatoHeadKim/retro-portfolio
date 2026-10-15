import { useEffect, useReducer } from 'react';
import type { PortfolioProject } from '../types/project';

export type Phase = 'empty' | 'inserting' | 'loaded' | 'booting' | 'zooming' | 'viewing' | 'returning' | 'ejecting';
export interface ConsoleState { phase: Phase; project: PortfolioProject | null }
export type ConsoleAction = { type: 'INSERT'; project: PortfolioProject } | { type: 'SEATED' | 'START' | 'BOOTED' | 'OPENED' | 'BACK' | 'CLOSED' | 'EJECT' | 'EJECTED' };
export const initialState: ConsoleState = { phase: 'empty', project: null };

export function consoleReducer(state: ConsoleState, action: ConsoleAction): ConsoleState {
  switch (action.type) {
    case 'INSERT': return state.phase === 'empty' ? { phase: 'inserting', project: action.project } : state;
    case 'SEATED': return state.phase === 'inserting' ? { ...state, phase: 'loaded' } : state;
    case 'START': return state.phase === 'loaded' ? { ...state, phase: 'booting' } : state;
    case 'BOOTED': return state.phase === 'booting' ? { ...state, phase: 'zooming' } : state;
    case 'OPENED': return state.phase === 'zooming' ? { ...state, phase: 'viewing' } : state;
    case 'BACK': return state.phase === 'viewing' ? { ...state, phase: 'returning' } : state;
    case 'CLOSED': return state.phase === 'returning' ? { ...state, phase: 'loaded' } : state;
    case 'EJECT': return state.phase === 'loaded' ? { ...state, phase: 'ejecting' } : state;
    case 'EJECTED': return state.phase === 'ejecting' ? initialState : state;
    default: return state;
  }
}

export function useGameConsole() {
  const [state, dispatch] = useReducer(consoleReducer, initialState);
  useEffect(() => {
    if (state.phase !== 'booting') return;
    const timer = window.setTimeout(() => dispatch({ type: 'BOOTED' }), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 340);
    return () => window.clearTimeout(timer);
  }, [state.phase]);
  return { state, dispatch };
}
