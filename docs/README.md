# JamWatHQ Web Experience# JamWatHQ Issue Reporting System



JamWatHQ delivers a static front-end experience backed by an Express.js server that powers authentication, reviews, and health monitoring. The repository now separates the presentation layer from the server logic so the site is easier to reason about and maintain.A comprehensive web application for collecting and managing user feedback, issue reports, and contact form submissions for the Jamaican Work and Travel HQ website.



## Architecture Overview## 🌟 Features



- **frontend/** – Static JAM stack pages, styles, scripts, media assets, and reusable HTML components.- **Comprehensive Issue Reporting**: 7 different categories with specific forms

- **backend/** – Express server, authentication, database models, REST routes, and supporting scripts.- **Contact Form Integration**: Handles general contact inquiries

- **Docs & guides** – Existing Markdown references for operations, deployment, and optimisation remain in the repo root.- **Email Notifications**: Automatic email forwarding to administrators

- **Responsive Design**: Works on all devices

## Quick Start- **Professional Styling**: Consistent with JamWatHQ branding



1. **Install dependencies**## 📋 Report Categories

   ```bash

   cd backend1. **🏢 Agency Information**: Report incorrect agency details, contact info, or services

   npm install2. **❓ FAQ Content**: Submit corrections to FAQ answers or suggest new questions

   ```3. **📰 News & Updates**: Report outdated news or missing important updates

2. **Configure environment variables**4. **📖 Guides & Resources**: Correct guide information or suggest improvements

   ```bash5. **🔗 Website Functionality**: Report technical issues, broken links, or bugs

   copy .env.example .env   # Windows PowerShell6. **📞 Contact & Embassy Information**: Update official contact information

   # or7. **💡 Suggestions & Improvements**: Share ideas for new features or enhancements

   cp .env.example .env     # macOS/Linux

   ```## 🚀 Quick Start

   Update the new `.env` file with valid credentials for MongoDB, sessions, and email.

3. **Run the server**### Prerequisites

   ```bash

   npm run dev   # nodemon with live reload- Node.js (version 14 or higher)

   # or- npm or yarn

   npm start     # production mode- Email account (Outlook, Gmail, etc.) for sending notifications

   ```

4. **View the site** – Visit `http://localhost:3000`. All HTML pages in `frontend/` are served automatically by the Express static middleware.### Installation



## Project Structure1. **Clone or download the project files**

   ```bash

```   cd JamWatHQ/Main/Experimenting

JamWatHQ/   ```

├── backend/

│   ├── config/          # Database + Passport configuration2. **Install dependencies**

│   ├── middleware/      # Auth helpers   ```bash

│   ├── models/          # Mongoose models   npm install

│   ├── routes/          # API + auth routes   ```

│   ├── scripts/         # Data cleanup + utilities

│   ├── server.js        # Express server entry point3. **Configure environment variables**

│   ├── package.json   ```bash

│   └── .env.example   # Copy the example file

├── frontend/   copy .env.example .env

│   ├── assets/          # Images and fonts   

│   ├── components/      # Reusable HTML snippets & demos   # Edit .env with your actual email credentials

│   ├── scripts/         # Front-end JS bundles   notepad .env

│   ├── styles/          # CSS + Sass sources   ```

│   ├── faq.html

│   ├── guide.html4. **Start the server**

│   ├── index.html   ```bash

│   ├── agencies.html   # Development mode with auto-restart

│   ├── news.html   npm run dev

│   └── share-experience.html   

└── *.md                 # Documentation set (deployment, native ads, optimisation, etc.)   # Or production mode

```   npm start

   ```

## Front-End Conventions

5. **Access the application**

- Each page keeps the floating gear icon block – retain the inline styles when duplicating a page.   - Main website: http://localhost:3000

- CSS imports now live under `styles/` (e.g. `styles/main.css`, `styles/native-ads.css`).   - Report issues: http://localhost:3000/report-issues

- JavaScript bundles are under `scripts/` (e.g. `scripts/main.js`, `scripts/native-ads.js`).   - Health check: http://localhost:3000/api/health

- Images and other media sit in `assets/images/`; fonts live in `assets/fonts/`.

- Reusable ad templates and demos are located in `components/`.## ⚙️ Configuration



## Back-End Notes### Email Setup



- The server serves static assets from `frontend/` and exposes existing REST endpoints under `/api` and `/auth`.#### For Outlook/Hotmail:

- `.env` resides in `backend/.env`; `dotenv` is configured to load from that directory.1. Go to your Microsoft account security settings

- Utility scripts (wrappers, data fixes, etc.) now live in `backend/scripts/` for easier discovery.2. Enable 2-factor authentication

3. Generate an app-specific password

## After the Reorganisation4. Use your email and the app password in `.env`



- Review the Markdown guides in the repo root and update any hard-coded asset paths if needed.#### For Gmail:

- Run `npm run dev` and manually smoke test each page to confirm assets load from their new locations.1. Enable 2-factor authentication

- When deploying, ensure your process manager runs `backend/server.js` and that the deployment includes the `frontend/` directory for static files.2. Generate an app-specific password

3. Set EMAIL_SERVICE=gmail in `.env`

#### Example .env file:
```env
PORT=3000
SESSION_SECRET=replace-with-64-character-random-string
CLIENT_URL=http://localhost:3000
ALLOW_INSECURE_HTTP=true
MONGODB_URI=mongodb://localhost:27017/jamwathq
EMAIL_USER=jamwathq@outlook.com
EMAIL_PASS=your-app-specific-password
EMAIL_SERVICE=outlook
ADMIN_EMAILS=jamwathq@outlook.com
```

## 📁 File Structure

```
JamWatHQ/Main/Experimenting/
├── server.js              # Main server application
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── report-issues.html     # Main reporting form page
├── index.html            # Homepage
├── faq.html              # FAQ page with floating gear icon
├── agencies.html         # Agency directory with gear icon
├── guide.html            # Guides page with gear icon
├── news.html             # News page with gear icon
├── Assets/               # Stylesheets, JavaScript, and images
│   ├── css/
│   ├── js/
│   └── webfonts/
└── README.md             # This file
```

## 🛠️ API Endpoints

### POST /api/submit-report
Submit issue reports with comprehensive categorization.

**Request Body:**
```json
{
  "category": "agency|faq|news|guides|website|contact|suggestions",
  "issueDescription": "Detailed description of the issue",
  "correctInformation": "Correct information if known",
  "userType": "Current J-1 participant",
  "followUp": "Yes|No",
  "email": "user@example.com"
  // ... category-specific fields
}
```

### POST /api/contact
Handle contact form submissions.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "message": "Message content"
}
```

### GET /api/health
Server health check endpoint.

## 🎨 Floating Gear Icon

All pages include a floating gear icon in the bottom-right corner that:
- Links directly to the report-issues.html page
- Shows a tooltip on hover
- Has smooth animations and responsive design
- Maintains consistent styling across all pages

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```
Uses nodemon for automatic server restarts on file changes.

### Testing Email Configuration
The server will verify email configuration on startup and log any issues.

### Adding New Report Categories
1. Update the HTML form options in `report-issues.html`
2. Add corresponding form fields with appropriate IDs
3. Update the `formatReportEmail()` function in `server.js`
4. Add category icons and names to the mapping objects

## 📧 Email Templates

The system generates professional HTML emails with:
- Category-specific formatting and icons
- All submitted form data organized clearly
- Timestamp and report ID for tracking
- Direct links to sources when provided
- User information for follow-up if requested

## 🚀 Deployment

### Local Development
Follow the Quick Start guide above.

### Production Deployment
1. Set up a VPS or cloud hosting service
2. Install Node.js and PM2 (process manager)
3. Configure environment variables
4. Use PM2 to run the application:
   ```bash
   pm2 start server.js --name "jamwathq-server"
   ```

### Domain Configuration
Update any hardcoded localhost references to your actual domain name.

## 🤝 Contributing

1. Report bugs using the issue reporting system on the website
2. Suggest improvements through the suggestions category
3. Submit corrections for outdated information

## 📞 Support

For technical issues or questions:
- Use the floating gear icon to submit a website functionality report
- Email: jamwathq@outlook.com
- Visit: Any page on the site and use the contact form

## 📄 License

This project is created for the Jamaican Work and Travel community to provide accurate J-1 visa information and support.

---

**Made with ❤️ for the Jamaican J-1 community**