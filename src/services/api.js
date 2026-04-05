const BASE_URL = 'https://dummyjson.com'

export async function request(endpoint, options = {}, data) {
  const res = await fetch(BASE_URL + endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
    body: JSON.stringify(data),
  })

  return res.json()
}
