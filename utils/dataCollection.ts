// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { JSDOM } from 'jsdom';
import OpenAI from 'openai';
import { TrainingData, Source, QAPair, Process, CaseStudy, Resource } from './agentTraining';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Official immigration sources
const OFFICIAL_SOURCES: Record<string, Array<{ name: string; url: string }>> = {
  'US': [
    { name: 'USCIS', url: 'https://www.uscis.gov/' },
    { name: 'Department of State', url: 'https://travel.state.gov/' },
    { name: 'CBP', url: 'https://www.cbp.gov/' }
  ],
  'Canada': [
    { name: 'IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html' },
    { name: 'Canada Border Services Agency', url: 'https://www.cbsa-asfc.gc.ca/' }
  ],
  'UK': [
    { name: 'UK Visas and Immigration', url: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration' },
    { name: 'Home Office', url: 'https://www.gov.uk/government/organisations/home-office' }
  ],
  'Australia': [
    { name: 'Department of Home Affairs', url: 'https://www.homeaffairs.gov.au/' },
    { name: 'Immigration and Citizenship', url: 'https://immi.homeaffairs.gov.au/' }
  ],
  'EU': [
    { name: 'European Commission - Migration and Home Affairs', url: 'https://ec.europa.eu/home-affairs/policies/migration-and-asylum_en' }
  ]
};

// Function to scrape content from a URL
export async function scrapeUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract text content from main content areas
    const mainContent = document.querySelector('main') || document.querySelector('article') || document.body;
    
    // Remove script and style elements
    const scripts = mainContent.querySelectorAll('script, style');
    scripts.forEach((script: Element) => script.remove());
    
    // Get the text content
    return mainContent.textContent?.replace(/\s+/g, ' ').trim() || '';
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return '';
  }
}

// Function to extract FAQs from content using AI
export async function extractFAQs(content: string, topic: string): Promise<QAPair[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in immigration law and policy. Your task is to extract relevant FAQ questions and answers from the provided content."
        },
        {
          role: "user",
          content: `Extract 10-15 frequently asked questions and detailed answers about ${topic} from the following content. Format your response as a JSON array of objects with 'question', 'answer', and 'category' fields:\n\n${content.substring(0, 8000)}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const responseContent = response.choices[0].message.content || '{"faqs": []}';
    const result = JSON.parse(responseContent);
    return result.faqs || [];
  } catch (error) {
    console.error('Error extracting FAQs:', error);
    return [];
  }
}

// Function to extract application processes from content using AI
export async function extractProcesses(content: string, topic: string): Promise<Process[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in immigration law and policy. Your task is to extract detailed application processes from the provided content."
        },
        {
          role: "user",
          content: `Extract detailed application processes related to ${topic} from the following content. Include steps, requirements, timeframes, and fees. Format your response as a JSON array of objects with 'name', 'steps' (array of objects with 'order', 'description', and optional 'tips'), 'requirements' (array of strings), 'timeframe', 'fees', and optional 'notes' fields:\n\n${content.substring(0, 8000)}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const responseContent = response.choices[0].message.content || '{"processes": []}';
    const result = JSON.parse(responseContent);
    return result.processes || [];
  } catch (error) {
    console.error('Error extracting processes:', error);
    return [];
  }
}

// Function to generate case studies using AI
export async function generateCaseStudies(topic: string): Promise<CaseStudy[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in immigration law and policy. Your task is to create realistic and educational case studies based on common scenarios."
        },
        {
          role: "user",
          content: `Generate 5 detailed case studies related to ${topic}. Each case study should include a realistic scenario, outcome, and key lessons learned. Format your response as a JSON array of objects with 'title', 'scenario', 'outcome', and 'keyLessons' (array of strings) fields.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const responseContent = response.choices[0].message.content || '{"caseStudies": []}';
    const result = JSON.parse(responseContent);
    return result.caseStudies || [];
  } catch (error) {
    console.error('Error generating case studies:', error);
    return [];
  }
}

// Function to compile legal resources using AI
export async function compileLegalResources(topic: string, country: string): Promise<Resource[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in immigration law and policy. Your task is to compile a list of legal resources for immigration assistance."
        },
        {
          role: "user",
          content: `Compile a list of 10 legal resources related to ${topic} in ${country}. Include organizations, documents, websites, and contact information where applicable. Format your response as a JSON array of objects with 'name', 'type' (one of: 'Organization', 'Document', 'Website', 'Contact'), 'description', optional 'url', and optional 'contact' fields.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const responseContent = response.choices[0].message.content || '{"resources": []}';
    const result = JSON.parse(responseContent);
    return result.resources || [];
  } catch (error) {
    console.error('Error compiling legal resources:', error);
    return [];
  }
}

// Main function to collect data for a specific topic
export async function collectDataForTopic(topic: string, countries: string[] = ['US', 'Canada', 'UK']): Promise<TrainingData> {
  const sources: Source[] = [];
  let allContent = '';
  
  // Collect data from official sources for each country
  for (const country of countries) {
    const countrySources = OFFICIAL_SOURCES[country];
    if (countrySources) {
      for (const source of countrySources) {
        console.log(`Collecting data from ${source.name} (${country})...`);
        
        // Add to sources
        sources.push({
          name: source.name,
          url: source.url,
          description: `Official immigration information from ${source.name} (${country})`,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
        
        // Scrape content
        const content = await scrapeUrl(source.url);
        allContent += content + ' ';
      }
    }
  }
  
  console.log('Extracting FAQs...');
  const faqs = await extractFAQs(allContent, topic);
  
  console.log('Extracting application processes...');
  const processes = await extractProcesses(allContent, topic);
  
  console.log('Generating case studies...');
  const caseStudies = await generateCaseStudies(topic);
  
  console.log('Compiling legal resources...');
  const legalResources = await compileLegalResources(topic, countries[0]);
  
  // Compile the training data
  const trainingData: TrainingData = {
    topic,
    officialSources: sources,
    applicationProcesses: processes,
    faqs,
    caseStudies,
    legalResources,
    updatedAt: new Date().toISOString()
  };
  
  return trainingData;
}

// Function to update existing training data with the latest information
export async function updateTrainingData(existingData: TrainingData): Promise<TrainingData> {
  console.log(`Updating training data for ${existingData.topic}...`);
  
  // Extract countries from existing sources
  const countries = Array.from(new Set(
    existingData.officialSources
      .map(source => {
        for (const [country, sources] of Object.entries(OFFICIAL_SOURCES)) {
          if (sources.some(s => source.url.includes(s.url))) {
            return country;
          }
        }
        return 'US'; // Default to US if country can't be determined
      })
  ));
  
  // Collect fresh data
  const freshData = await collectDataForTopic(existingData.topic, countries);
  
  // Merge the data, prioritizing new information
  return {
    ...existingData,
    officialSources: [...freshData.officialSources],
    applicationProcesses: [
      ...existingData.applicationProcesses,
      ...freshData.applicationProcesses.filter(p1 => !existingData.applicationProcesses.some(p2 => p2.name === p1.name))
    ],
    faqs: [
      ...existingData.faqs,
      ...freshData.faqs.filter(f1 => !existingData.faqs.some(f2 => f2.question === f1.question))
    ],
    caseStudies: [
      ...existingData.caseStudies,
      ...freshData.caseStudies.filter(c1 => !existingData.caseStudies.some(c2 => c2.title === c1.title))
    ],
    legalResources: [
      ...existingData.legalResources,
      ...freshData.legalResources.filter(r1 => !existingData.legalResources.some(r2 => r2.name === r1.name))
    ],
    updatedAt: new Date().toISOString()
  };
} 