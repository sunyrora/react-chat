const storage = {
  set: (key, value) => {
    if(!localStorage) return;
    localStorage[key] = (typeof value) === 'string' ? value : JSON.stringify(value);
  },
  get: (key) => {
    if(!localStorage ) return null;

    if(!localStorage[key]) return null;
    try {
      const value = JSON.parse(localStorage[key]);
      return value;
    } catch (error) {
      return localStorage[key];
    }
  },
  remove: (key) => {
    if(!localStorage) return null;
    
    if(localStorage[key]) localStorage.removeItem(key);
  }
};

export default storage;