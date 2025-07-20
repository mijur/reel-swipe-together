import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomCreator } from '../components/RoomCreator';
import { SwipeInterface } from '../components/SwipeInterface';

const Index = () => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  if (currentRoom) {
    return <SwipeInterface roomId={currentRoom} userCount={1} />;
  }

  return <RoomCreator onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
};

export default Index;
