CREATE TABLE email_history (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES email_templates(id),
  recipient_name VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  special_instructions TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  scheduled_for TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'scheduled', 'sent'))
);