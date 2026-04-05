<script setup>
import { getProducts } from '@/services/products'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const products = ref([])
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  document.title = 'Home - E-Commerce'

  try {
    const response = await getProducts()
    products.value = response.products
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="home-view">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading products…</p>
    </div>

    <div v-else class="products">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="router.push(`/products/${product.id}`)"
      >
        <img
          :src="product.thumbnail || product.images[0]"
          :alt="product.title"
          class="product-image"
        />

        <div class="product-info">
          <div class="product-top">
            <span class="product-category">{{ product.category }}</span>
            <span
              class="availability"
              :class="{ inStock: product.stock > 0, outOfStock: product.stock === 0 }"
            >
              {{ product.stock > 0 ? 'In Stock' : 'Sold Out' }}
            </span>
          </div>

          <h2>{{ product.title }}</h2>
          <p class="description">{{ product.description }}</p>

          <div class="product-meta">
            <span class="price">${{ product.price }}</span>
            <span class="rating">★ {{ product.rating.toFixed(1) }}</span>
          </div>

          <div class="product-footer">
            <span class="badge">{{ product.availabilityStatus }}</span>
            <span class="stock-count">{{ product.stock }} available</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-view {
  padding: 2rem 1rem;
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
  color: #555;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  display: flex;
  flex-direction: column;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.35);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.45);
}

.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: #0f172a;
}

.product-info {
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  color: #e2e8f0;
}

.product-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.product-category,
.availability,
.badge,
.stock-count {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.83rem;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
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

.product-info h2 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.35;
  color: #f8fafc;
}

.description {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 0.95rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f8fafc;
}

.rating {
  color: #fcd34d;
  font-weight: 700;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  background: rgba(148, 163, 184, 0.16);
  color: #e2e8f0;
}

.stock-count {
  background: rgba(148, 163, 184, 0.08);
  color: #cbd5e1;
}

@media (max-width: 640px) {
  .home-view {
    padding: 1.25rem;
  }

  .product-info {
    padding: 1rem;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  gap: 1rem;
  color: #475569;
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
</style>
