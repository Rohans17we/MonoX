#!/bin/bash

echo "🎮 Monopoly Game - Quick Deployment"
echo "===================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found"
    echo "📥 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI ready"
echo ""
echo "🔑 Please authenticate with Firebase..."
echo ""

# Try to login
firebase login --no-localhost

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Authentication successful!"
    echo ""
    echo "🚀 Deploying to Firebase Hosting..."
    echo ""
    
    cd /app
    firebase deploy --only hosting --project monox-50fd3
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 =================================="
        echo "🎉  DEPLOYMENT SUCCESSFUL!"
        echo "🎉 =================================="
        echo ""
        echo "🌐 Your Monopoly game is now live at:"
        echo ""
        echo "   https://monox-50fd3.web.app"
        echo "   https://monox-50fd3.firebaseapp.com"
        echo ""
        echo "✅ Features working:"
        echo "   • Firebase Authentication"
        echo "   • Real-time Firestore Database"
        echo "   • Custom Game Rules"
        echo "   • Winning Conditions"
        echo "   • Classic & Dark Themes"
        echo ""
        echo "🎮 Happy gaming!"
    else
        echo ""
        echo "❌ Deployment failed"
        echo "Please check the error messages above"
    fi
else
    echo ""
    echo "❌ Authentication failed"
    echo ""
    echo "💡 Alternative deployment methods:"
    echo ""
    echo "1. Deploy via Firebase Console:"
    echo "   - Go to: https://console.firebase.google.com"
    echo "   - Select: monox-50fd3"
    echo "   - Click: Hosting"
    echo "   - Upload: /app/frontend/build/"
    echo ""
    echo "2. Use GitHub Pages:"
    echo "   - See: /app/DEPLOYMENT.md for instructions"
    echo ""
fi
