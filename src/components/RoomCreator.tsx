import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Clapperboard, Users, ArrowRight } from 'lucide-react';

interface RoomCreatorProps {
  onCreateRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export const RoomCreator = ({ onCreateRoom, onJoinRoom }: RoomCreatorProps) => {
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const generateRoomCode = () => {
    const adjectives = ['Epic', 'Wild', 'Cosmic', 'Magic', 'Swift', 'Bright', 'Noble', 'Royal'];
    const nouns = ['Wolf', 'Eagle', 'Dragon', 'Phoenix', 'Tiger', 'Lion', 'Shark', 'Bear'];
    const numbers = Math.floor(Math.random() * 100);
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomCode();
    onCreateRoom(newRoomId);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      onJoinRoom(roomCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
            <Clapperboard className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">MovieMatch</h1>
          <p className="text-muted-foreground">
            Swipe together, watch together. Find the perfect movie for your group!
          </p>
        </div>

        {/* Create Room */}
        <div className="space-y-4">
          <Button 
            onClick={handleCreateRoom}
            className="w-full h-14 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
          >
            <Users className="w-5 h-5 mr-2" />
            Create Movie Session
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or join existing</span>
            </div>
          </div>
        </div>

        {/* Join Room */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="flex-1 h-12 text-center text-lg font-mono tracking-wider bg-muted border-border"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
            <Button 
              onClick={handleJoinRoom}
              disabled={!roomCode.trim()}
              className="h-12 px-6 bg-gradient-accent hover:opacity-90"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 pt-4">
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Swipe to choose:</strong> Like or pass on movies together
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Get matches:</strong> Find movies everyone agrees on
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">No accounts needed:</strong> Just share the room code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};