import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lock } from 'lucide-react';

const BoardCard = ({ board, selected, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        selected ? 'ring-2 ring-green-600 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={board.image} 
          alt={board.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {board.isPremium && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-amber-500 hover:bg-amber-600">
              <Lock className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{board.name}</CardTitle>
        <CardDescription>{board.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {board.properties.length} properties
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardCard;