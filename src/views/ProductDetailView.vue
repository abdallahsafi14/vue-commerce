<template>
  <main class="product-details-view">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading product details…</p>
    </div>

    <section v-else-if="product" class="product-details">
      <div class="detail-card">
        <img
          class="detail-image"
          :src="product.thumbnail || product.images[0]"
          :alt="product.title"
        />

        <div class="detail-info">
          <div class="detail-top">
            <span class="product-category">{{ product.category }}</span>
            <span
              class="availability"
              :class="{ inStock: product.stock > 0, outOfStock: product.stock === 0 }"
            >
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <h2>{{ product.title }}</h2>
          <p class="description">{{ product.description }}</p>

          <div class="product-meta">
            <span class="price">${{ product.price }}</span>
            <span class="rating">★ {{ product.rating.toFixed(1) }}</span>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="label">Brand</span>
              <span>{{ product.brand }}</span>
            </div>
            <div class="meta-item">
              <span class="label">SKU</span>
              <span>{{ product.sku }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Stock</span>
              <span>{{ product.stock }} pcs</span>
            </div>
            <div class="meta-item">
              <span class="label">Shipping</span>
              <span>{{ product.shippingInformation }}</span>
            </div>
          </div>

          <div class="detail-footer">
            <span class="badge">{{ product.availabilityStatus }}</span>
            <div class="quantity-control">
              <button type="button" @click="decrement" :disabled="quantity <= 1">-</button>
              <span>{{ quantity }}</span>
              <button type="button" @click="increment" :disabled="quantity >= product.stock">
                +
              </button>
            </div>
            <button
              class="cart-button"
              type="button"
              @click="handleAddToCart"
              :disabled="product.stock === 0"
            >
              Add to cart
            </button>
          </div>

          <p v-if="cartStatus" class="cart-status">{{ cartStatus }}</p>
        </div>
      </div>
    </section>

    <div v-else class="empty-state">
      <p>Product not found or it is no longer available.</p>
    </div>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { getProduct, updateCart } from '@/services/products'

const route = useRoute()
const id = computed(() => route.params.id)
const product = ref(null)
const isLoading = ref(true)
const quantity = ref(1)
const cartStatus = ref('')

const increment = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value += 1
  }
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
}

const handleAddToCart = async () => {
  if (!product.value) return

  cartStatus.value = 'Updating cart...'

  try {
    await updateCart(1, [{ id: product.value.id, quantity: quantity.value }])
    cartStatus.value = `Added ${quantity.value} item${quantity.value > 1 ? 's' : ''} to cart.`
  } catch (error) {
    cartStatus.value = 'Unable to update cart. Please try again.'
    console.error(error)
  }
}

onMounted(async () => {
  document.title = 'Product Details - E-Commerce'

  try {
    product.value = await getProduct(id.value)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.product-details-view {
  padding: 1rem 1rem;
}

.view-header {
  max-width: 900px;
  margin: 0 auto 1.5rem;
  text-align: center;
}

.view-header h1 {
  margin: 0;
  font-size: 2.25rem;
}

.view-header p {
  margin: 0.75rem auto 0;
  max-width: 620px;
  color: #cbd5e1;
}

.product-details {
  max-width: 1080px;
  margin: 0 auto;
}

.detail-card {
  display: grid;
  grid-template-columns: minmax(280px, 1.15fr) minmax(320px, 1.85fr);
  gap: 2rem;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.35);
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #0f172a;
}

.detail-info {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: #e2e8f0;
}

.detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-category,
.availability {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.product-category {
  background: rgba(56, 189, 248, 0.16);
  color: #7dd3fc;
}

.availability {
  font-weight: 600;
}

.inStock {
  background: rgba(16, 185, 129, 0.16);
  color: #6ee7b7;
}

.outOfStock {
  background: rgba(248, 113, 113, 0.16);
  color: #fecaca;
}

.detail-info h2 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  color: #f8fafc;
}

.description {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.8;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
}

.rating {
  color: #fcd34d;
  font-weight: 700;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.meta-item {
  background: rgba(148, 163, 184, 0.08);
  padding: 1rem;
  border-radius: 16px;
  color: #cbd5e1;
}

.meta-item .label {
  display: block;
  margin-bottom: 0.5rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 999px;
  padding: 0.35rem 0.5rem;
}

.quantity-control button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #e2e8f0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quantity-control button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.quantity-control span {
  min-width: 32px;
  text-align: center;
  color: #f8fafc;
  font-weight: 600;
}

.badge {
  background: rgba(148, 163, 184, 0.16);
  color: #e2e8f0;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
}

.cart-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  padding: 0.85rem 1.25rem;
  background: #3b82f6;
  color: white;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.cart-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.cart-status {
  margin: 0;
  color: #93c5fd;
  font-size: 0.95rem;
}

.empty-state {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  gap: 1rem;
  color: #cbd5e1;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(59, 130, 246, 0.16);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .product-details-view {
    padding: 1.25rem;
  }

  .detail-info {
    padding: 1.5rem;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
