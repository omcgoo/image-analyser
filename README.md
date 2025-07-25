# SVG Analyzer

A modern web application for analyzing SVG files and generating relevant tags using AI. Built with Next.js, React, and OpenAI integration.

## Features

- **SVG Analysis**: Upload and analyze SVG files with AI-powered tag generation
- **Bulk Processing**: Handle multiple files at once
- **Test Mode**: Toggle between AI analysis and test mode for development
- **Modern UI**: Clean, responsive interface with Tailwind CSS
- **Real-time Processing**: Live feedback during analysis
- **Tag Management**: Copy generated tags to clipboard

## Tech Stack

- **Framework**: Next.js 15.0.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **AI Integration**: OpenAI API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/omcgoo/image-analyser.git
cd image-analyser
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Single Upload**: Upload individual SVG files for analysis
2. **Bulk Upload**: Upload multiple files at once
3. **Test Mode**: Toggle between AI analysis and test mode using the switch
4. **Settings**: Customize AI prompts and temperature settings
5. **Copy Tags**: Click the copy button to copy generated tags to clipboard

## Project Structure

```
app/
├── api/                    # API routes
│   ├── analyze/           # Single file analysis
│   ├── analyze-bulk/      # Bulk file analysis
│   └── config/            # Configuration files
├── components/            # React components
│   ├── ui/               # UI components
│   ├── ImageUploader.tsx # File upload component
│   ├── TagList.tsx       # Tag display component
│   └── SettingsPanel.tsx # Settings panel
├── hooks/                # Custom React hooks
└── page.tsx              # Main page component
```

## API Endpoints

- `POST /api/analyze` - Analyze single SVG file
- `POST /api/analyze-bulk` - Analyze multiple SVG files

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required for AI analysis)

## Security

- API keys are stored in environment variables
- `.env.local` is gitignored to prevent accidental commits
- No sensitive data is stored in the repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions, please open an issue on GitHub.
