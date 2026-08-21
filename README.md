
# flare-clips-manager

The frontend dashboard interface template for flare-clips, built to manage gameplay clips, video storage, and serverless API interactions. 

## Architecture Overview
````
[ Browser Dashboard ] (manager.yourdomain.com)
       │
       ├── (GET / DELETE with x-api-key)
       ▼
[ Cloudflare Worker API ] (api.yourdomain.com)
       │
       ▼
[ Cloudflare R2 Storage ] (s-clips)
````
## Tech Stack
* Framework: Vite + JavaScript
* Styling: Custom CSS / Minimalist Dark Theme
* Hosting: Cloudflare Pages

## Getting Started Locally

1. Clone the repository:
````
   git clone https://github.com/suriyahs/flare-clip-manager.git
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
