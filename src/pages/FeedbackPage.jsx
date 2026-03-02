import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function FeedbackPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mockFeedback = [
    { id: 1, user: 'John Doe', rating: 5, message: 'Excellent platform!', type: 'general' },
    { id: 2, user: 'Jane Smith', rating: 4, message: 'Need more hard problems', type: 'feature' },
    { id: 3, user: 'Bob Johnson', rating: 3, message: 'Bug in Two Sum editor', type: 'bug' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setRating(5);
      setFeedbackType('general');
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Feedback</h1>
        <p className="text-muted-foreground">Help us improve CodeMastery</p>
      </div>

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Rating</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`text-2xl ${num <= rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Feedback Type</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {submitted ? 'Thank you!' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Community Feedback</h2>
        <div className="space-y-4">
          {mockFeedback.map((feedback) => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-foreground">{feedback.user}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-muted-foreground'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{feedback.message}</p>
                <p className="text-xs text-muted-foreground capitalize">{feedback.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
