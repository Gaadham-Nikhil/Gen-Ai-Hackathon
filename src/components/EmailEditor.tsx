import { useState, useEffect } from 'react';
import { Save, Send, Clock, Wand2, History, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import { generateEmailContent, validateApiKey } from '../services/api';

interface EmailData {
  id: number | null;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  recipientName: string;
  eventName: string;
  specialInstructions: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
}

interface EmailHistory {
  id: number;
  subject: string;
  recipient: string;
  sentAt: string;
  status: string;
}

export function EmailEditor() {
  const [template, setTemplate] = useState<EmailData>({
    id: null,
    name: '',
    subject: '',
    content: '',
    variables: [],
    recipientName: '',
    eventName: '',
    specialInstructions: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<EmailTemplate[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean>(false);

  useEffect(() => {
    fetchTemplates();
    fetchHistory();
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const isValid = await validateApiKey();
    setApiKeyValid(isValid);
    if (!isValid) {
      showNotification('error', 'Gemini API key is not configured or invalid');
    }
  };

  const handleVariableExtraction = (content: string) => {
    const matches = content.match(/\{([^}]+)\}/g) || [];
    const variables = matches.map(match => match.slice(1, -1));
    setTemplate(prev => ({ ...prev, variables }));
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setSavedTemplates(data);
    } catch (error) {
      showNotification('error', 'Failed to fetch templates');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setEmailHistory(data);
    } catch (error) {
      showNotification('error', 'Failed to fetch history');
    }
  };


  const generateContent = async () => {
    if (!apiKeyValid) {
      showNotification('error', 'Please configure a valid API key');
      return;
    }

    if (!template.recipientName || !template.eventName) {
      showNotification('error', 'Please fill in recipient name and event name');
      return;
    }

    setIsGenerating(true);

    try {
      const content = await generateEmailContent({
        recipientName: template.recipientName,
        eventName: template.eventName,
        specialInstructions: template.specialInstructions,
      });

      setTemplate(prev => ({ ...prev, content }));
      handleVariableExtraction(content);
      showNotification('success', 'Content generated successfully');
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {!apiKeyValid && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">API Key Not Configured</p>
              <p className="text-sm">Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY</p>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`mb-4 p-4 rounded-md ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : 'bg-green-50 text-green-800 border-green-200'
        } border`}>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={template.name}
            onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter template name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={template.recipientName}
              onChange={(e) => setTemplate(prev => ({ ...prev, recipientName: e.target.value }))}
              placeholder="Enter recipient's name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={template.eventName}
              onChange={(e) => setTemplate(prev => ({ ...prev, eventName: e.target.value }))}
              placeholder="Enter event name"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={template.specialInstructions}
            onChange={(e) => setTemplate(prev => ({ ...prev, specialInstructions: e.target.value }))}
            placeholder="Enter any special instructions or key points to include"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={template.subject}
            onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Enter email subject"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Content
            </label>
            <button
              onClick={generateContent}
              disabled={isGenerating}
              className={`flex items-center px-3 py-1 rounded-md text-sm ${
                isGenerating
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={template.content}
              onChange={(e) => {
                setTemplate(prev => ({ ...prev, content: e.target.value }));
                handleVariableExtraction(e.target.value);
              }}
              placeholder="Write your email content here or use the generate button above. Use {variable} for dynamic content."
            />
          </div>
        </div>

        {template.variables.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Detected Variables</h3>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable) => (
                <span
                  key={variable}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Clock className="h-4 w-4 mr-2" />
            Schedule
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <Send className="h-4 w-4 mr-2" />
            Send Now
          </button>
        </div>
      </div>
    </div>
  );
}