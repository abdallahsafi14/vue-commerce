<template>
  <nav>
    <div class="logo">
      <RouterLink to="/">Logo</RouterLink>
    </div>
    <ul>
      <li>
        <RouterLink to="/category">Category</RouterLink>
      </li>
    </ul>
    <div class="cart">
      <RouterLink to="/cart">Cart</RouterLink>
    </div>
  </nav>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0f172a;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  color: white;

  a {
    color: inherit;
    text-decoration: none;
  }
}

ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

li {
  a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #34495e;
    }
  }
}

.cart {
  a {
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    background-color: #1b2743;
    box-shadow: 0 6px 16px rgba(3, 92, 131, 0.25);
    transition:
      background-color 0.3s,
      transform 0.2s;

    &:hover {
      background-color: #2fb1e5;
      transform: translateY(-1px);
    }
  }
}
</style>
