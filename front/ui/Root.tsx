import React, { useState } from 'react'
import { Game } from './Game';

export const Root: React.FC = () => {
    const [id, setId] = useState('');
    const [gameStart, setGameStart] = useState(false);
    if (!gameStart) {
        return <div>
            Wprowadź ID lub zacznij nową grę:
            <form>
                <input value={id} onChange={e => setId(e.target.value)} />
                <button onClick={() => {
                    // TODO: CreateAPI which will check game ID.
                    setGameStart(true);
                }}> Sprawdź ID </button>
            </form>
            <button onClick={() => {
                setId('');
                setGameStart(true);
            }}>Zacznij nową grę</button>
        </div>
    } else {
        return <Game id={id} onClose={() => setGameStart(false)}/>
    }
}