# Immigration Helper AI

A comprehensive platform providing specialized AI assistance for various immigration topics. Each AI agent is trained on specific immigration topics to provide accurate, detailed, and up-to-date information.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [AI Agent Specializations](#ai-agent-specializations)
- [Getting Started](#getting-started)
- [Training the AI Agents](#training-the-ai-agents)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

Immigration Helper AI is a Next.js application that uses specialized AI agents to provide accurate and helpful information on various immigration topics. Each agent is trained on a comprehensive dataset specific to its area of expertise, allowing it to provide detailed and contextually relevant responses to user queries.

## Features

- **Specialized AI Agents**: Eight different AI agents, each trained on a specific immigration topic
- **Comprehensive Knowledge Base**: Data collected from official government sources, including application processes, FAQs, and legal resources
- **User-Friendly Interface**: Clean, intuitive chat interface for interacting with the AI agents
- **Regular Updates**: System for keeping the agents up-to-date with the latest immigration information
- **Validation and Testing**: Rigorous testing and evaluation of agent responses for accuracy and helpfulness

## AI Agent Specializations

The platform includes specialized agents for the following immigration topics:

1. **Visa Applications**: Different types of visas, application processes, documentation requirements
2. **Family Sponsorship**: Eligibility requirements, sponsorship process, documentation requirements
3. **Travel Documents**: Passport requirements, travel document types, application processes
4. **Citizenship**: Naturalization requirements, application process, citizenship tests
5. **Student Visas**: Eligibility requirements, application process, study permits
6. **Legal Assistance**: Finding legal representation, legal aid resources, immigration court processes
7. **Work Permits**: Types of work permits, application processes, employer requirements
8. **Permanent Residency**: Pathways to permanent residency, application processes, documentation requirements

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/immigration-helper-ai.git
   cd immigration-helper-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Test your OpenAI API connection:
   ```bash
   npm run test:openai
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Training the AI Agents

The application uses specialized AI agents trained on immigration topics. To train the agents:

```bash
npm run train
```

This will:
1. Collect data from official immigration sources
2. Process and format the data for training
3. Train specialized AI agents for each immigration topic

### Testing the AI Agents

After training the agents, you can test them to ensure they're working correctly:

```bash
npm run test:agents
```

This will test each agent with a relevant question and display the response.

### Manual Training Steps

If you prefer to run each step of the pipeline manually:

1. **Compile the scripts**:
   ```bash
   npm run build:scripts
   ```

2. **Data Collection and Training**:
   ```bash
   npm run train:collect
   ```

3. **Testing and Evaluation**:
   ```bash
   npm run train:test
   ```

4. **API Route Updates**:
   ```bash
   npm run train:update
   ```

### Troubleshooting

If you encounter issues running the scripts, see the [Troubleshooting section](docs/agent-training-guide.md#common-issues) in the Agent Training Guide.

## Development

### Project Structure

- `app/`: Next.js application code
  - `api/`: API routes for the AI agents
  - `resources/`: Pages for each immigration topic
  - `components/`: React components
- `utils/`: Utility functions
  - `agentTraining.ts`: Functions for training the AI agents
  - `dataCollection.ts`: Functions for collecting data from official sources
- `scripts/`: Scripts for running the training pipeline
- `data/`: Training data and results
- `docs/`: Documentation

### Adding a New Immigration Topic

To add a new immigration topic:

1. Add the topic to the `IMMIGRATION_TOPICS` array in `scripts/trainAgents.ts`
2. Create a new directory for the topic in `app/resources/`
3. Create a new API route for the topic in `app/api/`
4. Run the training pipeline to collect data and train the agent

## Deployment

The application is designed to be deployed on Vercel:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Set the environment variables in the Vercel dashboard
   - Required: `OPENAI_API_KEY` - Your OpenAI API key
   - Required: `NODE_ENV` - Set to `production` for deployment
4. Deploy the application

## Documentation

For more detailed documentation, see the following files:

- [Agent Training Guide](docs/agent-training-guide.md): Comprehensive guide to the agent training process
- [API Documentation](docs/api-documentation.md): Documentation for the API endpoints
- [Data Collection](docs/data-collection.md): Details on the data collection process

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 