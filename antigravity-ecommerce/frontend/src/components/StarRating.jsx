import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating, interactive = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`transition-all ${interactive ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            size={interactive ? 24 : 16}
            fill={star <= rating ? '#eab308' : 'none'}
            color={star <= rating ? '#eab308' : '#94a3b8'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
