import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Hook simplifié avec la version corrigée
const useNextCard = (byDateDesc) => {
    const [index, setIndex] = useState(0);

    const nextCard = () => {
        setTimeout(
            () => setIndex((prevIndex) => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0)),
            5000
        );
    };

    return { index, nextCard };
};

describe('nextCard function ', () => {
    const mockArray = ['item1', 'item2', 'item3'];

    test('increments and resets index correctly', () => {
        jest.useFakeTimers(); // Simule les timers

        const { result } = renderHook(() => useNextCard(mockArray));

        // Incrémenter une fois
        act(() => {
            result.current.nextCard();
            jest.advanceTimersByTime(5000); // Simule un délai de 5 secondes
        });
        expect(result.current.index).toBe(1); // Vérifie que l'index est passé à 1

        // Incrémenter une deuxième fois
        act(() => {
            result.current.nextCard();
            jest.advanceTimersByTime(5000);
        });
        expect(result.current.index).toBe(2); // Vérifie que l'index est passé à 2

        // Réinitialiser à 0 après avoir atteint la fin du tableau
        act(() => {
            result.current.nextCard();
            jest.advanceTimersByTime(5000);
        });
        expect(result.current.index).toBe(0); // Vérifie que l'index est réinitialisé à 0
    });
});
