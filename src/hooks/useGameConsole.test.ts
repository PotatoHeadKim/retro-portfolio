import { describe, expect, it } from 'vitest';
import { consoleReducer, initialState } from './useGameConsole';
import { projects } from '../data/projects';

describe('cartridge console interaction contract', () => {
  it('requires Start, preserves the cartridge on Back, and allows replacement after Eject', () => {
    let state = consoleReducer(initialState, { type: 'INSERT', project: projects[0] });
    expect(state.phase).toBe('inserting');
    state = consoleReducer(state, { type: 'SEATED' });
    expect(state.phase).toBe('loaded');
    state = consoleReducer(state, { type: 'START' });
    state = consoleReducer(state, { type: 'BOOTED' });
    state = consoleReducer(state, { type: 'OPENED' });
    expect(state.phase).toBe('viewing');
    state = consoleReducer(state, { type: 'BACK' });
    state = consoleReducer(state, { type: 'CLOSED' });
    expect(state).toEqual({ phase: 'loaded', project: projects[0] });
    state = consoleReducer(state, { type: 'EJECT' });
    state = consoleReducer(state, { type: 'EJECTED' });
    expect(state).toEqual(initialState);
    state = consoleReducer(state, { type: 'INSERT', project: projects[1] });
    expect(state.project?.id).toBe('rag');
  });
  it('rejects empty starts, occupied slots, and duplicate input during transitions', () => {
    expect(consoleReducer(initialState, { type: 'START' })).toBe(initialState);
    const inserting = consoleReducer(initialState, { type: 'INSERT', project: projects[0] });
    expect(consoleReducer(inserting, { type: 'START' })).toBe(inserting);
    expect(consoleReducer(inserting, { type: 'INSERT', project: projects[1] })).toBe(inserting);
    const booting = consoleReducer(consoleReducer(inserting, { type: 'SEATED' }), { type: 'START' });
    expect(consoleReducer(booting, { type: 'EJECT' })).toBe(booting);
    expect(consoleReducer(booting, { type: 'START' })).toBe(booting);
    expect(consoleReducer(booting, { type: 'BACK' })).toBe(booting);
  });
});
