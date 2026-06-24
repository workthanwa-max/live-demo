import { memo } from 'react';
import { ShoppingBag } from 'lucide-react';
import './Comment.css';

export interface CommentData {
  id: string;
  username: string;
  text: string;
  color: string;
  avatarUrl?: string;
  isPurchased?: boolean;
}

interface CommentProps {
  comment: CommentData;
}

const Comment = memo(({ comment }: CommentProps) => {
  return (
    <div className={`comment-wrapper ${comment.isPurchased ? 'purchased' : ''}`}>
      <div className="comment-avatar" style={{ backgroundColor: comment.color }}>
        {comment.avatarUrl ? (
          <img src={comment.avatarUrl} alt={comment.username} className="avatar-image" />
        ) : (
          comment.username.charAt(0).toUpperCase()
        )}
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-username">{comment.username}</span>
          {comment.isPurchased && (
            <div className="comment-badge">
              <ShoppingBag size={10} />
              <span>สั่งซื้อแล้ว</span>
            </div>
          )}
        </div>
        <span className="comment-text">{comment.text}</span>
      </div>
    </div>
  );
});

export default Comment;
