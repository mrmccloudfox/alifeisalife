# No Matter How Small - Charitable Benefit Website

🌟 **Live Website:** [https://nomatterhowsmall.life](https://nomatterhowsmall.life)

A beautiful, responsive website for the "A life is a life, no matter how small" charitable benefit campaign supporting Hope House Colorado. Features email signup collection, real-time notifications, and secure data management.

## 🎯 Project Overview

This website was created to support a benefit campaign inspired by a 13-year-old girl's poem about the value of life. The campaign aims to raise funds for Hope House Colorado through t-shirt sales while building a supporter community through email signups.

## ✨ Features

### 🌐 **Website Features**
- **Responsive Design**: Beautiful, mobile-first design with dark theme and gold accents
- **Hero Section**: Engaging landing with poem title and call-to-action
- **Story Section**: Video links showcasing the campaign's viral spread
- **Impact Metrics**: Display of social media reach and news coverage
- **Hope House Integration**: Information about the beneficiary organization
- **Email Signup**: Newsletter subscription with validation and success states

### 📧 **Email System**
- **Real-time Signup Collection**: Visitors can subscribe for shirt availability updates
- **Form Validation**: Client and server-side validation with friendly error messages
- **Email Notifications**: Instant notifications to admin when someone signs up
- **Duplicate Prevention**: Automatic handling of duplicate email addresses
- **Rate Limiting**: Protection against spam (3 attempts per hour per IP)

### 🔒 **Security & Privacy**
- **Environment Variables**: All sensitive data secured in Vercel
- **Admin Endpoints**: Disabled public admin access for data protection
- **Input Sanitization**: Comprehensive validation and sanitization
- **HTTPS Enforcement**: Automatic SSL certificates and HTTPS redirects

## 🛠️ Tech Stack

### **Frontend**
- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS v4**: Utility-first CSS framework for rapid styling
- **Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icons
- **Vite**: Fast build tool and development server

### **Backend**
- **Vercel Serverless Functions**: Scalable, edge-deployed API endpoints
- **Express.js**: Web framework for traditional server functionality (dev mode)
- **Supabase**: PostgreSQL database with real-time capabilities
- **Resend**: Reliable email delivery service
- **Node.js v20+**: Modern JavaScript runtime

### **Infrastructure**
- **Vercel**: Hosting platform with automatic deployments
- **Porkbun**: Domain registrar and DNS management
- **GitHub**: Version control and CI/CD integration

## 🌍 Domain & Deployment

### **Custom Domain Setup**
- **Primary Domain**: `nomatterhowsmall.life` (purchased via Porkbun)
- **WWW Redirect**: `www.nomatterhowsmall.life` → `nomatterhowsmall.life`
- **HTTPS Redirect**: All HTTP traffic automatically redirects to HTTPS
- **SSL Certificate**: Automatically provisioned by Vercel via Let's Encrypt

### **DNS Configuration**
```
A Record:    @ → 216.198.79.1 (Vercel)
CNAME:       www → 7e59fb65935e4b4a.vercel-dns-017.com
```

## 📊 Database Schema

### **Email Signups Table** (`email_signups`)
```sql
CREATE TABLE email_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'newsletter'
);

CREATE INDEX idx_email_signups_email ON email_signups(email);
CREATE INDEX idx_email_signups_created_at ON email_signups(created_at DESC);
```

## 🔧 API Endpoints

### **Public Endpoints**
- **`POST /api/email-signup`**: Submit newsletter signup
- **`GET /api/signup-count`**: Get total signup count (privacy-safe)
- **`GET /api/health`**: Health check endpoint
- **`GET/POST /api/messages`**: Support board messages

### **Disabled for Security**
- **`/api/admin/*`**: All admin endpoints disabled to protect personal data

## ⚙️ Environment Variables

### **Required for Production**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://trlwqxbkznfjpsswzrnw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_... (SENSITIVE)

# Email Notifications
RESEND_API_KEY=re_... (SENSITIVE)

# Optional Features
GEMINI_API_KEY=... (OPTIONAL)
```

## 🚀 Deployment Guide

### **Prerequisites**
- Node.js v20+
- npm or yarn
- Git
- Vercel account
- Supabase account
- Resend account
- Custom domain (optional)

### **Local Development**
```bash
# Clone repository
git clone [your-repo-url]
cd no-matter-how-small---a-benefit-for-hope-house

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### **Production Deployment**
1. **Push to GitHub**: Commit and push your code
2. **Connect Vercel**: Link your GitHub repo to Vercel
3. **Configure Environment**: Add production environment variables
4. **Deploy**: Automatic deployment on push to main branch

### **Domain Setup**
1. **Purchase Domain**: Register domain with preferred registrar
2. **Add to Vercel**: Project Settings → Domains → Add your domain
3. **Configure DNS**: Update DNS records to point to Vercel
4. **SSL Setup**: Automatic certificate provisioning (5-10 minutes)

## 👥 Account Information

### **Service Accounts** (All under `mr.mccloud.fox@gmail.com`)
- **Vercel**: Hosting and deployment platform
- **Supabase**: Database and backend services
- **Resend**: Email delivery service
- **Porkbun**: Domain registration and DNS
- **GitHub**: Code repository and version control

### **Admin Access**
- **Signup Management**: Via Supabase dashboard (Table Editor → email_signups)
- **Email Logs**: Via Resend dashboard (Logs section)
- **Site Analytics**: Via Vercel dashboard (Analytics tab)
- **DNS Management**: Via Porkbun dashboard

## 📧 Email Notification System

### **How It Works**
1. **User Signs Up**: Visitor submits email signup form
2. **Database Storage**: Email saved to Supabase with validation
3. **Instant Notification**: Email sent to admin via Resend
4. **Gmail Forward**: Auto-forwarded to stakeholders via Gmail filters

### **Email Details**
- **From**: `onboarding@resend.dev`
- **To**: `mr.mccloud.fox@gmail.com`
- **Auto-Forward**: Configured to forward to stakeholders
- **Content**: Name, email, timestamp, signup count

### **Gmail Filter Setup** (Optional)
Configure Gmail to auto-forward signup notifications:
```
Filter: From "onboarding@resend.dev" Subject contains "New Email Signup"
Action: Forward to stakeholder email + Keep in inbox
```

## 🔐 Security Features

### **Data Protection**
- **Environment Variables**: Sensitive data stored in Vercel (not in code)
- **Admin API Disabled**: No public access to personal information
- **Input Validation**: Comprehensive sanitization and validation
- **Rate Limiting**: Spam prevention on signup form
- **HTTPS Only**: All traffic encrypted via SSL

### **Privacy Measures**
- **Minimal Data Collection**: Only necessary signup information
- **Secure Storage**: PostgreSQL with proper indexing and constraints
- **Access Control**: Admin access only through secure Supabase dashboard
- **No Public Exports**: CSV/admin functions disabled for privacy

## 📈 Monitoring & Analytics

### **Available Metrics**
- **Signup Count**: `/api/signup-count` endpoint
- **Growth Tracking**: Via Supabase dashboard queries
- **Site Performance**: Vercel analytics and logs
- **Email Delivery**: Resend dashboard logs

### **Health Monitoring**
- **Uptime**: Vercel automatic monitoring
- **Database**: Supabase built-in monitoring
- **Email Service**: Resend delivery tracking
- **API Health**: `/api/health` endpoint

## 🎨 Customization

### **Styling**
- **Tailwind Config**: Customize colors, fonts, spacing in `tailwind.config.js`
- **Components**: Modular React components in `/src/components/`
- **Assets**: Images and static files in `/src/assets/`
- **Theme**: Dark theme with gold accent colors

### **Content Updates**
- **Static Data**: Update content in `/src/components/staticData.ts`
- **Email Templates**: Modify in `/api/email-signup.js`
- **Form Fields**: Customize in `/src/components/EmailSignup.tsx`

## 🤝 Contributing

### **Development Workflow**
1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Implement your feature
3. **Test Locally**: `npm run dev` and test thoroughly
4. **Commit Changes**: Clear, descriptive commit messages
5. **Push and Deploy**: Push to main triggers automatic deployment

### **Code Standards**
- **TypeScript**: Full type safety required
- **ESLint**: Follow linting rules
- **Formatting**: Consistent code formatting
- **Comments**: Document complex logic
- **Security**: Never commit sensitive data

## 🆘 Troubleshooting

### **Common Issues**

**Email Notifications Not Working**
- Check Resend dashboard for delivery logs
- Verify `RESEND_API_KEY` in Vercel environment variables
- Confirm sending to account owner's email (not external addresses with free tier)

**Database Connection Issues**
- Verify Supabase credentials in environment variables
- Check Supabase project status and database connectivity
- Confirm row-level security policies if implemented

**Domain Not Loading**
- Check DNS propagation (24-48 hours max)
- Verify Vercel domain configuration
- Confirm SSL certificate status in Vercel dashboard

**Build Failures**
- Check Vercel build logs for specific errors
- Verify all dependencies in `package.json`
- Ensure environment variables are properly set

## 📞 Support

### **For Technical Issues**
- **Vercel**: Check project dashboard and logs
- **Supabase**: Visit project dashboard for database status
- **Resend**: Email delivery logs and account status
- **DNS**: Porkbun domain management interface

### **For Code Issues**
- **Repository**: Check GitHub issues and commit history
- **Local Development**: Run `npm run lint` and `npm run dev`
- **Environment**: Verify all required environment variables

## 📚 Source Links

### **Original Story**
- **What happened**: https://x.com/libsoftiktok/status/2056919525107355654?s=20
- **Why it is personal**: https://x.com/libsoftiktok/status/2056937291919041009?s=20
- **Poem reading**: https://x.com/libsoftiktok/status/2056927043099459792?s=20
- **News coverage**: https://rockymountainvoice.com/2026/05/21/jeffco-student-barred-from-reading-pro-life-poem-after-school-calls-it-too-politically-charged/
- **Hope House Colorado**: https://hopehousecolorado.org/

## 🎉 Acknowledgments

Created with ❤️ to support Hope House Colorado and amplify the message that every life matters, no matter how small.

**Special Thanks:**
- The 13-year-old poet whose words inspired this campaign
- Hope House Colorado for their important work
- All supporters who sign up to stay connected

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Live Site**: [nomatterhowsmall.life](https://nomatterhowsmall.life)
