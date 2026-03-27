import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock window.location.reload pour tous les tests
beforeEach(() => {
    delete (window as any).location;
    window.location = { reload: vi.fn() } as any;
});

// Mock Element.animate pour simuler l'API animate pour tous les tests afin que les transitions fonctionnent en test.
if (typeof Element.prototype.animate === 'undefined') {
    Element.prototype.animate = function() {
        return {
            cancel: vi.fn(),
            finish: vi.fn(),
            pause: vi.fn(),
            play: vi.fn(),
            reverse: vi.fn(),
            onfinish: null,
            oncancel: null,
            onremove: null,
            finished: Promise.resolve(),
            ready: Promise.resolve(),
            playState: 'finished',
            replaceState: 'active',
            pending: false,
            playbackRate: 1,
            startTime: 0,
            currentTime: 0,
            timeline: null,
            effect: null,
            id: '',
            commitStyles: vi.fn(),
            persist: vi.fn(),
            updatePlaybackRate: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        } as any;
    };
}

global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};