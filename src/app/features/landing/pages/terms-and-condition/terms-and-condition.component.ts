import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-and-condition',
  imports: [CommonModule, FooterComponent, NavbarComponent, RouterModule],
  templateUrl: './terms-and-condition.component.html',
  styleUrl: './terms-and-condition.component.scss',
})
export class TermsAndConditionComponent {
  lastUpdated: string = 'May 26, 2025';
  introText: string = `
  <p>
  These Terms of Use (“Terms”) govern your access to and use of the services, software, websites, content, and features provided by <strong> Consultitude Ltd </strong>. (“Consultitude,” “we,” “our,” or “us”) through     <a class="underline" href="www.consultitude.com" target="_blank">www.consultitude.com</a>
 , <a class="underline" href="www.consultitude.ai" target="_blank">www.consultitude.ai</a>, and affiliated properties (collectively, the “Services”). <br/> By using the Services, you agree to be bound by these Terms and our <a class="underline" href="/privacy-and-policy" >Privacy Policy</a>, which together form a binding agreement between you and Consultitude. If you do not agree, you must not access or use the Services.
  </p>
  `;
  sections: { title: string; content: string[] }[] = [
    {
      title: 'Who We Are?',
      content: [
        `Consultitude Ltd. is a company headquartered in <strong> Riyadh, Kingdom of Saudi Arabia</strong>, providing AI-powered consulting tools to generate strategy documents, KPIs, insights, and deliverables for public and private organizations, consultants, and government clients.`,
      ],
    },
    {
      title: 'Eligibility',
      content: [
        'You must be at least 18 years old and legally capable of entering into binding contracts. If you are accessing the Services on behalf of a company, entity, or government body, you confirm that you have the authority to bind such organization to these Terms.',
      ],
    },
    // <a routerLink="/privacy-and-policy" class="text-black text-16px underline" >Privacy Policy</a>
    {
      title: 'Privacy and Data Protection',
      content: [
        `Your use of the Services is also governed by our <a class="underline" href="/privacy-and-policy" >Privacy Policy</a>, which describes how we collect, use, and safeguard your information. You agree that we may process your data in accordance with that policy.`,
      ],
    },
    {
      title: 'Permitted Use',
      content: [
        `<p>You agree to use the Services only for lawful and authorized purposes. You may not:</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
    <li>Use the Services to violate any applicable law, regulation, or third-party right</li>
    <li>Submit content that infringes the intellectual property or privacy rights of others</li>
    <li>Use the Services to transmit or store <strong> confidential, classified </strong>, or <strong> regulated information </strong> unless you have proper authorization and legal basis</li>
    <li>Submit or process content protected under:</li>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li>Non-disclosure agreements (NDAs)</li>
      <li>Government classification schemes</li>
      <li>Health privacy laws (e.g., HIPAA)</li>
      Financial data protection (e.g., PCI DSS)</li>
</ul>
    <li>Resell, sublicense, or misrepresent your association with Consultitude</li>
    <li>Attempt to probe, scan, or breach platform security</li>
        `,
      ],
    },
    {
      title: 'AI-Generated Content',
      content: [
        `
    <p class="mb-6">Consultitude integrates with third-party Large Language Models (LLMs), including <span class="font-semibold">OpenAI's ChatGPT</span> and <span class="font-semibold">Anthropic's Claude</span>, to process user-submitted prompts and documents.</p>

    <div class="border-l-4 border-yellow-400 pl-6 py-4 bg-yellow-50 rounded-r-lg">
      <div class="flex items-start">
        <div>
          <p class="text-yellow-800 font-semibold mb-2">Disclaimer:</p>
          <p class="text-yellow-700 leading-relaxed">AI-generated outputs are provided "as is" for informational purposes only. They do not constitute legal, strategic, medical, or professional advice. You are responsible for validating and using results appropriately.</p>
        </div>
      </div>
    </div>
    `,
      ],
    },

    {
      title: 'Account Responsibility',
      content: [
        `
        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your login information or give unauthorized access to others.</p>
        <p>Consultitude may suspend or terminate your account for:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Violation of these Terms</li>
          <li>Illegal or fraudulent activity</li>
          <li>Use that compromises the integrity or security of the platform</li>
        </ul>


        `,
      ],
    },

    {
      title: 'Content and Intellectual Property',
      content: [
        `
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>You retain ownership of any documents, inputs, and data you upload.</li>
          <li>You grant Consultitude a limited license to process, store, and analyze such content solely to provide the Services.</li>
          <li>All other platform content (e.g., software, design, models) is owned by Consultitude or its licensors and protected by copyright and IP laws.</li>
          <li>You may not copy, modify, reverse-engineer, or use platform IP outside the scope of your license.</li>
        </ul>

        `,
      ],
    },

    {
      title: 'Payments and Subscriptions',
      content: [
        `
        <p>Some Services require payment. Billing terms and pricing are provided in your account dashboard. All payments are securely processed by third parties (e.g., Stripe).</p>
        <p>Unless stated otherwise:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Fees are billed in advance</li>
          <li>Subscriptions auto-renew unless canceled</li>
          <li>Fees are non-refundable</li>
        </ul>

        `,
      ],
    },
    {
      title: 'Suspension or Termination',
      content: [
        `
        <p>Consultitude may suspend or terminate your access if you:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Breach these Terms</li>
          <li>Misuse or abuse the platform</li>
          <li>Violate any law or regulation through your use</li>
        </ul>
        <p>You may cancel your account at any time. Upon cancellation or termination, your access and license will be revoked, and we may delete your content in accordance with our Privacy Policy.

</p>

        `,
      ],
    },
    {
      title: 'Limitation of Liability',
      content: [
        `
    <div class="border-l-4 border-gray-300 pl-6 py-4 bg-gray-50">
      <p class="text-gray-700 leading-relaxed">To the fullest extent permitted by law, Consultitude shall not be liable for any indirect, incidental, special, punitive, or consequential damages, or for any loss of profits, revenue, or data arising out of or in connection with your use of the Services or reliance on AI-generated outputs. The Services are provided "as is" and "as available."</p>
    </div>
    `,
      ],
    },

    {
      title: 'Indemnification',
      content: [
        `
    <div class="border-l-4 border-gray-300 pl-6 py-4 bg-gray-50">

    <p class="mb-4">You agree to indemnify, defend, and hold harmless Consultitude, its officers, directors, affiliates, and employees from any and all claims, losses, liabilities, and expenses (including legal fees) arising from:</p>
    <ul class=" list-disc pl-6 space-y-2">
    <li class="italic">Your use or misuse of the Services</li>
    <li class="italic">Your uploaded content</li>
    <li class="italic">Any violation of applicable laws, regulations, or third-party rights</li>
    <li class="italic">Breach of these Terms or your confidentiality obligations</li>
    </ul>
    </div>
    `,
      ],
    },

    {
      title: 'Governing Law and Jurisdiction',
      content: [
        `<p>These Terms are governed by the laws of the <strong> Kingdom of Saudi Arabia</strong>. Any disputes shall be resolved exclusively in the courts of <strong> Riyadh, Saudi Arabia</strong></p>`,
      ],
    },
    {
      title: 'Force Majeure',
      content: [
        `<p>Consultitude is not liable for delays or failure to perform caused by events beyond our reasonable control, including but not limited to natural disasters, cyberattacks, labor unrest, internet outages, and government action.</p>`,
      ],
    },
    {
      title: 'Modifications',
      content: [
        `<p>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or in-app notices. Continued use after such changes constitutes acceptance of the updated Terms.</p>`,
      ],
    },
    {
      title: 'Contact Us',
      content: [
        `<p>If you have questions or concerns about these Terms, please contact us at:</p>

    <p><strong>Email:</strong>     <a href="mailto:hello@consultitude.com" class="underline" >hello@consultitude.com</a>
 </p>
    <p><strong>Website:</strong>     <a href="https://www.consultitude.com"  class="underline" target="_blank">https://www.consultitude.com</a>
</p>
    <p><strong>Headquarters:</strong>
    Riyadh, Kingdom of Saudi Arabia
    `,
      ],
    },
  ];
}
