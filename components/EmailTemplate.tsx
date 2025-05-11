import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  message,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
    <h1 style={{ color: '#3B82F6', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
      New Contact Form Submission
    </h1>
    <div>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#3B82F6', fontSize: '18px' }}>Message:</h2>
        <p style={{ padding: '15px', background: '#f7f7f7', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>{message}</p>
      </div>
    </div>
    <div style={{ marginTop: '30px', fontSize: '12px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
      <p>This email was sent from your contact form</p>
    </div>
  </div>
);