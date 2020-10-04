export const getItem = key => 
  typeof window!== 'undefined' && localStorage.getItem(key);

export const setItem = (key, val) => 
  typeof window!== 'undefined' && localStorage.setItem(key, val);