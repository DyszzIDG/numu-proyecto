import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        for (const shortcut of shortcuts) {
            const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
            const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatch = shortcut.alt ? event.altKey : !event.altKey;
            const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

            if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                event.preventDefault();
                shortcut.action();
                break;
            }
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
}

export const COMMON_SHORTCUTS = {
    EXECUTE: { key: 'Enter', ctrl: true, description: 'Execute scan' },
    SEARCH: { key: 'k', ctrl: true, description: 'Search prompts' },
    HISTORY: { key: 'h', ctrl: true, description: 'Toggle history' },
    ESCAPE: { key: 'Escape', description: 'Close modal/cancel' },
    SAVE: { key: 's', ctrl: true, description: 'Save as favorite' },
    EXPORT: { key: 'e', ctrl: true, description: 'Export results' },
};
