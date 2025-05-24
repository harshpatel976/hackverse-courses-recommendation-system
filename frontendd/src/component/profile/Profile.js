import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

function Profile() {
  const [formData, setFormData] = useState({
    biodata: { fullName: '', age: '', occupation: '', location: '' },
    skillSet: [{ skill: '', proficiency: 'beginner' }],
    interests: [''],
    goalSet: [{ goal: '', targetDate: '', priority: 'medium' }],
    timeAvailability: { hoursPerWeek: 0, preferredDays: [], preferredTimeSlots: [''] },
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Biodata
  const handleBiodataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      biodata: { ...prev.biodata, [name]: value },
    }));
  };

  // SkillSet
  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const newSkills = [...formData.skillSet];
    newSkills[index][name] = value;
    setFormData(prev => ({ ...prev, skillSet: newSkills }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skillSet: [...prev.skillSet, { skill: '', proficiency: 'beginner' }],
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skillSet: prev.skillSet.filter((_, i) => i !== index),
    }));
  };

  // Interests
  const handleInterestChange = (index, e) => {
    const newInterests = [...formData.interests];
    newInterests[index] = e.target.value;
    setFormData(prev => ({ ...prev, interests: newInterests }));
  };

  const addInterest = () => {
    setFormData(prev => ({ ...prev, interests: [...prev.interests, ''] }));
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  // Goals
  const handleGoalChange = (index, e) => {
    const { name, value } = e.target;
    const newGoals = [...formData.goalSet];
    newGoals[index][name] = value;
    setFormData(prev => ({ ...prev, goalSet: newGoals }));
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goalSet: [...prev.goalSet, { goal: '', targetDate: '', priority: 'medium' }],
    }));
  };

  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goalSet: prev.goalSet.filter((_, i) => i !== index),
    }));
  };

  // Time Availability
  const handleTimeAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      timeAvailability: { ...prev.timeAvailability, [name]: value },
    }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    const updatedDays = checked
      ? [...formData.timeAvailability.preferredDays, value]
      : formData.timeAvailability.preferredDays.filter(day => day !== value);

    setFormData(prev => ({
      ...prev,
      timeAvailability: { ...prev.timeAvailability, preferredDays: updatedDays },
    }));
  };

  const handleTimeSlotChange = (index, e) => {
    const newSlots = [...formData.timeAvailability.preferredTimeSlots];
    newSlots[index] = e.target.value;
    setFormData(prev => ({
      ...prev,
      timeAvailability: { ...prev.timeAvailability, preferredTimeSlots: newSlots },
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeAvailability: {
        ...prev.timeAvailability,
        preferredTimeSlots: [...prev.timeAvailability.preferredTimeSlots, ''],
      },
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeAvailability: {
        ...prev.timeAvailability,
        preferredTimeSlots: prev.timeAvailability.preferredTimeSlots.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    }
  };

  return (
    <div className='profile-form-container'>
      <h2 className='form-title'>Complete Your Profile</h2>
      {error && <p className='error-message'>{error}</p>}

      <form className='profile-form' onSubmit={handleSubmit}>
        {/* Biodata */}
        <h3 className='section-title'>Biodata</h3>
        {['fullName', 'age', 'occupation', 'location'].map((field) => (
          <div className='form-group' key={field}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              className='form-input'
              id={field}
              name={field}
              type={field === 'age' ? 'number' : 'text'}
              value={formData.biodata[field]}
              onChange={handleBiodataChange}
              placeholder={`Enter your ${field}`}
              required={field === 'fullName'}
            />
          </div>
        ))}

        {/* Skills */}
        <h3 className='section-title'>Skills *</h3>
        {formData.skillSet.map((skill, index) => (
          <div className='form-group skill-group' key={index}>
            <input
              className='form-input'
              name="skill"
              type="text"
              value={skill.skill}
              onChange={(e) => handleSkillChange(index, e)}
              placeholder="e.g., Python"
              required
            />
            <select
              className='form-select'
              name="proficiency"
              value={skill.proficiency}
              onChange={(e) => handleSkillChange(index, e)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {formData.skillSet.length > 1 && (
              <button className='remove-btn button' type="button" onClick={() => removeSkill(index)}>Remove</button>
            )}
          </div>
        ))}
        <button className='add-btn button' type="button" onClick={addSkill}>Add Skill</button>

        {/* Interests */}
        <h3 className='section-title'>Interests</h3>
        {formData.interests.map((interest, index) => (
          <div className='form-group' key={index}>
            <input
              className='form-input'
              type="text"
              value={interest}
              onChange={(e) => handleInterestChange(index, e)}
              placeholder="e.g., AI, Robotics"
            />
            {formData.interests.length > 1 && (
              <button className='remove-btn button' type="button" onClick={() => removeInterest(index)}>Remove</button>
            )}
          </div>
        ))}
        <button className='add-btn button' type="button" onClick={addInterest}>Add Interest</button>

        {/* Goals */}
        <h3 className='section-title'>Goals *</h3>
        {formData.skillSet.map((goal, index) => (
          <div className='form-group goal-group' key={index}>
            <input
              className='form-input'
              name="goal"
              type="text"
              value={goal.goal}
              onChange={(e) => handleGoalChange(index, e)}
              required
              placeholder="e.g., Build a portfolio"
            />
            <input
              className='form-input'
              name="targetDate"
              type="date"
              value={goal.targetDate}
              onChange={(e) => handleGoalChange(index, e)}
            />
            <select
              className='form-select'
              name="priority"
              value={goal.priority}
              onChange={(e) => handleGoalChange(index, e)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {formData.goalSet.length > 1 && (
              <button className='remove-btn button' type="button" onClick={() => removeGoal(index)}>Remove</button>
            )}
          </div>
        ))}
        <button className='add-btn button' type="button" onClick={addGoal}>Add Goal</button>

        {/* Time Availability */}
        <h3 className='section-title'>Time Availability</h3>
        <div className='form-group'>
          <input
            className='form-input'
            name="hoursPerWeek"
            type="number"
            value={formData.timeAvailability.hoursPerWeek}
            onChange={handleTimeAvailabilityChange}
            placeholder="Hours per week"
          />
        </div>

        <h4 className='sub-section-title'>Preferred Days</h4>
        <div className='checkbox-group'>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={formData.timeAvailability.preferredDays.includes(day)}
                onChange={handleDayChange}
              />
              {day}
            </label>
          ))}
        </div>

        <h4 className='sub-section-title'>Preferred Time Slots</h4>
        {formData.timeAvailability.preferredTimeSlots.map((slot, index) => (
          <div className='form-group' key={index}>
            <input
              className='form-input'
              type="text"
              value={slot}
              onChange={(e) => handleTimeSlotChange(index, e)}
              placeholder="e.g., 6-8 PM"
            />
            {formData.timeAvailability.preferredTimeSlots.length > 1 && (
              <button className='remove-btn button' type="button" onClick={() => removeTimeSlot(index)}>Remove</button>
            )}
          </div>
        ))}
        <button className='add-btn button buttons' type="button" onClick={addTimeSlot}>Add Time Slot</button>

        {/* Submit */}
        <div className='form-group'>
          <button className='submit-btn button' type="submit">Save Profile</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;