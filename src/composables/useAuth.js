import { computed, ref } from 'vue';
import { getCurrentUser, login, logout, register } from '@/api/auth';

const currentUser = ref(null);
const authLoading = ref(false);
const authError = ref('');
let loaded = false;

export function useAuth() {
  const run = async (callback) => {
    authLoading.value = true;
    authError.value = '';
    try {
      return await callback();
    } catch (error) {
      authError.value = error.message;
      throw error;
    } finally {
      authLoading.value = false;
    }
  };

  const loadCurrentUser = async ({ force = false } = {}) => {
    if (loaded && !force) return currentUser.value;
    return run(async () => {
      const data = await getCurrentUser();
      currentUser.value = data.user || null;
      loaded = true;
      return currentUser.value;
    });
  };

  const registerUser = async (payload) => run(async () => {
    const data = await register(payload);
    currentUser.value = data.user || null;
    loaded = true;
    return currentUser.value;
  });

  const loginUser = async (payload) => run(async () => {
    const data = await login(payload);
    currentUser.value = data.user || null;
    loaded = true;
    return currentUser.value;
  });

  const logoutUser = async () => run(async () => {
    await logout();
    currentUser.value = null;
    loaded = true;
  });

  return {
    currentUser,
    authLoading,
    authError,
    isLoggedIn: computed(() => Boolean(currentUser.value)),
    loadCurrentUser,
    registerUser,
    loginUser,
    logoutUser
  };
}
