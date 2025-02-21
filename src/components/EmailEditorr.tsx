// import { useState, useEffect } from 'react';
// import { Save, Send, Clock, Wand2, History, Plus, Edit, Trash2, X, Check } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// interface EmailTemplate {
//   id: number;
//   name: string;
//   subject: string;
//   content: string;
//   variables: string[];
//   created_at: Date;
//   updated_at: Date;
// }

// interface EmailHistory {
//   id: number;
//   template_id: number;
//   template_name: string;
//   recipient_name: string;
//   event_name: string;
//   special_instructions: string;
//   sent_at: Date;
//   status: 'draft' | 'scheduled' | 'sent';
//   scheduled_for?: Date;
// }

// interface EmailData {
//   id: number | null;
//   name: string;
//   subject: string;
//   content: string;
//   variables: string[];
//   recipientName: string;
//   eventName: string;
//   specialInstructions: string;
// }

// export function EmailEditor() {
//   const [template, setTemplate] = useState<EmailData>({
//     id: null,
//     name: '',
//     subject: '',
//     content: '',
//     variables: [],
//     recipientName: '',
//     eventName: '',
//     specialInstructions: '',
//   });

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [savedTemplates, setSavedTemplates] = useState<EmailTemplate[]>([]);
//   const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
//   const [scheduledDate, setScheduledDate] = useState<string>('');
//   const [showHistory, setShowHistory] = useState(false);
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
//   const [showScheduler, setShowScheduler] = useState(false);

//   useEffect(() => {
//     fetchTemplates();
//     fetchHistory();
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       const response = await fetch('/api/templates');
//       const data = await response.json();
//       setSavedTemplates(data);
//     } catch (error) {
//       showNotification('error', 'Failed to fetch templates');
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const response = await fetch('/api/history');
//       const data = await response.json();
//       setEmailHistory(data);
//     } catch (error) {
//       showNotification('error', 'Failed to fetch history');
//     }
//   };

//   const showNotification = (type: 'success' | 'error', message: string) => {
//     setNotification({ type, message });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   const handleVariableExtraction = (content: string) => {
//     const matches = content.match(/\{([^}]+)\}/g) || [];
//     const variables = matches.map(match => match.slice(1, -1));
//     setTemplate(prev => ({ ...prev, variables }));
//   };

//   const loadTemplate = (selectedTemplate: EmailTemplate) => {
//     setTemplate(prev => ({
//       ...prev,
//       id: selectedTemplate.id,
//       name: selectedTemplate.name,
//       subject: selectedTemplate.subject,
//       content: selectedTemplate.content,
//       variables: selectedTemplate.variables,
//     }));
//     setShowTemplates(false);
//   };

//   const deleteTemplate = async (id: number) => {
//     try {
//       await fetch(`/api/templates/${id}`, { method: 'DELETE' });
//       fetchTemplates();
//       showNotification('success', 'Template deleted successfully');
//     } catch (error) {
//       showNotification('error', 'Failed to delete template');
//     }
//   };

//   const generateEmailContent = async () => {
//     setIsGenerating(true);
//     try {
//       const generatedContent = `Dear ${template.recipientName},

// I hope this email finds you well. I'm writing regarding ${template.eventName}.

// ${template.specialInstructions}

// Looking forward to your response.

// Best regards,
// [Your Name]`;

//       setTemplate(prev => ({ ...prev, content: generatedContent }));
//       handleVariableExtraction(generatedContent);
//       showNotification('success', 'Email content generated successfully');
//     } catch (error) {
//       showNotification('error', 'Failed to generate content');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const saveTemplate = async (status: 'draft' | 'scheduled' | 'sent') => {
//     try {
//       const templateData = {
//         name: template.name,
//         subject: template.subject,
//         content: template.content,
//         variables: template.variables,
//       };

//       const templateResponse = await fetch('/api/templates', {
//         method: template.id ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(templateData),
//       });
//       const savedTemplate = await templateResponse.json();

//       await fetch('/api/history', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           template_id: savedTemplate.id,
//           recipient_name: template.recipientName,
//           event_name: template.eventName,
//           special_instructions: template.specialInstructions,
//           status,
//           scheduled_for: status === 'scheduled' ? scheduledDate : null,
//         }),
//       });

//       fetchTemplates();
//       fetchHistory();
//       showNotification('success', `Email ${status} successfully`);
      
//       if (status === 'sent' || status === 'scheduled') {
//         resetForm();
//       }
//     } catch (error) {
//       showNotification('error', `Failed to ${status} email`);
//     }
//   };

//   const resetForm = () => {
//     setTemplate({
//       id: null,
//       name: '',
//       subject: '',
//       content: '',
//       variables: [],
//       recipientName: '',
//       eventName: '',
//       specialInstructions: '',
//     });
//     setScheduledDate('');
//   };

//   const TemplatesList = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Saved Templates</h2>
//           <button
//             onClick={() => setShowTemplates(false)}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         <div className="space-y-4">
//           {savedTemplates.map((t) => (
//             <div key={t.id} className="border p-4 rounded-lg hover:bg-gray-50">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <h3 className="font-medium">{t.name}</h3>
//                   <p className="text-sm text-gray-600">{t.subject}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => loadTemplate(t)}
//                     className="p-2 hover:bg-gray-200 rounded-full"
//                   >
//                     <Edit className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => deleteTemplate(t.id)}
//                     className="p-2 hover:bg-red-100 text-red-600 rounded-full"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const HistoryPanel = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Email History</h2>
//           <button
//             onClick={() => setShowHistory(false)}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         <div className="space-y-4">
//           {emailHistory.map((entry) => (
//             <div key={entry.id} className="border p-4 rounded-lg">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-medium">{entry.template_name}</h3>
//                   <p className="text-sm text-gray-600">To: {entry.recipient_name}</p>
//                   <p className="text-sm text-gray-600">Event: {entry.event_name}</p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-sm ${
//                   entry.status === 'sent' ? 'bg-green-100 text-green-800' :
//                   entry.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   {entry.status}
//                 </span>
//               </div>
//               {entry.scheduled_for && (
//                 <p className="text-sm text-gray-600 mt-2">
//                   Scheduled for: {new Date(entry.scheduled_for).toLocaleString()}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
//       {notification && (
//         <Alert
//           className={`mb-4 border-l-4 p-4 rounded-md text-sm shadow-md transition-all duration-300 ${
//             notification.type === "error"
//               ? "bg-red-100 border-red-500 text-red-800"
//               : "bg-green-100 border-green-500 text-green-800"
//           }`}
//         >
//           <AlertDescription>{notification.message}</AlertDescription>
//         </Alert>
//       )}

// <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex space-x-4">
//             <button
//               onClick={() => setShowTemplates(true)}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all"
//             >
//               <Plus className="h-5 w-5 mr-2" />
//               Templates
//             </button>
//             <button
//               onClick={() => setShowHistory(true)}
//               className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm hover:bg-gray-900 transition-all"
//             >
//               <History className="h-5 w-5 mr-2" />
//               History
//             </button>
//           </div>
//         </div>
        
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Template Name
//           </label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             value={template.name}
//             onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
//             placeholder="Enter template name"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Recipient Name
//             </label>
//             <input
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={template.recipientName}
//               onChange={(e) => setTemplate(prev => ({ ...prev, recipientName: e.target.value }))}
//               placeholder="Enter recipient's name"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Name
//             </label>
//             <input
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={template.eventName}
//               onChange={(e) => setTemplate(prev => ({ ...prev, eventName: e.target.value }))}
//               placeholder="Enter event name"
//             />
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Special Instructions
//           </label>
//           <textarea
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             value={template.specialInstructions}
//             onChange={(e) => setTemplate(prev => ({ ...prev, specialInstructions: e.target.value }))}
//             placeholder="Enter any special instructions or key points to include"
//             rows={3}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Subject Line
//           </label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             value={template.subject}
//             onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
//             placeholder="Enter email subject"
//           />
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Email Content
//             </label>
//             <button
//               onClick={generateEmailContent}
//               disabled={isGenerating}
//               className={`flex items-center px-3 py-1 rounded-md text-sm ${
//                 isGenerating
//                   ? 'bg-gray-100 text-gray-400'
//                   : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
//               }`}
//             >
//               <Wand2 className="h-4 w-4 mr-2" />
//               {isGenerating ? 'Generating...' : 'Generate Content'}
//             </button>
//           </div>
//           <div className="relative">
//             <textarea
//               className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={template.content}
//               onChange={(e) => {
//                 setTemplate(prev => ({ ...prev, content: e.target.value }));
//                 handleVariableExtraction(e.target.value);
//               }}
//               placeholder="Write your email content here or use the generate button above. Use {variable} for dynamic content."
//             />
//           </div>
//         </div>

//         {template.variables.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Detected Variables</h3>
//             <div className="flex flex-wrap gap-2">
//               {template.variables.map((variable) => (
//                 <span
//                   key={variable}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
//                 >
//                   {variable}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="flex justify-end space-x-4">
//           <button
//             onClick={() => saveTemplate("draft")}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-sm hover:bg-gray-700 transition-all"
//           >
//             <Save className="h-5 w-5 mr-2" />
//             Save Draft
//           </button>

//           {/* Schedule Button with Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowScheduler(!showScheduler)}
//               className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-sm hover:bg-yellow-600 transition-all"
//             >
//               <Clock className="h-5 w-5 mr-2" />
//               Schedule
//             </button>
//             {showScheduler && (
//               <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-4 w-64">
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Schedule Date & Time
//                   </label>
//                   <input
//                     type="datetime-local"
//                     className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500"
//                     value={scheduledDate}
//                     onChange={(e) => setScheduledDate(e.target.value)}
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     onClick={() => setShowScheduler(false)}
//                     className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       if (scheduledDate) {
//                         saveTemplate("scheduled");
//                         setShowScheduler(false);
//                       }
//                     }}
//                     className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => saveTemplate("sent")}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all"
//           >
//             <Send className="h-5 w-5 mr-2" />
//             Send Now
//           </button>
//         </div>
//       </div>

//       {showTemplates && <TemplatesList />}
//       {showHistory && <HistoryPanel />}
//     </div>
//   );
// }

// export default EmailEditor;