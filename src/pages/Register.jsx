import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
 
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    role: 'CUSTOMER',
  });
 
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
 
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });
 
  // ===== Regex Rules =====
  const nameRegex = /^[A-Za-z]+$/;                 // letters only
  const phoneRegex = /^[0-9]{10}$/;                // exactly 10 digits
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email format
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // 8+ with letter & number
 
  // ===== Validators =====
  const validateName = (label, value) => {
    if (!value.trim()) return `${label} is required.`;
    if (!nameRegex.test(value.trim())) return `${label} can contain letters A–Z only.`;
    return '';
  };
 
  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Phone number is required.';
    if (!phoneRegex.test(digits)) return 'Enter a valid 10-digit phone number.';
    return '';
  };
 
  const validateEmail = (value) => {
    const v = value.trim();
    if (!v) return 'Email is required.';
    if (!emailRegex.test(v)) return 'Enter a valid email address.';
    return '';
  };
 
  const validatePassword = (value) => {
    if (!value) return 'Password is required.';
    if (!passwordRegex.test(value)) {
      return 'Password must be at least 8 characters and include letters and numbers.';
    }
    return '';
  };
 
  // ===== Handlers =====
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    // Phone: keep only digits, cap at 10, live-validate
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      const msg = validatePhone(digits);
      setFieldErrors((prev) => ({ ...prev, phone: msg }));
      return;
    }
 
    setFormData((prev) => ({ ...prev, [name]: value }));
 
    // Live-validate selective fields
    if (name === 'firstName' || name === 'lastName') {
      const label = name === 'firstName' ? 'First name' : 'Last name';
      const msg = validateName(label, value);
      setFieldErrors((prev) => ({ ...prev, [name]: msg }));
    }
 
    if (name === 'email') {
      const msg = validateEmail(value);
      setFieldErrors((prev) => ({ ...prev, email: msg }));
    }
 
    if (name === 'password') {
      const msg = validatePassword(value);
      setFieldErrors((prev) => ({ ...prev, password: msg }));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    // Final validation before submit
    const firstNameErr = validateName('First name', formData.firstName);
    const lastNameErr = validateName('Last name', formData.lastName);
    const phoneErr = validatePhone(formData.phone);
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);
 
    const newErrors = {
      firstName: firstNameErr,
      lastName: lastNameErr,
      phone: phoneErr,
      email: emailErr,
      password: passwordErr,
    };
 
    setFieldErrors(newErrors);
 
    // If any error, toast the first one for clarity
    const firstErrorMsg = Object.values(newErrors).find(Boolean);
    if (firstErrorMsg) {
      setLoading(false);
      toast.error(firstErrorMsg);
      return;
    }
 
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/restaurants');
    } catch (error) {
      // If backend returns field-specific message, show it; else generic
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed';
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };
 
  const isSubmitDisabled =
    loading ||
    !!fieldErrors.firstName ||
    !!fieldErrors.lastName ||
    !!fieldErrors.phone ||
    !!fieldErrors.email ||
    !!fieldErrors.password ||
    !formData.firstName ||
    !formData.lastName ||
    !formData.phone ||
    !formData.email ||
    !formData.password;
 
  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
 
        {/* noValidate disables browser's default bubbles; we control UX via toasts */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* First Name */}
            <div className={`field ${fieldErrors.firstName ? 'has-error' : ''}`}>
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                required
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby="firstName-error"
                autoComplete="given-name"
              />
              {fieldErrors.firstName && (
                <div id="firstName-error" className="field-error">
                  {fieldErrors.firstName}
                </div>
              )}
            </div>
 
            {/* Last Name */}
            <div className={`field ${fieldErrors.lastName ? 'has-error' : ''}`}>
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                required
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby="lastName-error"
                autoComplete="family-name"
              />
              {fieldErrors.lastName && (
                <div id="lastName-error" className="field-error">
                  {fieldErrors.lastName}
                </div>
              )}
            </div>
          </div>
 
          {/* Email */}
          <div className={`mb-4 field ${fieldErrors.email ? 'has-error' : ''}`}>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
              aria-invalid={!!fieldErrors.email}
              aria-describedby="email-error"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <div id="email-error" className="field-error">
                {fieldErrors.email}
              </div>
            )}
          </div>
 
          {/* Password */}
          <div className={`mb-4 field ${fieldErrors.password ? 'has-error' : ''}`}>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              aria-invalid={!!fieldErrors.password}
              aria-describedby="password-error"
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <div id="password-error" className="field-error">
                {fieldErrors.password}
              </div>
            )}
          </div>
 
          {/* Phone */}
          <div className={`mb-4 field ${fieldErrors.phone ? 'has-error' : ''}`}>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="10-digit number"
              inputMode="numeric"
              aria-invalid={!!fieldErrors.phone}
              aria-describedby="phone-error"
              autoComplete="tel"
              maxLength={10}
            />
            {fieldErrors.phone && (
              <div id="phone-error" className="field-error">
                {fieldErrors.phone}
              </div>
            )}
          </div>
 
          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              rows={2}
            />
          </div>
 
          {/* Role */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT_OWNER">Restaurant Owner</option>
              <option value="DELIVERY_AGENT">Delivery Agent</option>
            </select>
          </div>
 
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
 
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
 
export default Register;