# 🎮 Monopoly Gaming Platform

A beautiful, feature-rich online Monopoly game inspired by richup.io with Firebase backend.

![Monopoly Game](https://img.shields.io/badge/React-19-blue) ![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange) ![Status](https://img.shields.io/badge/Status-Ready-green)

## 🎯 Features

### 🎨 Complete UI/UX
- Landing page with "Rule the Economy" hero
- Classic & Dark theme toggle
- Beautiful dashboard with game rooms
- Multi-board selection (International, India, Europe, Asia)
- Responsive design for all devices

### 🎮 Custom Game Rules (Room Creator Controls)
- **Starting Cash**: Customize from $500 to $10,000 (default: $1500)
- **Mortgage Allowed**: Toggle property mortgaging
- **Auction Unpurchased**: Properties go to auction if not bought
- **Even Build Rule**: Houses must be built evenly across sets
- **Taxes to Free Parking**: Tax money collects, first to land gets all
- **No Rent in Jail**: Players in jail cannot collect rent

### 🏆 Winning Conditions
1. **Last Player Standing**: Classic bankruptcy rule
2. **Time/Turn Limit**: Richest player at end wins
3. **Money Goal**: First to reach target amount wins

### 🔥 Firebase Integration
- **Authentication**: Email/Password signup & login
- **Firestore**: Real-time database for game rooms
- **Real-time Updates**: All players see changes instantly
- **Serverless**: No backend server needed!

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase account (free tier works!)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd monopoly-game
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   yarn install
   ```

3. **Configure Firebase**
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Set security rules (see FIREBASE_SETUP.md)

4. **Run development server**
   ```bash
   yarn start
   ```

5. **Build for production**
   ```bash
   yarn build
   ```

## 🌐 Deployment

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

Your site will be live at:
- `https://monox-50fd3.web.app`
- `https://monox-50fd3.firebaseapp.com`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions and alternative hosting options.

## 📁 Project Structure

```
/app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── config/          # Firebase configuration
│   │   ├── services/        # Auth & Room services
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   └── mock/            # Mock data (for reference)
│   └── build/               # Production build (ready to deploy)
├── firebase.json            # Firebase hosting config
├── .firebaserc              # Firebase project config
├── DEPLOYMENT.md            # Deployment guide
└── FIREBASE_SETUP.md        # Firebase setup instructions
```

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Serverless)
- **Database**: Firestore (Real-time NoSQL)
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting / Vercel / Netlify / GitHub Pages

## 🎮 How to Play

1. **Quick Play**: Enter a nickname and jump into a game
2. **Create Account**: Sign up for persistent progress
3. **Create Room**: Set custom rules and winning conditions
4. **Join Room**: Browse public rooms and join games
5. **Play**: Roll dice, buy properties, build hotels, win!

## 🔧 Configuration

### Firebase Config
Located in `/app/frontend/src/config/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
```

### Environment Variables
No additional environment variables needed! Firebase config is in the code.

## 🔐 Security

### Firestore Rules
Configured to allow:
- Public read access to rooms
- Authenticated users can create/update their own data
- Guest users can create rooms with guest prefix

See `FIREBASE_SETUP.md` for complete security rules.

## 📊 Features Status

| Feature | Status |
|---------|--------|
| Landing Page | ✅ Complete |
| Authentication | ✅ Complete |
| Theme Toggle | ✅ Complete |
| Dashboard | ✅ Complete |
| Create Room | ✅ Complete |
| Custom Rules | ✅ Complete |
| Winning Conditions | ✅ Complete |
| Board Selection | ✅ Complete |
| Real-time Rooms | ✅ Complete |
| Game Board Logic | 🚧 Coming Soon |
| Dice Rolling | 🚧 Coming Soon |
| Property Trading | 🚧 Coming Soon |

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📝 License

MIT License - feel free to use this for your own projects!

## 🎉 Live Demo

Visit the live site: https://monox-50fd3.web.app

## 📞 Support

Need help? Check out:
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase configuration
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- Firebase Documentation: https://firebase.google.com/docs

## 🙏 Acknowledgments

- Inspired by [richup.io](https://richup.io)
- Built with React, Firebase, and Tailwind CSS
- UI components from shadcn/ui

---

**Built with ❤️ using React and Firebase**

🎮 Happy Gaming! Rule the Economy! 💰
