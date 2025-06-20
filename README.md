# SearchAI Experience plugin


## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development and Deployment](#local-development-and-deployment) 
  - [Upload search plugin](#upload-search-plugin)
- [Configuration](#configuration)
- [Code Summary and Overview](#code-summary-and-overview)
  - [Folder Structure](#folder-structure)
  


## Overview
This is a core plugin for hybrid search. The search results can be fine-tuned by adjusting the ratio between keyword and vector search weights and the threshold for vector search. It also features toggleable plugin settings for AI Overview, Recommendations, SearchAI Assist, ChatBot, and LLM-generated fields. This would be the default plugin that a collection with Auto Relevance enabled would redirect to from the admin console.

## Getting Started

### Prerequisites 
-  Ensure [Node.js](https://nodejs.org/) (version 14 or higher) is installed.
-  The project uses [pnpm](https://pnpm.io/installation) as its package manager. Make sure it is installed before proceeding.

### Local Development and Deployment

Clone the repository and navigate to its directory. To run the plugin locally for development:

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```
   This will start the Vite dev server at `https://localhost:9005`.


   The development server supports hot module reloading for rapid development. Any changes to source files will automatically refresh the browser.

3. Build for production:
   ```bash
   pnpm build
   ```
   This will generate optimized files in the `dist` folder

### Upload search plugin:

   Rename the dist folder as desired, compress it to a ZIP file, and upload it through the Search Settings page in the SearchBlox admin console. When making changes, rebuild and upload the new ZIP file with the same name to update the existing plugin.


## Configuration

Configure the `pluginDomain` setting in `facet.js`.

```js
    "pluginDomain": "https://localhost:8443"
```

For detailed documentation of all available configuration options, refer to the [configuration documentation](CONFIG_DOCUMENTATION.md).


## Code Summary and Overview 

### Folder Structure
For complete tree structure and quick explanation for each file in the project refer to [the project structure.](ARCHITECTURE.md)


The plugin consists of several key files and components:

- **facet.js** - The main configuration file that controls search behavior and results display. It contains settings for API endpoints, result limits, field mappings, and other search parameters.

- **Defaults.js** - Imports and processes the facet.js configuration, exporting individual configuration properties to be used throughout the application.

- **SbCore.js** - Contains the core search functionality including:
  - API request/response handling
  - Result formatting and processing
  - Analytics tracking
  - Error handling

- **App.jsx** - The root React component that handles:
  - Authentication flow when security is enabled
  - Conditional rendering of Login vs Search UI
  

- **LogIn.jsx** - Authentication component that:
  - Renders the login form when security is enabled
  - Validates username/password credentials
  - Manages authentication errors
  - Redirects to search on successful login

- **SearchUI.jsx** - Main search interface component that:
  - Handles search requests based on URL parameters
  - Renders search UI elements (search input, filters, results etc)
  - Coordinates between child components

#### Important Note
**init.js** - Required initialization file that sets up the global object needed by the voice search functionality (inline-worker package). Must be imported first in main.jsx to prevent runtime errors.