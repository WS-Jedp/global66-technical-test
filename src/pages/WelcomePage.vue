
<script>
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const navigateToHome = () => {
            router.push('/home')
        }
        return { navigateToHome }
    }
}
</script>

<template>
    <div class="font-sans text-gray-900 bg-gray-100">
        <h1>Welcome to Our Application!</h1>
        <p>We are glad to have you here. Explore our features and enjoy your experience.</p>
        <button @click="navigateToHome">Go to Home</button>
    </div>
</template>

