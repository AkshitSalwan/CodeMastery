import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function FeedbackPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback from database on mount
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/feedback/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const data = await response.json();
        setFeedback(data.feedback || []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to submit feedback');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');

      const response = await fetch('/api/feedback/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify({
          type: feedbackType,
          rating,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
      setTimeout(() => {
        setMessage('');
        setRating(5);
        setFeedbackType('general');
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message);
    }
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Rating</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`text-2xl ${
                      num <= rating ? 'text-yellow-400' : 'text-muted-foreground'
                    }`}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Feedback Type
              </label>
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

            <Button type="submit" className="w-full" disabled={submitted || !user}>
              {submitted ? 'Thank you!' : user ? 'Submit Feedback' : 'Log in to submit'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Community Feedback</h2>
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading feedback...</p>
            </CardContent>
          </Card>
        ) : feedback.length > 0 ? (
          <div className="space-y-4">
            {feedback.map((feedbackItem) => (
              <Card key={feedbackItem.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {feedbackItem.user?.username ||
                          feedbackItem.user?.name ||
                          'Anonymous User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(feedbackItem.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < (feedbackItem.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-muted-foreground'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {feedbackItem.message}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {feedbackItem.type}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">💭</div>
              <p className="text-lg font-semibold text-foreground mb-2">
                No feedback yet
              </p>
              <p className="text-muted-foreground">
                Be the first to share your feedback about CodeMastery
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
