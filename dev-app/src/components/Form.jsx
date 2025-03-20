import React, { useState, useEffect, useContext } from 'react';
import styles from './PropertyForm.module.css';
import AuthContext from './AuthContext.jsx';
import axios from 'axios';
const PropertyForm = ({ initialValues, isEditing = false, onSuccess }) => {
  const { isAuthenticated, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    status: 'pending',
    developer: '',
    buildingName: '',
    price: '',
    location: '',
    area: '',
    type: 'sale',
    image: null,
    bedrooms: '',
    baths: '',
    propertyType: '',
    description: '',
    coordinates: { lat: 18.5590, lng: 73.7868 },
    locality: '',
    amenities: '',
    floorPlan: null,
    brochureURL: '',
    LegalDocURL: '',
    paymentPlan: { onBooking: '', duringConstruction: '', onHandover: '', postHandover: '' },
    slug: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    reraApproved: false,
    reraNumber: '',
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      const amenitiesString = Array.isArray(initialValues.amenities)
        ? initialValues.amenities.join(', ')
        : initialValues.amenities || '';
      const metaKeywordsString = Array.isArray(initialValues.metaKeywords)
        ? initialValues.metaKeywords.join(', ')
        : initialValues.metaKeywords || '';
      const imagesArray = Array.isArray(initialValues.images) ? initialValues.images : [];

      setFormData({
        ...initialValues,
        amenities: amenitiesString,
        metaKeywords: metaKeywordsString,
        image: null,
        imagePreviewUrl: initialValues.image,
        paymentPlan: {
          onBooking: initialValues.paymentPlan?.onBooking || '',
          duringConstruction: initialValues.paymentPlan?.duringConstruction || '',
          onHandover: initialValues.paymentPlan?.onHandover || '',
          postHandover: initialValues.paymentPlan?.postHandover || '',
        },
        coordinates: {
          lat: initialValues.coordinates?.lat || 25.276987,
          lng: initialValues.coordinates?.lng || 55.296249,
        },
        images: imagesArray,
      });

      setPreviewImages([
        ...(initialValues.image ? [initialValues.image] : []),
        ...imagesArray,
      ]);
      setFloorPlanPreview(initialValues.floorPlan || null);
    }
  }, [initialValues]);

  const cloudinaryUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Upload failed');
      return result.secure_url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: file, imagePreviewUrl: e.target.result });
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, floorPlan: file });
        setFloorPlanPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      setFormData({ ...formData, images: [...currentImages, ...files] });

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImages((prev) => [...prev, e.target.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleBuildingNameChange = (e) => {
    const buildingName = e.target.value;
    setFormData({
      ...formData,
      buildingName,
      slug: formData.slug === '' ? generateSlug(buildingName) : formData.slug,
    });
    setErrors({ ...errors, buildingName: buildingName ? '' : 'Building Name is required' });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      developer: 'Developer is required',
      buildingName: 'Building Name is required',
      price: 'Price is required',
      location: 'Location is required',
      area: 'Area is required',
      type: 'Type is required',
      bedrooms: 'Bedrooms is required',
      propertyType: 'Property Type is required',
      description: 'Description is required',
      locality: 'Locality is required',
      slug: 'Slug is required',
    };

    if (!isEditing || !formData.imagePreviewUrl) {
      requiredFields.image = 'Main Image is required';
    }

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] || (field === 'image' && !formData.image && !formData.imagePreviewUrl)) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      setIsLoading(true);
      setErrors({});
  
      let mainImageSecureUrl = formData.imagePreviewUrl || '';
      if (formData.image instanceof File) {
        mainImageSecureUrl = await cloudinaryUpload(formData.image);
      }
  
      const additionalImageUrls = [];
      for (const image of formData.images) {
        if (image instanceof File) {
          additionalImageUrls.push(await cloudinaryUpload(image));
        } else if (typeof image === 'string') {
          additionalImageUrls.push(image);
        }
      }
  
      let floorPlanUrl = formData.floorPlan;
      if (formData.floorPlan instanceof File) {
        floorPlanUrl = await cloudinaryUpload(formData.floorPlan);
      }
  
      const dataToSend = {
        status: formData.status,
        developer: formData.developer,
        buildingName: formData.buildingName,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        area: formData.area,
        type: formData.type,
        image: mainImageSecureUrl,
        bedrooms: formData.bedrooms,
        baths: formData.baths,
        propertyType: formData.propertyType,
        description: formData.description,
        coordinates: {
          lat: formData.coordinates.lat,
          lng: formData.coordinates.lng,
        },
        locality: formData.locality,
        amenities: formData.amenities ? formData.amenities.split(',').map((item) => item.trim()) : [],
        floorPlan: floorPlanUrl,
        brochureURL: formData.brochureURL,
        LegalDocURL: formData.LegalDocURL,
        paymentPlan: {
          onBooking: parseFloat(formData.paymentPlan.onBooking) || 0,
          duringConstruction: parseFloat(formData.paymentPlan.duringConstruction) || 0,
          onHandover: parseFloat(formData.paymentPlan.onHandover) || 0,
          postHandover: parseFloat(formData.paymentPlan.postHandover) || 0,
        },
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords
          ? formData.metaKeywords.split(',').map((item) => item.trim())
          : [],
        reraApproved: formData.reraApproved,
        reraNumber: formData.reraNumber,
        images: additionalImageUrls,
        updatedAt: new Date(),
      };
  
      if (isEditing && onSuccess) {
        onSuccess(dataToSend);
        return;
      }
  
      const response = await axios.post(
        'https://knightsfinestates-backend-1.onrender.com/api/properties',
        dataToSend,
        { withCredentials: true }
      );
  
      console.log('Backend Response:', response); // Debug log
  
      if (response.status !== 201) {
        throw new Error(response.data.error || 'Failed to create property');
      }
  
      alert('Property created successfully!');
      setFormData({
        status: 'pending',
        developer: '',
        buildingName: '',
        price: '',
        location: '',
        area: '',
        type: 'sale',
        image: null,
        bedrooms: '',
        baths: '',
        propertyType: '',
        description: '',
        coordinates: { lat: 18.5590, lng: 73.7868 },
        locality: '',
        amenities: '',
        floorPlan: null,
        brochureURL: '',
        LegalDocURL: '',
        paymentPlan: { onBooking: '', duringConstruction: '', onHandover: '', postHandover: '' },
        slug: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        reraApproved: false,
        reraNumber: '',
        images: [],
      });
      setPreviewImages([]);
      setFloorPlanPreview(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: `Failed to save property: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleRemoveMainImage = () => {
    setFormData({ ...formData, image: null, imagePreviewUrl: null });
    setErrors({ ...errors, image: 'Main Image is required' });
  };

  const handleRemoveFloorPlan = () => {
    setFormData({ ...formData, floorPlan: null });
    setFloorPlanPreview(null);
  };

  return (
    <div className={`${styles.container} ${styles.transitionAll}`}>
      <form className={`${styles.propertyForm} ${styles.shadowMd}`} onSubmit={handleFormSubmit}>
        <h2 className={styles.heading}>{isEditing ? 'Edit Property' : 'Add New Property'}</h2>
        {errors.submit && <div className={`${styles.errorMessage} ${styles.shadowSm}`}>{errors.submit}</div>}

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="developer">
            Developer:
          </label>
          <input
            className={`${styles.input} ${errors.developer ? styles.inputError : ''} ${styles.shadowSm}`}
            type="text"
            id="developer"
            value={formData.developer}
            onChange={(e) => {
              setFormData({ ...formData, developer: e.target.value });
              setErrors({ ...errors, developer: e.target.value ? '' : 'Developer is required' });
            }}
            placeholder="Enter developer name"
          />
          {errors.developer && <span className={styles.errorText}>{errors.developer}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="buildingName">
            Building Name:
          </label>
          <input
            className={`${styles.input} ${errors.buildingName ? styles.inputError : ''} ${styles.shadowSm}`}
            type="text"
            id="buildingName"
            value={formData.buildingName}
            onChange={handleBuildingNameChange}
            placeholder="Enter building name"
          />
          {errors.buildingName && <span className={styles.errorText}>{errors.buildingName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="slug">
            Slug (URL friendly name):
          </label>
          <input
            className={`${styles.input} ${errors.slug ? styles.inputError : ''} ${styles.shadowSm}`}
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => {
              setFormData({ ...formData, slug: e.target.value });
              setErrors({ ...errors, slug: e.target.value ? '' : 'Slug is required' });
            }}
            placeholder="Eg. luxury-villa-Pune"
          />
          {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
          <span className={styles.helpText}>Auto-generated from building name, but customizable</span>
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="price">
            Price (INR):
          </label>
          <input
            className={`${styles.input} ${errors.price ? styles.inputError : ''} ${styles.shadowSm}`}
            type="number"
            id="price"
            min="0"
            value={formData.price}
            onChange={(e) => {
              setFormData({ ...formData, price: e.target.value });
              setErrors({ ...errors, price: e.target.value ? '' : 'Price is required' });
            }}
            placeholder="Enter price"
          />
          {errors.price && <span className={styles.errorText}>{errors.price}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="location">
            Location (city):
          </label>
          <input
            className={`${styles.input} ${errors.location ? styles.inputError : ''} ${styles.shadowSm}`}
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              setErrors({ ...errors, location: e.target.value ? '' : 'Location is required' });
            }}
            placeholder="Eg. Pune"
          />
          {errors.location && <span className={styles.errorText}>{errors.location}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="locality">
            Locality:
          </label>
          <input
            className={`${styles.input} ${errors.locality ? styles.inputError : ''} ${styles.shadowSm}`}
            type="text"
            id="locality"
            value={formData.locality}
            onChange={(e) => {
              setFormData({ ...formData, locality: e.target.value });
              setErrors({ ...errors, locality: e.target.value ? '' : 'Locality is required' });
            }}
            placeholder="Eg. Baner"
          />
          {errors.locality && <span className={styles.errorText}>{errors.locality}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="area">
            Area (sq. ft):
          </label>
          <input
            className={`${styles.input} ${errors.area ? styles.inputError : ''} ${styles.shadowSm}`}
            type="text"
            id="area"
            value={formData.area}
            onChange={(e) => {
              setFormData({ ...formData, area: e.target.value });
              setErrors({ ...errors, area: e.target.value ? '' : 'Area is required' });
            }}
            placeholder="Eg. 1500"
          />
          {errors.area && <span className={styles.errorText}>{errors.area}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="type">
            Type:
          </label>
          <select
            className={`${styles.select} ${errors.type ? styles.inputError : ''} ${styles.shadowSm}`}
            id="type"
            value={formData.type}
            onChange={(e) => {
              setFormData({ ...formData, type: e.target.value });
              setErrors({ ...errors, type: e.target.value ? '' : 'Type is required' });
            }}
          >
            <option value="sale">Sale</option>
            <option value="offplan">Offplan</option>
          </select>
          {errors.type && <span className={styles.errorText}>{errors.type}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="image">
            Main Image:
          </label>
          {formData.imagePreviewUrl && (
            <div className={`${styles.imagePreviewItem} ${styles.shadowSm}`}>
              <img
                src={formData.imagePreviewUrl}
                alt="Main property"
                className={styles.roundedSm}
                onError={(e) => (e.target.style.display = 'none')}
              />
              <button
                type="button"
                className={`${styles.removeImageBtn} ${styles.shadowSm}`}
                onClick={handleRemoveMainImage}
              >
                ✕
              </button>
            </div>
          )}
          <input
            className={`${styles.input} ${errors.image ? styles.inputError : ''} ${styles.shadowSm}`}
            type="file"
            id="image"
            accept="image/*"
            onChange={handleMainImageUpload}
          />
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="floorPlan">
            Floor Plan Image:
          </label>
          {floorPlanPreview && (
            <div className={`${styles.imagePreviewItem} ${styles.shadowSm}`}>
              <img
                src={floorPlanPreview}
                alt="Floor plan"
                className={styles.roundedSm}
                onError={(e) => (e.target.style.display = 'none')}
              />
              <button
                type="button"
                className={`${styles.removeImageBtn} ${styles.shadowSm}`}
                onClick={handleRemoveFloorPlan}
              >
                ✕
              </button>
            </div>
          )}
          <input
            className={`${styles.input} ${styles.shadowSm}`}
            type="file"
            id="floorPlan"
            accept="image/*"
            onChange={handleFloorPlanUpload}
          />
        </div>

        <div className={styles.formGroupSideBySide}>
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="bedrooms">
              Bedrooms:
            </label>
            <input
              className={`${styles.input} ${errors.bedrooms ? styles.inputError : ''} ${styles.shadowSm}`}
              type="number"
              id="bedrooms"
              min="0"
              value={formData.bedrooms}
              onChange={(e) => {
                setFormData({ ...formData, bedrooms: e.target.value });
                setErrors({ ...errors, bedrooms: e.target.value ? '' : 'Bedrooms is required' });
              }}
              placeholder="Eg. 3"
            />
            {errors.bedrooms && <span className={styles.errorText}>{errors.bedrooms}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="baths">
              Baths:
            </label>
            <input
              className={`${styles.input} ${styles.shadowSm}`}
              type="number"
              id="baths"
              min="0"
              value={formData.baths}
              onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
              placeholder="Eg. 2"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="propertyType">
            Property Type:
          </label>
          <select
            className={`${styles.select} ${errors.propertyType ? styles.inputError : ''} ${styles.shadowSm}`}
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => {
              setFormData({ ...formData, propertyType: e.target.value });
              setErrors({ ...errors, propertyType: e.target.value ? '' : 'Property Type is required' });
            }}
          >
            <option value="">Select Property Type</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Apartment">Apartment</option>
          </select>
          {errors.propertyType && <span className={styles.errorText}>{errors.propertyType}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.required}`} htmlFor="description">
            Description:
          </label>
          <textarea
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''} ${styles.shadowSm}`}
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: e.target.value ? '' : 'Description is required' });
            }}
            placeholder="Describe the property..."
          />
          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="additionalImages">
            Additional Images:
          </label>
          {previewImages.length > 0 && (
            <div className={`${styles.imagesGrid} ${styles.shadowSm}`}>
              {previewImages.map((imgUrl, index) => (
                index > 0 && (
                  <div key={index} className={`${styles.imagePreviewItem} ${styles.shadowSm}`}>
                    <img
                      src={imgUrl}
                      alt={`Property ${index}`}
                      className={styles.roundedSm}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <button
                      type="button"
                      className={`${styles.removeImageBtn} ${styles.shadowSm}`}
                      onClick={() => handleRemoveImage(index - 1)}
                    >
                      ✕
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
          <input
            className={`${styles.input} ${styles.shadowSm}`}
            type="file"
            id="additionalImages"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesUpload}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="amenities">
            Amenities (comma-separated):
          </label>
          <input
            className={`${styles.input} ${styles.shadowSm}`}
            type="text"
            id="amenities"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            placeholder="Eg. Pool, Gym, Parking"
          />
        </div>

        <div className={styles.formGroupSideBySide}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="brochureURL">
              Brochure URL:
            </label>
            <input
              className={`${styles.input} ${styles.shadowSm}`}
              type="text"
              id="brochureURL"
              value={formData.brochureURL}
              onChange={(e) => setFormData({ ...formData, brochureURL: e.target.value })}
              placeholder="Eg. https://example.com/brochure.pdf"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="LegalDocURL">
              Legal Document URL:
            </label>
            <input
              className={`${styles.input} ${styles.shadowSm}`}
              type="text"
              id="LegalDocURL"
              value={formData.LegalDocURL}
              onChange={(e) => setFormData({ ...formData, LegalDocURL: e.target.value })}
              placeholder="Eg. https://example.com/legal.pdf"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <h4 className={`${styles.paymentPlanHeading} ${styles.textGray800}`}>
            Payment Plan
          </h4>
          <div className={`${styles.paymentPlanGroup} ${styles.shadowSm}`}>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="onBooking">
                On Booking (%):
              </label>
              <input
                className={`${styles.input} ${styles.shadowSm}`}
                type="number"
                id="onBooking"
                min="0"
                value={formData.paymentPlan.onBooking}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentPlan: { ...formData.paymentPlan, onBooking: e.target.value },
                  })
                }
                placeholder="Eg. 10"
              />
            </div>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="duringConstruction">
                During Construction (%):
              </label>
              <input
                className={`${styles.input} ${styles.shadowSm}`}
                type="number"
                id="duringConstruction"
                min="0"
                value={formData.paymentPlan.duringConstruction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentPlan: { ...formData.paymentPlan, duringConstruction: e.target.value },
                  })
                }
                placeholder="Eg. 40"
              />
            </div>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="onHandover">
                On Handover (%):
              </label>
              <input
                className={`${styles.input} ${styles.shadowSm}`}
                type="number"
                id="onHandover"
                min="0"
                value={formData.paymentPlan.onHandover}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentPlan: { ...formData.paymentPlan, onHandover: e.target.value },
                  })
                }
                placeholder="Eg. 50"
              />
            </div>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="postHandover">
                Post Handover (%):
              </label>
              <input
                className={`${styles.input} ${styles.shadowSm}`}
                type="number"
                id="postHandover"
                min="0"
                value={formData.paymentPlan.postHandover}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentPlan: { ...formData.paymentPlan, postHandover: e.target.value },
                  })
                }
                placeholder="Eg. 0"
              />
            </div>
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.coordinatesGroup}`}>
          <h4 className={`${styles.paymentPlanHeading} ${styles.textGray800}`}>
            Coordinates (For Map Directions)
          </h4>
          <div className={styles.formGroupSideBySide}>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="lat">
                Latitude:
              </label>
              <input
                className={`${styles.input} ${styles.shadowSm}`}
                type="number"
                step="any"
                id="lat"
                value={formData.coordinates.lat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 25.276987 },
                  })
                }
                placeholder="Eg. 25.276987"
              />
            </div>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="lng">
                Longitude:
              </label>
              <input
                className={`${styles.input} ${styles.shadowSm}`}
                type="number"
                step="any"
                id="lng"
                value={formData.coordinates.lng}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 55.296249 },
                  })
                }
                placeholder="Eg. 55.296249"
              />
            </div>
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.seoSection}`}>
          <h4 className={`${styles.paymentPlanHeading} ${styles.textGray800}`}>
            SEO Information
          </h4>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="metaTitle">
              Meta Title:
            </label>
            <input
              className={`${styles.input} ${styles.shadowSm}`}
              type="text"
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="Eg. Luxury Villa in Pune"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="metaDescription">
              Meta Description:
            </label>
            <textarea
              className={`${styles.textarea} ${styles.shadowSm}`}
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="Enter a brief description for search engines..."
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="metaKeywords">
              Meta Keywords (comma-separated):
            </label>
            <input
              className={`${styles.input} ${styles.shadowSm}`}
              type="text"
              id="metaKeywords"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              placeholder="Eg. luxury, villa, Pune"
            />
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.reraSection}`}>
          <h4 className={`${styles.paymentPlanHeading} ${styles.textGray800}`}>
            RERA Information
          </h4>
          <div className={`${styles.checkboxGroup} ${styles.shadowSm}`}>
            <input
              type="checkbox"
              id="reraApproved"
              checked={formData.reraApproved}
              onChange={(e) => setFormData({ ...formData, reraApproved: e.target.checked })}
            />
            <label className={styles.checkboxLabel} htmlFor="reraApproved">
              RERA Approved
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="reraNumber">
              RERA Number:
            </label>
            <input
              className={`${styles.input} ${styles.shadowSm}`}
              type="text"
              id="reraNumber"
              value={formData.reraNumber}
              onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
              placeholder="Enter RERA number"
            />
          </div>
        </div>

        <button
          className={`${styles.button} ${isLoading ? styles.buttonDisabled : ''} ${styles.shadowMd}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : isEditing ? 'Update Property' : 'Create Property'}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;