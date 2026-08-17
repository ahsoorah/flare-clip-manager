
# flare-clips-manager

The frontend dashboard interface for flare-clips, built to manage gameplay clips, video storage, and serverless API interactions. 

## Architecture Overview

[ Browser Dashboard ] (manager.suriyah.dev)
       │
       ├── (GET / DELETE with x-api-key)
       ▼
[ Cloudflare Worker API ] (api.suriyah.dev)
       │
       ▼
[ Cloudflare R2 Storage ] (vices-clips)

## Tech Stack
* Framework: Vite + JavaScript
* Styling: Custom CSS / Minimalist Dark Theme
* Hosting: Cloudflare Pages

## Getting Started Locally

1. Clone the repository:
````
   git clone [https://github.com/ahsoorah/flare-clip-manager.git](https://github.com/ahsoorah/flare-clip-manager.git)
   cd flare-clip-manager
````
2. Install dependencies:
````
   npm install
````
3. Create your local environment file based on the template:
````
   cp .env.example .env
````
4. Run the development server:
````
   npm run dev
