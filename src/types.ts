export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  createdAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduledFor?: Date;
  stats: {
    total: number;
    sent: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  createdAt: Date;
}

export interface EmailStats {
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  spam: number;
  timeSeries: {
    timestamp: string;
    delivered: number;
    opened: number;
    clicked: number;
  }[];
}