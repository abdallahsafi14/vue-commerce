<template>
  <main class="cart-view">
    
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading cart…</p>
    </div>

    <section v-else class="cart-content">
      <div v-if="cart?.products?.length" class="cart-grid">
        <div class="cart-items">
          <div v-for="item in cart.products" :key="item.id" class="cart-item">
            <img
              class="item-image"
              :src="
                item.thumbnail ||
                item.images?.[0] ||
                'https://via.placeholder.com/150?text=No+Image'
              "
              :alt="item.title"
            />

            <div class="item-details">
              <router-link class="item-title" :to="`/products/${item.id}`">
                {{ item.title }}
              </router-link>
              <p class="item-subtitle">{{ item.brand }} {{ item.category }}</p>
              <div class="item-price">
                <span>${{ item.price }}</span>
                <span class="item-total"
                  >Total: ${{ item.total || item.price * item.quantity }}</span
                >
              </div>

              <div class="item-actions">
                <div class="quantity-control">
                  <button type="button" @click="decrement(item)" :disabled="item.quantity <= 1">
                    -
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button
                    type="button"
                    @click="increment(item)"
                    :disabled="item.quantity >= item.stock"
                  >
                    +
                  </button>
                </div>
                <button type="button" class="remove-button" @click="removeItem(item)">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside class="cart-summary">
          <div class="summary-card">
            <h2>Order summary</h2>
            <div class="summary-row">
              <span>Items</span>
              <span>{{ totalItems }}</span>
            </div>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Discount</span>
              <span>${{ discount.toFixed(2) }}</span>
            </div>
            <div class="summary-total">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
            <button type="button" class="clear-button" @click="clearCart">Clear cart</button>
          </div>
        </aside>
      </div>

      <div v-else class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add products from the store to see them here.</p>
        <router-link class="browse-button" to="/">Browse products</router-link>
      </div>

      <p v-if="cartStatus" class="cart-status">{{ cartStatus }}</p>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { deleteCart, getCart, updateCart } from '@/services/products'

const cart = ref(null)
const isLoading = ref(true)
const cartStatus = ref('')
const cartId = 1

const fetchCart = async () => {
  isLoading.value = true
  cartStatus.value = ''

  try {
    cart.value = await getCart(cartId)
  } catch (error) {
    cartStatus.value = 'Unable to load the cart.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const increment = async (item) => {
  if (!item || item.quantity >= item.stock) return
  cartStatus.value = 'Updating cart…'

  try {
    await updateCart(cartId, [{ id: item.id, quantity: item.quantity + 1 }])
    await fetchCart()
    cartStatus.value = `Updated quantity for ${item.title}.`
  } catch (error) {
    cartStatus.value = 'Unable to update quantity.'
    console.error(error)
  }
}

const decrement = async (item) => {
  if (!item || item.quantity <= 1) return
  cartStatus.value = 'Updating cart…'

  try {
    await updateCart(cartId, [{ id: item.id, quantity: item.quantity - 1 }])
    await fetchCart()
    cartStatus.value = `Updated quantity for ${item.title}.`
  } catch (error) {
    cartStatus.value = 'Unable to update quantity.'
    console.error(error)
  }
}

const removeItem = async (item) => {
  if (!item) return
  cartStatus.value = 'Removing item…'

  try {
    await updateCart(cartId, [{ id: item.id, quantity: 0 }])
    await fetchCart()
    cartStatus.value = `Removed ${item.title} from cart.`
  } catch (error) {
    cartStatus.value = 'Unable to remove item.'
    console.error(error)
  }
}

const clearCart = async () => {
  cartStatus.value = 'Clearing cart…'

  try {
    await deleteCart(cartId)
    cart.value = { products: [] }
    cartStatus.value = 'Cart cleared.'
  } catch (error) {
    cartStatus.value = 'Unable to clear cart.'
    console.error(error)
  }
}

const totalItems = computed(() => {
  return cart.value?.products?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
})

const subtotal = computed(() => {
  return (
    cart.value?.products?.reduce(
      (sum, item) => sum + (item.total || item.price * item.quantity || 0),
      0,
    ) || 0
  )
})

const discount = computed(() => {
  return cart.value?.discountedTotal != null
    ? (cart.value?.total || 0) - cart.value.discountedTotal
    : 0
})

const total = computed(() => {
  return cart.value?.discountedTotal != null ? cart.value.discountedTotal : subtotal.value
})

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.cart-view {
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

.cart-content {
  max-width: 1180px;
  margin: 0 auto;
}

.cart-grid {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 1.5rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 1rem;
  padding: 1.25rem;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
}

.item-image {
  width: 100%;
  min-height: 120px;
  object-fit: cover;
  border-radius: 18px;
  background: #0f172a;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  color: #e2e8f0;
}

.item-title {
  color: #f8fafc;
  font-size: 1.05rem;
  font-weight: 700;
  text-decoration: none;
}

.item-title:hover {
  color: #60a5fa;
}

.item-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
}

.item-price {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: baseline;
}

.item-price span {
  color: #f8fafc;
}

.item-total {
  color: #94a3b8;
  font-size: 0.95rem;
}

.item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 999px;
  padding: 0.4rem 0.5rem;
}

.quantity-control button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #e2e8f0;
  font-size: 1.1rem;
  cursor: pointer;
}

.quantity-control button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.quantity-control span {
  min-width: 26px;
  text-align: center;
  color: #f8fafc;
  font-weight: 600;
}

.remove-button {
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: transparent;
  color: #fda4af;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.remove-button:hover {
  background: rgba(248, 113, 113, 0.12);
}

.cart-summary {
  position: sticky;
  top: 1.5rem;
}

.summary-card {
  padding: 1.5rem;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-card h2 {
  margin: 0;
  color: #f8fafc;
}

.summary-row,
.summary-total {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: #cbd5e1;
}

.summary-total {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
}

.clear-button,
.browse-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.95rem 1.1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  color: white;
  background: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.clear-button:hover,
.browse-button:hover {
  background: #2563eb;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  background: #111827;
  color: #cbd5e1;
}

.empty-state h2 {
  margin-bottom: 0.75rem;
  color: #f8fafc;
}

.cart-status {
  margin-top: 1rem;
  color: #93c5fd;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
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
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-view {
    padding: 1.25rem;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-image {
    min-height: 200px;
  }
}
</style>
