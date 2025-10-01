'use client';

// ESSENTIAL PHASE: User info collection for personalization

import { useState } from 'react';

interface UserInfo {
  name: string;
  email: string;
  company: string;
  role?: string;
}

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  onSkip: () => void;
}

export default function UserInfoForm({ onSubmit, onSkip }: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!userInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!userInfo.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(userInfo);
    }
  };
  
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%)',
      padding: 'var(--spacing-5xl) var(--spacing-2xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div className="glass-card" style={{ padding: 'var(--spacing-4xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4xl)' }}>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Almost There! 
            </h1>
            <p style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)'
            }}>
              Help us personalize your results and connect you to the right tools.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>
            <div>
              <label htmlFor="name" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={userInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.name ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="Enter your full name"
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--color-primary-alpha)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = errors.name ? 'var(--color-error)' : 'var(--color-border)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.name && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.email ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="Enter your email address"
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--color-primary-alpha)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = errors.email ? 'var(--color-error)' : 'var(--color-border)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.email && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="company" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                value={userInfo.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.company ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="Enter your company name"
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--color-primary-alpha)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = errors.company ? 'var(--color-error)' : 'var(--color-border)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.company && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.company}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="role" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Role/Title (Optional)
              </label>
              <input
                type="text"
                id="role"
                value={userInfo.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="e.g., CTO, Founder, VP Engineering"
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--color-primary-alpha)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  padding: 'var(--spacing-lg) var(--spacing-xl)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-primary)';
                }}
              >
                Get My Personalized Results →
              </button>
              
              <button
                type="button"
                onClick={onSkip}
                style={{
                  width: '100%',
                  color: 'var(--color-text-secondary)',
                  padding: 'var(--spacing-sm) 0',
                  background: 'none',
                  border: 'none',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                }}
              >
                Skip for now - just show results
              </button>
            </div>
          </form>
          
          <div style={{ 
            marginTop: 'var(--spacing-3xl)', 
            paddingTop: 'var(--spacing-3xl)', 
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-secondary)'
            }}>
              <svg style={{ 
                width: '16px', 
                height: '16px', 
                marginRight: 'var(--spacing-sm)' 
              }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your information is secure and will never be shared
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}