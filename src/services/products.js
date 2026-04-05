import { request } from './api'

export const getProducts = () => request('/products')

export const getProduct = (id) => request(`/products/${id}`)

export const getCart = (cartId) => request(`/carts/${cartId}`)

export const searchProduct = (data) => request(`/products/search`, { method: 'POST' }, data)

export const getCategories = () => request('/products/categories')

export const getCategory = (cat) => request(`/products/category/${cat}`)

export const getCarts = () => request('/carts')

export const deleteCart = (cartId) => request(`/carts/${cartId}`, { method: 'DELETE' })

export const updateCart = (cartId, products, merge = true) =>
  request(`/carts/${cartId}`, { method: 'PUT' }, { merge, products })
