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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockBoards } from '../mock/mockData';
import { toast } from '../hooks/use-toast';
import { Lock, Settings, Trophy } from 'lucide-react';

const CreateRoomModal = ({ open, onClose, onRoomCreated }) => {
  const [formData, setFormData] = useState({
    roomName: '',
    boardId: 'international',
    maxPlayers: 4,
    isPrivate: false,
    customRules: {
      startingCash: 1500,
      mortgageAllowed: true,
      auctionUnpurchased: false,
      evenBuildRule: true,
      taxesToFreeParking: false,
      noRentInJail: false,
    },
    winningCondition: {
      type: 'bankruptcy', // 'bankruptcy', 'time_limit', 'money_goal'
      value: null, // turns/minutes for time_limit, amount for money_goal
    }
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

    const roomDataWithBoardName = {
      ...formData,
      boardName: selectedBoard?.name,
    };

    onRoomCreated(roomDataWithBoardName);
    setLoading(false);
    onClose();
    
    // Reset form
    setFormData({
      roomName: '',
      boardId: 'international',
      maxPlayers: 4,
      isPrivate: false,
      customRules: {
        startingCash: 1500,
        mortgageAllowed: true,
        auctionUnpurchased: false,
        evenBuildRule: true,
        taxesToFreeParking: false,
        noRentInJail: false,
      },
      winningCondition: {
        type: 'bankruptcy',
        value: null,
      }
    });
  };

  const updateCustomRule = (rule, value) => {
    setFormData({
      ...formData,
      customRules: {
        ...formData.customRules,
        [rule]: value
      }
    });
  };

  const updateWinningCondition = (type, value = null) => {
    setFormData({
      ...formData,
      winningCondition: { type, value }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Game Room</DialogTitle>
          <DialogDescription>
            Set up your Monopoly game with custom rules and win conditions
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="rules" className="gap-1">
                <Settings className="w-4 h-4" />
                Rules
              </TabsTrigger>
              <TabsTrigger value="winning" className="gap-1">
                <Trophy className="w-4 h-4" />
                Winning
              </TabsTrigger>
            </TabsList>

            {/* Basic Settings */}
            <TabsContent value="basic" className="space-y-4 mt-4">
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
            </TabsContent>

            {/* Custom Rules */}
            <TabsContent value="rules" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="startingCash">Starting Cash Amount</Label>
                <Input
                  id="startingCash"
                  type="number"
                  min="500"
                  max="10000"
                  step="100"
                  value={formData.customRules.startingCash}
                  onChange={(e) => updateCustomRule('startingCash', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Default: $1500
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="mortgageAllowed">Mortgage Allowed</Label>
                  <p className="text-xs text-muted-foreground">
                    Players can mortgage properties for cash
                  </p>
                </div>
                <Switch
                  id="mortgageAllowed"
                  checked={formData.customRules.mortgageAllowed}
                  onCheckedChange={(checked) => updateCustomRule('mortgageAllowed', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="auctionUnpurchased">Auction Unpurchased Properties</Label>
                  <p className="text-xs text-muted-foreground">
                    If a player doesn't buy a property, it goes to auction
                  </p>
                </div>
                <Switch
                  id="auctionUnpurchased"
                  checked={formData.customRules.auctionUnpurchased}
                  onCheckedChange={(checked) => updateCustomRule('auctionUnpurchased', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="evenBuildRule">Even Build Rule</Label>
                  <p className="text-xs text-muted-foreground">
                    Houses must be built evenly across a property set
                  </p>
                </div>
                <Switch
                  id="evenBuildRule"
                  checked={formData.customRules.evenBuildRule}
                  onCheckedChange={(checked) => updateCustomRule('evenBuildRule', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="taxesToFreeParking">Taxes to Free Parking</Label>
                  <p className="text-xs text-muted-foreground">
                    Tax money collects in Free Parking, first to land gets all
                  </p>
                </div>
                <Switch
                  id="taxesToFreeParking"
                  checked={formData.customRules.taxesToFreeParking}
                  onCheckedChange={(checked) => updateCustomRule('taxesToFreeParking', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="noRentInJail">No Rent While in Jail</Label>
                  <p className="text-xs text-muted-foreground">
                    Players in jail cannot collect rent
                  </p>
                </div>
                <Switch
                  id="noRentInJail"
                  checked={formData.customRules.noRentInJail}
                  onCheckedChange={(checked) => updateCustomRule('noRentInJail', checked)}
                />
              </div>
            </TabsContent>

            {/* Winning Conditions */}
            <TabsContent value="winning" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label>Win Condition Type</Label>
                  <div className="mt-2 space-y-2">
                    <div 
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.winningCondition.type === 'bankruptcy' 
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/20' 
                          : 'border-border hover:border-green-300'
                      }`}
                      onClick={() => updateWinningCondition('bankruptcy')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Last Player Standing</p>
                          <p className="text-xs text-muted-foreground">
                            Classic rule: Last player remaining after bankruptcies wins
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.winningCondition.type === 'bankruptcy' 
                            ? 'border-green-600 bg-green-600' 
                            : 'border-gray-300'
                        }`} />
                      </div>
                    </div>

                    <div 
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.winningCondition.type === 'time_limit' 
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/20' 
                          : 'border-border hover:border-green-300'
                      }`}
                      onClick={() => updateWinningCondition('time_limit', formData.winningCondition.value || 30)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">Time/Turn Limit</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Richest player at the end wins
                          </p>
                          {formData.winningCondition.type === 'time_limit' && (
                            <Input
                              type="number"
                              min="10"
                              max="100"
                              value={formData.winningCondition.value || 30}
                              onChange={(e) => updateWinningCondition('time_limit', parseInt(e.target.value))}
                              placeholder="Number of turns"
                              className="w-32"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.winningCondition.type === 'time_limit' 
                            ? 'border-green-600 bg-green-600' 
                            : 'border-gray-300'
                        }`} />
                      </div>
                    </div>

                    <div 
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.winningCondition.type === 'money_goal' 
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/20' 
                          : 'border-border hover:border-green-300'
                      }`}
                      onClick={() => updateWinningCondition('money_goal', formData.winningCondition.value || 5000)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">Money Goal</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            First player to reach target amount wins
                          </p>
                          {formData.winningCondition.type === 'money_goal' && (
                            <Input
                              type="number"
                              min="3000"
                              max="20000"
                              step="500"
                              value={formData.winningCondition.value || 5000}
                              onChange={(e) => updateWinningCondition('money_goal', parseInt(e.target.value))}
                              placeholder="Target amount"
                              className="w-32"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.winningCondition.type === 'money_goal' 
                            ? 'border-green-600 bg-green-600' 
                            : 'border-gray-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
