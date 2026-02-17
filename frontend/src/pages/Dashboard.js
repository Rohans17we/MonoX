import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Grid3x3, List } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import BoardCard from '../components/BoardCard';
import CreateRoomModal from '../components/CreateRoomModal';
import { mockBoards } from '../mock/mockData';
import { toast } from '../hooks/use-toast';
import { createRoom, subscribeToRooms, joinRoom } from '../services/roomService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('international');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has nickname (guest) or is authenticated
    const guestNickname = sessionStorage.getItem('guestNickname');
    if (!isAuthenticated && !guestNickname) {
      navigate('/');
      return;
    }

    // Subscribe to real-time room updates
    const unsubscribe = subscribeToRooms((updatedRooms) => {
      setRooms(updatedRooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, navigate]);

  const handleRoomCreated = async (roomData) => {
    try {
      const currentUser = auth.currentUser || {
        uid: 'guest-' + Date.now(),
        displayName: sessionStorage.getItem('guestNickname') || 'Guest',
        photoURL: null
      };

      const newRoom = await createRoom(roomData, {
        uid: currentUser.uid,
        username: user?.username || currentUser.displayName,
        avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`
      });

      toast({
        title: 'Room created!',
        description: `"${roomData.roomName}" is ready for players.`,
      });

      // Navigate to the room
      navigate(`/room/${newRoom.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const currentUser = auth.currentUser || {
        uid: 'guest-' + Date.now(),
        displayName: sessionStorage.getItem('guestNickname') || 'Guest'
      };

      await joinRoom(roomId, {
        id: currentUser.uid,
        username: user?.username || currentUser.displayName,
        avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`
      });

      toast({
        title: 'Joined room!',
        description: 'You have successfully joined the game.',
      });

      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join room.',
        variant: 'destructive',
      });
    }
  };

  const publicRooms = rooms.filter(room => !room.isPrivate && room.status === 'waiting');
  const availableBoards = mockBoards.filter(board => !board.isPremium || user?.isPremium);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-teal-950/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Game Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back{isAuthenticated ? `, ${user?.username}` : ''}! Choose a room or create your own.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="rooms">Game Rooms</TabsTrigger>
            <TabsTrigger value="boards">Board Types</TabsTrigger>
          </TabsList>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={() => setShowCreateRoom(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </div>

            {publicRooms.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Grid3x3 className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No rooms available</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a game room!
                </p>
                <Button
                  onClick={() => setShowCreateRoom(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-3xl'
              }`}>
                {publicRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onJoinRoom={handleJoinRoom}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Boards Tab */}
          <TabsContent value="boards" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Choose Your Board</h2>
                <p className="text-muted-foreground">
                  Select from classic and premium board editions
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBoards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    selected={selectedBoard === board.id}
                    onClick={() => {
                      if (board.isPremium && !user?.isPremium) {
                        toast({
                          title: 'Premium Board',
                          description: 'Upgrade to premium to unlock this board',
                          variant: 'destructive',
                        });
                        return;
                      }
                      setSelectedBoard(board.id);
                      toast({
                        title: 'Board selected',
                        description: `${board.name} is now your default board`,
                      });
                    }}
                  />
                ))}
              </div>

              {!user?.isPremium && (
                <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Unlock Premium Boards</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get access to exclusive board editions including European Cities, Asian Markets, and more!
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                      >
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateRoomModal
        open={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
};

export default Dashboard;