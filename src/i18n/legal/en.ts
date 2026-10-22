import { FREE_LIMITS, LAUNCH_SPOTS, LIFETIME_LAUNCH_PRICE_USD, LIFETIME_PRICE_USD, PRO_PRICE_USD } from "@/lib/billing";
import type { LegalSet } from "./types";

export const legalEn: LegalSet = {
  kicker: "Legal",
  updatedLabel: "Last updated",
  questions: "Questions",

  terms: {
    title: "Terms of Service",
    description: "The terms that govern your use of Wallify.",
    updated: "October 21, 2026",
    lede: "The short version: Wallify helps you collect and display testimonials. Only publish genuine ones, you own your content, and you can cancel any time.",
    sections: [
      {
        h: "About these terms",
        p: [
          "These terms govern your use of Wallify (the “Service”), operated by HH Digital LLC (“we”, “us”). By creating an account or using the Service, you agree to them. If you do not agree, please do not use the Service.",
        ],
      },
      {
        h: "What Wallify does",
        p: [
          "Wallify lets you create a space, share a public link where your customers can leave a rating and a testimonial, approve the ones you want, and display them on your website through an embeddable widget or a public wall page.",
        ],
      },
      {
        h: "Your account",
        p: [
          "You must provide accurate information and keep your password secure. You are responsible for all activity on your account. You must be at least 16 years old to use the Service. Tell us right away if you suspect unauthorised access.",
        ],
      },
      {
        h: "Genuine testimonials only",
        p: [
          "You may only publish testimonials that come from real customers or users who submitted them. Do not write, edit, buy or fabricate testimonials, and do not change the meaning of what someone wrote. Consumer-protection and advertising laws in many countries prohibit fake or misleading reviews, and you are responsible for complying with them.",
          "You are responsible for having the right to display the names and words that people submit through your collection link.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "Do not use the Service to break the law, harass or deceive people, send spam, distribute malware, or publish content that is unlawful, hateful or infringes someone else’s rights. Do not attempt to scrape, overload, probe or reverse-engineer the Service, or to bypass its limits.",
        ],
      },
      {
        h: "Your content",
        p: [
          "You keep ownership of your content and the testimonials you collect. You give us a limited licence to host, process and display that content solely to operate the Service for you, including showing approved testimonials on your wall and widget. We may remove content that breaks these terms.",
        ],
      },
      {
        h: "Plans and billing",
        p: [
          `The Free plan includes ${FREE_LIMITS.spaces} space and up to ${FREE_LIMITS.approvedTestimonials} approved testimonials, with a “Powered by Wallify” badge.`,
          `Pro costs $${PRO_PRICE_USD} per month and renews automatically each month until you cancel. You can cancel at any time from Manage billing in your dashboard. Cancellation takes effect at the end of the period you have already paid for, and you keep access until then.`,
          `Lifetime is a one-time payment (the price shown at checkout: $${LIFETIME_PRICE_USD}, or the $${LIFETIME_LAUNCH_PRICE_USD} launch price for the first ${LAUNCH_SPOTS} customers) that gives you the Pro features for as long as Wallify is offered, with future updates included. It is not a subscription and does not renew. If we permanently discontinue the Service, we will give you at least 30 days’ notice and, during that time, you may ask us for an export of your testimonials.`,
          "Payments are processed by Stripe. We never see or store your full card details. Prices are shown before you pay and may include applicable taxes. If we change the price of a subscription, we will tell you in advance and the new price applies from your next renewal. Prices of Lifetime purchases you have already made do not change.",
          "Refunds are described in our Refund Policy.",
        ],
      },
      {
        h: "Free plan limits",
        p: [
          "If a paid plan ends, your account returns to the free limits. Your data is kept, but your public wall shows only your most recent approved testimonials up to the free limit, and you cannot approve more until you are within it.",
        ],
      },
      {
        h: "Availability and changes",
        p: [
          "We work to keep the Service available and secure, but we do not guarantee it will be uninterrupted or error-free. We may improve, change or remove features. We will try to give reasonable notice of changes that significantly affect you.",
        ],
      },
      {
        h: "Termination",
        p: [
          "You can stop using the Service at any time and ask us to delete your account. We may suspend or end accounts that break these terms or put the Service or other users at risk. Sections that by their nature should survive termination, such as ownership, liability and governing law, will survive.",
        ],
      },
      {
        h: "Warranties and liability",
        p: [
          "The Service is provided “as is” without warranties of any kind. To the fullest extent permitted by law, we are not liable for indirect, incidental or consequential losses, or for lost profits or data, and our total liability for any claim relating to the Service is limited to the amount you paid us in the twelve months before the claim. Nothing in these terms limits rights that your local consumer law gives you and that cannot be waived.",
        ],
      },
      {
        h: "Governing law",
        p: [
          "These terms are governed by the laws of the State of Wyoming, USA, without regard to its conflict-of-laws rules, except where your local consumer law gives you rights that cannot be waived. Subject to those rights, the state and federal courts sitting in Wyoming have exclusive jurisdiction over disputes arising from these terms.",
        ],
      },
      {
        h: "Changes to these terms",
        p: [
          "We may update these terms from time to time. Material changes take effect when we post them on this page with a new “last updated” date. If you keep using the Service after that, you accept the revised terms.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    description: "How Wallify collects, uses and protects personal data.",
    updated: "October 21, 2026",
    lede: "The short version: we collect only what we need to run Wallify, we use no advertising or analytics trackers, we never sell your data, and your database is hosted in the EU.",
    sections: [
      {
        h: "Who we are",
        p: [
          "Wallify is operated by HH Digital LLC (“we”, “us”). For questions or requests about personal data, contact contact@hhdigitalllc.us.",
        ],
      },
      {
        h: "Two kinds of people",
        p: [
          "Account holders are the people who sign up for Wallify. For their account data, we are the data controller.",
          "Testimonial authors are people who leave a testimonial through a Wallify collection link. For that data, the account holder who owns the space decides why and how it is used (the controller) and we process it on their behalf (the processor).",
        ],
      },
      {
        h: "What we collect",
        p: [
          "Account holders: your email address, a securely hashed password, the names, headlines and web addresses of your spaces, and your plan status.",
          "Testimonial authors: the rating, text, name and optional title or company that you type into the form. Nothing else is required.",
          "Payments: handled by Stripe. We receive and store only a Stripe customer reference, your subscription status and renewal date, and whether you bought Lifetime. We never see your full card number.",
          "Technical data: like any web service, our hosting provider processes your IP address and request details in short-lived server logs to deliver and secure the Service.",
          "Spam prevention: when you submit a testimonial, we keep a one-way hashed form of your IP address (it cannot be turned back into your address) for a short time, to limit abuse.",
        ],
      },
      {
        h: "How we use it",
        p: [
          "We use data to provide the Service: to sign you in, show your dashboard, display approved testimonials on the wall and widget, send account emails such as email confirmation, and take payment. We also use it to prevent abuse and keep the Service secure.",
          "Our legal bases are performing our contract with you, our legitimate interest in running a secure service, and, for testimonial authors, your consent when you submit the form.",
        ],
      },
      {
        h: "Testimonials are public once approved",
        p: [
          "If you leave a testimonial, your name, optional title and your words may be shown publicly on the website of the space owner and on their Wallify wall page, but only after the space owner approves them. To have a testimonial removed, ask the space owner, or email us and we will help.",
        ],
      },
      {
        h: "Cookies and tracking",
        p: [
          "We use only the essential cookies needed to keep you signed in. We do not use advertising cookies or analytics trackers, we do not track you across other sites, and the embeddable widget does not track visitors to the site it appears on.",
        ],
      },
      {
        h: "Who we share data with",
        p: [
          "We use a small number of service providers (processors) to run Wallify: Supabase (database and sign-in, hosted in the EU, Ireland), Vercel (hosting), Stripe (payments), and Resend (transactional email). They process data only on our instructions and under their own security commitments.",
          "Some of these providers may process data outside the European Economic Area. Where they do, they rely on recognised safeguards such as standard contractual clauses. We do not sell your personal data.",
        ],
      },
      {
        h: "How long we keep it",
        p: [
          "We keep account data while your account is active. If you ask us to delete your account, we delete your account, spaces and testimonials within 30 days, apart from limited records we must keep by law (such as payment records held by Stripe). Backups are overwritten on a rolling basis.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "Depending on where you live, you may have the right to access, correct, delete or export your personal data, to object to or restrict certain processing, and to withdraw consent. To exercise these rights, email contact@hhdigitalllc.us. We will respond within the time required by law.",
          "If you are in the EU or UK, you also have the right to complain to your local data-protection authority.",
        ],
      },
      {
        h: "Security",
        p: [
          "We use access controls, encryption in transit, hashed passwords and row-level security so accounts can only reach their own data. No online service is perfectly secure, but we take reasonable steps to protect your information and will notify you of a breach where the law requires it.",
        ],
      },
      {
        h: "Children",
        p: [
          "Wallify is not directed at children under 16, and we do not knowingly collect their personal data.",
        ],
      },
      {
        h: "Changes to this policy",
        p: ["If our practices change, we will update this page and revise the date above."],
      },
    ],
  },

  refunds: {
    title: "Refund Policy",
    description: "Our 14-day refund policy for Wallify Pro and Lifetime.",
    updated: "October 21, 2026",
    lede: "The short version: if Wallify isn’t right for you, ask within 14 days of paying and we’ll refund you. No awkward questions.",
    sections: [
      {
        h: "14-day refund",
        p: [
          `You can request a full refund within 14 days of your first payment for Pro ($${PRO_PRICE_USD}/month) or Lifetime (one-time payment), for any reason.`,
        ],
      },
      {
        h: "Renewals",
        p: [
          "Pro renews monthly until you cancel. Cancel before your renewal date to avoid the next charge. If you were charged for a renewal and did not mean to continue, contact us within 7 days of that charge and we will refund it.",
        ],
      },
      {
        h: "After 14 days",
        p: [
          "After the refund window, payments are non-refundable, except where the law requires otherwise. You can still cancel Pro at any time and keep access until the end of the paid period.",
        ],
      },
      {
        h: "How to ask",
        p: [
          "Email contact@hhdigitalllc.us from the address on your account and tell us which plan you bought. We will confirm and process the refund through Stripe, which usually reaches your original payment method within 5 to 10 business days.",
        ],
      },
      {
        h: "What happens to your account",
        p: [
          "After a refund, a Pro subscription is cancelled and a Lifetime purchase is removed, and your account returns to the free plan and its limits. Your spaces and testimonials are kept.",
        ],
      },
      {
        h: "Your legal rights",
        p: [
          "This policy is in addition to any rights you have under the consumer law where you live, which we do not limit. We may decline refunds where we reasonably believe the policy is being abused, for example repeated purchase-and-refund cycles.",
        ],
      },
    ],
  },
};
