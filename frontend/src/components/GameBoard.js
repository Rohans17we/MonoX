import React, { useState, useEffect } from 'react';
import BoardSpace from './BoardSpace';
import { boardSpaces } from '../data/boardData';
import './GameBoard.css';

const GameBoard = ({ gameState, players, onSpaceClick }) => {
  const [selectedSpace, setSelectedSpace] = useState(null);

  // Get property owner
  const getPropertyOwner = (spaceId) => {
    return players.find(p => 
      p.properties && p.properties.some(prop => prop.spaceId === spaceId)
    );
  };

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    if (onSpaceClick) {
      onSpaceClick(space);
    }
  };

  // Organize spaces by position
  const bottomSpaces = boardSpaces.filter(s => s.position === 'bottom').reverse();
  const leftSpaces = boardSpaces.filter(s => s.position === 'left');
  const topSpaces = boardSpaces.filter(s => s.position === 'top');
  const rightSpaces = boardSpaces.filter(s => s.position === 'right').reverse();
  
  const corners = {
    bottomRight: boardSpaces.find(s => s.position === 'corner-bottom-right'),
    bottomLeft: boardSpaces.find(s => s.position === 'corner-bottom-left'),
    topLeft: boardSpaces.find(s => s.position === 'corner-top-left'),
    topRight: boardSpaces.find(s => s.position === 'corner-top-right'),
  };

  return (
    <div className=\"game-board-container\">
      <div className=\"game-board\">
        {/* Top row */}
        <div className=\"board-row top-row\">
          <BoardSpace 
            space={corners.topLeft} 
            players={players}
            onClick={handleSpaceClick}
          />
          {topSpaces.map(space => (
            <BoardSpace
              key={space.id}
              space={space}
              players={players}
              owner={getPropertyOwner(space.id)}
              onClick={handleSpaceClick}
            />
          ))}
          <BoardSpace 
            space={corners.topRight} 
            players={players}
            onClick={handleSpaceClick}
          />
        </div>

        {/* Middle section with left, center, right */}
        <div className=\"board-middle\">
          {/* Left column */}
          <div className=\"board-column left-column\">
            {leftSpaces.map(space => (
              <BoardSpace
                key={space.id}
                space={space}
                players={players}
                owner={getPropertyOwner(space.id)}
                onClick={handleSpaceClick}
              />
            ))}
          </div>

          {/* Center area */}
          <div className=\"board-center\">
            <div className=\"center-content\">
              <div className=\"text-center\">
                <h1 className=\"text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent\">
                  MONOPOLY
                </h1>
                <p className=\"text-sm text-muted-foreground\">
                  Build your empire!
                </p>
              </div>
              
              {gameState && gameState.currentPlayerIndex !== undefined && (
                <div className=\"mt-8 p-4 bg-card rounded-lg border shadow-sm\">
                  <p className=\"text-sm font-semibold mb-2\">Current Turn:</p>
                  <div className=\"flex items-center gap-2\">
                    <div 
                      className=\"w-6 h-6 rounded-full border-2 border-white shadow\"
                      style={{ backgroundColor: players[gameState.currentPlayerIndex]?.color }}
                    />
                    <span className=\"font-bold\">
                      {players[gameState.currentPlayerIndex]?.username}
                    </span>
                  </div>
                </div>
              )}
              
              {gameState?.dice && gameState.dice[0] > 0 && (
                <div className=\"mt-4 p-4 bg-card rounded-lg border shadow-sm\">
                  <p className=\"text-sm font-semibold mb-2\">Last Roll:</p>
                  <div className=\"flex gap-2 justify-center\">
                    <div className=\"dice-face\">
                      {gameState.dice[0]}
                    </div>
                    <div className=\"dice-face\">
                      {gameState.dice[1]}
                    </div>
                  </div>
                  <p className=\"text-center mt-2 text-sm\">
                    Total: {gameState.dice[0] + gameState.dice[1]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className=\"board-column right-column\">
            {rightSpaces.map(space => (
              <BoardSpace
                key={space.id}
                space={space}
                players={players}
                owner={getPropertyOwner(space.id)}
                onClick={handleSpaceClick}
              />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className=\"board-row bottom-row\">
          <BoardSpace 
            space={corners.bottomLeft} 
            players={players}
            onClick={handleSpaceClick}
          />
          {bottomSpaces.map(space => (
            <BoardSpace
              key={space.id}
              space={space}
              players={players}
              owner={getPropertyOwner(space.id)}
              onClick={handleSpaceClick}
            />
          ))}
          <BoardSpace 
            space={corners.bottomRight} 
            players={players}
            onClick={handleSpaceClick}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
