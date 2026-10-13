# Little Royals

The school desk is split into three apps.

| Folder | What it is | Run |
| --- | --- | --- |
| `frontend` | Next.js school desk | `npm --prefix frontend run dev` |
| `backend` | Go API for the development register | `go -C backend run ./cmd/server` |
| `mobile` | Flutter app for iOS and Android | `cd mobile && flutter run` |

The desk at `frontend` still keeps its own sample register in the browser. The API and the phone app share the same seeded school records.

## API

The server listens on `http://127.0.0.1:8080`.

- `POST /v1/login` with `{ "email", "password" }`
- `GET /v1/dashboard`
- `GET /v1/students` and `GET /v1/students/{id}`
- `GET /v1/applications`
- `GET /v1/classes`

Development password for every seeded account: `school`.

Head teacher: `grace.achieng@littleroyals.school`. Parent: `mei.chen@gmail.com`.

Android emulators should use `http://10.0.2.2:8080`. The phone login screen has an API address field.
