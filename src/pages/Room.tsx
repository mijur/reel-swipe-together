import { useParams } from 'react-router-dom';
import { SwipeInterface } from '../components/SwipeInterface';

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  
  // In a real app, you'd fetch room data and user count from backend
  const userCount = Math.floor(Math.random() * 5) + 1; // Mock data

  return <SwipeInterface roomId={roomId} userCount={userCount} />;
};

export default Room;