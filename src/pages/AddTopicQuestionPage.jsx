import AdminAddQuestionPage from './AdminAddQuestionPage';

export default function AddTopicQuestionPage() {
  return (
    <AdminAddQuestionPage
      pageTitle="Add New Question by Topic"
      pageDescription="Create a full problem with tags, constraints, examples, test cases, hints, and starter code."
      redirectTo="/problems"
    />
  );
}
