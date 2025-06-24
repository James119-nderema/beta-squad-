// src/components/AttendanceForm.jsx
import React, { useState } from 'react';
import { employeeService } from '../../Services/attendanceService';

const AttendanceForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
    department: '',
    signature: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    const newErrors = {};
    
    // Validate all step 1 fields
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.role) newErrors.role = 'Role is required';
    
    setErrors(newErrors);
    
    // Only proceed if no errors
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await employeeService.createEmployee(formData);
      alert('Attendance recorded successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role: '',
        department: '',
        signature: ''
      });
      setStep(1);
    } catch (error) {
      alert('Failed to record attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      <div className="h-full w-full max-w-4xl mx-auto flex items-center justify-center">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {step === 1 ? 'Personal Information' : 'Department & Sign In/Out'}
          </h2>
          
          <form onSubmit={step === 1 ? (e) => e.preventDefault() : handleSubmit}>
            {step === 1 ? (
              // Step 1: Personal Information
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className={`mt-1 block text-gray-700 w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className={`mt-1 block text-gray-700 w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`mt-1 block text-gray-700 w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className={`mt-1 block text-gray-700 w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className={`mt-1 block text-gray-700 w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a role</option>
                    <option value="Member">Member</option>
                    <option value="Visitor">Visitor</option>
                    <option value="Staff">Staff</option>
                    <option value="Attachee">Attachee</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                  {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                </div>
                
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              </div>
            ) : (
              // Step 2: Department and Signature
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="mt-1 block text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  >
                    <option value="">Select a department</option>
                    <option value="Communication">Communication</option>
                    <option value="Creatives">Creatives</option>
                    <option value="Tech Department">Tech Department</option>
                    <option value="Community Experience">Community Experience</option>
                    <option value="Youth Engagement">Youth Engagement</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Signature</label>
                  <select
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    required
                    className="mt-1 block text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  >
                    <option value="">Select an option</option>
                    <option value="Check in">Check in</option>
                    <option value="Check out">Check out</option>
                  </select>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;