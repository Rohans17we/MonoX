import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft, Users, Settings, MessageSquare } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const GameRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching room data
    setTimeout(() => {
      setRoomData({
        id: roomId,
        name: 'Friendly Game',
        board: 'International Classic',
        status: 'waiting',
        players: [
          {
            id: '1',
            username: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
            ready: false,
            isHost: true,
          },
          {
            id: '2',
            username: 'Player2',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player2',
            ready: true,
            isHost: false,
          },
        ],
        maxPlayers: 4,
      });
      setLoading(false);
    }, 1000);
  }, [roomId]);

  const handleLeaveRoom = () => {
    toast({
      title: 'Left room',
      description: 'You have left the game room',
    });
    navigate('/dashboard');
  };

  const handleStartGame = () => {
    toast({
      title: 'Starting game...',
      description: 'Game functionality coming soon!',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-teal-950/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleLeaveRoom}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Leave Room
          </Button>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {roomData?.status === 'waiting' ? 'Waiting for players' : 'In Progress'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{roomData?.name}</CardTitle>
                <p className="text-muted-foreground">Board: {roomData?.board}</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      <Settings className="w-12 h-12 text-green-600 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                    <p className="text-xl font-semibold">Game Board</p>
                    <p className="text-muted-foreground">
                      Full game board will be rendered here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players ({roomData?.players.length}/{roomData?.maxPlayers})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {roomData?.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={player.avatar} alt={player.username} />
                        <AvatarFallback>{player.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{player.username}</p>
                        {player.isHost && (
                          <Badge variant="secondary" className="text-xs">Host</Badge>
                        )}
                      </div>
                    </div>
                    {player.ready ? (
                      <Badge className="bg-green-600">Ready</Badge>
                    ) : (
                      <Badge variant="outline">Not Ready</Badge>
                    )}
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: roomData?.maxPlayers - roomData?.players.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-muted"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <p className="text-muted-foreground">Waiting for player...</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chat functionality coming soon
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={roomData?.players.length < 2}
              >
                Start Game
              </Button>
              <Button
                onClick={handleLeaveRoom}
                variant="outline"
                className="w-full"
              >
                Leave Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;