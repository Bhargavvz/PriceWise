import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';
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
      const response = await listService.createList(newListName);
      if (response.success) {
        toast.success('List created successfully');
        setNewListName('');
        setShowCreateModal(false);
        loadLists();
      }
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  const handleDeleteList = async (id) => {
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
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>My Shopping Lists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Create List
        </button>
      </div>

      {lists.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {lists.map(list => (
            <div
              key={list.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{list.name}</h3>
                {list.description && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {list.description}
                  </p>
                )}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(list.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '0.5rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No shopping lists yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Create your first shopping list to get started
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Create Your First List
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }} onClick={() => setShowCreateModal(false)}>
          <div
            className="card"
            style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1.5rem' }}>Create New List</h3>
            <form onSubmit={handleCreateList}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input"
                  placeholder="e.g., Weekly Groceries"
                  autoFocus
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
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
