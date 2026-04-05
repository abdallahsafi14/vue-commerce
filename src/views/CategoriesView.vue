<template>
  <main class="category-view">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading categories…</p>
    </div>

    <section v-else class="category-content">
      <div class="category-list">
        <button
          v-for="category in categories"
          :key="category.slug"
          :class="['category-chip', { active: category.slug === selectedCategory }]"
          @click="selectCategory(category.slug)"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="category-products">
        <div class="category-header">
          <h2>{{ selectedCategoryName }}</h2>
          <p v-if="products.length === 0" class="empty-text">No products found in this category.</p>
        </div>

        <div v-if="isProductsLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading products…</p>
        </div>

        <div v-else class="products-grid">
          <div v-for="product in products" :key="product.id" class="product-card">
            <img
              :src="product.thumbnail || product.images?.[0]"
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

              <router-link class="detail-link" :to="`/products/${product.id}`">
                View details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getCategories, getCategory } from '@/services/products'

const categories = ref([])
const selectedCategory = ref('')
const products = ref([])
const isLoading = ref(true)
const isProductsLoading = ref(false)

const selectedCategoryName = computed(() => {
  const category = categories.value.find((item) => item.slug === selectedCategory.value)
  return category?.name || 'Products'
})

const fetchCategories = async () => {
  isLoading.value = true

  try {
    const response = await getCategories()
    console.log(response)
    const normalized = Array.isArray(response)
      ? response.map((item) =>
          typeof item === 'string'
            ? {
                slug: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                url: `/products/category/${item}`,
              }
            : item,
        )
      : []

    categories.value = normalized
    selectedCategory.value = normalized[0]?.slug || ''
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const fetchProducts = async (categorySlug) => {
  if (!categorySlug) {
    products.value = []
    return
  }

  isProductsLoading.value = true

  try {
    const response = await getCategory(categorySlug)
    products.value = response?.products || []
  } catch (error) {
    console.error(error)
    products.value = []
  } finally {
    isProductsLoading.value = false
  }
}

const selectCategory = async (slug) => {
  if (slug === selectedCategory.value) return
  selectedCategory.value = slug
  await fetchProducts(slug)
}

onMounted(async () => {
  await fetchCategories()
  if (selectedCategory.value) {
    await fetchProducts(selectedCategory.value)
  }
})
</script>

<style scoped>
.category-view {
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

.category-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.category-chip {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(148, 163, 184, 0.08);
  color: #e2e8f0;
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.category-chip.active,
.category-chip:hover {
  background: #2563eb;
  color: white;
}

.category-products {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-header h2 {
  margin: 0;
  color: #f8fafc;
}

.empty-text {
  margin: 0;
  color: #94a3b8;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.28);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.38);
}

.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: #0f172a;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  color: #e2e8f0;
}

.product-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.product-category,
.availability {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.83rem;
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
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
}

.rating {
  color: #fcd34d;
  font-weight: 700;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  color: #f8fafc;
  background: rgba(59, 130, 246, 0.18);
  transition: background-color 0.2s ease;
}

.detail-link:hover {
  background: rgba(59, 130, 246, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
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

@media (max-width: 780px) {
  .category-products {
    gap: 1.25rem;
  }

  .product-card {
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .category-view {
    padding: 1.25rem;
  }

  .category-list {
    justify-content: flex-start;
  }
}
</style>
