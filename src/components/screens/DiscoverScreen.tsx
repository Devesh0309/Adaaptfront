import React, { useState, useEffect } from 'react';

interface DiscoverScreenProps {}

export function DiscoverScreen({}: DiscoverScreenProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'sources'>('news');

  // Local styles scoped to this component only - completely redesigned
  const localStyles = {
    // Main container - clean and minimal
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 24px',
      minHeight: '100vh'
    },

    // Header section - minimal and cleana
    header: {
      textAlign: 'center' as const,
      marginBottom: '48px'
    },

    headerTitle: {
      fontSize: '42px',
      fontWeight: '700',
      color: 'var(--text-strong)',
      marginBottom: '0',
      letterSpacing: '-0.03em',
      lineHeight: '1.1'
    },

    // Minimal tab system - centered
    tabContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      marginBottom: '40px'
    },

    tabList: {
      display: 'flex',
      background: 'transparent',
      borderRadius: '0',
      padding: '0',
      border: 'none',
      marginBottom: '32px',
      gap: '0'
    },

    tab: {
      padding: '16px 32px',
      borderRadius: '0',
      border: 'none',
      background: 'transparent',
      color: 'var(--text-muted)',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      position: 'relative' as const,
      borderBottom: '2px solid transparent'
    },

    tabActive: {
      color: 'var(--text-strong)',
      fontWeight: '600',
      borderBottom: '2px solid #6C63FF'
    },

    // Active section with soft violet background
    activeSection: {
      background: 'rgba(108, 99, 255, 0.03)', // Very subtle violet background
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(108, 99, 255, 0.06)',
      position: 'relative' as const
    },

    // Clean grid layout
    grid: {
      display: 'grid',
      gap: '24px'
    },

    newsGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
    },

    sourcesGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    },

    // Clean professional news cards with glass borders
    newsCard: {
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255, 255, 255, 0.35)',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 200ms ease',
      cursor: 'pointer',
      position: 'relative' as const,
      boxShadow: '0 3px 16px rgba(15, 23, 42, 0.06)'
    },

    newsCardTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: 'var(--text-strong)',
      marginBottom: '12px',
      lineHeight: '1.4'
    },

    newsCardDescription: {
      fontSize: '15px',
      color: 'var(--text-body)',
      lineHeight: '1.5',
      marginBottom: '20px'
    },

    newsCardActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      position: 'absolute' as const,
      top: '20px',
      right: '20px'
    },

    actionButton: {
      padding: '4px 8px',
      border: '1px solid rgba(16, 17, 20, 0.10)',
      borderRadius: '6px',
      background: 'rgba(255, 255, 255, 0.8)',
      color: 'var(--text-muted)',
      fontSize: '11px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      display: 'flex',
      alignItems: 'center',
      gap: '2px'
    },

    // Clean data source tiles with glass borders
    sourceCard: {
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255, 255, 255, 0.35)',
      borderRadius: '16px',
      padding: '28px 24px',
      transition: 'all 200ms ease',
      cursor: 'pointer',
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      textAlign: 'center' as const,
      boxShadow: '0 3px 16px rgba(15, 23, 42, 0.06)',
      minHeight: '160px',
      justifyContent: 'center'
    },

    sourceIcon: {
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(90, 87, 214, 0.08) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      fontSize: '22px',
      border: '1px solid rgba(108, 99, 255, 0.10)'
    },

    sourceName: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--text-strong)',
      marginBottom: '16px'
    },

    connectButton: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, var(--brand-accent) 0%, #6A66FF 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      boxShadow: '0 2px 8px rgba(52, 48, 190, 0.15)'
    },

    // Bottom note styling
    bottomNote: {
      marginTop: '32px',
      textAlign: 'center' as const,
      fontSize: '14px',
      color: 'var(--text-muted)',
      fontStyle: 'italic',
      padding: '16px',
      background: 'rgba(108, 99, 255, 0.04)',
      borderRadius: '12px',
      border: '1px solid rgba(108, 99, 255, 0.08)'
    }
  };

  // Professional industry news data
  const newsItems = [
    {
      id: 1,
      title: "Competitor launches AI-powered analytics platform",
      description: "TechCorp unveiled their new machine learning suite targeting enterprise customers, focusing on predictive analytics and automated insights generation."
    },
    {
      id: 2,
      title: "Market trend: 67% increase in data integration demand",
      description: "Industry report shows significant growth in organizations seeking unified data solutions, driven by remote work and digital transformation initiatives."
    },
    {
      id: 3,
      title: "New compliance regulations affect data processing",
      description: "Updated privacy laws in major markets require enhanced data governance protocols, impacting how businesses handle customer information."
    },
    {
      id: 4,
      title: "Cloud adoption accelerates in financial services",
      description: "Banking sector shows 45% year-over-year growth in cloud-based analytics adoption, prioritizing real-time fraud detection capabilities."
    },
    {
      id: 5,
      title: "Investment surge in business intelligence startups",
      description: "Venture funding for BI and analytics companies reaches record high, with $2.3B invested across 47 deals in the last quarter."
    },
    {
      id: 6,
      title: "API-first approach gains momentum in enterprise",
      description: "Companies increasingly prioritize API-driven architectures for data integration, enabling more flexible and scalable analytics workflows."
    }
  ];

  // Clean data sources
  const dataSources = [
    { id: 1, name: "Salesforce", icon: "🔗", description: "CRM Platform" },
    { id: 2, name: "NetSuite", icon: "💼", description: "ERP System" },
    { id: 3, name: "Amazon S3", icon: "☁️", description: "Cloud Storage" },
    { id: 4, name: "PostgreSQL", icon: "🗄️", description: "Database" },
    { id: 5, name: "Stripe", icon: "💳", description: "Payments" },
    { id: 6, name: "HubSpot", icon: "🎯", description: "Marketing" }
  ];

  // Hover handlers with subtle effects
  const handleNewsCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 23, 42, 0.08)';
  };

  const handleNewsCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 3px 16px rgba(15, 23, 42, 0.06)';
  };

  const handleSourceCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 23, 42, 0.08)';
  };

  const handleSourceCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 3px 16px rgba(15, 23, 42, 0.06)';
  };

  const handleActionHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(108, 99, 255, 0.06)';
    e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.12)';
    e.currentTarget.style.color = 'var(--text-strong)';
  };

  const handleActionLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
    e.currentTarget.style.borderColor = 'rgba(16, 17, 20, 0.10)';
    e.currentTarget.style.color = 'var(--text-muted)';
  };

  const handleConnectHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(52, 48, 190, 0.25)';
  };

  const handleConnectLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 48, 190, 0.15)';
  };

  // Mobile responsive CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .discover-container-redesign {
          padding: 32px 16px !important;
        }
        
        .discover-header-title-redesign {
          font-size: 36px !important;
        }
        
        .discover-tab-redesign {
          padding: 12px 24px !important;
          font-size: 15px !important;
        }
        
        .discover-active-section-redesign {
          padding: 24px 16px !important;
          border-radius: 16px !important;
        }
        
        .discover-news-grid-redesign {
          grid-template-columns: 1fr !important;
        }
        
        .discover-sources-grid-redesign {
          grid-template-columns: 1fr !important;
        }
        
        .discover-news-card-redesign {
          padding: 20px !important;
        }
        
        .discover-actions-redesign {
          position: static !important;
          margin-top: 16px !important;
          justify-content: flex-start !important;
        }
      }
      
      @media (max-width: 480px) {
        .discover-container-redesign {
          padding: 24px 12px !important;
        }
        
        .discover-header-title-redesign {
          font-size: 32px !important;
        }
        
        .discover-active-section-redesign {
          padding: 20px 12px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={localStyles.container} className="discover-container-redesign">
      {/* Clean Header */}
      <div style={localStyles.header}>
        <h1 style={localStyles.headerTitle} className="discover-header-title-redesign">
          Discover
        </h1>
      </div>

      {/* Minimal Centered Tabs */}
      <div style={localStyles.tabContainer}>
        <div style={localStyles.tabList}>
          <button
            style={{
              ...localStyles.tab,
              ...(activeTab === 'news' ? localStyles.tabActive : {})
            }}
            className="discover-tab-redesign"
            onClick={() => setActiveTab('news')}
          >
            Industry News
          </button>
          <button
            style={{
              ...localStyles.tab,
              ...(activeTab === 'sources' ? localStyles.tabActive : {})
            }}
            className="discover-tab-redesign"
            onClick={() => setActiveTab('sources')}
          >
            Data Sources
          </button>
        </div>

        {/* Active Section with Violet Background */}
        <div style={localStyles.activeSection} className="discover-active-section-redesign">
          {activeTab === 'news' && (
            <div>
              <div 
                style={{
                  ...localStyles.grid,
                  ...localStyles.newsGrid
                }}
                className="discover-news-grid-redesign"
              >
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    style={localStyles.newsCard}
                    className="discover-news-card-redesign"
                    onMouseEnter={handleNewsCardHover}
                    onMouseLeave={handleNewsCardLeave}
                  >
                    <div style={localStyles.newsCardActions} className="discover-actions-redesign">
                      <button
                        style={localStyles.actionButton}
                        onMouseEnter={handleActionHover}
                        onMouseLeave={handleActionLeave}
                      >
                        Mute ▾
                      </button>
                      <button
                        style={localStyles.actionButton}
                        onMouseEnter={handleActionHover}
                        onMouseLeave={handleActionLeave}
                      >
                        Why this?
                      </button>
                    </div>
                    <h3 style={localStyles.newsCardTitle}>{item.title}</h3>
                    <p style={localStyles.newsCardDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div>
              <div 
                style={{
                  ...localStyles.grid,
                  ...localStyles.sourcesGrid
                }}
                className="discover-sources-grid-redesign"
              >
                {dataSources.map((source) => (
                  <div
                    key={source.id}
                    style={localStyles.sourceCard}
                    onMouseEnter={handleSourceCardHover}
                    onMouseLeave={handleSourceCardLeave}
                  >
                    <div style={localStyles.sourceIcon}>
                      {source.icon}
                    </div>
                    <h3 style={localStyles.sourceName}>{source.name}</h3>
                    <button
                      style={localStyles.connectButton}
                      onMouseEnter={handleConnectHover}
                      onMouseLeave={handleConnectLeave}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
              
              <div style={localStyles.bottomNote}>
                Only connectors you are allowed to add are shown
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}