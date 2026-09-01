# InfraPredict AI — Frontend Prototype

A PAIMANA-inspired frontend prototype for the MoSPI AI for Infrastructure Monitoring hackathon problem.

## Included

- Landing page with 3 role logins:
  - Contractor
  - Supervisor
  - Government / MoSPI
- Separate role-based login screen
- Responsive dashboard
- KPI cards
- Project portfolio table
- AI risk score dashboard
- Early warning alerts
- Risk trend chart
- Sector distribution doughnut chart
- Cost/delay predictive analytics
- Milestone timeline
- Reports page
- Search/filter projects
- Demo login (any username/password works)

## Run

Simplest option:
1. Extract the ZIP.
2. Open `index.html` in a browser.

Recommended:
Use VS Code + Live Server and open `index.html`.

## Backend integration

The frontend currently uses demo/static data.

Replace the demo login in `handleLogin()` with your API call, for example:

```js
const response = await fetch("http://127.0.0.1:5000/api/login", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({username, password, role: currentRole})
});
```

Then load project data from your Flask API and update the dashboard.

## Chart

Chart.js is loaded from a CDN in `index.html`. Internet access is required for the charts unless you download Chart.js locally.

## Suggested Flask API endpoints

POST `/api/login`
GET `/api/projects`
GET `/api/projects/:id`
GET `/api/dashboard`
GET `/api/risk`
GET `/api/alerts`
GET `/api/analytics`
POST `/api/projects`
POST `/api/projects/:id/update`
POST `/api/alerts`
GET `/api/reports`
