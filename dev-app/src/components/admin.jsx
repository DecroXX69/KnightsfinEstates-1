import React, { useState, useEffect, useContext } from 'react';
import PropertyForm from './Form.jsx';
import styles from './AdminPanel.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [pendingProperties, setPendingProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [viewCountProperties, setViewCountProperties] = useState([]);
  const [contactUsQueries, setContactUsQueries] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { 
    isAuthenticated, 
    logout, 
    sessionExpiring, 
    timeRemaining, 
    extendSession 
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [approvedPage, setApprovedPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [viewCountPage, setViewCountPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchProperties();
    }
  }, [isAuthenticated, navigate]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const [pendingResponse, approvedResponse, viewCountResponse, contactUsResponse] = await Promise.all([
        axios.get('https://knightsfinestates-backend-1.onrender.com/api/pending', { withCredentials: true }),
        axios.get('https://knightsfinestates-backend-1.onrender.com/api/all', { withCredentials: true }),
        axios.get('https://knightsfinestates-backend-1.onrender.com/api/view-count', { withCredentials: true }),
        axios.get('https://knightsfinestates-backend-1.onrender.com/api/contactus', { withCredentials: true })
      ]);

      const approved = approvedResponse.data.filter(prop => prop.status === 'approved');
      const sortedQueries = contactUsResponse.data.data?.sort((b, a) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      ) || [];

      setPendingProperties(pendingResponse.data);
      setApprovedProperties(approved);
      setViewCountProperties(viewCountResponse.data);
      setContactUsQueries(sortedQueries);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`https://knightsfinestates-backend-1.onrender.com/api/approve/${id}`, {}, { withCredentials: true });
      fetchProperties();
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`https://knightsfinestates-backend-1.onrender.com/api/${id}`, { withCredentials: true });
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleEdit = async (property) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://knightsfinestates-backend-1.onrender.com/api/properties/${property._id}`, { withCredentials: true });
      setSelectedProperty(response.data);
      setActiveTab('create');
      setFormKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error fetching property details for edit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (updatedData) => {
    try {
      setLoading(true);
      await axios.put(`https://knightsfinestates-backend-1.onrender.com/api/${selectedProperty._id}`, updatedData, { withCredentials: true });
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
      await axios.patch(`https://knightsfinestates-backend-1.onrender.com/api/${propertyId}/sub-status`, 
        { subStatus: newSubStatus }, 
        { withCredentials: true }
      );
      fetchProperties();
    } catch (error) {
      console.error('Error updating sub-status:', error);
    }
  };

  const handleTrendUpdate = async (propertyId, newTrend) => {
    try {
      await axios.patch(`https://knightsfinestates-backend-1.onrender.com/api/${propertyId}/trend`, 
        { Trend: newTrend }, 
        { withCredentials: true }
      );
      fetchProperties();
    } catch (error) {
      console.error('Error updating trend:', error);
    }
  };

  const handleCancelEdit = () => {
    setSelectedProperty(null);
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  const exportToExcel = () => {
    const exportData = contactUsQueries.map(query => ({
      Date: new Date(query.createdAt).toLocaleDateString(),
      Time: new Date(query.createdAt).toLocaleTimeString(),
      Name: query.fullname,
      Email: query.email,
      Phone: query.phone,
      'Property Type': query.chooseProperty || 'Not specified',
      Profession: query.profession || 'Not specified',
      Message: query.message
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Queries');
    
    const colWidths = Object.keys(exportData[0]).map((key) => ({
      wch: Math.max(key.length, ...exportData.map(row => String(row[key]).length))
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `contact_queries_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const paginate = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (data) => Math.ceil(data.length / itemsPerPage);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Admin Panel</h1>
        <button className={styles.logoutButton} onClick={logout}>Logout</button>
      </div>

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
        <button 
          className={activeTab === 'contact-us' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('contact-us');
            setSelectedProperty(null);
          }}
        >
          Contact Us Queries
        </button>
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <span className={styles.spinner}></span>
        </div>
      )}

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
                key={formKey}
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
          <div className={styles.debugInfo}>
            <p><strong>Debug Info:</strong> {pendingProperties.length} properties loaded</p>
            <button 
              className={styles.editButton}
              onClick={() => fetchProperties()}
            >
              Refresh Data
            </button>
          </div>
          {pendingProperties.length === 0 ? (
            <p className={styles.noProperties}>No pending properties found.</p>
          ) : (
            <>
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
                  {paginate(pendingProperties, pendingPage).map(property => (
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
              <div className={styles.pagination}>
                <button
                  disabled={pendingPage === 1}
                  onClick={() => setPendingPage(prev => prev - 1)}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {pendingPage} of {getTotalPages(pendingProperties)}
                </span>
                <button
                  disabled={pendingPage === getTotalPages(pendingProperties)}
                  onClick={() => setPendingPage(prev => prev + 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className={styles.tabContent}>
          <h2 className={styles.sectionHeading}>Approved Properties</h2>
          <div className={styles.debugInfo}>
            <p><strong>Debug Info:</strong> {approvedProperties.length} properties loaded</p>
            <button 
              className={styles.editButton}
              onClick={() => fetchProperties()}
            >
              Refresh Data
            </button>
          </div>
          {approvedProperties.length === 0 ? (
            <p className={styles.noProperties}>No approved properties found.</p>
          ) : (
            <>
              <table className={styles.propertiesTable}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th>ID</th>
                    <th>Developer</th>
                    <th>Building</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Trend</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(approvedProperties, approvedPage).map(property => (
                    <tr key={property._id} className={styles.tableRow}>
                      <td>{property._id}</td>
                      <td>{property.developer}</td>
                      <td>{property.buildingName}</td>
                      <td>{property.location}</td>
                      <td>${property.price}</td>
                      <td>
                        <div className={styles.statusButtons}>
                          <button 
                            className={`${styles.statusButton} ${property.subStatus === 'sold' ? styles.statusActive : ''}`}
                            onClick={() => handleSubStatusUpdate(property._id, 'sold')}
                          >
                            Sold
                          </button>
                          <button 
                            className={`${styles.statusButton} ${property.subStatus === 'available' || !property.subStatus ? styles.statusActive : ''}`}
                            onClick={() => handleSubStatusUpdate(property._id, 'available')}
                          >
                            Available
                          </button>
                          <button 
                            className={`${styles.statusButton} ${property.subStatus === 'Under Construction' ? styles.statusActive : ''}`}
                            onClick={() => handleSubStatusUpdate(property._id, 'Under Construction')}
                          >
                            Under Construction
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className={styles.statusButtons}>
                          <button 
                            className={`${styles.statusButton} ${property.Trend === 'normal' || !property.Trend ? styles.statusActive : ''}`}
                            onClick={() => handleTrendUpdate(property._id, 'normal')}
                          >
                            Normal
                          </button>
                          <button 
                            className={`${styles.statusButton} ${property.Trend === 'Hot' ? styles.statusActive : ''}`}
                            onClick={() => handleTrendUpdate(property._id, 'Hot')}
                          >
                            Hot Deal
                          </button>
                        </div>
                      </td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.pagination}>
                <button
                  disabled={approvedPage === 1}
                  onClick={() => setApprovedPage(prev => prev - 1)}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {approvedPage} of {getTotalPages(approvedProperties)}
                </span>
                <button
                  disabled={approvedPage === getTotalPages(approvedProperties)}
                  onClick={() => setApprovedPage(prev => prev + 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'view-count' && (
        <div className={styles.tabContent}>
          <h2 className={styles.sectionHeading}>Property View Counts</h2>
          <div className={styles.debugInfo}>
            <p><strong>Debug Info:</strong> {viewCountProperties.length} properties loaded</p>
            <button 
              className={styles.editButton}
              onClick={() => fetchProperties()}
            >
              Refresh Data
            </button>
          </div>
          {viewCountProperties.length === 0 ? (
            <p className={styles.noProperties}>No view count data available.</p>
          ) : (
            <>
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
                  {paginate(viewCountProperties, viewCountPage).map(property => (
                    <tr key={property._id} className={styles.tableRow}>
                      <td>{property._id}</td>
                      <td>{property.buildingName}</td>
                      <td>{property.location}</td>
                      <td>{property.viewCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.pagination}>
                <button
                  disabled={viewCountPage === 1}
                  onClick={() => setViewCountPage(prev => prev - 1)}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {viewCountPage} of {getTotalPages(viewCountProperties)}
                </span>
                <button
                  disabled={viewCountPage === getTotalPages(viewCountProperties)}
                  onClick={() => setViewCountPage(prev => prev + 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'contact-us' && (
        <div className={styles.tabContent}>
          <h2 className={styles.sectionHeading}>Contact Us Queries</h2>
          <div className={styles.debugInfo}>
            <p><strong>Debug Info:</strong> {contactUsQueries.length} queries loaded</p>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.editButton}
                onClick={() => fetchProperties()}
              >
                Refresh Data
              </button>
              <button 
                className={styles.exportButton}
                onClick={exportToExcel}
              >
                Export to Excel
              </button>
            </div>
          </div>
          {contactUsQueries.length === 0 ? (
            <p className={styles.noProperties}>No contact queries found.</p>
          ) : (
            <>
              <table className={styles.propertiesTable}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Property Type</th>
                    <th>Profession</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(contactUsQueries, contactPage).map(query => (
                    <tr key={query._id} className={styles.tableRow}>
                      <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(query.createdAt).toLocaleTimeString()}</td>
                      <td>{query.fullname}</td>
                      <td>{query.email}</td>
                      <td>{query.phone}</td>
                      <td>{query.chooseProperty || 'Not specified'}</td>
                      <td>{query.profession || 'Not specified'}</td>
                      <td 
                        className={styles.messageCell}
                        onClick={() => handleMessageClick(query.message)}
                      >
                        {query.message.substring(0, 50) + (query.message.length > 50 ? '...' : '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.pagination}>
                <button
                  disabled={contactPage === 1}
                  onClick={() => setContactPage(prev => prev - 1)}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {contactPage} of {getTotalPages(contactUsQueries)}
                </span>
                <button
                  disabled={contactPage === getTotalPages(contactUsQueries)}
                  onClick={() => setContactPage(prev => prev + 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {sessionExpiring && (
        <div className={styles.sessionTimeout}>
          <div className={styles.timeoutContent}>
            <h3>Your session is about to expire</h3>
            <p>
              You will be logged out in {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
            <div className={styles.timeoutActions}>
              <button onClick={extendSession} className={styles.stayButton}>
                Stay Logged In
              </button>
              <button onClick={logout} className={styles.logoutButton}>
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className={styles.messageModal}>
          <div className={styles.messageModalContent}>
            <h3>Full Message</h3>
            <p>{selectedMessage}</p>
            <button 
              className={styles.closeButton}
              onClick={closeMessageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;