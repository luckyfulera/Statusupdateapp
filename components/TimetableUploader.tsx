// TimetableUploader component for uploading and managing timetable images
// Allows teachers to upload timetable images which can be used to automatically set availability

import React, { useState, useCallback } from 'react';
import { Teacher, TimetableData } from '../types';

interface TimetableUploaderProps {
  teacher: Teacher;
  onTimetableUpload?: (timetable: TimetableData) => void;
  onClose?: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

const TimetableUploader: React.FC<TimetableUploaderProps> = ({
  teacher,
  onTimetableUpload,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // Handle file upload and processing
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // In a real implementation, you would upload the file to a server
      // For now, we'll simulate processing and create a default timetable
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create a default timetable structure
      // In a real implementation, you would use OCR or image processing
      // to extract the actual timetable data from the image
      const defaultTimetable: TimetableData = {
        days: DAYS_OF_WEEK,
        timeSlots: TIME_SLOTS,
        schedule: {}
      };

      // For demo purposes, set some default classes
      DAYS_OF_WEEK.forEach(day => {
        defaultTimetable.schedule[day] = {};
        TIME_SLOTS.forEach(slot => {
          defaultTimetable.schedule[day][slot] = null;
        });
      });

      // Set some sample classes for demonstration
      if (teacher.subjects && teacher.subjects.length > 0) {
        defaultTimetable.schedule['Monday']['9:00 AM - 10:00 AM'] = {
          subject: teacher.subjects[0] || 'Mathematics',
          class: '10A',
          room: 'Room 101'
        };
        defaultTimetable.schedule['Monday']['10:00 AM - 11:00 AM'] = {
          subject: teacher.subjects[1] || 'Physics',
          class: '10B',
          room: 'Room 102'
        };
        defaultTimetable.schedule['Tuesday']['2:00 PM - 3:00 PM'] = {
          subject: teacher.subjects[0] || 'Mathematics',
          class: '11A',
          room: 'Room 201'
        };
      }

      // Call the callback with the processed timetable
      if (onTimetableUpload) {
        onTimetableUpload(defaultTimetable);
      }

      // Close the uploader after successful upload
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);

    } catch (error) {
      setError('Failed to process timetable image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, teacher.subjects, onTimetableUpload, onClose]);

  // Clean up preview URL
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Timetable Image
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="timetable-upload"
            />
            <label htmlFor="timetable-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedFile ? selectedFile.name : 'Click to upload timetable image'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={previewUrl}
                  alt="Timetable preview"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isProcessing && (
            <div className="mt-6">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Processing timetable... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isProcessing}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Upload & Process'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload a clear photo of your weekly timetable</li>
              <li>• Our system will process the image and extract schedule information</li>
              <li>• Your availability will be automatically set based on the timetable</li>
              <li>• You can manually adjust any conflicts or special cases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableUploader;
