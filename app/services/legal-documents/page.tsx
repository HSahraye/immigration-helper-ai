"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LegalDocumentsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    documentType: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Format email content
      const emailContent = `
        Legal Document Request:
        
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Document Type: ${formData.documentType}
        
        Message:
        ${formData.message}
      `;
      
      // Send the email using our API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'sahrayehamid@gmail.com',
          subject: `Legal Document Request from ${formData.name}`,
          content: emailContent,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send your request');
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        documentType: '',
        message: '',
      });
      
      // Reset submission status after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setIsSubmitting(false);
      setError((err as Error).message || 'There was an error submitting your request. Please try again later.');
    }
  };
  
  return (
    <main style={{
      display: 'block',
      width: '100%',
      maxWidth: '100%',
      backgroundColor: '#000000',
      color: '#ffffff',
      overflowY: 'auto',
      overflowX: 'hidden',
      height: 'auto',
      minHeight: '100vh',
      padding: '2rem 1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingBottom: '4rem',
        }}
      >
        <header style={{
          textAlign: 'center',
          marginBottom: '4rem',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}>Legal Documents</h1>
          <p style={{
            fontSize: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            Our legal team provides comprehensive documentation services to protect your rights and interests in the United States.
          </p>
        </header>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
            }}>Our Legal Services</h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}>Contracts & Agreements</h3>
                <p style={{
                  color: '#d1d5db',
                }}>
                  Professional drafting of contracts, business agreements, leases, and other legal documents tailored to your specific needs.
                </p>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}>Estate Planning</h3>
                <p style={{
                  color: '#d1d5db',
                }}>
                  Comprehensive estate planning documents including wills, trusts, power of attorney, and healthcare directives.
                </p>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}>Legal Review</h3>
                <p style={{
                  color: '#d1d5db',
                }}>
                  Expert review of existing legal documents to ensure they meet your needs and comply with current laws and regulations.
                </p>
              </div>
            </div>
            
            <div style={{
              marginTop: '2rem',
            }}>
              <Link 
                href="/resources"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Browse Resources
              </Link>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
            }}>Contact Us</h2>
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 0',
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                }}>✓</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                }}>Thank you!</h3>
                <p style={{
                  fontSize: '1.125rem',
                }}>Your request has been sent to sahrayehamid@gmail.com. One of our legal specialists will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}>
                {error && (
                  <div style={{
                    backgroundColor: 'rgba(185, 28, 28, 0.5)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                  }}>
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                  }}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                  }}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                  }}>Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div>
                  <label htmlFor="documentType" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                  }}>Document Type</label>
                  <select
                    id="documentType"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  >
                    <option value="" disabled>Select document type</option>
                    <option value="contract">Contract/Agreement</option>
                    <option value="estatePlanning">Estate Planning</option>
                    <option value="legalReview">Legal Review</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                  }}>Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                    placeholder="Tell us about your specific legal document needs..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Request Assistance'}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}>Need Urgent Assistance?</h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '1.5rem',
          }}>Our legal experts are ready to help you immediately.</p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <a 
              href="tel:5551234567" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (555) 123-4567
            </a>
            <a 
              href="mailto:sahrayehamid@gmail.com" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid #ffffff',
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 