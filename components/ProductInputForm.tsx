'use client';

// CORE PHASE: Product input collection with ideal customer description

import { useState } from 'react';

interface ProductInfo {
  productName: string;
  productDescription: string;
  keyFeatures: string;
  idealCustomerDescription: string; // NEW: User's description of ideal customer
  businessModel: string;
  customerCount: string;
  distinguishingFeature: string;
}

interface ProductInputFormProps {
  onSubmit: (productInfo: ProductInfo) => void;
}

export default function ProductInputForm({ onSubmit }: ProductInputFormProps) {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    productName: '',
    productDescription: '',
    keyFeatures: '',
    idealCustomerDescription: '', // NEW field
    businessModel: '',
    customerCount: '',
    distinguishingFeature: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productInfo.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    
    if (!productInfo.businessModel.trim()) {
      newErrors.businessModel = 'Business model is required';
    }
    
    if (!productInfo.productDescription.trim()) {
      newErrors.productDescription = 'Product description is required';
    }
    
    if (!productInfo.idealCustomerDescription.trim()) {
      newErrors.idealCustomerDescription = 'Please describe your ideal customer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(productInfo);
    }
  };
  
  const handleInputChange = (field: keyof ProductInfo, value: string) => {
    setProductInfo(prev => ({ ...prev, [field]: value }));
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
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <div className="glass-card" style={{ padding: 'var(--spacing-4xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4xl)' }}>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Tell Us About Your Product
            </h1>
            <p style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)'
            }}>
              We&apos;ll use this information to generate personalized insights and recommendations.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>
            {/* Product Name */}
            <div>
              <label htmlFor="productName" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                value={productInfo.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.productName ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="e.g., AI Sales Assistant, CRM Platform"
              />
              {errors.productName && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.productName}</p>
              )}
            </div>
            
            {/* Business Model */}
            <div>
              <label htmlFor="businessModel" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Business Model *
              </label>
              <select
                id="businessModel"
                value={productInfo.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.businessModel ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="">Select business model...</option>
                <option value="B2B Subscription">B2B (Subscription)</option>
                <option value="B2B One-time">B2B (One-time Purchase)</option>
              </select>
              {errors.businessModel && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.businessModel}</p>
              )}
            </div>
            
            {/* Product Description */}
            <div>
              <label htmlFor="productDescription" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Product Description *
              </label>
              <textarea
                id="productDescription"
                value={productInfo.productDescription}
                onChange={(e) => handleInputChange('productDescription', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.productDescription ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Describe what your product does and the problem it solves..."
              />
              {errors.productDescription && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.productDescription}</p>
              )}
            </div>
            
            {/* Key Features */}
            <div>
              <label htmlFor="keyFeatures" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Key Features (Optional)
              </label>
              <textarea
                id="keyFeatures"
                value={productInfo.keyFeatures}
                onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="List main features or capabilities..."
              />
            </div>
            
            {/* Ideal Customer Description */}
            <div>
              <label htmlFor="idealCustomerDescription" style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Describe Your Ideal Customer or Target Buyer *
              </label>
              <textarea
                id="idealCustomerDescription"
                value={productInfo.idealCustomerDescription}
                onChange={(e) => handleInputChange('idealCustomerDescription', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: `2px solid ${errors.idealCustomerDescription ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '120px',
                  resize: 'vertical'
                }}
                placeholder="Who is your ideal customer? What are their characteristics, pain points, and goals? Be as specific as possible..."
              />
              {errors.idealCustomerDescription && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>{errors.idealCustomerDescription}</p>
              )}
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-xs)',
                marginTop: 'var(--spacing-xs)',
                fontStyle: 'italic'
              }}>
                💡 We&apos;ll compare your description with AI-generated insights to identify buyer understanding gaps
              </p>
            </div>
            
            {/* Submit Button */}
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
              Next: Begin Assessment →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}