const sessidTouserMap = new Map();

export const setUser = (id, user) => {
  sessidTouserMap.set(id, user);
};

export const getUser = (id) => {
  return sessidTouserMap.get(id);
};
