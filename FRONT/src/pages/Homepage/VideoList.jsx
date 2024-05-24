import React, { useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';

const VideoList = ({ videos, db }) => {
  const [localVideos, setLocalVideos] = useState(videos);
  console.log(videos);
  const {username} = useParams();

  const handleVote = async (videoId, voteType) => {
    const videoRef = doc(db, "videos", videoId);
    const videoDoc = localVideos.find(video => video.id === videoId);

    let updatedLikes = videoDoc.likes;
    let updatedDislikes = videoDoc.dislikes;

    const userId = "currentUser"; 

    if (voteType === 'like') {
      if (updatedLikes.includes(userId)) {
        updatedLikes = updatedLikes.filter(id => id !== userId);
      } else {
        updatedLikes.push(userId);
        updatedDislikes = updatedDislikes.filter(id => id !== userId);
      }
    } else {
      if (updatedDislikes.includes(userId)) {
        updatedDislikes = updatedDislikes.filter(id => id !== userId);
      } else {
        updatedDislikes.push(userId);
        updatedLikes = updatedLikes.filter(id => id !== userId);
      }
    }

    
    await updateDoc(videoRef, {
      likes: updatedLikes,
      dislikes: updatedDislikes
    });

    
    setLocalVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? { ...video, likes: updatedLikes, dislikes: updatedDislikes }
          : video

      )

      
    );console.log(localVideos);
  };

  return (
    <div>
      {videos.map((video) => (
        <div key={video.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <video src={video.url} controls={true} width="100%"></video>
          <h1>{video.title}</h1>
          <h2>{video.description}</h2>
          <h3>{video.tags}</h3>
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <img src={video.author} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} /> */}
            <div>
              <span>Par : {username}</span>
              <br />
              <span>Créée le : {new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <button onClick={() => handleVote(video.id, 'like')}>
              {video.likes.includes("currentUser") ? "👍" : "👍"} {video.likes.length}
            </button>
            <button onClick={() => handleVote(video.id, 'dislike')}>
              {video.dislikes.includes("currentUser") ? "👎" : "👎"} {video.dislikes.length}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
