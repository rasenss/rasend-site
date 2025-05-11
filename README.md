# Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js 15, React 19, and Tailwind CSS. This site showcases my work, skills, and experience in a clean, interactive interface.


## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, and TailwindCSS 4
- **Responsive Design**: Fully responsive for all device sizes
- **Interactive Elements**: Animations and transitions powered by Framer Motion
- **Contact Form**: Integrated email functionality via Resend API
- **Portfolio Showcase**: Interactive display of design and development work
- **Resume Section**: Downloadable resume and skills showcase
- **Performance Optimized**: Fast loading times with optimized images and code

## 📋 Sections

- **Hero/Home**: Introduction and welcome section
- **Portfolio**: Showcase of design and development projects
- **Skills**: Technical skills and competencies
- **Resume**: Professional experience and education
- **Certifications**: Professional certifications and achievements
- **Contact**: Contact form and direct contact options
- **Easter Egg**: Fun interactive element for visitors to discover

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Resend API
- **PDF Support**: PDF.js
- **Optimization**: CSS Optimization with Critters and CSSnano
- **Virtualization**: TanStack React Virtual

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later

### Installation

1. Clone the repository
```bash
git clone https://github.com/rasenss/rasend-site.git
cd portfolio
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your_email_address_here
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚢 Deployment

This project is optimized for deployment on Vercel. See [vercel-deployment.md](vercel-deployment.md) for detailed deployment instructions.

### Quick Deployment Steps:

1. Push your code to a Git repository
2. Connect to Vercel
3. Add the required environment variables
4. Deploy!

## 📝 Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   │   └── contact/      # Contact form API
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page component
├── components/           # React components
├── lib/                  # Utility functions and libraries
├── public/               # Static files (images, etc.)
│   ├── Certifications/   # Certification PDFs and images
│   ├── portfolio/        # Portfolio project images
│   └── Resume/           # Resume PDF
└── types/                # TypeScript type definitions
```

## 🧪 Performance Optimizations

- Image optimization via Next.js Image component
- CSS optimization with Critters and CSSnano
- Code splitting and lazy loading
- Font optimization
- Properly configured caching strategies

## 👤 Author

- **[Rasendriya Khansa Jolankarfyan](https://github.com/rasenss)**
- Contact: rasuen27@gmail.com

## 📄 License

This project is licensed under the MIT License.
