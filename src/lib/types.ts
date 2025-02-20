export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
    variables: string[];
    created_at: Date;
    updated_at: Date;
  }
  
  export interface EmailHistory {
    id: number;
    template_id: number;
    recipient_name: string;
    event_name: string;
    special_instructions: string;
    sent_at: Date;
    status: 'draft' | 'scheduled' | 'sent';
    scheduled_for?: Date;
  }