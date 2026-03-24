import Navbar from '../components/Navbar';
import './Feed.css';

function Feed() {
  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-content">
        <h2>Feed</h2>
        {/* posts will go here */}
      </div>
    </div>
  );
}

export default Feed;