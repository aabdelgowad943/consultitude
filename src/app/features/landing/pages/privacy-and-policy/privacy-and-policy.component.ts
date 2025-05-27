import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-and-policy',
  imports: [CommonModule, FooterComponent, NavbarComponent, RouterModule],
  templateUrl: './privacy-and-policy.component.html',
  styleUrl: './privacy-and-policy.component.scss',
})
export class PrivacyAndPolicyComponent {
  title: string = 'Privacy Policy ';
  introText: string = `
  <p class="text-[18px]" >
  This Privacy Policy (“Policy”) explains how <strong> Consultitude Ltd </strong>. (“Consultitude,” “we,” “our,” or “us”) through   a company headquartered in the <strong> Kingdom of Saudi Arabia</strong>, collects, uses, discloses, and safeguards your data when you use our websites, applications, and AI-powered consulting services (the “Services”). <br/>

  By accessing or using the Services, you agree to the terms of this Policy. If you disagree, please do not use our Services. This Policy should be read in conjunction with our <a class="underline" href="/terms-and-conditions" >Terms of Use</a> , which governs your overall access to the platform.
  </p>
  `;
  sections: { title: string; content: string[] }[] = [
    {
      title: 'About Consultitude',
      content: [
        `Consultitude Ltd. is a company headquartered in <strong> Riyadh, Kingdom of Saudi Arabia</strong>, providing AI-powered tools for consultants, organizations, and public entities to generate strategy documents, business insights, KPIs, and other consulting deliverables efficiently using advanced Large Language Models (LLMs). Our Services are available at  <a href="https://www.consultitude.com"  class="underline" target="_blank">https://www.consultitude.com</a> and affiliated domains such as  <a href=" www.consultitude.ai.

"  class="underline" target="_blank"> www.consultitude.ai.

</a> `,
      ],
    },

    {
      title: 'Information We Collect',
      content: [
        `<p>a. Information You Provide</p>
        <p>You may provide:</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
    <li>Personal details: Name, email address, job title, company, password</li>
    <li>Billing details: Processed securely via third-party providers like Stripe</li>
    <li>Document content: Files, prompts, or notes uploaded to the system</li>
    <li>Communication: Customer support interactions, surveys, feedback</li>
    </ul>
    <br/>
    <p>Important: You must not upload content that is classified, protected by legal privilege, under non-disclosure agreements (NDAs), or regulated by laws concerning personal health (e.g., HIPAA), financial data (e.g., PCI DSS), or national security unless you have lawful authority and necessary safeguards in place. Consultitude disclaims responsibility for unauthorized uploads of such data.</p>
    <br/>
    <p>b. Information Collected Automatically.</p>
    <p>We collect technical data such as:</p>

    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li>IP address, browser type, operating system</li>
      <li>Device type, session duration, page views</li>
      <li>Usage metrics and interaction logs</li>
     <li> Cookies and similar technologies (see Section 3)</li>
</ul>
    <li>Resell, sublicense, or misrepresent your association with Consultitude</li>
    <li>Attempt to probe, scan, or breach platform security</li>
        `,
      ],
    },
    {
      title: 'Cookies and Tracking',
      content: [
        `
    <p>We use cookies to personalize your experience, analyze platform usage, and improve functionality.</p>

    <table class="w-full border-collapse my-5">
      <thead>
        <tr class="border border-gray-200">
          <th class="p-3 border border-gray-200  font-bold">Type</th>
          <th class="p-3 border border-gray-200  font-bold">Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border border-gray-200">
          <td class="p-3 border border-gray-200  font-bold">Essential Cookies</td>
          <td class="p-3 border border-gray-200 ">Secure login, account access, and site stability</td>
        </tr>
        <tr class="border border-gray-200">
          <td class="p-3 border border-gray-200  font-bold">Preference Cookies</td>
          <td class="p-3 border border-gray-200 ">Language, display, and UI settings</td>
        </tr>
        <tr class="border border-gray-200">
          <td class="p-3 border border-gray-200  font-bold">Analytics Cookies</td>
          <td class="p-3 border border-gray-200 ">Measure feature usage and improve performance</td>
        </tr>
        <tr class="border border-gray-200">
          <td class="p-3 border border-gray-200  font-bold">Marketing Cookies</td>
          <td class="p-3 border border-gray-200 ">Rare use; only enabled with user consent</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 20px;">You can manage cookie preferences via your browser settings.</p>
    `,
      ],
    },

    {
      title: 'Use of Information',
      content: [
        `
    <p class="mb-4">We use your data to:</p>

    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li>Provide and operate the Services</li>
      <li>Process your content using AI models</li>
      <li>Personalize user experience</li>
      <li>Communicate with you (e.g., updates, service alerts)</li>
      <li>Handle billing and support</li>
      <li>Detect and prevent misuse or fraud</li>
      <li>Improve features and conduct internal analysis (if opted in)</li>
    </ul>

    <p class="font-medium">We <span class="font-bold">do not use your data for AI training</span> unless you explicitly opt in.</p>
    `,
      ],
    },

    {
      title: 'AI Model Use & Document Processing',
      content: [
        `
    <p class="mb-6">Consultitude integrates with third-party AI providers (e.g., <span class="font-semibold">OpenAI, Anthropic</span>) to generate outputs from uploaded documents or prompts.</p>

    <h3 class="text-lg font-semibold mb-4">Data Use Model</h3>

    <ul class="list-disc pl-6 space-y-3 mb-6">
      <li>Content is transmitted securely to LLM providers via encrypted APIs</li>
      <li>Outputs are generated and returned in real time</li>
      <li>Your data is <span class="font-semibold">not used to train or improve these LLMs</span> without your consent</li>
      <li>Consultitude does not permit LLM providers to retain or analyze content for independent purposes</li>
    </ul>

    <h3 class="text-lg font-semibold mb-4">AI Output Disclaimer</h3>

    <p>AI-generated results are <span class="font-semibold">informational only</span> and <span class="font-semibold">do not constitute legal, financial, or strategic advice</span>. Consultitude disclaims any responsibility for actions taken based on generated outputs.</p>
    `,
      ],
    },

    {
      title: 'Sharing of Information',
      content: [
        `
    <p class="mb-6">We do not sell personal data. We may share data with:</p>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-50">
            <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Party</th>
            <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 px-4 py-3 font-semibold">AWS (Amazon Web Services)</td>
            <td class="border border-gray-300 px-4 py-3">Cloud infrastructure hosting in the Kingdom of Saudi Arabia and other secure regions</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border border-gray-300 px-4 py-3 font-semibold">LLM providers</td>
            <td class="border border-gray-300 px-4 py-3">Secure content processing via OpenAI, Anthropic, etc.</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-3 font-semibold">Payment processors</td>
            <td class="border border-gray-300 px-4 py-3">Stripe, for billing and invoicing</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border border-gray-300 px-4 py-3 font-semibold">Affiliates</td>
            <td class="border border-gray-300 px-4 py-3">Controlled partners under the same privacy framework</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-3 font-semibold">Legal authorities</td>
            <td class="border border-gray-300 px-4 py-3">When required to comply with Saudi Arabian law or legal process</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border border-gray-300 px-4 py-3 font-semibold">Business partners</td>
            <td class="border border-gray-300 px-4 py-3">In mergers, acquisitions, or asset transfers</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-3 font-semibold">Your consent</td>
            <td class="border border-gray-300 px-4 py-3">When you authorize specific data usage or disclosures</td>
          </tr>
        </tbody>
      </table>
    </div>
    `,
      ],
    },

    {
      title: 'Security and Storage',
      content: [
        `
    <ul class="list-disc pl-6 space-y-3 mb-6">
      <li>All systems are hosted on <span class="font-semibold">Amazon Web Services (AWS)</span>, using data centers with high-security compliance standards (e.g., ISO 27001, SOC 2).</li>
      <li>Data is encrypted in transit and at rest.</li>
      <li>Access is restricted through role-based controls and security audits.</li>
    </ul>

    <p>While no system is impenetrable, we take industry-standard precautions to protect your data.</p>
    `,
      ],
    },

    {
      title: 'Data Retention',
      content: [
        `
    <p class="mb-4">We retain:</p>

    <ul class="list-disc pl-6 space-y-3 mb-6">
      <li><span class="font-semibold">User data</span> while your account is active</li>
      <li><span class="font-semibold">Deleted accounts</span> are purged within 30 days</li>
      <li><span class="font-semibold">Logs and metadata</span> for internal security and analytics, retained in anonymized form</li>
      <li><span class="font-semibold">Content submitted to LLMs</span> is processed on-the-fly and not stored, unless opted in</li>
    </ul>

    <p>You may request deletion at any time by contacting <a href="mailto:hello@consultitude.com" class="text-blue-600 hover:text-blue-800 underline">hello@consultitude.com</a>.</p>
    `,
      ],
    },

    {
      title: 'Your Rights',
      content: [
        `
    <p class="mb-4">Depending on your location and legal jurisdiction, you may have the right to:</p>

    <ul class="list-disc pl-6 space-y-3 mb-6">
      <li>Access and correct your personal information</li>
      <li>Request data deletion or export</li>
      <li>Object to data processing</li>
      <li>Limit the use of AI features tied to your data</li>
    </ul>

    <p>To make a request, contact us at <a href="mailto:hello@consultitude.com" class="text-blue-600 hover:text-blue-800 underline">hello@consultitude.com</a>. We respond within 30 days.</p>
    `,
      ],
    },

    {
      title: 'International Data Transfers',
      content: [
        `
    <p class="mb-4">While Consultitude is based in <span class="font-semibold">Saudi Arabia</span>, some data may be processed outside the Kingdom where legally permissible. All cross-border transfers follow robust contractual safeguards such as <span class="font-semibold">Standard Contractual Clauses (SCCs)</span> or equivalent protections.</p>
    `,
      ],
    },

    {
      title: 'Limitation of Liability',
      content: [
        `
    <div class="border-l-4 border-gray-300 pl-6 py-4 bg-gray-50">
      <p class="text-gray-700 leading-relaxed">To the maximum extent permitted by applicable law, Consultitude shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits or data, arising from the use of the Services or reliance on AI-generated outputs. All Services and content are provided "as is" and "as available."</p>
    </div>
    `,
      ],
    },
    {
      title: 'Indemnification',
      content: [
        `
    <div class="border-l-4 border-gray-300 pl-6 py-4 bg-gray-50">
      <p class="text-gray-700 leading-relaxed">You agree to indemnify, defend, and hold harmless Consultitude, its employees, partners, and affiliates from any claims, damages, liabilities, and expenses (including legal fees) arising from your use of the Services, your content submissions, or violations of this Policy or applicable law.</p>
    </div>
    `,
      ],
    },

    {
      title: 'Governing Law and Jurisdiction',
      content: [
        `
    <p class="mb-4">This Policy shall be governed by and construed in accordance with the laws of the <span class="font-semibold">Kingdom of Saudi Arabia</span>. All disputes arising from or related to this Policy shall be subject to the <span class="font-semibold">exclusive jurisdiction of the courts of Riyadh, Saudi Arabia</span>.</p>
    `,
      ],
    },

    {
      title: 'Force Majeure',
      content: [
        `
    <p class="mb-4">Consultitude shall not be held liable for any failure or delay in performance caused by events beyond its reasonable control, including but not limited to acts of God, internet failures, third-party service disruptions, cyberattacks, labor disputes, or government restrictions.</p>
    `,
      ],
    },

    {
      title: "Children's Privacy",
      content: [
        `
    <p class="mb-4">Our Services are not directed to individuals under 18. We do not knowingly collect data from minors. If we become aware of such data, we will delete it immediately upon request.</p>
    `,
      ],
    },

    {
      title: 'Contact Us',
      content: [
        `
    <p class="mb-6">If you have questions, requests, or complaints related to this Policy, contact us at:</p>

    <div class="space-y-4">
      <div class="flex items-center">

        <div>
          <span class="font-semibold">Email:</span>
          <a href="mailto:hello@consultitude.com" class="text-blue-600 hover:text-blue-800 underline">hello@consultitude.com</a>
        </div>
      </div>

      <div class="flex items-center">

        <div>
          <span class="font-semibold">Website:</span>
          <a href="https://consultitude.com" class="text-blue-600 hover:text-blue-800 underline">https://consultitude.com</a>
        </div>
      </div>

      <div class="flex items-start">

        <div>
          <span class="font-semibold">Headquarters:</span> Riyadh, Kingdom of Saudi Arabia
        </div>
      </div>
    </div>
    `,
      ],
    },
  ];
}
