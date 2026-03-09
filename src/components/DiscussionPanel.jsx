import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { MessageCircle, ThumbsUp, Reply, Send } from 'lucide-react';
import { discussions } from '../data/discussions';

export function DiscussionPanel({ problemId }) {
  const [discussionsList, setDiscussionsList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showReply, setShowReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Filter discussions for this problem
    const problemDiscussions = discussions.filter(d => d.problemId === problemId);
    setDiscussionsList(problemDiscussions);
  }, [problemId]);

  const handleUpvote = (discussionId, replyId = null) => {
    setDiscussionsList(prev =>
      prev.map(discussion => {
        if (discussion.id === discussionId) {
          if (replyId) {
            return {
              ...discussion,
              replies: discussion.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, upvotes: reply.upvotes + 1 }
                  : reply
              )
            };
          }
          return { ...discussion, upvotes: discussion.upvotes + 1 };
        }
        return discussion;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newDiscussion = {
      id: Date.now(),
      problemId,
      author: {
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        role: "user"
      },
      title: "New Discussion",
      content: newComment,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      replies: []
    };

    setDiscussionsList(prev => [newDiscussion, ...prev]);
    setNewComment('');
  };

  const handleAddReply = (discussionId) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        role: "user"
      },
      content: replyText,
      timestamp: new Date().toISOString(),
      upvotes: 0
    };

    setDiscussionsList(prev =>
      prev.map(discussion =>
        discussion.id === discussionId
          ? { ...discussion, replies: [...discussion.replies, newReply] }
          : discussion
      )
    );

    setReplyText('');
    setShowReply(null);
  };

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Ask a Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts or ask for help..."
            className="w-full p-3 border border-border rounded-lg resize-none bg-background text-foreground"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussionsList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No discussions yet. Be the first to ask a question!</p>
            </CardContent>
          </Card>
        ) : (
          discussionsList.map((discussion) => (
            <Card key={discussion.id}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <img
                    src={discussion.author.avatar}
                    alt={discussion.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-foreground">{discussion.author.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {discussion.author.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(discussion.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground mb-3">{discussion.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpvote(discussion.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.upvotes}
                      </button>
                      <button
                        onClick={() => setShowReply(showReply === discussion.id ? null : discussion.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </button>
                    </div>

                    {/* Reply Form */}
                    {showReply === discussion.id && (
                      <div className="mt-4 pl-4 border-l-2 border-border">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 border border-border rounded resize-none bg-background text-foreground text-sm"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowReply(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddReply(discussion.id)}
                            disabled={!replyText.trim()}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {discussion.replies.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {discussion.replies.map((reply) => (
                          <div key={reply.id} className="pl-4 border-l-2 border-border">
                            <div className="flex gap-2">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-foreground">{reply.author.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground mb-2">{reply.content}</p>
                                <button
                                  onClick={() => handleUpvote(discussion.id, reply.id)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  {reply.upvotes}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}