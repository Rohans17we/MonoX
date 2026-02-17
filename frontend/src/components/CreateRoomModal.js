import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { mockBoards } from '../mock/mockData';
import { toast } from '../hooks/use-toast';
import { Lock } from 'lucide-react';

const CreateRoomModal = ({ open, onClose, onRoomCreated }) => {
  const [formData, setFormData] = useState({
    roomName: '',
    boardId: 'international',
    maxPlayers: 4,
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);

  const selectedBoard = mockBoards.find(b => b.id === formData.boardId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if board is premium
    if (selectedBoard?.isPremium) {
      toast({
        title: 'Premium Board',
        description: 'This board requires a premium subscription.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Mock room creation - replace with actual API call later
    setTimeout(() => {
      const newRoom = {
        id: 'room-' + Date.now(),
        name: formData.roomName,
        board: formData.boardId,
        boardName: selectedBoard?.name,
        players: 1,
        maxPlayers: parseInt(formData.maxPlayers),
        isPrivate: formData.isPrivate,
        status: 'waiting',
        host: 'You',
        createdAt: new Date().toISOString(),
      };
      
      toast({
        title: 'Room created!',
        description: `"${formData.roomName}" is ready for players.`,
      });
      
      onRoomCreated(newRoom);
      setLoading(false);
      onClose();
      
      // Reset form
      setFormData({
        roomName: '',
        boardId: 'international',
        maxPlayers: 4,
        isPrivate: false,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Game Room</DialogTitle>
          <DialogDescription>
            Set up your Monopoly game and invite players
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              name="roomName"
              type="text"
              placeholder="My Awesome Game"
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="boardId">Board Type</Label>
            <Select
              value={formData.boardId}
              onValueChange={(value) => setFormData({ ...formData, boardId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                {mockBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    <div className="flex items-center gap-2">
                      {board.name}
                      {board.isPremium && <Lock className="w-3 h-3" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBoard?.isPremium && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Premium board - Upgrade to unlock
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Max Players</Label>
            <Select
              value={formData.maxPlayers.toString()}
              onValueChange={(value) => setFormData({ ...formData, maxPlayers: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select max players" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
                <SelectItem value="6">6 Players</SelectItem>
                <SelectItem value="8">8 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2 py-2">
            <div className="space-y-0.5">
              <Label htmlFor="isPrivate">Private Room</Label>
              <p className="text-xs text-muted-foreground">
                Only invited players can join
              </p>
            </div>
            <Switch
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Room'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;