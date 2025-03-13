import React, { useState, useEffect } from 'react';
import PropertyForm from './Form';
import styles from './AdminPanel.module.css';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [pendingProperties, setPendingProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [viewCountProperties, setViewCountProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // Used to force re-render the form

  // Fetch properties when the component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  // Centralized fetch properties function
  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Use the dedicated endpoint for pending properties
      const pendingResponse = await axios.get('https://knightsfinestates-backend-1.onrender.com/api/pending');
      const approvedResponse = await axios.get('https://knightsfinestates-backend-1.onrender.com/api/all');
      
      // Filter approved properties from all properties
      const approved = approvedResponse.data.filter(prop => prop.status === 'approved');
      
      setPendingProperties(pendingResponse.data);
      setApprovedProperties(approved);
      
      // Fetch properties with view counts
      const viewCountResponse = await axios.get('https://knightsfinestates-backend-1.onrender.com/api/view-count');
      setViewCountProperties(viewCountResponse.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve property
  const handleApprove = async (id) => {
    try {
      await axios.put(`https://knightsfinestates-backend-1.onrender.com/api/approve/${id}`);
      // Refresh properties list
      fetchProperties();
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  // Handle delete property
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`https://knightsfinestates-backend-1.onrender.com/api/${id}`);
        // Refresh properties list
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  // Handle edit property - fetch the full property details
  const handleEdit = async (property) => {
    try {
      setLoading(true);
      // Fetch the complete property details to ensure we have all fields
      const response = await axios.get(`https://knightsfinestates-backend-1.onrender.com/api/properties/${property._id}`);
      setSelectedProperty(response.data);
      setActiveTab('create');
      setFormKey(prevKey => prevKey + 1); // Force form re-render with new data
    } catch (error) {
      console.error('Error fetching property details for edit:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle update property
  const handleUpdateProperty = async (updatedData) => {
    try {
      setLoading(true);
      await axios.put(`https://knightsfinestates-backend-1.onrender.com/api/${selectedProperty._id}`, updatedData);
      setSelectedProperty(null);
      fetchProperties();
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleSubStatusUpdate = async (propertyId, newSubStatus) => {
    try {
      await axios.patch(`https://knightsfinestates-backend-1.onrender.com/api/${propertyId}/sub-status`, {
        subStatus: newSubStatus
      });
      fetchProperties();
    } catch (error) {
      console.error('Error updating sub-status:', error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setSelectedProperty(null);
  };

  return (
    <div className={styles.adminPanel}>
      <h1 className={styles.heading}>Admin Panel</h1>
      
      <div className={styles.tabContainer}>
        <button 
          className={activeTab === 'create' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('create');
            setSelectedProperty(null);
          }}
        >
          {selectedProperty ? 'Edit Property' : 'Create Property'}
        </button>
        <button 
          className={activeTab === 'pending' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('pending');
            setSelectedProperty(null);
          }}
        >
          Pending Properties
        </button>
        <button 
          className={activeTab === 'approved' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('approved');
            setSelectedProperty(null);
          }}
        >
          Approved Properties
        </button>
        <button 
          className={activeTab === 'view-count' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('view-count');
            setSelectedProperty(null);
          }}
        >
          View Count
        </button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {activeTab === 'create' && (
        <div className={styles.tabContent}>
          {selectedProperty ? (
            <div>
              <div className={styles.editHeader}>
                <h2 className={styles.sectionHeading}>Edit Property: {selectedProperty.buildingName}</h2>
                <button 
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              </div>
              <PropertyForm 
                key={formKey} // Force re-render when property changes
                initialValues={selectedProperty}
                isEditing={true}
                onSuccess={(formData) => {
                  handleUpdateProperty(formData);
                }}
              />
            </div>
          ) : (
            <div>
              <h2 className={styles.sectionHeading}>Create New Property</h2>
              <PropertyForm 
                onSuccess={() => {
                  // Refresh properties list after creating
                  fetchProperties();
                }}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className={styles.tabContent}>
          <h2 className={styles.sectionHeading}>Pending Properties</h2>
          {pendingProperties.length === 0 ? (
            <p className={styles.noProperties}>No pending properties found.</p>
          ) : (
            <table className={styles.propertiesTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>Developer</th>
                  <th>Building</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProperties.map(property => (
                  <tr key={property._id} className={styles.tableRow}>
                    <td>{property._id}</td>
                    <td>{property.developer}</td>
                    <td>{property.buildingName}</td>
                    <td>{property.location}</td>
                    <td>${property.price}</td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.approveButton}
                        onClick={() => handleApprove(property._id)}
                      >
                        Approve
                      </button>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(property)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(property._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className={styles.tabContent}>
          <h2 className={styles.sectionHeading}>Approved Properties</h2>
          {approvedProperties.length === 0 ? (
            <p className={styles.noProperties}>No approved properties found.</p>
          ) : (
            <table className={styles.propertiesTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>Developer</th>
                  <th>Building</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedProperties.map(property => (
                  <tr key={property._id} className={styles.tableRow}>
                    <td>{property._id}</td>
                    <td>{property.developer}</td>
                    <td>{property.buildingName}</td>
                    <td>{property.location}</td>
                    <td>${property.price}</td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(property)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(property._id)}
                      >
                        Delete
                      </button>
                      <button
  className={`styles.statusbutton ${property.subStatus === 'sold' ? 'active' : ''}`}
  onClick={() => handleSubStatusUpdate(property._id, 'sold')}
>
  Sold
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'view-count' && (
        <div className={styles.tabContent}>
          <h2 className={styles.sectionHeading}>Property View Counts</h2>
          {viewCountProperties.length === 0 ? (
            <p className={styles.noProperties}>No view count data available.</p>
          ) : (
            <table className={styles.propertiesTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>Building Name</th>
                  <th>Location</th>
                  <th>View Count</th>
                </tr>
              </thead>
              <tbody>
                {viewCountProperties.map(property => (
                  <tr key={property._id} className={styles.tableRow}>
                    <td>{property._id}</td>
                    <td>{property.buildingName}</td>
                    <td>{property.location}</td>
                    <td>{property.viewCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;