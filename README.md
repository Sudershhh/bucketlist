# BucketList Tracker

A modern web application that helps users track their bucket list dreams and goals. Users can create, manage, and visualize their bucket list items with images in a secure, personalized environment.

![BucketList Tracker Screenshot](screenshot.png)
_(Note: You'll need to add an actual screenshot of your application here)_

## Features

- 🔐 Secure user authentication
- 📝 Create and manage bucket list items
- 🖼️ Upload images for each bucket list entry
- 🎯 Personal dashboard to track all dreams and goals
- ☁️ Cloud storage for images
- 📱 Responsive design for all devices

## Tech Stack

### Frontend

- React 18
- AWS Amplify UI Components
- Vite
- CSS3 with modern animations and transitions

### Backend (AWS Services)

- AWS Amplify
- Amazon Cognito for authentication
- AWS AppSync for GraphQL API
- Amazon DynamoDB for database
- Amazon S3 for image storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AWS Account
- AWS Amplify CLI

## Getting Started

1. Clone the repository

2. Install dependencies

3. Configure Amplify

```bash
amplify configure
amplify init
```

4. Push the backend to AWS

```bash
amplify push
```

5. Start the development server

```bash
npm run dev
```

## Project Structure

```
bucketlistapp/
├── amplify/
│   ├── auth/
│   ├── data/
│   └── storage/
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
└── package.json
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Deployment

The application can be deployed using AWS Amplify Hosting:

```bash
amplify publish
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
