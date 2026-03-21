# Privy Setup Guide

This guide will help you configure Privy with Gmail and Twitter authentication for your Web3Commerce project.

## Step 1: Get Your Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Create a new application or select an existing one
3. Copy your **App ID** from the dashboard

## Step 2: Configure OAuth Providers

### Gmail (Google OAuth)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**: Add `https://auth.privy.io/oauth/callback`
6. Copy the **Client ID** and **Client Secret**
7. In Privy Dashboard → Authentication → Add OAuth Provider → Google
8. Paste the Client ID and Client Secret

### Twitter OAuth

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project
3. Create a new app within the project
4. Set app permissions to "Read and write"
5. Configure callback URL: `https://auth.privy.io/oauth/callback`
6. Copy the **API Key** and **API Secret**
7. In Privy Dashboard → Authentication → Add OAuth Provider → Twitter
8. Paste the API Key and API Secret

## Step 3: Environment Variables

Create a `.env.local` file in your frontend directory:

```bash
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_actual_privy_app_id_here

# RPC Configuration (for Celo Sepolia)
NEXT_PUBLIC_RPC_URL=https://celo-sepolia.infura.io/v3/your_infura_key

# WalletConnect (Optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here

# Pinata IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Update Privy Configuration

The Privy configuration is already set up in `lib/privy.ts` with:
- Gmail and Twitter login enabled
- Proper chain configuration for Celo Sepolia
- Embedded wallet support
- Session management

## Step 5: Test Authentication

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Connect Wallet" and you should see:
   - Email login
   - Wallet connection
   - Google (Gmail) login
   - Twitter login

## Step 6: Verify Configuration

Check that:
- ✅ Privy App ID is correctly set in `.env.local`
- ✅ Google OAuth is configured in Privy Dashboard
- ✅ Twitter OAuth is configured in Privy Dashboard
- ✅ Social login buttons appear in the authentication modal
- ✅ Users can successfully authenticate with Gmail and Twitter

## Troubleshooting

### "OAuth provider not enabled" error
- Make sure you've configured OAuth providers in the Privy Dashboard
- Double-check your redirect URIs are set to `https://auth.privy.io/oauth/callback`

### "Invalid App ID" error
- Verify your Privy App ID in `.env.local`
- Make sure there are no extra spaces or characters

### Social login buttons not showing
- Ensure the login methods include 'google' and 'twitter' in your config
- Check that the OAuth providers are properly configured in Privy Dashboard

### Network issues
- Make sure your RPC URL is working for Celo Sepolia
- Verify your wallet connection is working first

## Next Steps

Once authentication is working:
1. Test user registration and login flows
2. Verify user data is properly stored
3. Test wallet creation for social login users
4. Implement role-based access control (buyer/seller/admin)
