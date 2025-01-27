// Setter for sensor
export const setSensor = (newSensor) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem('sensor', newSensor); 
    } catch (error) {
      console.error("Error saving sensor to localStorage:", error);
    }
  }
};

// Getter for sensor
export const getSensor = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem('sensor') || 'humidity'; 
    } catch (error) {
      console.error("Error getting sensor from localStorage:", error);
      return 'humidity'; 
    }
  }
  return 'humidity'; 
};

// Setter for location
export const setLocation = (newLocation) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem('location', newLocation); 
    } catch (error) {
      console.error("Error saving location to localStorage:", error);
    }
  }
};

// Getter for location
export const getLocation = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem('location') || '1'; 
    } catch (error) {
      console.error("Error getting location from localStorage:", error);
      return '1';
    }
  }
  return '1'; 
};

// Setter for timestamp
export const setTimestamp1 = (newTimestamp) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem('timestamp1', newTimestamp); 
    } catch (error) {
      console.error("Error saving timestamp to localStorage:", error);
    }
  }
};

// Getter for timestamp
export const getTimestamp1 = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem('timestamp1') || '';
    } catch (error) {
      console.error("Error getting timestamp from localStorage:", error);
      return '';
    }
  }
  return ''; 
};

// Setter for timestamp2
export const setTimestamp2 = (newTimestamp) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem('timestamp2', newTimestamp); 
    } catch (error) {
      console.error("Error saving timestamp to localStorage:", error);
    }
  }
};

// Getter for timestamp2
export const getTimestamp2 = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem('timestamp2') || '';
    } catch (error) {
      console.error("Error getting timestamp from localStorage:", error);
      return '';
    }
  }
  return ''; 
};