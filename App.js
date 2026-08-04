import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    Pclass: '',
    Sex: '',
    Age: '',
    SibSp: '',
    Parch: '',
    Fare: '',
    Embarked: '',
    HasCabin: ''
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Pclass: Number(formData.Pclass),
          Sex: Number(formData.Sex),
          Age: Number(formData.Age),
          SibSp: Number(formData.SibSp),
          Parch: Number(formData.Parch),
          Fare: Number(formData.Fare),
          Embarked: Number(formData.Embarked),
          HasCabin: Number(formData.HasCabin)
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Titanic Survival Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Pclass: <input type="number" name="Pclass" value={formData.Pclass} onChange={handleChange} required/></label></div>
        <div><label>Sex (0=male, 1=female): <input type="number" name="Sex" value={formData.Sex} onChange={handleChange} required/></label></div>
        <div><label>Age: <input type="number" name="Age" step="any" value={formData.Age} onChange={handleChange} required/></label></div>
        <div><label>SibSp: <input type="number" name="SibSp" value={formData.SibSp} onChange={handleChange} required/></label></div>
        <div><label>Parch: <input type="number" name="Parch" value={formData.Parch} onChange={handleChange} required/></label></div>
        <div><label>Fare: <input type="number" name="Fare" step="any" value={formData.Fare} onChange={handleChange} required/></label></div>
        <div><label>Embarked (0=S, 1=C, 2=Q): <input type="number" name="Embarked" value={formData.Embarked} onChange={handleChange} required/></label></div>
        <div><label>Has Cabin (0=No, 1=Yes): <input type="number" name="HasCabin" value={formData.HasCabin} onChange={handleChange} required/></label></div>
        <button type="submit">Predict</button>
      </form>
      {prediction && (
        <div>
          <h3>Results:</h3>
          <p>Model 1: {prediction.model1}</p>
          <p>Model 2: {prediction.model2}</p>
        </div>
      )}
    </div>
  );
}
export default App;
