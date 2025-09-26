This App is called Application Tracker:

It is an Angular application for tracking job applications,
It uses LocalStorage only (no backend),
The guide below is step-by-step, starting from a fresh Windows PC.

🖥️ 1. Prerequisites – Installations
1.1 Install Git

Download: https://git-scm.com/download/win
During installation:

*Select “Use Git from the Windows Command Prompt”
Verify installation:
git --version

1.2 Install Node.js + npm
Download LTS version: https://nodejs.org/en/download
Verify installation:

node -v
npm -v

1.3 Install Angular CLI
npm install -g @angular/cli

Verify installation:

ng version

1.4 Install VS Code (or another IDE)

Download: https://code.visualstudio.com/

1.5 Install Project Dependencies

Clone the repo:

git clone https://github.com/VoutsaStevie/application-tracker.git
cd application-Tracker

*Install dependencies:
npm install

⚙️ 2. Development Setup
2.1 Run the App
ng serve
Default: http://localhost:4200

2.2 Project Structure
C:.
│   app.config.ts
│   app.css
│   app.html
│   app.routes.ts
│   app.spec.ts
│   app.ts
│
├───core
│   ├───guards
│   │       admin.guard.ts
│   │       auth.guard.ts
│   │
│   ├───interceptors
│   │       auth.interceptor.ts
│   │
│   └───services
├───features
│   ├───admin
│   │   │   admin.routes.ts
│   │   │
│   │   └───components
│   │           admin.components.ts
│   │
│   ├───applications
│   │   │   applications.routes.ts
│   │   │
│   │   ├───components
│   │   │       application-list.component.ts
│   │   │
│   │   ├───models
│   │   │       application.model.ts
│   │   │
│   │   └───services
│   │           application.service.spec.ts
│   │           application.service.ts
│   │
│   └───auth
│       │   auth.routes.ts
│       │
│       ├───components
│       │   ├───login
│       │   │       login.component.ts
│       │   │       login.css
│       │   │
│       │   └───register
│       │           register.component.ts
│       │           register.css
│       │
│       ├───models
│       │       user.model.ts
│       │
│       └───services
│               auth.service.ts
│               auth.spec.ts
│
├───infrastructure
└───shared
    ├───components
    │   ├───header
    │   │       header.component.ts
    │   │
    │   └───notifications
    │           notifications.component.ts
    │
    ├───directives
    │       highlight.directive.ts
    │
    ├───pipes
    │       duration.pipe.ts
    │       priority.pipe.ts
    │
    └───services
            error.service.ts

🧹 3.Install depencies
-npm run lint
-Prettier
-npm run format
-Husky + Lint-Staged
-npx husky install

📦 4. Available NPM Scripts

ng serve → Run dev server
ng build → Build for production
npm run lint → Run ESLint checks
npm run format → Run Prettier formatting
ng test → Run unit tests

✨ Functionalities
👩‍💻 For a Simple User
-Register/Login
-Create an application(Enterprise name,Position title)
-View all applications (organized by phases: Sent, Interview, Verdict).
-Update an application if details are wrong.
-Delete an application.
-Move an application through phases(Sent, Interview, Verdict)
-Give a verdict on an application(Accepted, Rejected)

👨‍💼 For an Admin (all of the above, plus)
-Create new users.
-Delete users.
