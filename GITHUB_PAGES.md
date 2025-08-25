# GitHub Pages Deployment

This repository is configured to automatically deploy the React frontend to GitHub Pages.

## Setup Instructions

### 1. Repository Settings
To enable GitHub Pages deployment, ensure the following settings are configured in your GitHub repository:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the configuration

### 2. Workflow Configuration
The deployment workflow is defined in `.github/workflows/deploy.yml` and includes:

- **Permissions**: Proper permissions for Pages deployment
- **Environment**: Uses `github-pages` environment for security
- **Node.js Setup**: Uses Node.js 20 with npm caching
- **Build Process**: Installs dependencies and builds the React app
- **Deployment**: Uses the official GitHub Pages deployment action

### 3. Vite Configuration
The `frontend/vite.config.js` is configured with:
```javascript
base: '/real-time-video-chat/' // Matches the repository name
```

This ensures all assets are properly referenced when deployed to the GitHub Pages subdirectory.

## Manual Deployment

To trigger a deployment manually:
1. Go to **Actions** tab in the repository
2. Select the "Deploy React Frontend to GitHub Pages" workflow
3. Click **Run workflow**

## Automatic Deployment

The workflow also runs automatically when code is pushed to the `main` branch.

## Access the Deployed App

Once deployed, the app will be available at:
`https://rahulkbharti.github.io/real-time-video-chat/`

## Troubleshooting

### Common Issues:
1. **403 Permission Denied**: Ensure GitHub Pages is enabled and workflow has proper permissions
2. **404 Not Found**: Check that the base path in vite.config.js matches the repository name
3. **Assets not loading**: Verify relative paths are used for static assets

### Build Issues:
- The workflow uses `npm ci` for faster, reproducible builds
- All dependencies are installed from `package-lock.json`
- Build artifacts are uploaded from the `frontend/dist` directory