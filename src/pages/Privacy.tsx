import { Link } from 'react-router-dom'
import { usePageMeta } from '../usePageMeta'

export function Privacy() {
  usePageMeta(
    'Privacy Policy | Controller Test',
    'Controller Test runs in your browser. Button, stick, and rumble data stay on your machine. This policy explains what the site does not collect.',
    '/privacy',
  )

  return (
    <article className="prose">
      <h1>Privacy Policy</h1>
      <p className="updated">Last Updated: April 3, 2025</p>

      <section>
        <h2>Introduction</h2>
        <p>
          At Controller Test App, we respect your privacy and are committed to protecting your personal data.
          This privacy policy explains how our controller testing application works and how we handle your information.
        </p>
        <p>
          Controller Test App is an open-source web application hosted on GitHub Pages that allows users to test and diagnose
          game controllers through their web browser. Our application is designed with privacy as a core principle.
        </p>
      </section>

      <section>
        <h2>How Our Application Works</h2>
        <p>
          Controller Test App uses the browser's Gamepad API to detect and interact with connected controllers. Here's how it works:
        </p>
        <ul>
          <li>When you connect a controller to your device, your browser detects it through the Gamepad API</li>
          <li>Our application reads the controller's inputs (buttons, sticks, triggers) in real-time</li>
          <li>The application displays visual feedback of your controller's inputs and performs diagnostics</li>
          <li>All processing happens locally in your browser - no data is sent to external servers</li>
          <li>Controller identification is performed by matching device information against our local database</li>
        </ul>
      </section>

      <section>
        <h2>Information We Do Not Collect</h2>
        <p>Controller Test App is designed to function without collecting any personal data. When you use our application:</p>
        <ul>
          <li>We do not collect or store any information about your controllers or gaming devices</li>
          <li>We do not track your usage patterns or behavior</li>
          <li>We do not use cookies or any other tracking technologies</li>
          <li>We do not use analytics services</li>
          <li>We do not have a backend server that receives your data</li>
          <li>We do not collect your IP address or geolocation</li>
        </ul>
      </section>

      <section>
        <h2>Local Processing Only</h2>
        <p>All controller data processing happens exclusively in your browser and includes:</p>
        <ul>
          <li>Controller identification (matching against our built-in database)</li>
          <li>Button and stick input readings</li>
          <li>Stick drift detection</li>
          <li>Button response testing</li>
        </ul>
        <p>
          This data exists only in your browser's memory during your session and is automatically cleared when you close the tab or window.
        </p>
      </section>

      <section>
        <h2>GitHub Pages Hosting</h2>
        <p>
          Our application is hosted on GitHub Pages, which may collect certain technical information as part of its standard web hosting operations,
          such as IP addresses in server logs. This collection is not controlled by us and is subject to GitHub's own privacy policy.
          You can learn more about GitHub's privacy practices at <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement">GitHub Privacy Statement</a>.
        </p>
      </section>

      <section>
        <h2>External Links</h2>
        <p>Our application may contain links to external sites, such as:</p>
        <ul>
          <li>GitHub repository</li>
          <li>Controller manufacturer support pages</li>
          <li>Community resources</li>
        </ul>
        <p>
          These external sites have their own privacy policies. We are not responsible for the privacy practices
          or content of these external sites. We encourage you to review the privacy policies of any external sites you visit.
        </p>
      </section>

      <section>
        <h2>Children's Privacy</h2>
        <p>
          Our application is not specifically directed to children under 13. We do not knowingly collect personal information
          from children under 13. Since our application doesn't collect personal data from any users, this includes children.
          If you are a parent or guardian and believe your child has provided us with personal information,
          please contact us, and we will take steps to remove that information.
        </p>
      </section>

      <section>
        <h2>Do Not Track Signals</h2>
        <p>
          Some browsers have a "Do Not Track" feature that signals to websites that you don't want to have your online activities tracked.
          Our application honors Do Not Track signals by default since we don't track any user activity regardless of browser settings.
        </p>
      </section>

      <section>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time as we add new features or as privacy laws change.
          We will notify you of any material changes by posting the new privacy policy on this page and updating
          the "Last Updated" date at the top of this policy. We encourage you to review this privacy policy periodically.
        </p>
      </section>

      <section>
        <h2>Open Source</h2>
        <p>
          Controller Test App is an open-source project. The complete source code is available on GitHub, which means
          anyone can inspect it to verify our privacy practices. This transparency ensures that our application
          functions exactly as described in this privacy policy.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>If you have any questions about this privacy policy or our application, please contact us through our GitHub repository:</p>
        <p>
          <a href="https://github.com/BryantWelch/controller-test.app/issues">https://github.com/BryantWelch/controller-test.app/issues</a>
        </p>
        <p><Link to="/">Back to the tester</Link></p>
      </section>
    </article>
  )
}
