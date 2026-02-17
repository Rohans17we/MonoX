import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Lock, Play } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const RoomCard = ({ room, onJoinRoom }) => {
  const handleJoin = () => {
    if (room.status === 'in-progress') {
      toast({
        title: 'Game in progress',
        description: 'This game has already started.',
        variant: 'destructive',
      });
      return;
    }

    if (room.players >= room.maxPlayers) {
      toast({
        title: 'Room full',
        description: 'This room has reached maximum capacity.',
        variant: 'destructive',
      });
      return;
    }

    onJoinRoom(room.id);
  };

  const isFull = room.players >= room.maxPlayers;
  const isInProgress = room.status === 'in-progress';

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2">
              {room.name}
              {room.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
            </CardTitle>
            <CardDescription>{room.boardName}</CardDescription>
          </div>
          {isInProgress ? (
            <Badge variant="secondary">In Progress</Badge>
          ) : isFull ? (
            <Badge variant="destructive">Full</Badge>
          ) : (
            <Badge variant="default" className="bg-green-600">Waiting</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {room.players}/{room.maxPlayers} Players
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Host: {room.host}
            </span>
          </div>

          <Button
            onClick={handleJoin}
            disabled={isFull || isInProgress}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-md transition-shadow"
          >
            <Play className="w-4 h-4 mr-2" />
            {isInProgress ? 'In Progress' : isFull ? 'Room Full' : 'Join Game'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;