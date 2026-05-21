(function () {
  let client = null;

  function isConfigured() {
    const config = window.SUPABASE_CONFIG || {};
    return Boolean(
      config.url &&
      config.anonKey &&
      !config.url.includes('YOUR_SUPABASE') &&
      !config.anonKey.includes('YOUR_SUPABASE')
    );
  }

  function getClient() {
    if (!isConfigured()) {
      throw new Error('Supabase is not configured yet. Add your project URL and anon key in supabase_config.js.');
    }

    if (!window.supabase?.createClient) {
      throw new Error('Supabase client failed to load. Check your internet connection.');
    }

    if (!client) {
      client = window.supabase.createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anonKey
      );
    }

    return client;
  }

  async function signInWithGoogle() {
    const redirectTo = new URL('index.html', window.location.href).href;
    const { error } = await getClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });
    if (error) throw error;
  }

  async function signInWithPassword(email, password) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUpWithPassword(email, password) {
    const redirectTo = new URL('index.html', window.location.href).href;
    const { data, error } = await getClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo }
    });
    if (error) throw error;
    return data;
  }

  async function resetPassword(email) {
    const redirectTo = new URL('index.html', window.location.href).href;
    const { error } = await getClient().auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }

  async function getSession() {
    if (!isConfigured()) return null;
    const { data, error } = await getClient().auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function signOut() {
    if (!isConfigured()) return;
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
  }

  window.AuthManager = {
    isConfigured,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    resetPassword,
    getSession,
    signOut
  };
})();
