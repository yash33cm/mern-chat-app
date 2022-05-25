export const fetchsender = (loggeduser, users) => {
  return users[0]._id === loggeduser.id ? users[1].name : users[0].name;
};

export const fetchsenderfull = (loggeduser, users) => {
  return users[0]._id === loggeduser.id ? users[1] : users[0];
};
