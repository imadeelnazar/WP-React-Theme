import React, { useState, useEffect } from 'react';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(wpScienceTheme.apiUrl + `/wp/v2/comments?post=${postId}`);
      const data = await response.json();
      setComments(data);
    };
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h2>Comments:</h2>
      {comments.map(comment => (
        <div key={comment.id}>
          <img src={comment.author_avatar_urls['24']} alt={comment.author_name} />
          <h3>{comment.author_name}</h3>
          <span>{comment.date}</span>
          <div dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;