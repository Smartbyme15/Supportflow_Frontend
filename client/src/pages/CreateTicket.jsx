import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  X, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  FileText,
  Tag,
  Flag,
  Image
} from 'lucide-react';
import './CreateTicket.css';

const CreateTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
  });
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const categories = ['Billing', 'Technical', 'Account', 'Order', 'Delivery', 'Refund', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < selectedFiles.length) {
      alert('Some files exceed 5MB limit');
    }
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description) {
      setError('Subject and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/tickets', formData);
      const ticket = response.data.ticket;
      
      setTicketNumber(ticket.ticketNumber);
      setTicketCreated(true);
      
      if (ticket.aiSuggestion && !ticket.aiSuggestion.error) {
        setAiPreview(ticket.aiSuggestion);
      }
      
      setTimeout(() => {
        navigate(`/customer/tickets/${ticket._id}`);
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket');
      alert('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  if (ticketCreated) {
    return (
      <div className="create-ticket-container">
        <div className="ticket-success">
          <div className="success-icon">
            <CheckCircle size={64} color="#48bb78" />
          </div>
          <h2>🎉 Ticket Created!</h2>
          <p className="ticket-number-display">Ticket #: <strong>{ticketNumber}</strong></p>
          
          {aiPreview && (
            <div className="ai-preview-success">
              <div className="ai-preview-header">
                <Sparkles size={18} />
                <span>AI Analysis</span>
              </div>
              <div className="ai-preview-grid">
                <div>
                  <label>Category</label>
                  <span>{aiPreview.category}</span>
                </div>
                <div>
                  <label>Priority</label>
                  <span>{aiPreview.priority}</span>
                </div>
                <div className="full-width">
                  <label>Summary</label>
                  <span>{aiPreview.summary}</span>
                </div>
              </div>
            </div>
          )}
          
          <p className="redirect-note">Redirecting to ticket details...</p>
          <button 
            onClick={() => navigate('/customer/dashboard')} 
            className="btn-secondary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-header">
        <button onClick={() => navigate('/customer/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>Create New Ticket</h1>
        <p className="subtitle">Fill in the details below to submit your support request</p>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="create-ticket-grid">
        <div className="ticket-form-main">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section-header">
                <FileText size={18} />
                <h3>Subject</h3>
              </div>
              <p className="form-hint">Give a short, clear title for your issue</p>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Charged twice for my order"
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <FileText size={18} />
                <h3>Description</h3>
              </div>
              <p className="form-hint">Describe your issue in detail. What happened? When did it happen?</p>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                rows={6}
                required
                disabled={loading}
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-section half">
                <div className="form-section-header">
                  <Tag size={18} />
                  <h3>Category</h3>
                </div>
                <p className="form-hint">Select a category for your issue</p>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-section half">
                <div className="form-section-header">
                  <Flag size={18} />
                  <h3>Priority</h3>
                </div>
                <p className="form-hint">AI will analyze and suggest priority</p>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-select"
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <Image size={18} />
                <h3>Attachments (Optional)</h3>
              </div>
              <p className="form-hint">Screenshots, receipts, error logs (Max 5MB each)</p>
              
              <div className="file-upload-area">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                  accept=".jpg,.jpeg,.png,.pdf,.txt"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload size={24} />
                  <span>Drag & drop files here or click to browse</span>
                  <span className="file-types">JPG, PNG, PDF, TXT (Max 5MB)</span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="file-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                      <button type="button" onClick={() => removeFile(index)} className="file-remove">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Ticket...' : 'Create Ticket'}
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="ticket-form-sidebar">
          <div className="help-section">
            <h3>💡 Need Help?</h3>
            <p>We're here for you. Follow these tips for a better experience.</p>
          </div>

          <div className="tips-section">
            <h4>Before You Submit</h4>
            <ul>
              <li>
                <strong>Use a clear subject</strong>
                <span>Keep it short and specific.</span>
              </li>
              <li>
                <strong>Provide full details</strong>
                <span>Include steps, dates, and error messages.</span>
              </li>
              <li>
                <strong>Add screenshots</strong>
                <span>Helps us understand the issue faster.</span>
              </li>
              <li>
                <strong>Be patient</strong>
                <span>Our team will respond as soon as possible.</span>
              </li>
            </ul>
          </div>

          <div className="how-it-works">
            <h4>How It Works</h4>
            <div className="step">
              <span className="step-number">1</span>
              <div>
                <strong>You submit a ticket</strong>
                <span>Fill out the form with your issue.</span>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div>
                <strong>AI analyzes your issue</strong>
                <span>Suggests category, priority & summary.</span>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div>
                <strong>Agent reviews & responds</strong>
                <span>Our team looks into your issue.</span>
              </div>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <div>
                <strong>Issue resolved</strong>
                <span>You'll be notified when it's done.</span>
              </div>
            </div>
          </div>

          <div className="footer-note">
            © 2025 AssistFlow • All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;