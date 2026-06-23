import { memo } from 'react';
import './Comment.css';

export interface CommentData {
  id: string;
  username: string;
  text: string;
  color: string;
  isPurchased?: boolean;
}

interface CommentProps {
  comment: CommentData;
}

const Comment = memo(({ comment }: CommentProps) => {
  return (
    <div className={`comment-wrapper ${comment.isPurchased ? 'purchased' : ''}`}>
      <div className="comment-avatar" style={{ backgroundColor: comment.color }}>
        {comment.username.charAt(0).toUpperCase()}
      </div>
      <div className="comment-content">
        <span className="comment-username">{comment.username}</span>
        {comment.isPurchased ? (
          <div className="comment-badge">Purchased Item</div>
        ) : null}
        <span className="comment-text">{comment.text}</span>
      </div>
    </div>
  );
});

export default Comment;
