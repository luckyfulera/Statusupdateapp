import React, { useState, FormEvent, useEffect } from 'react';
import { Student, Teacher, UserRole } from '../types';
import Button from './Button';
import Input from './Input';
import Card from './Card';

interface ProfileEditorProps {
  user: Student | Teacher;
  onSave: (updatedUser: Student | Teacher) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Clean up blob URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Clear upload success message after 3 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Create blob URL for preview (better performance)
      const blobUrl = URL.createObjectURL(file);
      setPreviewImage(blobUrl);

      // Create base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
        setUploadSuccess(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={previewImage || formData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.fullName}`}
                alt={formData.fullName}
                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-200"
              />
              
              {/* Upload Method Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'file'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'url'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Use URL
                </button>
              </div>

              {uploadMethod === 'file' ? (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
                </div>
              ) : (
                <Input
                  label="Profile Image URL"
                  id="profileImage"
                  name="profileImage"
                  value={formData.profileImage || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              )}
            </div>

            {/* Upload Success Message */}
            {uploadSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Image uploaded successfully!
                </div>
              </div>
            )}

            {/* Common Fields */}
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
            />

            {/* Student-specific fields */}
            {user.role === UserRole.STUDENT && (
              <>
                <Input
                  label="Course"
                  id="course"
                  name="course"
                  value={(formData as Student).course}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Section"
                  id="section"
                  name="section"
                  value={(formData as Student).section}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Year"
                  id="year"
                  name="year"
                  type="number"
                  value={(formData as Student).year}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {/* Teacher-specific fields */}
            {user.role === UserRole.TEACHER && (
              <>
                <Input
                  label="Designation"
                  id="designation"
                  name="designation"
                  value={(formData as Teacher).designation}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Department"
                  id="department"
                  name="department"
                  value={(formData as Teacher).department || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Staff Room"
                  id="staffRoom"
                  name="staffRoom"
                  value={(formData as Teacher).staffRoom}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Seat Number"
                  id="seatNo"
                  name="seatNo"
                  value={(formData as Teacher).seatNo}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Floor"
                  id="floor"
                  name="floor"
                  value={(formData as Teacher).floor}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEditor;
