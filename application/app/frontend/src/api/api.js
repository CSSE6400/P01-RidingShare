export const getPassenger = async () => {
  const url = "/passengers";
  const response = await fetch(url);
  return response.json(); 
}

export const AddPassenger = async (post) => {
  const url = "/passengers";
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return response.json(); 
};
