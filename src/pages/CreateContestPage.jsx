import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

export function CreateContestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [status, setStatus] = useState('upcoming');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startMode, setStartMode] = useState('now'); // now | custom
  const [durationPreset, setDurationPreset] = useState('1d'); // 1h,3h,1d,3d,7d
  const [maxParticipants, setMaxParticipants] = useState('1000');
  const [entryFee, setEntryFee] = useState('0');
  const [prizeFirst, setPrizeFirst] = useState('');
  const [prizeSecond, setPrizeSecond] = useState('');
  const [prizeThird, setPrizeThird] = useState('');
  const [problemIds, setProblemIds] = useState('');
  const [rules, setRules] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Keep start date in sync with "Start now" vs "Custom"
  useEffect(() => {
    if (startMode === 'now') {
      const now = new Date();
      const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setStartDate(iso);
    }
  }, [startMode]);

  // Auto-calculate end date when start date or duration preset changes
  useEffect(() => {
    if (!startDate) return;

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;

    let deltaMs = 0;
    switch (durationPreset) {
      case '1h':
        deltaMs = 1 * 60 * 60 * 1000;
        break;
      case '3h':
        deltaMs = 3 * 60 * 60 * 1000;
        break;
      case '1d':
        deltaMs = 24 * 60 * 60 * 1000;
        break;
      case '3d':
        deltaMs = 3 * 24 * 60 * 60 * 1000;
        break;
      case '7d':
        deltaMs = 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        deltaMs = 24 * 60 * 60 * 1000;
    }

    const end = new Date(start.getTime() + deltaMs);
    const iso = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setEndDate(iso);
  }, [startDate, durationPreset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Start and end date are required.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Please provide valid dates.');
      return;
    }

    if (end <= start) {
      setError('End date must be after start date.');
      return;
    }

    const problemIdList = problemIds
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    if (problemIdList.length === 0) {
      setError('Please provide at least one problem ID.');
      return;
    }

    setSubmitting(true);

    try {
      const durationDays = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );

      const parsedMaxParticipants = parseInt(maxParticipants || '0', 10) || 1000;
      const parsedEntryFee = parseFloat(entryFee || '0') || 0;

      const hasPrize =
        prizeFirst.trim().length > 0 ||
        prizeSecond.trim().length > 0 ||
        prizeThird.trim().length > 0;

      const newContest = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        createdBy: {
          id: user?.id || 'interviewer-custom',
          name: user?.name || user?.email || 'Interviewer',
          avatar: user?.avatar || '',
        },
        status,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        duration: durationDays,
        difficulty,
        totalProblems: problemIdList.length,
        participants: 0,
        maxParticipants: parsedMaxParticipants,
        entryFee: parsedEntryFee,
        prize: hasPrize
          ? {
              first: prizeFirst.trim() || null,
              second: prizeSecond.trim() || null,
              third: prizeThird.trim() || null,
            }
          : null,
        problems: problemIdList,
        rules: rules
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        participationStatus: 'not-joined',
        userRank: null,
      };

      const stored = localStorage.getItem('customContests');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [...existing, newContest];
      localStorage.setItem('customContests', JSON.stringify(updated));

      navigate('/contests');
    } catch (err) {
      console.error(err);
      setError('Failed to create contest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create New Contest
        </h1>
        <p className="text-muted-foreground">
          Define contest details, schedule, problems, rules, and prizes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contest Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. Weekly Challenge #6"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground min-h-[80px]"
                  placeholder="Short description of the contest..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Start Date & Time
                </label>
                <select
                  value={startMode}
                  onChange={(e) => setStartMode(e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="now">Start now</option>
                  <option value="custom">Choose date & time</option>
                </select>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={startMode === 'now'}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Duration
                </label>
                <select
                  value={durationPreset}
                  onChange={(e) => setDurationPreset(e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="1h">1 hour</option>
                  <option value="3h">3 hours</option>
                  <option value="1d">1 day</option>
                  <option value="3d">3 days</option>
                  <option value="7d">7 days</option>
                </select>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  End Date & Time (auto-calculated)
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  readOnly
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground opacity-80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. 1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Entry Fee (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="0 for free"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Prize - 1st Place
                </label>
                <input
                  type="text"
                  value={prizeFirst}
                  onChange={(e) => setPrizeFirst(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. $500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Prize - 2nd Place
                </label>
                <input
                  type="text"
                  value={prizeSecond}
                  onChange={(e) => setPrizeSecond(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. $300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Prize - 3rd Place
                </label>
                <input
                  type="text"
                  value={prizeThird}
                  onChange={(e) => setPrizeThird(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. $200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Problem IDs (comma separated)
                </label>
                <input
                  type="text"
                  value={problemIds}
                  onChange={(e) => setProblemIds(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. 1, 2, 3, 4"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use problem IDs from the problems list.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tags / Topics (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="e.g. Arrays, DP, Graphs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Rules (one per line)
              </label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground min-h-[100px]"
                placeholder="Example:&#10;Each problem has a 5-minute time limit&#10;Cheating will result in disqualification"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/contests')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Contest'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

