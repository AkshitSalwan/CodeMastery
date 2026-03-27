# Login Credentials

## Demo Accounts

All demo accounts are ready to use for testing. No signup required.

### Admin Account
- **Email**: `admin@codemastery.com`
- **Password**: `admin123456`
- **Role**: Admin
- **Permissions**: Create/edit/delete problems, manage ai hints & test cases, view analytics

### Interviewer Account
- **Email**: `interviewer@codemastery.com`
- **Password**: `interview123456`
- **Role**: Interviewer
- **Permissions**: View problems, manage interviews, track learner progress

### Learner Account
- **Email**: `user@codemastery.com`
- **Password**: `demo123456`
- **Role**: Learner
- **Permissions**: Solve problems, submit code, view hints

## Login Endpoints

- **Frontend**: http://localhost:3000/login
- **Backend API**: POST `http://localhost:4000/api/auth/login`

## Backend API Authentication

After logging in, use the JWT token from the response:

```bash
# Example login request
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@codemastery.com","password":"admin123456"}'

# Response contains JWT token to use in Authorization header
# Authorization: Bearer <token>
```

## Quick Test Commands

### Get Problems List
```bash
curl -s http://localhost:4000/api/problems | jq '.problems[] | {id, title, slug, difficulty}'
```

### Get Problem Details
```bash
curl -s http://localhost:4000/api/problems/search-jolly | jq '.'
```

### Submit Solution (Requires Auth Token)
```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@codemastery.com","password":"demo123456"}' | jq -r '.token')

curl -X POST http://localhost:4000/api/problems/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": 1,
    "code": "def two_sum(nums, target):\n    return [0, 1]",
    "language": "python"
  }'
```

## Notes

- All credentials are stored in the backend database
- Tokens expire after a set duration (see backend configuration)
- Use the same credentials both in frontend UI and API calls
- For development, these demo accounts are pre-seeded and always available
