'use client';
import { motion } from 'framer-motion';
import FormInput from './FormInput';

const StepTwo = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return { strength: (strength / 4) * 100, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-800 p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Admin Account Setup</h2>
      <p className="text-neutral-400 mb-8">Create your administrator account</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
          placeholder="John"
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
          placeholder="Doe"
        />
      </div>

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="john@acme.com"
      />

      <FormInput
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        required
        placeholder="+1 (555) 000-0000"
      />

      <div className="mb-6">
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="••••••••"
        />
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="w-full bg-neutral-700 h-1">
                <motion.div
                  className={`h-full ${passwordStrength.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength.strength}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
              {passwordStrength.label}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StepTwo;