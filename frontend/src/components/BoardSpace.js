import React from 'react';
import { propertyColors } from '../boardData';
import { Home, Hotel } from 'lucide-react';

const BoardSpace = ({ space, players, owner, onClick }) => {
  const getSpaceColor = () => {
    if (space.color) {
      return propertyColors[space.color];
    }
    return '#e0e0e0';
  };

  const playersOnSpace = players.filter(p => p.position === space.id);
  
  const renderProperty = () => (
    <div 
      className={`board-space property ${space.position} cursor-pointer hover:scale-105 transition-transform`}
      onClick={() => onClick && onClick(space)}
    >
      <div 
        className="color-bar h-8" 
        style={{ backgroundColor: getSpaceColor() }}
      />
      <div className="p-2 flex-1 flex flex-col justify-between">
        <p className="text-xs font-semibold text-center leading-tight">{space.name}</p>
        {space.price && (
          <p className="text-xs text-center font-bold">${space.price}</p>
        )}
        {owner && (
          <div className="mt-1">
            {owner.properties.find(p => p.spaceId === space.id)?.houses > 0 && (
              <div className="flex justify-center gap-1">
                {[...Array(owner.properties.find(p => p.spaceId === space.id).houses)].map((_, i) => (
                  <Home key={i} className="w-3 h-3 text-green-600" />
                ))}
              </div>
            )}
            {owner.properties.find(p => p.spaceId === space.id)?.hotels > 0 && (
              <div className="flex justify-center">
                <Hotel className="w-4 h-4 text-red-600" />
              </div>
            )}
          </div>
        )}
      </div>
      {renderPlayers()}
    </div>
  );

  const renderCorner = () => (
    <div 
      className={`board-space corner ${space.position} cursor-pointer hover:scale-105 transition-transform`}
      onClick={() => onClick && onClick(space)}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-bold text-center p-2">{space.name}</p>
      </div>
      {renderPlayers()}
    </div>
  );

  const renderSpecial = () => (
    <div 
      className={`board-space special ${space.position} cursor-pointer hover:scale-105 transition-transform`}
      onClick={() => onClick && onClick(space)}
    >
      <div className="p-2 flex items-center justify-center flex-col h-full">
        <p className="text-xs font-semibold text-center">{space.name}</p>
        {space.amount && (
          <p className="text-xs text-center mt-1">${space.amount}</p>
        )}
      </div>
      {renderPlayers()}
    </div>
  );

  const renderPlayers = () => {
    if (playersOnSpace.length === 0) return null;
    
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
        {playersOnSpace.map(player => (
          <div
            key={player.id}
            className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: player.color }}
            title={player.username}
          />
        ))}
      </div>
    );
  };

  // Render based on space type
  if (space.position.includes('corner')) {
    return renderCorner();
  } else if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
    return renderProperty();
  } else {
    return renderSpecial();
  }
};

export default BoardSpace;
