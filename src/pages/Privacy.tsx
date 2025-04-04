import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const PrivacyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 1rem;
`;

const LastUpdated = styled.p`
  font-style: italic;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textLight};
`;

const List = styled.ul`
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const Privacy: React.FC = () => {
  return (
    <PrivacyContainer>
      <Helmet>
        <title>Privacy Policy | Controller Test App</title>
        <meta name="description" content="Privacy policy for Controller Test App - how we handle your data and protect your privacy." />
      </Helmet>
      
      <Title>Privacy Policy</Title>
      <LastUpdated>Last Updated: April 3, 2025</LastUpdated>
      
      <Section>
        <SectionTitle>Introduction</SectionTitle>
        <p>
          At Controller Test App, we respect your privacy and are committed to protecting your personal data.
          This privacy policy explains how our controller testing application works and how we handle your information.
        </p>
        <p>
          Controller Test App is an open-source web application hosted on GitHub Pages that allows users to test and diagnose
          game controllers through their web browser. Our application is designed with privacy as a core principle.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>How Our Application Works</SectionTitle>
        <p>
          Controller Test App uses the browser's Gamepad API to detect and interact with connected controllers. Here's how it works:
        </p>
        <List>
          <li>When you connect a controller to your device, your browser detects it through the Gamepad API</li>
          <li>Our application reads the controller's inputs (buttons, sticks, triggers) in real-time</li>
          <li>The application displays visual feedback of your controller's inputs and performs diagnostics</li>
          <li>All processing happens locally in your browser - no data is sent to external servers</li>
          <li>Controller identification is performed by matching device information against our local database</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Information We Do Not Collect</SectionTitle>
        <p>
          Controller Test App is designed to function without collecting any personal data. When you use our application:
        </p>
        <List>
          <li>We do not collect or store any information about your controllers or gaming devices</li>
          <li>We do not track your usage patterns or behavior</li>
          <li>We do not use cookies or any other tracking technologies</li>
          <li>We do not use analytics services</li>
          <li>We do not have a backend server that receives your data</li>
          <li>We do not collect your IP address or geolocation</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Local Processing Only</SectionTitle>
        <p>
          All controller data processing happens exclusively in your browser and includes:
        </p>
        <List>
          <li>Controller identification (matching against our built-in database)</li>
          <li>Button and stick input readings</li>
          <li>Stick drift detection</li>
          <li>Button response testing</li>
        </List>
        <p>
          This data exists only in your browser's memory during your session and is automatically cleared when you close the tab or window.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>GitHub Pages Hosting</SectionTitle>
        <p>
          Our application is hosted on GitHub Pages, which may collect certain technical information as part of its standard web hosting operations,
          such as IP addresses in server logs. This collection is not controlled by us and is subject to GitHub's own privacy policy.
          You can learn more about GitHub's privacy practices at <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>External Links</SectionTitle>
        <p>
          Our application may contain links to external sites, such as:
        </p>
        <List>
          <li>GitHub repository</li>
          <li>Controller manufacturer support pages</li>
          <li>Community resources</li>
        </List>
        <p>
          These external sites have their own privacy policies. We are not responsible for the privacy practices
          or content of these external sites. We encourage you to review the privacy policies of any external sites you visit.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>Children's Privacy</SectionTitle>
        <p>
          Our application is not specifically directed to children under 13. We do not knowingly collect personal information
          from children under 13. Since our application doesn't collect personal data from any users, this includes children.
          If you are a parent or guardian and believe your child has provided us with personal information,
          please contact us, and we will take steps to remove that information.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>Do Not Track Signals</SectionTitle>
        <p>
          Some browsers have a "Do Not Track" feature that signals to websites that you don't want to have your online activities tracked.
          Our application honors Do Not Track signals by default since we don't track any user activity regardless of browser settings.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>Changes to This Privacy Policy</SectionTitle>
        <p>
          We may update our privacy policy from time to time as we add new features or as privacy laws change.
          We will notify you of any material changes by posting the new privacy policy on this page and updating
          the "Last Updated" date at the top of this policy. We encourage you to review this privacy policy periodically.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>Open Source</SectionTitle>
        <p>
          Controller Test App is an open-source project. The complete source code is available on GitHub, which means
          anyone can inspect it to verify our privacy practices. This transparency ensures that our application
          functions exactly as described in this privacy policy.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <p>
          If you have any questions about this privacy policy or our application, please contact us through our GitHub repository:
        </p>
        <p>
          <a href="https://github.com/BryantWelch/controller-test.app/issues" target="_blank" rel="noopener noreferrer">https://github.com/BryantWelch/controller-test.app/issues</a>
        </p>
      </Section>
    </PrivacyContainer>
  );
};

export default Privacy;
