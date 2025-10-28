import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, ShoppingCart, Calendar, CheckCircle2, Circle, Sparkles, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { listService } from '../services';
import { useToast } from '../contexts/ToastContext';

const ShoppingListsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const response = await listService.getLists();
      if (response.success) {
        setLists(response.data);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
      toast.error('Failed to load shopping lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await listService.createList(newListName, newListDescription);
      if (response.success) {
        toast.success('List created successfully!');
        setNewListName('');
        setNewListDescription('');
        setShowCreateModal(false);
        loadLists();
      }
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  const handleDeleteList = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this list?')) return;

    try {
      await listService.deleteList(id);
      toast.success('List deleted successfully');
      loadLists();
    } catch (error) {
      toast.error('Failed to delete list');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        padding: 'var(--space-12) 0 var(--space-16)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'fadeIn 1s ease-out'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fadeInDown" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-4)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <ShoppingCart size={16} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>My Shopping Lists</span>
          </div>

          <h1 className="animate-fadeInUp" style={{
            fontSize: 'var(--text-6xl)',
            fontWeight: 'extrabold',
            color: 'white',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Organize Your
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Shopping Lists
            </span>
          </h1>

          <p className="animate-fadeInUp" style={{
            fontSize: 'var(--text-xl)',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: 'var(--space-8)',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Create, manage, and optimize your grocery shopping with our smart list builder.
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary animate-fadeInUp"
            style={{
              height: '3.5rem',
              padding: '0 var(--space-8)',
              fontSize: 'var(--text-lg)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Plus size={24} />
            Create New List
          </button>

          {/* Stats Row */}
          {lists.length > 0 && (
            <div className="animate-fadeInUp" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-8)',
              maxWidth: '600px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.8)', marginBottom: 'var(--space-1)' }}>
                  Total Lists
                </p>
                <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'white' }}>
                  {lists.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        {lists.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {lists.map((list, index) => (
              <div
                key={list.id}
                className="card hover-lift animate-fadeInUp"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`,
                  transition: 'all var(--transition-base)'
                }}
                onClick={() => navigate(`/lists/${list.id}`)}
              >
                {/* Top Gradient Bar */}
                <div style={{
                  height: '6px',
                  background: `linear-gradient(135deg, ${
                    index % 4 === 0 ? '#10b981, #059669' :
                    index % 4 === 1 ? '#3b82f6, #2563eb' :
                    index % 4 === 2 ? '#f59e0b, #d97706' :
                    '#8b5cf6, #6d28d9'
                  })`,
                  marginBottom: 'var(--space-4)'
                }} />

                {/* List Icon */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-xl)',
                  background: `linear-gradient(135deg, ${
                    index % 4 === 0 ? 'rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.15)' :
                    index % 4 === 1 ? 'rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.15)' :
                    index % 4 === 2 ? 'rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.15)' :
                    'rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.15)'
                  })`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                  boxShadow: `0 4px 12px ${
                    index % 4 === 0 ? 'rgba(16, 185, 129, 0.2)' :
                    index % 4 === 1 ? 'rgba(59, 130, 246, 0.2)' :
                    index % 4 === 2 ? 'rgba(245, 158, 11, 0.2)' :
                    'rgba(139, 92, 246, 0.2)'
                  }`
                }}>
                  <ShoppingCart size={32} color={
                    index % 4 === 0 ? '#10b981' :
                    index % 4 === 1 ? '#3b82f6' :
                    index % 4 === 2 ? '#f59e0b' :
                    '#8b5cf6'
                  } />
                </div>

                {/* List Content */}
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-primary)'
                }}>
                  {list.name}
                </h3>

                {list.description && (
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-4)',
                    lineHeight: '1.5'
                  }}>
                    {list.description}
                  </p>
                )}

                {/* List Stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-4)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Calendar size={14} color="var(--text-tertiary)" />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      {new Date(list.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  marginTop: 'var(--space-4)'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lists/${list.id}`);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: 'var(--text-sm)' }}
                  >
                    View List
                  </button>
                  <button
                    onClick={(e) => handleDeleteList(list.id, e)}
                    className="btn btn-secondary"
                    style={{
                      padding: 'var(--space-3)',
                      color: 'var(--danger)'
                    }}
                    title="Delete list"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card animate-fadeIn" style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(109, 40, 217, 0.1) 100%)',
            border: '2px dashed var(--border)'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.15) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)'
            }}>
              <ShoppingCart size={48} color="#8b5cf6" />
            </div>
            <h3 style={{
              fontSize: 'var(--text-2xl)',
              marginBottom: 'var(--space-2)'
            }}>
              No Shopping Lists Yet
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              maxWidth: '400px',
              margin: '0 auto var(--space-6)'
            }}>
              Create your first shopping list to start organizing your grocery shopping and finding the best prices.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
              style={{
                height: '3rem',
                padding: '0 var(--space-8)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
              }}
            >
              <Plus size={20} />
              Create Your First List
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 'var(--space-4)'
          }}
        >
          <div
            className="card animate-fadeIn"
            style={{
              width: '100%',
              maxWidth: '500px',
              transform: showCreateModal ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform var(--transition-base)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                  <Sparkles size={24} color="white" />
                </div>
                <h3 style={{ fontSize: 'var(--text-2xl)' }}>Create New List</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateList}>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontWeight: '600',
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)'
                }}>
                  List Name *
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input"
                  placeholder="e.g., Weekly Groceries, Party Shopping"
                  autoFocus
                  required
                  style={{
                    height: '3rem',
                    fontSize: 'var(--text-lg)'
                  }}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontWeight: '600',
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)'
                }}>
                  Description (Optional)
                </label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="input"
                  placeholder="Add a description for your list..."
                  rows="3"
                  style={{
                    resize: 'vertical',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    height: '3rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <Plus size={20} />
                  Create List
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, height: '3rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsPage;
